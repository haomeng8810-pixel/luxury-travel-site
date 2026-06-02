export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

// ============================================
// Mock 数据 - 多语言
// ============================================

const DESTINATIONS: Record<string, { slug: string; nameCn: string; nameJp: string; name: string; coverImage: string; continent: string; descriptionCn: string; descriptionJp: string; description: string; highlightsCn: string[]; highlightsJp: string[]; highlights: string[]; bestTimeCn: string; bestTimeJp: string; bestTime: string; visaInfoCn: string; visaInfoJp: string; visaInfo: string; tripCount: number; trips: Array<{ slug: string; titleCn: string; titleJp: string; title: string; coverImage: string; duration: number; nights: number; taglineCn: string; taglineJp: string; tagline: string; emotion: { nameCn: string; nameJp: string; name: string; icon: string } | null }> }> = {
  tokyo: {
    slug: 'tokyo', nameCn: '东京', nameJp: '東京', name: 'Tokyo', coverImage: 'https://picsum.photos/id/1040/1920/1080', continent: 'Asia',
    descriptionCn: '东京是一座融合传统与现代的城市。从浅草寺的古韵到涩谷的潮流，从筑地市场的新鲜寿司到米其林三星的精致料理，每一面都值得探索。',
    descriptionJp: '東京は伝統と現代が融合した都市です。浅草寺の古風な趣から渋谷のトレンド、築地市場の新鮮な寿司からミシュラン三つ星の洗練された料理まで、すべての面が探索する価値があります。',
    description: 'Tokyo is a city where tradition meets modernity. From the ancient charm of Senso-ji Temple to the trends of Shibuya, from fresh sushi at Tsukiji to Michelin-starred cuisine.',
    highlightsCn: ['浅草寺与雷门', '东京塔与晴空塔', '涩谷十字路口', '新宿御苑', '银座购物', '筑地场外市场'],
    highlightsJp: ['浅草寺と雷門', '東京タワーとスカイツリー', '渋谷スクランブル交差点', '新宿御苑', '銀座ショッピング', '築地場外市場'],
    highlights: ['Senso-ji Temple & Kaminarimon', 'Tokyo Tower & Skytree', 'Shibuya Crossing', 'Shinjuku Gyoen', 'Ginza Shopping', 'Tsukiji Outer Market'],
    bestTimeCn: '3-5 月（樱花季）、10-11 月（红叶季）',
    bestTimeJp: '3-5月（桜シーズン）、10-11月（紅葉シーズン）',
    bestTime: 'Mar-May (Cherry Blossom), Oct-Nov (Fall Foliage)',
    visaInfoCn: '中国公民需提前办理日本旅游签证',
    visaInfoJp: '中国公民は事前に日本の観光ビザを取得する必要があります',
    visaInfo: 'Chinese citizens need to apply for a Japanese tourist visa in advance',
    tripCount: 12,
    trips: [
      { slug: 'tokyo-kyoto-classic', titleCn: '东京京都经典之旅', titleJp: '東京京都クラシック旅', title: 'Tokyo-Kyoto Classic Journey', coverImage: 'https://picsum.photos/id/1039/800/600', duration: 7, nights: 6, taglineCn: '传统与现代的完美交融', taglineJp: '伝統と現代の完璧な融合', tagline: 'Perfect blend of tradition and modernity', emotion: { nameCn: '宁静惬意', nameJp: '心やすらぐ', name: 'Contentment', icon: '🌸' } },
    ]
  },
  kyoto: {
    slug: 'kyoto', nameCn: '京都', nameJp: '京都', name: 'Kyoto', coverImage: 'https://picsum.photos/id/1031/1920/1080', continent: 'Asia',
    descriptionCn: '京都是日本的灵魂所在。千年古寺、枯山水庭院、艺伎文化，在这里感受最纯粹的日本之美。',
    descriptionJp: '京都は日本の魂の場所です。千年の古寺、枯山水の庭園、芸妓文化、ここで最も純粋な日本の美しさを感じてください。',
    description: 'Kyoto is the soul of Japan. Ancient temples, zen gardens, geisha culture - experience the purest Japanese beauty here.',
    highlightsCn: ['金阁寺', '伏见稻荷大社', '岚山竹林', '清水寺', '祇园花见小路', '二条城'],
    highlightsJp: ['金閣寺', '伏見稲荷大社', '嵐山竹林', '清水寺', '祇園花見小路', '二条城'],
    highlights: ['Kinkaku-ji Temple', 'Fushimi Inari Shrine', 'Arashiyama Bamboo Grove', 'Kiyomizu-dera Temple', 'Gion Hanami-koji', 'Nijo Castle'],
    bestTimeCn: '3-4 月（樱花）、11 月（红叶）',
    bestTimeJp: '3-4月（桜）、11月（紅葉）',
    bestTime: 'Mar-Apr (Cherry Blossom), Nov (Fall Foliage)',
    visaInfoCn: '中国公民需提前办理日本旅游签证',
    visaInfoJp: '中国公民は事前に日本の観光ビザを取得する必要があります',
    visaInfo: 'Chinese citizens need to apply for a Japanese tourist visa in advance',
    tripCount: 8,
    trips: [
      { slug: 'tokyo-kyoto-classic', titleCn: '东京京都经典之旅', titleJp: '東京京都クラシック旅', title: 'Tokyo-Kyoto Classic Journey', coverImage: 'https://picsum.photos/id/1039/800/600', duration: 7, nights: 6, taglineCn: '传统与现代的完美交融', taglineJp: '伝統と現代の完璧な融合', tagline: 'Perfect blend of tradition and modernity', emotion: { nameCn: '宁静惬意', nameJp: '心やすらぐ', name: 'Contentment', icon: '🌸' } },
    ]
  },
  osaka: {
    slug: 'osaka', nameCn: '大阪', nameJp: '大阪', name: 'Osaka', coverImage: 'https://picsum.photos/id/29/1920/1080', continent: 'Asia',
    descriptionCn: '大阪是日本的厨房。道顿堀的美食、黑门市场的海鲜、环球影城的欢乐，让你的味蕾和心灵都得到满足。',
    descriptionJp: '大阪は日本の台所です。道頓堀のグルメ、黒門市場の海鮮、ユニバーサルスタジオの楽しさで、味覚も心も満たされます。',
    description: 'Osaka is Japan\'s kitchen. From Dotonbori food to Kuromon Market seafood and Universal Studios thrills.',
    highlightsCn: ['道顿堀', '大阪城', '环球影城', '黑门市场', '心斋桥', '通天阁'],
    highlightsJp: ['道頓堀', '大阪城', 'ユニバーサルスタジオ', '黒門市場', '心斎橋', '通天閣'],
    highlights: ['Dotonbori', 'Osaka Castle', 'Universal Studios Japan', 'Kuromon Market', 'Shinsaibashi', 'Tsutenkaku Tower'],
    bestTimeCn: '全年适宜',
    bestTimeJp: '一年中快適',
    bestTime: 'Year-round',
    visaInfoCn: '中国公民需提前办理日本旅游签证',
    visaInfoJp: '中国公民は事前に日本の観光ビザを取得する必要があります',
    visaInfo: 'Chinese citizens need to apply for a Japanese tourist visa in advance',
    tripCount: 6,
    trips: [
      { slug: 'osaka-gourmet', titleCn: '大阪美食冒险', titleJp: '大阪グルメアドベンチャー', title: 'Osaka Gourmet Adventure', coverImage: 'https://picsum.photos/id/28/800/600', duration: 4, nights: 3, taglineCn: '从米其林到街头小吃', taglineJp: 'ミシュランからストリートフードまで', tagline: 'From Michelin to street food', emotion: { nameCn: '逃离喧嚣', nameJp: '悩みを忘れよう', name: 'Distraction', icon: '🏝️' } },
    ]
  },
  hokkaido: {
    slug: 'hokkaido', nameCn: '北海道', nameJp: '北海道', name: 'Hokkaido', coverImage: 'https://picsum.photos/id/15/1920/1080', continent: 'Asia',
    descriptionCn: '北海道是日本的自然天堂。冬天的粉雪、夏天的花海、四季不断的温泉和海鲜，让你远离都市喧嚣。',
    descriptionJp: '北海道は日本の自然の楽園です。冬の粉雪、夏の花畑、四季折々の温泉と海鮮で、都会の喧騒から離れられます。',
    description: 'Hokkaido is Japan\'s natural paradise. Powder snow in winter, flower fields in summer, and hot springs year-round.',
    highlightsCn: ['二世谷滑雪', '富良野薰衣草', '小樽运河', '登别温泉', '札幌雪祭', '函馆夜景'],
    highlightsJp: ['ニセコスキー', '富良野ラベンダー', '小樽運河', '登別温泉', 'さっぽろ雪まつり', '函館夜景'],
    highlights: ['Niseko Skiing', 'Furano Lavender', 'Otaru Canal', 'Noboribetsu Onsen', 'Sapporo Snow Festival', 'Hakodate Night View'],
    bestTimeCn: '12-2 月（滑雪）、7-8 月（花海）',
    bestTimeJp: '12-2月（スキー）、7-8月（花畑）',
    bestTime: 'Dec-Feb (Skiing), Jul-Aug (Flower Fields)',
    visaInfoCn: '中国公民需提前办理日本旅游签证',
    visaInfoJp: '中国公民は事前に日本の観光ビザを取得する必要があります',
    visaInfo: 'Chinese citizens need to apply for a Japanese tourist visa in advance',
    tripCount: 10,
    trips: [
      { slug: 'hokkaido-winter', titleCn: '北海道冬日仙境', titleJp: '北海道冬の仙境', title: 'Hokkaido Winter Wonderland', coverImage: 'https://picsum.photos/id/15/800/600', duration: 6, nights: 5, taglineCn: '粉雪天堂与温泉乡', taglineJp: 'パウダースノーと温泉郷', tagline: 'Powder snow paradise and hot springs', emotion: { nameCn: '焕然一新', nameJp: 'リフレッシュ', name: 'Revitalized', icon: '🔥' } },
    ]
  },
  okinawa: {
    slug: 'okinawa', nameCn: '冲绳', nameJp: '沖縄', name: 'Okinawa', coverImage: 'https://picsum.photos/id/1018/1920/1080', continent: 'Asia',
    descriptionCn: '冲绳是日本的热带天堂。碧蓝的海水、丰富的珊瑚礁、独特的琉球文化，让你感受海岛度假的惬意。',
    descriptionJp: '沖縄は日本の熱帯楽園です。青い海、豊かなサンゴ礁、独特の琉球文化で、アイランドリゾートの快適さを感じてください。',
    description: 'Okinawa is Japan\'s tropical paradise. Crystal clear waters, coral reefs, and unique Ryukyu culture.',
    highlightsCn: ['美丽海水族馆', '川平湾浮潜', '竹富岛', '首里城', '国际通', '万座毛'],
    highlightsJp: ['美ら海水族館', '川平湾シュノーケリング', '竹富島', '首里城', '国際通り', '万座毛'],
    highlights: ['Churaumi Aquarium', 'Kabira Bay Snorkeling', 'Taketomi Island', 'Shuri Castle', 'Kokusai Street', 'Manzamo Cliff'],
    bestTimeCn: '4-10 月',
    bestTimeJp: '4-10月',
    bestTime: 'Apr-Oct',
    visaInfoCn: '中国公民需提前办理日本旅游签证',
    visaInfoJp: '中国公民は事前に日本の観光ビザを取得する必要があります',
    visaInfo: 'Chinese citizens need to apply for a Japanese tourist visa in advance',
    tripCount: 7,
    trips: [
      { slug: 'okinawa-beach', titleCn: '冲绳海岛度假', titleJp: '沖縄島めぐり', title: 'Okinawa Island Escape', coverImage: 'https://picsum.photos/id/1018/800/600', duration: 5, nights: 4, taglineCn: '碧蓝海域与白色沙滩', taglineJp: 'コバルトブルーの海と白い砂浜', tagline: 'Cobalt blue waters and white sandy beaches', emotion: { nameCn: '自由无束', nameJp: '自由気まま', name: 'Freedom', icon: '🕊️' } },
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

function getLocaleArray(obj: any, field: string, locale: string): string[] {
  const suffix = locale === 'en' ? '' : locale === 'ja' ? 'Jp' : 'Cn';
  const key = field + suffix;
  if (key in obj && Array.isArray(obj[key])) return obj[key];
  const cnKey = field + 'Cn';
  if (cnKey in obj && Array.isArray(obj[cnKey])) return obj[cnKey];
  return obj[field] || [];
}

// ============================================
// 目的地详情页
// ============================================

export default async function DestinationDetailPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const t = await getTranslations('destinationDetail');
  const { locale, slug } = await params;
  const destination = DESTINATIONS[slug];
  if (!destination) notFound();

  const displayName = getLocaleField(destination, 'name', locale);
  const description = getLocaleField(destination, 'description', locale);
  const highlights = getLocaleArray(destination, 'highlights', locale);
  const bestTime = getLocaleField(destination, 'bestTime', locale);
  const visaInfo = getLocaleField(destination, 'visaInfo', locale);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden">
        <Image src={destination.coverImage} alt={displayName} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
          <div className="max-w-7xl mx-auto">
            <Link href="/destinations" className="inline-block px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm mb-4 hover:bg-white/30 transition-colors">{t('back')}</Link>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4">{displayName}</h1>
            <p className="text-xl opacity-90">{destination.name} · {t('tripsCount', { count: destination.tripCount })}</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* 左侧内容 */}
          <div className="lg:col-span-2 space-y-12">
            {/* 目的地介绍 */}
            <section>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">{t('overview')}</h2>
              <p className="text-lg text-gray-700 leading-relaxed">{description}</p>
            </section>

            {/* 必体验 */}
            <section>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">{t('highlights')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {highlights.map((h: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <span className="text-yellow-600 font-bold">{i + 1}</span>
                    <span className="text-gray-700">{h}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 旅行贴士 */}
            <section>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">{t('travelTips')}</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">{t('bestTime')}</p>
                  <p className="font-medium text-gray-900">{bestTime}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">{t('visaInfo')}</p>
                  <p className="font-medium text-gray-900">{visaInfo}</p>
                </div>
              </div>
            </section>

            {/* 相关行程 */}
            <section>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">{t('relatedTrips')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {destination.trips.map((trip) => {
                  const tripTitle = getLocaleField(trip, 'title', locale);
                  const tripTagline = getLocaleField(trip, 'tagline', locale);
                  const emotionName = trip.emotion ? getLocaleField(trip.emotion, 'name', locale) : '';
                  return (
                    <Link key={trip.slug} href={`/trips/${trip.slug}`} className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image src={trip.coverImage} alt={tripTitle} fill className="object-cover group-hover:scale-105 transition-transform" sizes="(max-width: 768px) 100vw, 50vw" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">{tripTitle}</h3>
                        <p className="text-sm text-gray-500">{trip.duration} {t('day')} {trip.nights} {t('night')}</p>
                        {trip.emotion && <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">{trip.emotion.icon} {emotionName}</span>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          </div>

          {/* 右侧边栏 */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('quickInfo')}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">{t('destination')}</span><span className="font-medium">{displayName}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">{t('tripCount')}</span><span className="font-medium">{destination.tripCount} {t('tripsUnit')}</span></div>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('inquiry')}</h3>
                <p className="text-gray-600 mb-4 text-sm">{t('inquirySubtitle')}</p>
                <Link href="/contact" className="block w-full py-3 bg-gray-900 text-white text-center rounded-lg hover:bg-gray-800 transition-colors">{t('contactUs')}</Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
