import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const published = searchParams.get('published');

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { titleCn: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (type) where.type = type;
    if (published === 'true') where.isPublished = true;
    if (published === 'false') where.isPublished = false;

    const articles = await prisma.article.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(articles);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, titleCn, slug, type, categories, tags, coverImage, gallery, subtitle, content, author, readTime, isFeatured, isPublished } = body;

    const article = await prisma.article.create({
      data: {
        title,
        titleCn,
        slug,
        type: type || 'STORY',
        categories: categories || '[]',
        tags: tags || '[]',
        coverImage: coverImage || '',
        gallery: gallery || '[]',
        subtitle,
        content: content || '',
        author,
        readTime: readTime ? Number(readTime) : null,
        isFeatured: isFeatured || false,
        isPublished: isPublished || false,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
