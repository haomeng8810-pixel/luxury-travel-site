'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { Suspense } from 'react';
import { useTranslations, useLocale } from 'next-intl';

// ============================================
// Mock 数据 - 多语言版本
// ============================================

const EMOTIONS = [
  { id: '1', name: 'contentment', nameCn: '宁静惬意', nameEn: 'Contentment', nameJp: '心安らぐ', color: '#9b8ec4', icon: '🌸' },
  { id: '2', name: 'revitalized', nameCn: '焕然一新', nameEn: 'Revitalized', nameJp: '新しい自分', color: '#e67e22', icon: '🔥' },
  { id: '3', name: 'freedom', nameCn: '自由无束', nameEn: 'Freedom', nameJp: '自由', color: '#3498db', icon: '🕊️' },
  { id: '4', name: 'distraction', nameCn: '逃离喧嚣', nameEn: 'Escape', nameJp: '日常からの逃避', color: '#e74c3c', icon: '🏝️' },
  { id: '5', name: 'challenged', nameCn: '挑战自我', nameEn: 'Challenged', nameJp: '挑戦', color: '#2c3e50', icon: '🏔️' },
];

const TRIPS = [
  {
    id: '1',
    slug: 'tokyo-kyoto-classic',
    titleCn: '东京京都经典之旅', titleEn: 'Tokyo & Kyoto Classic', titleJp: '東京・京都クラシック',
    subtitle: 'Experience the perfect blend of modern and traditional Japan',
    taglineCn: '从繁华东京到古都京都，感受日本传统与现代的完美交融',
    taglineEn: 'From bustling Tokyo to ancient Kyoto, experience the perfect fusion of tradition and modernity',
    taglineJp: '活気ある東京から古都京都まで、伝統と現代の完璧な融合を体験',
    coverImage: 'https://picsum.photos/id/1039/800/600',
    duration: 7, nights: 6, isFeatured: true, isExclusive: true,
    destination: { nameCn: '东京·京都', nameEn: 'Tokyo · Kyoto', nameJp: '東京・京都', slug: 'tokyo-kyoto' },
    emotion: { name: 'contentment', nameCn: '宁静惬意', nameEn: 'Contentment', nameJp: '心安らぐ', color: '#9b8ec4', icon: '🌸' },
    categoriesCn: ['文化', '美食', '城市'], categoriesEn: ['Culture', 'Food', 'City'], categoriesJp: ['文化', 'グルメ', '都市'],
    subDestinationsCn: ['东京', '镰仓', '京都', '奈良'], subDestinationsEn: ['Tokyo', 'Kamakura', 'Kyoto', 'Nara'], subDestinationsJp: ['東京', '鎌倉', '京都', '奈良'],
    priceCurrency: '¥', priceFrom: 28800, isInquireOnly: false,
  },
  {
    id: '2',
    slug: 'hokkaido-winter',
    titleCn: '北海道冬日奇缘', titleEn: 'Hokkaido Winter Wonderland', titleJp: '北海道ウインターワンダーランド',
    subtitle: 'Ski, hot springs, and snow festivals in Japan\'s winter wonderland',
    taglineCn: '在粉雪天堂滑雪，在温泉乡放松，感受北海道的冬日魅力',
    taglineEn: 'Ski in powder paradise, relax in hot spring villages, experience Hokkaido\'s winter charm',
    taglineJp: 'パウダーパラダイスでスキー、温泉郷でリラックス、北海道の冬の魅力を体験',
    coverImage: 'https://picsum.photos/id/15/800/600',
    duration: 6, nights: 5, isFeatured: true, isExclusive: false,
    destination: { nameCn: '北海道', nameEn: 'Hokkaido', nameJp: '北海道', slug: 'hokkaido' },
    emotion: { name: 'revitalized', nameCn: '焕然一新', nameEn: 'Revitalized', nameJp: '新しい自分', color: '#e67e22', icon: '🔥' },
    categoriesCn: ['滑雪', '温泉', '自然'], categoriesEn: ['Skiing', 'Hot Springs', 'Nature'], categoriesJp: ['スキー', '温泉', '自然'],
    subDestinationsCn: ['札幌', '小樽', '二世谷', '登别'], subDestinationsEn: ['Sapporo', 'Otaru', 'Niseko', 'Noboribetsu'], subDestinationsJp: ['札幌', '小樽', 'ニセコ', '登別'],
    priceCurrency: '¥', priceFrom: 22800, isInquireOnly: false,
  },
  {
    id: '3',
    slug: 'okinawa-beach',
    titleCn: '冲绳海岛度假', titleEn: 'Okinawa Island Paradise', titleJp: '沖縄アイランドパラダイス',
    subtitle: 'Crystal clear waters, coral reefs, and island paradise',
    taglineCn: '在碧蓝海域浮潜，在白色沙滩漫步，享受冲绳的慢生活',
    taglineEn: 'Snorkel in crystal blue waters, stroll on white sand beaches, enjoy Okinawa\'s slow life',
    taglineJp: '透き通る青い海でシュノーケリング、白い砂浜を散策、沖縄のスローライフを楽しむ',
    coverImage: 'https://picsum.photos/id/1018/800/600',
    duration: 5, nights: 4, isFeatured: false, isExclusive: false,
    destination: { nameCn: '冲绳', nameEn: 'Okinawa', nameJp: '沖縄', slug: 'okinawa' },
    emotion: { name: 'freedom', nameCn: '自由无束', nameEn: 'Freedom', nameJp: '自由', color: '#3498db', icon: '🕊️' },
    categoriesCn: ['海滩', '浮潜', '休闲'], categoriesEn: ['Beach', 'Snorkeling', 'Relaxation'], categoriesJp: ['ビーチ', 'シュノーケリング', 'リラックス'],
    subDestinationsCn: ['那霸', '恩纳村', '石垣岛', '竹富岛'], subDestinationsEn: ['Naha', 'Onna Village', 'Ishigaki Island', 'Taketomi Island'], subDestinationsJp: ['那覇', '恩納村', '石垣島', '竹富島'],
    priceCurrency: '¥', priceFrom: 15800, isInquireOnly: false,
  },
  {
    id: '4',
    slug: 'osaka-gourmet',
    titleCn: '大阪美食文化之旅', titleEn: 'Osaka Culinary Adventure', titleJp: '大阪グルメアドベンチャー',
    subtitle: 'Street food, Michelin stars, and culinary adventures',
    taglineCn: '从米其林三星到街头小吃，在大阪开启味蕾盛宴',
    taglineEn: 'From Michelin 3-star to street food, embark on a culinary feast in Osaka',
    taglineJp: 'ミシュラン三つ星からストリートフードまで、大阪でグルメの宴を開始',
    coverImage: 'https://picsum.photos/id/28/800/600',
    duration: 4, nights: 3, isFeatured: false, isExclusive: true,
    destination: { nameCn: '大阪', nameEn: 'Osaka', nameJp: '大阪', slug: 'osaka' },
    emotion: { name: 'distraction', nameCn: '逃离喧嚣', nameEn: 'Escape', nameJp: '日常からの逃避', color: '#e74c3c', icon: '🏝️' },
    categoriesCn: ['美食', '文化', '购物'], categoriesEn: ['Food', 'Culture', 'Shopping'], categoriesJp: ['グルメ', '文化', 'ショッピング'],
    subDestinationsCn: ['大阪', '神户', '奈良'], subDestinationsEn: ['Osaka', 'Kobe', 'Nara'], subDestinationsJp: ['大阪', '神戸', '奈良'],
    priceCurrency: '¥', priceFrom: 18800, isInquireOnly: true,
  },
];

