import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type Props = { params: { id: string } };

// GET - Get single destination
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const dest = await prisma.destination.findUnique({ where: { id: params.id } });
    if (!dest) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(dest);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

// PUT - Update destination
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const data = await request.json();
    const dest = await prisma.destination.update({
      where: { id: params.id },
      data: {
        slug: data.slug,
        name: data.name,
        nameCn: data.nameCn,
        nameLocal: data.nameLocal,
        continent: data.continent,
        region: data.region,
        countryCode: data.countryCode,
        description: data.description,
        coverImage: data.coverImage,
        gallery: data.gallery !== undefined ? JSON.stringify(data.gallery) : undefined,
        highlight: data.highlight !== undefined ? JSON.stringify(data.highlight) : undefined,
        language: data.language,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
      },
    });
    return NextResponse.json(dest);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete destination
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    await prisma.destination.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
