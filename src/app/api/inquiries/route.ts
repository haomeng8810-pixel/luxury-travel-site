import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const inquiryRequestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  destination: z.string().optional(),
  travelDate: z.string().optional(),
  guests: z.number().optional(),
  budget: z.number().optional(),
  message: z.string().max(2000).optional(),
  tripSlug: z.string().optional(),
});

// POST - Create inquiry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = inquiryRequestSchema.parse(body);

    const inquiry = await prisma.inquiry.create({
      data: {
        name: validated.name,
        email: validated.email,
        phone: validated.phone || '',
        destination: validated.destination || '',
        travelDate: validated.travelDate ? new Date(validated.travelDate) : null,
        guests: validated.guests || null,
        budget: validated.budget || null,
        message: validated.message || '',
        tripSlug: validated.tripSlug || null,
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

    const where = status ? { status } : {};
    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
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
