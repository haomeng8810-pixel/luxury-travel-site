import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const available = searchParams.get('available');

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (available === 'true') where.isAvailable = true;
    if (available === 'false') where.isAvailable = false;

    const experts = await prisma.travelExpert.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(experts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, title, avatar, bio, specialties, languages, yearsExperience, quote, videoIntro, email, isAvailable, sortOrder } = body;

    const expert = await prisma.travelExpert.create({
      data: {
        name,
        slug,
        title,
        avatar: avatar || '',
        bio,
        specialties: specialties || '',
        languages: languages || '',
        yearsExperience: Number(yearsExperience) || 0,
        quote,
        videoIntro,
        email,
        isAvailable: isAvailable !== undefined ? isAvailable : true,
        sortOrder: Number(sortOrder) || 0,
      },
    });

    return NextResponse.json(expert, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
