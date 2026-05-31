'use client';

import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';

function getLocaleField(obj: any, field: string, locale: string): string {
  const suffix = locale === 'en' ? '' : locale === 'ja' ? 'Jp' : 'Cn';
  const key = field + suffix;
  if (key in obj && (obj as any)[key]) return (obj as any)[key];
  const cnKey = field + 'Cn';
  if (cnKey in obj && (obj as any)[cnKey]) return (obj as any)[cnKey];
  return (obj as any)[field] || '';
}

export function DestinationsGrid({
  destinations,
}: {
  destinations: Array<{
    id: string;
    slug: string;
    name: string;
    nameCn: string;
    nameJp?: string;
    continent: string;
    coverImage: string;
    _count?: { trips: number };
  }>;
}) {
  const t = useTranslations('destinations');
  const locale = useLocale();

  const grouped = destinations.reduce((acc, dest) => {
    if (!acc[dest.continent]) acc[dest.continent] = [];
    acc[dest.continent].push(dest);
    return acc;
  }, {} as Record<string, typeof destinations>);

  const allLabel = locale === 'en' ? 'View All Destinations' : locale === 'ja' ? 'すべての目的地を見る' : '查看全部目的地';

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">{t('title')}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>

        {Object.entries(grouped).map(([continent, dests]) => (
          <div key={continent} className="mb-12 last:mb-0">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {t(`continents.${continent.toLowerCase() as 'asia'}`) || continent}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {dests.slice(0, 5).map((dest) => (
                <Link key={dest.id} href={`/destinations/${dest.slug}`} className="group relative aspect-square rounded-lg overflow-hidden block">
                  <Image src={dest.coverImage} alt={getLocaleField(dest, 'name', locale)} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <p className="text-lg font-bold">{getLocaleField(dest, 'name', locale)}</p>
                    <p className="text-sm opacity-80">{dest.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center mt-12">
          <Link href="/destinations" className="inline-flex items-center px-8 py-4 border-2 border-gray-900 text-gray-900 text-lg font-medium rounded hover:bg-gray-900 hover:text-white transition-all duration-200 group">
            {allLabel}
            <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
