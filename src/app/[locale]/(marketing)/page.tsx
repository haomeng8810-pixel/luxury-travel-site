// ============================================
// 高端定制旅行网站 - 首页组件
// 数据源：Supabase PostgreSQL (Prisma)
// ============================================

import { prisma } from '@/lib/prisma';
import { HeroSection } from '@/components/HeroSection';
import { FeelingsSelector } from '@/components/FeelingsSelector';
import FeaturedTrips from '@/components/FeaturedTrips';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { DestinationsGrid } from '@/components/DestinationsGrid';
import { Testimonials } from '@/components/Testimonials';
import { LatestStories } from '@/components/LatestStories';
import { FinalCTA } from '@/components/FinalCTA';

// ============================================
// 数据获取（服务端组件）- Prisma Database
// ============================================

async function getFeaturedTrips() {
  const trips = await prisma.trip.findMany({
    where: { isFeatured: true, isActive: true },
    orderBy: { sortOrder: 'asc' },
    take: 4,
    include: {
      emotion: true,
      destination: true,
    },
  });

  return trips.map((trip: any) => ({
    id: trip.id,
    slug: trip.slug,
    title: trip.title,
    titleCn: trip.titleCn,
    titleJp: trip.titleCn, // TODO: add titleJp column later
    subtitle: trip.subtitle || '',
    subtitleJp: trip.subtitle || '',
    tagline: trip.tagline || '',
    coverImage: trip.coverImage,
    destination: {
      name: trip.destination.name,
      nameCn: trip.destination.nameCn,
      nameJp: trip.destination.nameCn,
    },
    emotion: trip.emotion
      ? { name: trip.emotion.name, nameCn: trip.emotion.nameCn, nameJp: trip.emotion.nameCn }
      : { name: '', nameCn: '', nameJp: '' },
    duration: trip.duration,
    nights: trip.nights,
    priceFrom: trip.priceFrom ? Number(trip.priceFrom) : undefined,
    isExclusive: trip.isExclusive,
  }));
}

async function getDestinations() {
  const destinations = await prisma.destination.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: { select: { trips: true } },
    },
  });

  return destinations.map((dest: any) => ({
    id: dest.id,
    slug: dest.slug,
    name: dest.name,
    nameCn: dest.nameCn,
    nameJp: dest.nameCn,
    continent: dest.continent,
    coverImage: dest.coverImage,
    _count: { trips: dest._count.trips },
  }));
}

async function getEmotions() {
  const emotions = await prisma.emotion.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });

  return emotions.map((emo: any) => ({
    id: emo.id,
    name: emo.name,
    nameCn: emo.nameCn,
    nameJp: emo.nameCn,
    description: emo.description,
    descriptionJp: emo.description,
    color: emo.color,
    icon: emo.icon || '✨',
  }));
}

async function getTestimonials() {
  const reviews = await prisma.review.findMany({
    where: { isFeatured: true, isActive: true },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  return reviews.map((review: any) => ({
    id: review.id,
    customerName: review.customerName,
    location: review.location,
    rating: review.rating,
    title: review.title,
    titleCn: review.title,
    titleJp: review.title,
    content: review.content,
    tripDate: review.tripDate || null,
  }));
}

async function getLatestStories() {
  const [articles, podcasts] = await Promise.all([
    prisma.article.findMany({
      where: { isFeatured: true, isPublished: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    }),
    prisma.podcast.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      take: 2,
    }),
  ]);

  return {
    articles: articles.map((a: any) => ({
      id: a.id,
      slug: a.slug,
      type: a.type,
      title: a.title,
      coverImage: a.coverImage,
      readTime: a.readTime || 5,
      publishedAt: a.publishedAt || a.createdAt,
    })),
    podcasts: podcasts.map((p: any) => ({
      id: p.id,
      slug: p.slug,
      type: 'PODCAST' as const,
      title: p.title,
      coverImage: p.coverImage,
      duration: p.duration,
      episodeNumber: p.episodeNumber,
    })),
  };
}

// ============================================
// 首页组件
// ============================================

export default async function HomePage() {
  let trips: any[] = [], destinations: any[] = [], emotions: any[] = [], testimonials: any[] = [], stories: any = { articles: [], podcasts: [] };
  
  try {
    [trips, destinations, emotions, testimonials, stories] =
      await Promise.all([
        getFeaturedTrips(),
        getDestinations(),
        getEmotions(),
        getTestimonials(),
        getLatestStories(),
      ]);
  } catch (error) {
    console.error('Database connection error:', error);
    // Return empty data - site will still render without DB content
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section - 全屏首屏 */}
      <HeroSection />

      {/* Feelings Engine - 情感选择器（核心差异化） */}
      <section id="feelings">
        <FeelingsSelector emotions={emotions} />
      </section>

      {/* Featured Trips - 精选行程 */}
      <section id="trips">
        <FeaturedTrips trips={trips} />
      </section>

      {/* Why Choose Us - 品牌优势 */}
      <section id="why-us">
        <WhyChooseUs />
      </section>

      {/* Destinations - 目的地探索 */}
      <section id="destinations">
        <DestinationsGrid destinations={destinations} />
      </section>

      {/* Testimonials - 客户评价 */}
      <section id="testimonials">
        <Testimonials reviews={testimonials} />
      </section>

      {/* Latest Stories - 最新灵感 */}
      <section id="stories">
        <LatestStories articles={stories.articles} podcasts={stories.podcasts} />
      </section>

      {/* Final CTA - 最终转化 */}
      <section id="contact">
        <FinalCTA />
      </section>
    </main>
  );
}
