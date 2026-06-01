import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

// ============================================
// Mock 数据 - 多语言
// ============================================

const EMOTIONS: Record<string, { slug: string; name: string; nameCn: string; nameJp: string; descriptionCn: string; descriptionJp: string; description: string; color: string; icon: string; coverImage: string; trips: Array<{ slug: string; titleCn: string; titleJp: string; title: string; coverImage: string; duration: number; nights: number; taglineCn: string; taglineJp: string; tagline: string; destination: { nameCn: string; nameJp: string; name: string } }> }> = {
  contentment: {
    slug: 'contentment', name: 'contentment', nameCn: '宁静惬意', nameJp: '心安らぐ',
    descriptionCn: '在千年古寺中聆听钟声，于温泉乡感受岁月静好。宁静惬意的旅行，让你远离喧嚣，找回内心的平静。',
    descriptionJp: '千年の寺で鐘の音を聞き、温泉郷で静かな時を感じる。心安らぐ旅は、喧騒を離れ、心の平穏を取り戻させます。',
    description: 'Listen to temple bells in ancient temples, feel tranquility in hot spring towns. A peaceful journey away from the noise.',
    color: '#9b8ec4', icon: '🌸', coverImage: 'https://picsum.photos/id/1031/1920/1080',
    trips: [
      { slug: 'tokyo-kyoto-classic', titleCn: '东京京都经典之旅', titleJp: '東京京都クラシック旅', title: 'Tokyo-Kyoto Classic Journey', coverImage: 'https://picsum.photos/id/1039/800/600', duration: 7, nights: 6, taglineCn: '传统与现代的完美交融', taglineJp: '伝統と現代の完璧な融合', tagline: 'Perfect blend of tradition and modernity', destination: { nameCn: '东京·京都', nameJp: '東京・京都', name: 'Tokyo & Kyoto' } },
      { slug: 'okinawa-beach', titleCn: '冲绳海岛度假', titleJp: '沖縄島めぐり', title: 'Okinawa Island Escape', coverImage: 'https://picsum.photos/id/1018/800/600', duration: 5, nights: 4, taglineCn: '碧蓝海域与白色沙滩', taglineJp: 'コバルトブルーの海と白い砂浜', tagline: 'Cobalt blue waters and white sandy beaches', destination: { nameCn: '冲绳', nameJp: '沖縄', name: 'Okinawa' } },
    ]
  },
  revitalized: {
    slug: 'revitalized', name: 'revitalized', nameCn: '焕然一新', nameJp: '新しい自分',
    descriptionCn: '在粉雪天堂挑战自我，于清晨冥想中重新出发。焕然一新的旅行，让你找回久违的活力。',
    descriptionJp: '粉雪の天国で自分に挑戦し、朝の瞑想で新たに歩き出す。新しい自分の旅は、忘れられた活力を取り戻させます。',
    description: 'Challenge yourself in powder snow paradise, start anew in morning meditation. A revitalizing journey.',
    color: '#e67e22', icon: '🔥', coverImage: 'https://picsum.photos/id/15/1920/1080',
    trips: [
      { slug: 'hokkaido-winter', titleCn: '北海道冬日仙境', titleJp: '北海道冬の仙境', title: 'Hokkaido Winter Wonderland', coverImage: 'https://picsum.photos/id/15/800/600', duration: 6, nights: 5, taglineCn: '粉雪天堂与温泉乡', taglineJp: 'パウダースノーと温泉郷', tagline: 'Powder snow paradise and hot springs', destination: { nameCn: '北海道', nameJp: '北海道', name: 'Hokkaido' } },
    ]
  },
  freedom: {
    slug: 'freedom', name: 'freedom', nameCn: '自由无束', nameJp: '自由',
    descriptionCn: '在冲绳碧海中浮潜，于樱花树下感受风的自由。自由无束的旅行，让你忘记所有束缚。',
    descriptionJp: '沖縄の海でシュノーケリングし、桜の木の下で風の自由を感じる。自由な旅は、すべての縛りを忘れさせます。',
    description: 'Snorkel in Okinawa crystal waters, feel the wind freedom under cherry blossoms. A liberating journey.',
    color: '#3498db', icon: '🕊️', coverImage: 'https://picsum.photos/id/1018/1920/1080',
    trips: [
      { slug: 'okinawa-beach', titleCn: '冲绳海岛度假', titleJp: '沖縄島めぐり', title: 'Okinawa Island Escape', coverImage: 'https://picsum.photos/id/1018/800/600', duration: 5, nights: 4, taglineCn: '碧蓝海域与白色沙滩', taglineJp: 'コバルトブルーの海と白い砂浜', tagline: 'Cobalt blue waters and white sandy beaches', destination: { nameCn: '冲绳', nameJp: '沖縄', name: 'Okinawa' } },
    ]
  },
  distraction: {
    slug: 'distraction', name: 'distraction', nameCn: '逃离喧嚣', nameJp: '日常からの逃避',
    descriptionCn: '远离都市的喧嚣，在竹林深处找回内心的平静。逃离喧嚣的旅行，让你暂时忘却一切烦恼。',
    descriptionJp: '都会の喧騒を離れ、竹林の奥深くで心の平穏を取り戻す。日常からの逃避の旅は、すべての悩みを一時的に忘れさせます。',
    description: 'Escape urban noise, find inner peace in bamboo forests. A journey to forget all worries temporarily.',
    color: '#e74c3c', icon: '🏝️', coverImage: 'https://picsum.photos/id/28/1920/1080',
    trips: [
      { slug: 'osaka-gourmet', titleCn: '大阪美食冒险', titleJp: '大阪グルメアドベンチャー', title: 'Osaka Gourmet Adventure', coverImage: 'https://picsum.photos/id/28/800/600', duration: 4, nights: 3, taglineCn: '从米其林到街头小吃', taglineJp: 'ミシュランからストリートフードまで', tagline: 'From Michelin to street food', destination: { nameCn: '大阪', nameJp: '大阪', name: 'Osaka' } },
    ]
  },
  challenged: {
    slug: 'challenged', name: 'challenged', nameCn: '挑战自我', nameJp: '挑戦',
    descriptionCn: '攀登富士山，穿越熊野古道，在挑战中发现更好的自己。挑战自我的旅行，让你突破极限。',
    descriptionJp: '富士山に登り、熊野古道を歩き、挑戦の中でより良い自分を見つける。挑戦の旅は、限界を超えさせます。',
    description: 'Climb Mount Fuji, walk the Kumano Kodo, discover a better self through challenges.',
    color: '#2c3e50', icon: '🏔️', coverImage: 'https://picsum.photos/id/29/1920/1080',
    trips: [
      { slug: 'hokkaido-winter', titleCn: '北海道冬日仙境', titleJp: '北海道冬の仙境', title: 'Hokkaido Winter Wonderland', coverImage: 'https://picsum.photos/id/15/800/600', duration: 6, nights: 5, taglineCn: '粉雪天堂与温泉乡', taglineJp: 'パウダースノーと温泉郷', tagline: 'Powder snow paradise and hot springs', destination: { nameCn: '北海道', nameJp: '北海道', name: 'Hokkaido' } },
    ]
  },
};

