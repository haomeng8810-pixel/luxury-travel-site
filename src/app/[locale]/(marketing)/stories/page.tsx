'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';

// ============================================
// Mock 数据 - 多语言版本
// ============================================

const ARTICLES = [
  { id: '1', slug: 'kyoto-hidden-temples', type: 'STORY',
    titleCn: '京都十大隐秘寺庙', titleEn: 'Ten Hidden Temples of Kyoto', titleJp: '京都の隠れた十大寺院',
    subtitleCn: '远离游客，感受真正的禅意', subtitleEn: 'Away from tourists, feel true zen', subtitleJp: '観光客を離れ、本当の禅を感じる',
    coverImage: 'https://picsum.photos/id/1031/800/500', readTime: 8, publishedAt: new Date('2026-05-20'),
    authorCn: '田中先生', authorEn: 'Mr. Tanaka', authorJp: '田中先生' },
  { id: '2', slug: 'japan-tea-ceremony', type: 'FEATURE',
    titleCn: '日本茶道艺术', titleEn: 'The Art of Japanese Tea Ceremony', titleJp: '日本茶道の芸術',
    subtitleCn: '一期一会的极致体验', subtitleEn: 'The ultimate experience of "once in a lifetime"', subtitleJp: '「一期一会」の究極体験',
    coverImage: 'https://picsum.photos/id/1039/800/500', readTime: 12, publishedAt: new Date('2026-05-15'),
    authorCn: '佐藤女士', authorEn: 'Ms. Sato', authorJp: '佐藤女士' },
  { id: '3', slug: 'hokkaido-ski-guide', type: 'GUIDE',
    titleCn: '北海道滑雪完全指南', titleEn: 'Complete Hokkaido Ski Guide', titleJp: '北海道スキー完全ガイド',
    subtitleCn: '从新手到高手的进阶之路', subtitleEn: 'From beginner to advanced', subtitleJp: '初心者から上級者までのステップ',
    coverImage: 'https://picsum.photos/id/15/800/500', readTime: 15, publishedAt: new Date('2026-05-10'),
    authorCn: '山本教练', authorEn: 'Coach Yamamoto', authorJp: '山本コーチ' },
  { id: '4', slug: 'tokyo-michelin', type: 'FEATURE',
    titleCn: '东京米其林餐厅精选', titleEn: 'Tokyo Michelin Restaurant Picks', titleJp: '東京ミシュランレストラン厳選',
    subtitleCn: '2026 年必吃的 10 家餐厅', subtitleEn: '10 must-try restaurants in 2026', subtitleJp: '2026 年必食の10軒',
    coverImage: 'https://picsum.photos/id/28/800/500', readTime: 10, publishedAt: new Date('2026-05-05'),
    authorCn: '美食编辑部', authorEn: 'Food Editorial', authorJp: 'グルメ編集部' },
  { id: '5', slug: 'okinawa-beach-guide', type: 'GUIDE',
    titleCn: '冲绳海滩浮潜攻略', titleEn: 'Okinawa Beach Snorkeling Guide', titleJp: '沖縄ビーチシュノーケリングガイド',
    subtitleCn: '最佳季节、地点和装备推荐', subtitleEn: 'Best season, spots, and gear', subtitleJp: 'ベストシーズン、スポット、装備',
    coverImage: 'https://picsum.photos/id/1018/800/500', readTime: 8, publishedAt: new Date('2026-04-28'),
    authorCn: '旅行编辑部', authorEn: 'Travel Editorial', authorJp: '旅行編集部' },
  { id: '6', slug: 'japan-sakura-2026', type: 'NEWS',
    titleCn: '2026 日本樱花季预测', titleEn: '2026 Japan Cherry Blossom Forecast', titleJp: '2026 日本桜シーズン予測',
    subtitleCn: '各地开花时间与最佳观赏地', subtitleEn: 'Bloom times and best viewing spots', subtitleJp: '各地開花時期とベストスポット',
    coverImage: 'https://picsum.photos/id/1040/800/500', readTime: 6, publishedAt: new Date('2026-04-20'),
    authorCn: '气象编辑部', authorEn: 'Weather Editorial', authorJp: '気象編集部' },
];

const PODCASTS = [
  { id: '1', slug: 'japan-culture-deep',
    titleCn: '深度解读日本文化', titleEn: 'Deep Dive into Japanese Culture', titleJp: '日本文化を深く読み解く',
    coverImage: 'https://picsum.photos/id/1039/200/200', duration: 2400, episodeNumber: 1, publishedAt: new Date('2026-05-18') },
  { id: '2', slug: 'hokkaido-adventure',
    titleCn: '北海道探险记', titleEn: 'Hokkaido Adventure', titleJp: '北海道探検記',
    coverImage: 'https://picsum.photos/id/15/200/200', duration: 1800, episodeNumber: 2, publishedAt: new Date('2026-05-11') },
  { id: '3', slug: 'tokyo-food-tour',
    titleCn: '东京美食漫游', titleEn: 'Tokyo Food Tour', titleJp: '東京グルメ漫游',
    coverImage: 'https://picsum.photos/id/28/200/200', duration: 2100, episodeNumber: 3, publishedAt: new Date('2026-05-04') },
];

