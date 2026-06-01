import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const published = searchParams.get('published');

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (published === 'true') where.isPublished = true;
    if (published === 'false') where.isPublished = false;

    const podcasts = await prisma.podcast.findMany({
      where,
      orderBy: [{ seasonNumber: 'desc' }, { episodeNumber: 'desc' }],
    });

    return NextResponse.json(podcasts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, description, coverImage, audioUrl, duration, episodeNumber, seasonNumber, guests, transcript, isPublished } = body;

    const podcast = await prisma.podcast.create({
      data: {
        title,
        slug,
        description,
        coverImage: coverImage || '',
        audioUrl: audioUrl || '',
        duration: Number(duration) || 0,
        episodeNumber: Number(episodeNumber),
        seasonNumber: Number(seasonNumber) || 1,
        guests: guests || '',
        transcript,
        isPublished: isPublished || false,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    return NextResponse.json(podcast, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
