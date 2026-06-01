import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';

// GET - List destinations
export async function GET() {
  try {
    const destinations = await prisma.destination.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { trips: true } } },
    });
    return NextResponse.json(destinations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch destinations' }, { status: 500 });
  }
}

// POST - Create destination
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const destination = await prisma.destination.create({
      data: {
        slug: data.slug,
        name: data.name,
        nameCn: data.nameCn,
        nameLocal: data.nameLocal || '',
        continent: data.continent,
        region: data.region || '',
        countryCode: data.countryCode || '',
        description: data.description || '',
        coverImage: data.coverImage || '',
        gallery: data.gallery ? JSON.stringify(data.gallery) : '[]',
        highlight: data.highlight ? JSON.stringify(data.highlight) : '[]',
        language: data.language || '',
        isActive: data.isActive !== undefined ? data.isActive : true,
        sortOrder: data.sortOrder || 0,
      },
    });

    return NextResponse.json(destination, { status: 201 });
  } catch (error: any) {
    console.error('Create destination error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create destination' }, { status: 500 });
  }
}
