import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Props = { params: { id: string } };

// PUT - Update trip itinerary
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const data = await request.json();

    const trip = await prisma.trip.update({
      where: { id: params.id },
      data: {
        itinerary: JSON.stringify(data.itinerary),
      },
    });

    return NextResponse.json(trip);
  } catch (error: any) {
    console.error('Update itinerary error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update itinerary' }, { status: 500 });
  }
}
