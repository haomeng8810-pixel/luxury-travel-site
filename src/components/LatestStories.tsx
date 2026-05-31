import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

export async function LatestStories({
  articles,
  podcasts,
}: {
  articles: Array<{ id: string; slug: string; type: string; title: string; coverImage: string; readTime: number | null; publishedAt: Date | null }>;
  podcasts: Array<{ id: string; slug: string; title: string; coverImage: string; duration: number; episodeNumber: number }>;
}) {
  const t = await getTranslations('home.stories');

  const allItems = [
    ...articles.slice(0, 2).map((a) => ({ ...a, contentType: 'article' as const, duration: null, episodeNumber: null })),
    ...podcasts.slice(0, 1).map((p) => ({ ...p, contentType: 'podcast' as const, readTime: null })),
  ].slice(0, 3);

  if (allItems.length === 0) return null;

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">{t('sectionTitle')}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('sectionSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {allItems.map((item) => (<StoryCard key={item.id} item={item} />))}
        </div>

        <div className="text-center">
          <Link href="/stories" className="inline-flex items-center px-8 py-4 border-2 border-gray-900 text-gray-900 text-lg font-medium rounded hover:bg-gray-900 hover:text-white transition-all duration-200 group">
            {t('viewAll')}
            <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function StoryCard({ item }: { item: { id: string; slug: string; contentType: 'article' | 'podcast'; title: string; coverImage: string; type?: string; readTime: number | null; duration: number | null; episodeNumber: number | null } }) {
  const isPodcast = item.contentType === 'podcast';

  return (
    <Link href={isPodcast ? `/stories/podcast/${item.slug}` : `/stories/${item.slug}`} className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image src={item.coverImage} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        <div className="absolute top-4 left-4">
          {isPodcast ? (
            <span className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">🎙️ Podcast</span>
          ) : (
            <span className="px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded-full">{getTypeLabel(item.type || 'story')}</span>
          )}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors line-clamp-2">{item.title}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {item.readTime && <span>📖 {item.readTime} min read</span>}
          {item.duration && <span>🎧 {formatDuration(item.duration)}</span>}
          {item.episodeNumber && <span>Ep. {item.episodeNumber}</span>}
        </div>
      </div>
    </Link>
  );
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = { story: 'Story', guide: 'Guide', feature: 'Feature', news: 'News' };
  return labels[type] || 'Story';
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return `${minutes} min`;
}
