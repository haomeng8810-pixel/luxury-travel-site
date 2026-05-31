import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const inquiryRequestSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  country: z.string().optional(),
  destination: z.string().optional(),
  emotions: z.string().optional().default(''),
  travelDate: z.string().optional(),
  duration: z.number().optional(),
  travelers: z.number().optional().default(1),
  travelerType: z.string().optional(),
  budget: z.string().optional(),
  interests: z.string().optional().default(''),
  notes: z.string().optional(),
  tripSlug: z.string().optional(),
});

// POST - Create inquiry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = inquiryRequestSchema.parse(body);

    // If tripSlug is provided, get the trip ID
    let tripId: string | null = null;
    if (validated.tripSlug) {
      const trip = await prisma.trip.findUnique({
        where: { slug: validated.tripSlug },
        select: { id: true },
      });
      tripId = trip?.id || null;
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        firstName: validated.firstName,
        lastName: validated.lastName,
        email: validated.email,
        phone: validated.phone || null,
        country: validated.country || null,
        destination: validated.destination || null,
        emotions: validated.emotions,
        travelDates: validated.travelDate ? new Date(validated.travelDate) : null,
        travelDatesFlexible: false,
        duration: validated.duration || null,
        travelers: validated.travelers,
        travelerType: validated.travelerType || null,
        budget: validated.budget || null,
        interests: validated.interests,
        notes: validated.notes || null,
        tripId,
        status: 'NEW',
      },
    });

    return NextResponse.json({ success: true, id: inquiry.id }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: error.errors }, { status: 400 });
    }
    console.error('Inquiry creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET - List inquiries
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = status ? { status } : {};
    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { trip: true, expert: true },
      }),
      prisma.inquiry.count({ where }),
    ]);

    return NextResponse.json({
      inquiries,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Inquiry list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
