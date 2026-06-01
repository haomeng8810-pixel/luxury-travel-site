import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

// ============================================
// Mock 数据 - 多语言
// ============================================

const EMOTIONS = [
  { id: '1', slug: 'contentment', name: 'contentment', nameCn: '宁静惬意', nameJp: '心安らぐ', descriptionCn: '在千年古寺中聆听钟声，于温泉乡感受岁月静好', descriptionJp: '千年の寺で鐘の音を聞き、温泉郷で静かな時を感じる', description: 'Listen to temple bells in ancient temples, feel the tranquility in hot spring towns', color: '#9b8ec4', icon: '🌸', coverImage: 'https://picsum.photos/id/1031/800/500', tripCount: 12 },
  { id: '2', slug: 'revitalized', name: 'revitalized', nameCn: '焕然一新', nameJp: '新しい自分', descriptionCn: '在粉雪天堂挑战自我，于清晨冥想中重新出发', descriptionJp: '粉雪の天国で自分に挑戦し、朝の瞑想で新たに歩き出す', description: 'Challenge yourself in powder snow paradise, start anew in morning meditation', color: '#e67e22', icon: '🔥', coverImage: 'https://picsum.photos/id/15/800/500', tripCount: 8 },
  { id: '3', slug: 'freedom', name: 'freedom', nameCn: '自由无束', nameJp: '自由', descriptionCn: '在冲绳碧海中浮潜，于樱花树下感受风的自由', descriptionJp: '沖縄の海でシュノーケリングし、桜の木の下で風の自由を感じる', description: 'Snorkel in Okinawa crystal waters, feel the freedom under cherry blossom trees', color: '#3498db', icon: '🕊️', coverImage: 'https://picsum.photos/id/1018/800/500', tripCount: 15 },
  { id: '4', slug: 'distraction', name: 'distraction', nameCn: '逃离喧嚣', nameJp: '日常からの逃避', descriptionCn: '远离都市的喧嚣，在竹林深处找回内心的平静', descriptionJp: '都会の喧騒を離れ、竹林の奥深くで心の平穏を取り戻す', description: 'Escape urban noise, find inner peace deep in bamboo forests', color: '#e74c3c', icon: '🏝️', coverImage: 'https://picsum.photos/id/28/800/500', tripCount: 10 },
  { id: '5', slug: 'challenged', name: 'challenged', nameCn: '挑战自我', nameJp: '挑戦', descriptionCn: '攀登富士山，穿越熊野古道，在挑战中发现更好的自己', descriptionJp: '富士山に登り、熊野古道を歩き、挑戦の中でより良い自分を見つける', description: 'Climb Mount Fuji, walk the Kumano Kodo, discover yourself through challenges', color: '#2c3e50', icon: '🏔️', coverImage: 'https://picsum.photos/id/29/800/500', tripCount: 6 },
];

function getLocaleField(obj: any, field: string, locale: string): string {
  const suffix = locale === 'en' ? '' : locale === 'ja' ? 'Jp' : 'Cn';
  const key = field + suffix;
  if (key in obj && obj[key]) return obj[key];
  const cnKey = field + 'Cn';
  if (cnKey in obj && obj[cnKey]) return obj[cnKey];
  return obj[field] || '';
}

// ============================================
// 情感选择器首页
// ============================================

export default async function FeelingsIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const t = await getTranslations('feelings');
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-64 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
          <div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">
              {t('title')}
            </h1>
            <p className="text-xl opacity-90">
              {t('subtitle') || "It's not where you want to go; it's how you want to feel"}
            </p>
          </div>
        </div>
      </section>

      {/* 情感网格 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {EMOTIONS.map((emotion) => (
            <EmotionCard key={emotion.id} emotion={emotion} locale={locale} t={t} />
          ))}
        </div>
      </section>
    </div>
  );
}

function EmotionCard({ emotion, locale, t }: { emotion: typeof EMOTIONS[0]; locale: string; t: any }) {
  const displayName = getLocaleField(emotion, 'name', locale);
  const displayDesc = getLocaleField(emotion, 'description', locale);
  const tripLabel = locale === 'ja' ? '旅程' : locale === 'en' ? 'trips' : '个行程';

  return (
    <Link
      href={`/feelings/${emotion.slug}`}
      className="group relative aspect-[4/5] rounded-lg overflow-hidden block"
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${emotion.coverImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
        <div className="text-5xl mb-3">{emotion.icon}</div>
        <h3 className="text-3xl font-serif font-bold mb-1">{displayName}</h3>
        <p className="text-sm opacity-90 line-clamp-2 mb-2">{displayDesc}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm opacity-70">{emotion.tripCount} {tripLabel}</span>
          <span className="text-sm font-medium group-hover:translate-x-2 transition-transform">
            {t('discover') || (locale === 'ja' ? '探索 →' : locale === 'en' ? 'Explore →' : '探索 →')}
          </span>
        </div>
      </div>
    </Link>
  );
}
