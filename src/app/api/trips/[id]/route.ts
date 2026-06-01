import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';

type Props = { params: { id: string } };

// GET - Get single trip
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: params.id },
      include: { destination: true, emotion: true },
    });
    if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    return NextResponse.json(trip);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trip' }, { status: 500 });
  }
}

// PUT - Update trip
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const data = await request.json();

    const trip = await prisma.trip.update({
      where: { id: params.id },
      data: {
        slug: data.slug,
        title: data.title,
        titleCn: data.titleCn,
        subtitle: data.subtitle,
        tagline: data.tagline,
        description: data.description,
        coverImage: data.coverImage,
        gallery: data.gallery ? JSON.stringify(data.gallery) : undefined,
        duration: data.duration,
        nights: data.nights,
        minGuests: data.minGuests,
        difficulty: data.difficulty,
        activityLevel: data.activityLevel,
        emotionId: data.emotionId || null,
        categories: data.categories ? JSON.stringify(data.categories) : undefined,
        experiences: data.experiences ? JSON.stringify(data.experiences) : undefined,
        destinationId: data.destinationId,
        subDestinations: data.subDestinations ? JSON.stringify(data.subDestinations) : undefined,
        priceFrom: data.priceFrom,
        priceCurrency: data.priceCurrency,
        priceNote: data.priceNote,
        isInquireOnly: data.isInquireOnly,
        isFeatured: data.isFeatured,
        isExclusive: data.isExclusive,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      },
    });

    return NextResponse.json(trip);
  } catch (error: any) {
    console.error('Update trip error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update trip' }, { status: 500 });
  }
}

// DELETE - Delete trip
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    await prisma.trip.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete trip' }, { status: 500 });
  }
}
