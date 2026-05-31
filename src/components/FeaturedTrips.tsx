'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

interface Trip {
  id: string;
  slug: string;
  title: string;
  titleCn: string;
  titleJp?: string;
  subtitle?: string;
  subtitleJp?: string;
  coverImage: string;
  duration: number;
  nights: number;
  emotion?: { name: string; nameCn: string; nameJp?: string } | null;
  destination: { name: string; nameCn: string; nameJp?: string };
  isExclusive: boolean;
  priceFrom?: number;
}

interface FeaturedTripsProps { trips: Trip[]; }

function getLocaleField(obj: any, field: string, locale: string): string {
  const suffix = locale === 'en' ? '' : locale === 'ja' ? 'Jp' : 'Cn';
  const key = field + suffix;
  if (key in obj && (obj as any)[key]) return (obj as any)[key];
  const cnKey = field + 'Cn';
  if (cnKey in obj && (obj as any)[cnKey]) return (obj as any)[cnKey];
  return (obj as any)[field] || '';
}

function TripCard({ trip, index, locale, labels }: { trip: Trip; index: number; locale: string; labels: { exclusive: string; inquire: string; day: string; night: string; from: string } }) {
  const displayName = getLocaleField(trip, 'title', locale);
  const destName = getLocaleField(trip.destination, 'name', locale);
  const emotionName = trip.emotion ? getLocaleField(trip.emotion, 'name', locale) : '';

  return (
    <article className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={trip.coverImage} alt={displayName} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        {trip.isExclusive && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-yellow-600 text-white text-xs font-bold uppercase tracking-wide rounded">{labels.exclusive}</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-sm opacity-90">{destName}</p>
          <h3 className="text-2xl font-serif font-bold">{displayName}</h3>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {trip.duration} {labels.day} {trip.nights} {labels.night}
          </div>
          {trip.emotion && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              {emotionName}
            </div>
          )}
        </div>
        {trip.priceFrom && (
          <p className="text-lg font-bold text-yellow-600 mb-4">
            ¥{trip.priceFrom.toLocaleString()} {labels.from}
          </p>
        )}
        {trip.subtitle && <p className="text-gray-600 mb-6 line-clamp-2">{getLocaleField(trip, 'subtitle', locale)}</p>}
        <Link href={`/trips/${trip.slug}`} className="inline-flex items-center text-gray-900 font-medium hover:text-yellow-600 transition-colors group/link">
          {labels.inquire}
          <svg className="ml-2 w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </Link>
      </div>
    </article>
  );
}

export default function FeaturedTrips({ trips }: FeaturedTripsProps) {
  const locale = useLocale();
  // Use translations from home.featuredTrips, trips, common via parent or inline
  const labels = {
    exclusive: locale === 'en' ? 'Exclusive' : locale === 'ja' ? '限定' : '限定',
    inquire: locale === 'en' ? 'Inquire Now' : locale === 'ja' ? '今すぐ相談' : '立即咨询',
    day: locale === 'en' ? 'days' : locale === 'ja' ? '日間' : '天',
    night: locale === 'en' ? 'nights' : locale === 'ja' ? '泊' : '晚',
    from: locale === 'en' ? '~' : locale === 'ja' ? '~' : '~',
  };

  if (!trips || trips.length === 0) return null;

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            {locale === 'en' ? 'Featured Trips' : locale === 'ja' ? '厳選旅程' : '精选行程'}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {locale === 'en' ? 'Curated experiences designed for discerning travelers' : locale === 'ja' ? '上質な旅行者のために設計された厳選された体験' : '为高端旅行者精心设计的深度体验'}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {trips.map((trip, index) => (
            <TripCard key={trip.id} trip={trip} index={index} locale={locale} labels={labels} />
          ))}
        </div>
        <div className="text-center">
          <Link href="/trips" className="inline-flex items-center px-8 py-4 border-2 border-gray-900 text-gray-900 text-lg font-medium rounded hover:bg-gray-900 hover:text-white transition-all duration-200 group">
            {locale === 'en' ? 'View All Trips' : locale === 'ja' ? 'すべての旅程を見る' : '查看全部行程'}
            <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