// ============================================
// 辅助函数
// ============================================

function getLocaleField(obj: any, field: string, locale: string): string {
  const suffix = locale === 'en' ? 'En' : locale === 'ja' ? 'Jp' : 'Cn';
  return obj[field + suffix] || obj[field + 'Cn'] || '';
}

function getEmotionName(emotion: any, locale: string): string {
  if (locale === 'en') return emotion.nameEn || emotion.name.charAt(0).toUpperCase() + emotion.name.slice(1);
  if (locale === 'ja') return emotion.nameJp || emotion.nameCn;
  return emotion.nameCn;
}

// ============================================
// 行程列表页
// ============================================

export default function TripsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">加载中...</div>}>
      <TripsContent />
    </Suspense>
  );
}

function TripsContent() {
  const searchParams = useSearchParams();
  const urlEmotion = searchParams?.get('emotion') || '';
  const [selectedEmotion, setSelectedEmotion] = useState<string>(urlEmotion);
  const t = useTranslations('trips');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  useEffect(() => {
    setSelectedEmotion(searchParams?.get('emotion') || '');
  }, [searchParams]);

  const filteredTrips = selectedEmotion
    ? TRIPS.filter((t) => t.emotion?.name === selectedEmotion)
    : TRIPS;

  const tripCountSuffix = locale === 'en' ? 'trips' : locale === 'ja' ? '件' : '个行程';

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-64 bg-gray-900 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url(https://picsum.photos/id/1016/1920/1080)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
          <div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">{t('title')}</h1>
            <p className="text-xl opacity-90">{t('subtitle')}</p>
          </div>
        </div>
      </section>

      {/* 筛选栏 */}
      <section className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setSelectedEmotion('')}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                  !selectedEmotion ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('filters.all')}
              </button>
              {EMOTIONS.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setSelectedEmotion(e.name)}
                  className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                    selectedEmotion === e.name
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {e.icon} {getEmotionName(e, locale)}
                </button>
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-auto">
              {filteredTrips.length} {tripCountSuffix}
            </span>
          </div>
        </div>
      </section>

      {/* 行程网格 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} t={t} tCommon={tCommon} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-2xl text-gray-400 mb-4">🔍</p>
            <p className="text-xl text-gray-500 mb-6">{t('noResults')}</p>
            <button
              onClick={() => setSelectedEmotion('')}
              className="text-yellow-600 hover:text-yellow-700 font-medium"
            >
              {t('viewAll')}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

// ============================================
// 行程卡片
// ============================================

function TripCard({
  trip,
  t,
  tCommon,
  locale,
}: {
  trip: {
    id: string;
    slug: string;
    titleCn: string;
    titleEn: string;
    titleJp: string;
    subtitle: string | null;
    taglineCn: string;
    taglineEn: string;
    taglineJp: string;
    coverImage: string;
    duration: number;
    nights: number;
    isFeatured: boolean;
    isExclusive: boolean;
    destination: { nameCn: string; nameEn: string; nameJp: string; slug: string };
    emotion: { name: string; nameCn: string; nameEn: string; nameJp: string; color: string; icon: string | null } | null;
    priceCurrency: string;
    priceFrom: number;
    isInquireOnly: boolean;
  };
  t: any;
  tCommon: any;
  locale: string;
}) {
  const title = getLocaleField(trip, 'title', locale);
  const tagline = getLocaleField(trip, 'tagline', locale);
  const destinationName = getLocaleField(trip.destination, 'name', locale);

  return (
    <Link
      href={`/trips/${trip.slug}`}
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={trip.coverImage}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {trip.isExclusive && (
            <span className="px-2 py-1 bg-yellow-600 text-white text-xs font-bold rounded">{t('exclusive')}</span>
          )}
          {trip.isFeatured && (
            <span className="px-2 py-1 bg-gray-900 text-white text-xs font-bold rounded">{t('featured')}</span>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-sm opacity-90">{destinationName}</p>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
          {title}
        </h3>
        {tagline && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tagline}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{trip.duration} {tCommon('day')} {trip.nights} {tCommon('night')}</span>
          </div>
          {trip.emotion && (
            <span
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: `${trip.emotion.color}15`, color: trip.emotion.color }}
            >
              {trip.emotion.icon} {getEmotionName(trip.emotion, locale)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