const TYPE_LABELS: Record<string, { cn: string; en: string; jp: string }> = {
  STORY: { cn: '故事', en: 'Story', jp: 'ストーリー' },
  GUIDE: { cn: '指南', en: 'Guide', jp: 'ガイド' },
  FEATURE: { cn: '专题', en: 'Feature', jp: '特集' },
  NEWS: { cn: '新闻', en: 'News', jp: 'ニュース' },
};

// ============================================
// 辅助函数
// ============================================

function getLocaleField(obj: any, field: string, locale: string): string {
  const suffix = locale === 'en' ? 'En' : locale === 'ja' ? 'Jp' : 'Cn';
  return obj[field + suffix] || obj[field + 'Cn'] || '';
}

function formatDuration(seconds: number, locale: string): string {
  const minutes = Math.floor(seconds / 60);
  if (locale === 'en') return `${minutes} min`;
  if (locale === 'ja') return `${minutes}分`;
  return `${minutes}分钟`;
}

// ============================================
// 灵感/故事列表页
// ============================================

export default function StoriesPage() {
  const t = useTranslations('stories');
  const locale = useLocale();
  const [selectedType, setSelectedType] = useState<string>('');

  const filteredArticles = selectedType
    ? ARTICLES.filter((a) => a.type === selectedType)
    : ARTICLES;

  const typeOptions = [
    { value: '', label: t('filters.all') || '全部' },
    { value: 'STORY', label: TYPE_LABELS['STORY'][locale === 'ja' ? 'jp' : locale === 'en' ? 'en' : 'cn'] },
    { value: 'GUIDE', label: TYPE_LABELS['GUIDE'][locale === 'ja' ? 'jp' : locale === 'en' ? 'en' : 'cn'] },
    { value: 'FEATURE', label: TYPE_LABELS['FEATURE'][locale === 'ja' ? 'jp' : locale === 'en' ? 'en' : 'cn'] },
    { value: 'NEWS', label: TYPE_LABELS['NEWS'][locale === 'ja' ? 'jp' : locale === 'en' ? 'en' : 'cn'] },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-64 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: 'url(https://picsum.photos/id/1015/1920/1080)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
          <div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">{t('title')}</h1>
            <p className="text-xl opacity-90">{t('subtitle')}</p>
          </div>
        </div>
      </section>

      {/* 筛选栏 */}
      <section className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {typeOptions.map((type) => (
              <button key={type.value} onClick={() => setSelectedType(type.value)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${(!selectedType && !type.value) || selectedType === type.value ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{type.label}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 文章网格 */}
        {filteredArticles.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('latestArticles')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} locale={locale} />
              ))}
            </div>
          </div>
        )}

        {/* 播客列表 */}
        {PODCASTS.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">🎙️ {t('podcasts')}</h2>
            <div className="space-y-4">
              {PODCASTS.map((podcast) => (
                <PodcastCard key={podcast.id} podcast={podcast} locale={locale} />
              ))}
            </div>
          </div>
        )}

        {filteredArticles.length === 0 && (
          <div className="text-center py-24">
            <p className="text-xl text-gray-500">{t('noContent')}</p>
          </div>
        )}
      </section>
    </div>
  );
}

function ArticleCard({ article, locale }: { article: any; locale: string }) {
  const t = useTranslations('stories');
  const title = getLocaleField(article, 'title', locale);
  const subtitle = getLocaleField(article, 'subtitle', locale);
  const author = getLocaleField(article, 'author', locale);
  const typeLabel = TYPE_LABELS[article.type]?.[locale === 'ja' ? 'jp' : locale === 'en' ? 'en' : 'cn'] || article.type;

  return (
    <Link href={`/stories/${article.slug}`} className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image src={article.coverImage} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-bold rounded-full">{typeLabel}</span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors line-clamp-2">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mb-4 line-clamp-2">{subtitle}</p>}
        <div className="flex items-center gap-4 text-sm text-gray-400">
          {author && <span>{author}</span>}
          {article.readTime && <span>{t('readTime', { minutes: article.readTime })}</span>}
          {article.publishedAt && <span>{new Date(article.publishedAt).toLocaleDateString()}</span>}
        </div>
      </div>
    </Link>
  );
}

function PodcastCard({ podcast, locale }: { podcast: any; locale: string }) {
  const t = useTranslations('stories');
  const title = getLocaleField(podcast, 'title', locale);

  return (
    <Link href={`/stories/podcast/${podcast.slug}`} className="group flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
        <Image src={podcast.coverImage} alt={title} fill className="object-cover" sizes="96px" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">▶</div>
        </div>
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">{t('episode', { number: podcast.episodeNumber })}: {title}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-400 mt-2">
          <span>🎧 {formatDuration(podcast.duration, locale)}</span>
          {podcast.publishedAt && <span>{new Date(podcast.publishedAt).toLocaleDateString()}</span>}
        </div>
      </div>
    </Link>
  );
}
