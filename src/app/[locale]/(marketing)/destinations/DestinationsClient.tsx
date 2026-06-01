'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';

interface Destination {
  id: string;
  slug: string;
  name: string;
  nameCn: string;
  nameJp?: string;
  coverImage: string;
  countryCode: string;
  continent: string;
  tripCount: number;
}

interface DestinationsClientProps {
  destinations: Destination[];
}

function getContinentLabel(continent: string, locale: string): string {
  const labels: Record<string, { cn: string; en: string; jp: string }> = {
    Africa: { cn: '非洲', en: 'Africa', jp: 'アフリカ' },
    Asia: { cn: '亚洲', en: 'Asia', jp: 'アジア' },
    Europe: { cn: '欧洲', en: 'Europe', jp: 'ヨーロッパ' },
    'North America': { cn: '北美洲', en: 'North America', jp: '北アメリカ' },
    'South America': { cn: '南美洲', en: 'South America', jp: '南アメリカ' },
    Oceania: { cn: '大洋洲', en: 'Oceania', jp: 'オセアニア' },
    'Arctic Circle': { cn: '极地', en: 'Arctic Circle', jp: '北極圏' },
    'Middle East': { cn: '中东', en: 'Middle East', jp: '中東' },
  };
  const entry = labels[continent];
  if (!entry) return continent;
  if (locale === 'ja') return entry.jp;
  if (locale === 'en') return entry.en;
  return entry.cn;
}

function getLocaleName(dest: { name: string; nameCn: string; nameJp?: string }, locale: string): string {
  if (locale === 'ja' && dest.nameJp) return dest.nameJp;
  if (locale === 'en') return dest.name;
  return dest.nameCn;
}

function DestinationCard({ destination }: { destination: Destination }) {
  const t = useTranslations('destinations');
  const locale = useLocale();
  const displayName = getLocaleName(destination, locale);

  return (
    <Link href={`/destinations/${destination.slug}`} className="group relative aspect-square rounded-lg overflow-hidden block">
      <Image src={destination.coverImage} alt={displayName} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="text-lg font-bold">{displayName}</h3>
        <p className="text-sm opacity-80">{destination.name}</p>
        <p className="text-xs mt-1 opacity-70">{destination.tripCount} {t('tripsUnit') || (locale === 'ja' ? '旅程' : locale === 'en' ? 'trips' : '个行程')}</p>
      </div>
    </Link>
  );
}

export default function DestinationsClient({ destinations }: DestinationsClientProps) {
  const t = useTranslations('destinations');
  const locale = useLocale();
  const [selectedContinent, setSelectedContinent] = useState<string>('');

  const continents = Array.from(new Set(destinations.map((d) => d.continent)));

  const filtered = selectedContinent
    ? destinations.filter((d) => d.continent === selectedContinent)
    : destinations;

  const groupedByContinent = filtered.reduce((acc, dest) => {
    if (!acc[dest.continent]) acc[dest.continent] = [];
    acc[dest.continent].push(dest);
    return acc;
  }, {} as Record<string, Destination[]>);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-96 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: 'url(https://picsum.photos/id/1036/1920/1080)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
          <div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">{t('title')}</h1>
            <p className="text-xl opacity-90">{t('subtitle')}</p>
          </div>
        </div>
      </section>

      {/* 大洲筛选 */}
      <section className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button onClick={() => setSelectedContinent('')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${!selectedContinent ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{t('all') || (locale === 'ja' ? 'すべて' : locale === 'en' ? 'All' : '全部')}</button>
            {continents.map((c) => (
              <button key={c} onClick={() => setSelectedContinent(c)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedContinent === c ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{getContinentLabel(c, locale)}</button>
            ))}
          </div>
        </div>
      </section>

      {/* 目的地网格 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {Object.entries(groupedByContinent).map(([continentName, dests]) => (
          <div key={continentName} className="mb-16">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">{getContinentLabel(continentName, locale)}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {dests.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-xl text-gray-500">{t('noData')}</p>
          </div>
        )}
      </section>
    </div>
  );
}