function getLocaleField(obj: any, field: string, locale: string): string {
  const suffix = locale === 'en' ? '' : locale === 'ja' ? 'Jp' : 'Cn';
  const key = field + suffix;
  if (key in obj && obj[key]) return obj[key];
  const cnKey = field + 'Cn';
  if (cnKey in obj && obj[cnKey]) return obj[cnKey];
  return obj[field] || '';
}

// ============================================
// 情感详情页
// ============================================

export default async function FeelingsDetailPage({ params }: { params: Promise<{ emotionSlug: string; locale: string }> }) {
  const t = await getTranslations('feelings');
  const { locale, emotionSlug } = await params;
  const emotion = EMOTIONS[emotionSlug];
  if (!emotion) notFound();

  const displayName = getLocaleField(emotion, 'name', locale);
  const displayDesc = getLocaleField(emotion, 'description', locale);
  const dayLabel = locale === 'ja' ? '日' : locale === 'en' ? 'days' : '天';
  const nightLabel = locale === 'ja' ? '泊' : locale === 'en' ? 'nights' : '晚';

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${emotion.coverImage})` }} />
        <div className="absolute inset-0" style={{ backgroundColor: `${emotion.color}80` }} />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
          <div>
            <div className="text-7xl mb-4">{emotion.icon}</div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4">{displayName}</h1>
            <p className="text-lg opacity-80 max-w-2xl mx-auto">{displayDesc}</p>
          </div>
        </div>
      </section>

      {/* 行程列表 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">
          {t('emotionTrips', { name: displayName, count: emotion.trips.length }) || `${displayName} · ${emotion.trips.length} ${locale === 'ja' ? '旅程' : locale === 'en' ? 'trips' : '个行程'}`}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {emotion.trips.map((trip) => (
            <TripCard key={trip.slug} trip={trip} emotion={emotion} locale={locale} dayLabel={dayLabel} nightLabel={nightLabel} />
          ))}
        </div>
      </section>

      {/* 返回 */}
      <section className="text-center py-8">
        <Link href="/feelings" className="text-gray-500 hover:text-gray-900 transition-colors">{t('back')}</Link>
      </section>
    </div>
  );
}

function TripCard({ trip, emotion, locale, dayLabel, nightLabel }: { trip: { slug: string; titleCn: string; titleJp: string; title: string; coverImage: string; duration: number; nights: number; taglineCn: string; taglineJp: string; tagline: string; destination: { nameCn: string; nameJp: string; name: string } }; emotion: { color: string; icon: string; nameCn: string; nameJp: string; name: string }; locale: string; dayLabel: string; nightLabel: string }) {
  const tripTitle = getLocaleField(trip, 'title', locale);
  const tripTagline = getLocaleField(trip, 'tagline', locale);
  const destName = getLocaleField(trip.destination, 'name', locale);
  const emotionName = getLocaleField(emotion, 'name', locale);

  return (
    <Link href={`/trips/${trip.slug}`} className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={trip.coverImage} alt={tripTitle} fill className="object-cover group-hover:scale-105 transition-transform" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-sm opacity-90">{destName}</p>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">{tripTitle}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tripTagline}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{trip.duration} {dayLabel} {trip.nights} {nightLabel}</span>
          <span className="text-sm font-medium" style={{ color: emotion.color }}>{emotion.icon} {emotionName}</span>
        </div>
      </div>
    </Link>
  );
}
