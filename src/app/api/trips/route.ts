import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - List trips
export async function GET() {
  try {
    const trips = await prisma.trip.findMany({
      include: { destination: true, emotion: true },
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(trips);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trips' }, { status: 500 });
  }
}

// POST - Create trip
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const trip = await prisma.trip.create({
      data: {
        slug: data.slug,
        title: data.title,
        titleCn: data.titleCn,
        subtitle: data.subtitle || '',
        tagline: data.tagline || '',
        description: data.description || '',
        coverImage: data.coverImage || '',
        gallery: data.gallery ? JSON.stringify(data.gallery) : '[]',
        duration: data.duration,
        nights: data.nights,
        minGuests: data.minGuests || 2,
        difficulty: data.difficulty || 'Easy',
        activityLevel: data.activityLevel || 'Relaxed',
        emotionId: data.emotionId || null,
        categories: data.categories ? JSON.stringify(data.categories) : '[]',
        experiences: data.experiences ? JSON.stringify(data.experiences) : '[]',
        destinationId: data.destinationId,
        subDestinations: data.subDestinations ? JSON.stringify(data.subDestinations) : '[]',
        priceFrom: data.priceFrom || null,
        priceCurrency: data.priceCurrency || 'CNY',
        priceNote: data.priceNote || '',
        isInquireOnly: data.isInquireOnly || false,
        isFeatured: data.isFeatured || false,
        isExclusive: data.isExclusive || false,
        sortOrder: data.sortOrder || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });

    return NextResponse.json(trip, { status: 201 });
  } catch (error: any) {
    console.error('Create trip error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create trip' }, { status: 500 });
  }
}
