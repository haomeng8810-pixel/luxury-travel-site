import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { InquiryForm } from '@/components/InquiryForm';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';

// ============================================
// 行程详情页 - Prisma Database
// ============================================

function getLocaleField(obj: any, field: string, locale: string) {
  const suffix = locale === 'zh' ? 'Cn' : locale === 'ja' ? 'Jp' : 'En';
  const key = `${field}${suffix}`;
  return obj[key] || obj[field] || obj[`${field}Cn`] || '';
}

async function getTrip(slug: string) {
  const trip = await prisma.trip.findUnique({
    where: { slug, isActive: true },
    include: {
      emotion: true,
      destination: true,
    },
  });

  if (!trip) return null;

  // Parse JSON fields
  let itinerary: any[] = [];
  try { itinerary = JSON.parse(trip.itinerary || '[]'); } catch { itinerary = []; }

  const inclusions = JSON.parse(trip.inclusions || '[]');
  const exclusions = JSON.parse(trip.exclusions || '[]');
  const categories = JSON.parse(trip.categories || '[]');
  const experiences = JSON.parse(trip.experiences || '[]');
  const subDestinations = JSON.parse(trip.subDestinations || '[]');
  const gallery = JSON.parse(trip.gallery || '[]');
  const highlights = JSON.parse((trip.destination as any).highlight || '[]');

  return {
    id: trip.id,
    slug: trip.slug,
    title: trip.title,
    titleCn: trip.titleCn,
    titleEn: trip.title,
    titleJp: trip.titleCn,
    subtitle: trip.subtitle || '',
    tagline: trip.tagline || '',
    taglineCn: trip.tagline || '',
    taglineEn: trip.tagline || '',
    taglineJp: trip.tagline || '',
    coverImage: trip.coverImage,
    duration: trip.duration,
    nights: trip.nights,
    isFeatured: trip.isFeatured,
    isExclusive: trip.isExclusive,
    destination: {
      id: trip.destination.id,
      name: trip.destination.name,
      nameCn: trip.destination.nameCn,
      nameEn: trip.destination.name,
      nameJp: trip.destination.nameCn,
      slug: trip.destination.slug,
      coverImage: trip.destination.coverImage,
    },
    emotion: trip.emotion
      ? {
          name: trip.emotion.name,
          nameCn: trip.emotion.nameCn,
          nameEn: trip.emotion.name,
          nameJp: trip.emotion.nameCn,
          color: trip.emotion.color,
          icon: trip.emotion.icon || '✨',
        }
      : null,
    categories,
    categoriesCn: categories,
    categoriesEn: categories,
    categoriesJp: categories,
    subDestinations,
    subDestinationsCn: subDestinations,
    subDestinationsEn: subDestinations,
    subDestinationsJp: subDestinations,
    inclusions,
    inclusionsCn: inclusions,
    inclusionsEn: inclusions,
    inclusionsJp: inclusions,
    exclusions,
    exclusionsCn: exclusions,
    exclusionsEn: exclusions,
    exclusionsJp: exclusions,
    priceCurrency: trip.priceCurrency === 'CNY' ? '¥' : trip.priceCurrency,
    priceFrom: trip.priceFrom ? Number(trip.priceFrom) : undefined,
    isInquireOnly: trip.isInquireOnly,
    description: trip.description,
    descriptionCn: trip.description,
    descriptionEn: trip.description,
    descriptionJp: trip.description,
    itinerary,
    gallery,
    highlights,
  };
}

async function getRelatedTrips(destinationId: string, currentSlug: string) {
  const trips = await prisma.trip.findMany({
    where: {
      destinationId,
      slug: { not: currentSlug },
      isActive: true,
    },
    include: { emotion: true, destination: true },
    take: 3,
  });

  return trips.map((t) => ({
    id: t.id,
    slug: t.slug,
    title: t.title,
    titleCn: t.titleCn,
    coverImage: t.coverImage,
    duration: t.duration,
    nights: t.nights,
    priceFrom: t.priceFrom ? Number(t.priceFrom) : undefined,
    priceCurrency: t.priceCurrency,
  }));
}

export default async function TripDetailPage({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  const trip = await getTrip(params.slug);
  if (!trip) notFound();

  const t = await getTranslations('tripDetail');
  const tCommon = await getTranslations('common');

  const relatedTrips = await getRelatedTrips(trip.destination.slug === params.slug ? '' : trip.destination.id, params.slug);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-[70vh]">
        <Image
          src={trip.coverImage}
          alt={getLocaleField(trip, 'title', params.locale)}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
          <div className="max-w-6xl mx-auto">
            <Link
              href="/trips"
              className="inline-block mb-4 text-sm opacity-80 hover:opacity-100 transition-opacity"
            >
              ← {tCommon('back')}
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {getLocaleField(trip, 'title', params.locale)}
            </h1>
            <p className="text-lg opacity-90">{trip.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{trip.emotion?.icon || '✨'}</span>
            <div>
              <div className="text-gray-500 text-xs">{t('emotion')}</div>
              <div className="font-medium">{getLocaleField(trip.emotion || { name: '', nameCn: '', nameEn: '', nameJp: '' }, 'name', params.locale)}</div>
            </div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">{t('duration')}</div>
            <div className="font-medium">{trip.duration} {t('days')} / {trip.nights} {t('nights')}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">{t('destination')}</div>
            <div className="font-medium">{getLocaleField(trip.destination, 'name', params.locale)}</div>
          </div>
          {trip.priceFrom && (
            <div>
              <div className="text-gray-500 text-xs">{t('priceFrom')}</div>
              <div className="font-medium">{trip.priceCurrency}{trip.priceFrom.toLocaleString()}/人</div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Description */}
          <section>
            <h2 className="text-2xl font-bold mb-4">{t('overview')}</h2>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: getLocaleField(trip, 'description', params.locale) }}
            />
          </section>

          {/* Itinerary */}
          {trip.itinerary.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6">{t('itineraryTitle')}</h2>
              <div className="space-y-8">
                {trip.itinerary.map((day: any) => (
                  <div key={day.day} className="flex gap-6">
                    <div className="flex-shrink-0 w-16 text-center">
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mx-auto">
                        {day.day}
                      </div>
                    </div>
                    <div className="flex-1 pb-8 border-b border-gray-100 last:border-0">
                      <h3 className="text-xl font-semibold mb-2">
                        {getLocaleField(day, 'title', params.locale)}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {getLocaleField(day, 'description', params.locale)}
                      </p>
                      {day.activitiesCn && (
                        <div className="flex flex-wrap gap-2">
                          {(getLocaleField(day, 'activities', params.locale) || []).map((a: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                              {a}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Inclusions */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-green-600">{t('included')}</h3>
              <ul className="space-y-2">
                {trip.inclusions.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-red-500">{t('excluded')}</h3>
              <ul className="space-y-2">
                {trip.exclusions.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Sidebar - Inquiry Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <InquiryForm tripSlug={trip.slug} tripTitle={getLocaleField(trip, 'title', params.locale)} />
          </div>
        </div>
      </div>

      {/* Related Trips */}
      {relatedTrips.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">{t('relatedTrips')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedTrips.map((rt) => (
                <Link key={rt.id} href={`/trips/${rt.slug}`} className="group">
                  <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <Image src={rt.coverImage} alt={rt.titleCn} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-1">{getLocaleField(rt, 'title', params.locale)}</h3>
                      <p className="text-sm text-gray-500">{rt.duration}{t('days')} · {rt.nights}{t('nights')}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
