import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { InquiryForm } from '@/components/InquiryForm';
import { getTranslations } from 'next-intl/server';

// ============================================
// Mock 数据 - 多语言版本
// ============================================

const EXPERTS = [
  {
    id: '1', slug: 'tanaka',
    nameCn: '田中太郎', nameEn: 'Taro Tanaka', nameJp: '田中太郎',
    titleCn: '日本文化专家', titleEn: 'Japan Culture Expert', titleJp: '日本文化エキスパート',
    avatar: 'https://picsum.photos/id/64/400/400',
    bioCn: '在日本生活 25 年，精通京都文化与历史，带您走进真正的日本。',
    bioEn: 'Lived in Japan for 25 years, expert in Kyoto culture and history, taking you to the real Japan.',
    bioJp: '日本に25年間在住、京都文化と歴史に精通し、本当の日本へご案内します。',
    specialtiesCn: ['京都文化', '茶道', '寺庙巡礼'], specialtiesEn: ['Kyoto Culture', 'Tea Ceremony', 'Temple Tours'], specialtiesJp: ['京都文化', '茶道', '寺院巡り'],
    languagesCn: ['中文', '日文', '英文'], languagesEn: ['Chinese', 'Japanese', 'English'], languagesJp: ['中国語', '日本語', '英語'],
    yearsExperience: 15,
    quoteCn: '每一次旅行，都是一次心灵的对话。',
    quoteEn: 'Every trip is a conversation with the soul.',
    quoteJp: '每一次の旅は、魂との対話です。',
  },
  {
    id: '2', slug: 'sato',
    nameCn: '佐藤花子', nameEn: 'Hanako Sato', nameJp: '佐藤花子',
    titleCn: '美食旅行顾问', titleEn: 'Culinary Travel Advisor', titleJp: 'グルメ旅行アドバイザー',
    avatar: 'https://picsum.photos/id/65/400/400',
    bioCn: '前米其林餐厅公关，深谙日本美食文化，为您预订最难预约的餐厅。',
    bioEn: 'Former Michelin restaurant PR, deeply versed in Japanese food culture, booking the hardest-to-reserve restaurants for you.',
    bioJp: '元ミシュランレストランPR、日本食文化に精通し、予約困難なレストランをご手配します。',
    specialtiesCn: ['米其林餐厅', '怀石料理', '居酒屋文化'], specialtiesEn: ['Michelin Restaurants', 'Kaiseki', 'Izakaya Culture'], specialtiesJp: ['ミシュランレストラン', '懐石料理', '居酒屋文化'],
    languagesCn: ['中文', '日文'], languagesEn: ['Chinese', 'Japanese'], languagesJp: ['中国語', '日本語'],
    yearsExperience: 12,
    quoteCn: '美食是了解一个地方最快的方式。',
    quoteEn: 'Food is the fastest way to understand a place.',
    quoteJp: '美食は、その土地を理解する最も早い方法です。',
  },
  {
    id: '3', slug: 'yamamoto',
    nameCn: '山本健一', nameEn: 'Kenichi Yamamoto', nameJp: '山本健一',
    titleCn: '户外活动专家', titleEn: 'Outdoor Adventure Expert', titleJp: 'アウトドアアドベンチャーエキスパート',
    avatar: 'https://picsum.photos/id/91/400/400',
    bioCn: '前滑雪教练，熟悉北海道和长野的所有雪场，也是资深徒步爱好者。',
    bioEn: 'Former ski instructor, familiar with all ski resorts in Hokkaido and Nagano, also an avid hiker.',
    bioJp: '元スキーインストラクター、北海道と長野のすべてのスキー場に精通し、ハイキング愛好家でもあります。',
    specialtiesCn: ['滑雪', '徒步', '温泉'], specialtiesEn: ['Skiing', 'Hiking', 'Hot Springs'], specialtiesJp: ['スキー', 'ハイキング', '温泉'],
    languagesCn: ['中文', '日文', '英文'], languagesEn: ['Chinese', 'Japanese', 'English'], languagesJp: ['中国語', '日本語', '英語'],
    yearsExperience: 18,
    quoteCn: '在大自然中感受日本的美。',
    quoteEn: 'Experience Japan\'s beauty in nature.',
    quoteJp: '大自然の中で日本の美しさを感じる。',
  },
];

const STATS = { destinations: 50, trips: 30, reviews: 200, years: 20 };

// ============================================
// 辅助函数
// ============================================

function getLocaleField(obj: any, field: string, locale: string): string {
  const suffix = locale === 'en' ? 'En' : locale === 'ja' ? 'Jp' : 'Cn';
  return obj[field + suffix] || obj[field + 'Cn'] || '';
}

// ============================================
// 关于我们页面 - APPLE TRAVEL 苹果旅行
// ============================================

export default async function AboutPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations('about');
  const locale = params.locale;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[70vh] bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: 'url(https://picsum.photos/id/253/1920/1080)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
          <div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-wider">APPLE TRAVEL</h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">贅沢な時間を、あなたに。<br />{t('heroSubtitle')}</p>
          </div>
        </div>
      </section>

      {/* 品牌故事 */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">{t('brandStory')}</h2>
          <div className="text-lg text-gray-700 leading-relaxed space-y-6">
            <p>{t('description')}</p>
            <p>{t('teamDescription')}</p>
            <p>{t('brandPromise')}</p>
          </div>
        </div>
      </section>

      {/* 数据统计 */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatCard number={`${STATS.destinations}+`} label={t('stats.destinations')} />
            <StatCard number={`${STATS.trips}+`} label={t('stats.trips')} />
            <StatCard number={`${STATS.reviews}+`} label={t('stats.reviews')} />
            <StatCard number={`${STATS.years}+`} label={t('stats.experience')} />
          </div>
        </div>
      </section>

      {/* 核心理念 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">{t('philosophy')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <PhilosophyCard icon="🏯" title={t('deepExperience')} description={t('deepExperienceDesc')} />
          <PhilosophyCard icon="🎯" title={t('customized')} description={t('customizedDesc')} />
          <PhilosophyCard icon="✨" title={t('beyondExpect')} description={t('beyondExpectDesc')} />
        </div>
      </section>

      {/* 专家团队 */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">{t('team')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('teamSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {EXPERTS.map((expert) => (
              <ExpertCard key={expert.id} expert={expert} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">{t('ctaTitle')}</h2>
            <p className="text-gray-600">{t('contactSubtitle')}</p>
          </div>
          <InquiryForm />
        </div>
      </section>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (<div><div className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-2">{number}</div><p className="text-gray-500">{label}</p></div>);
}

function PhilosophyCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (<div className="text-center p-8"><div className="text-5xl mb-4">{icon}</div><h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3><p className="text-gray-600 leading-relaxed">{description}</p></div>);
}

function ExpertCard({ expert, locale }: { expert: any; locale: string }) {
  const name = getLocaleField(expert, 'name', locale);
  const title = getLocaleField(expert, 'title', locale);
  const bio = getLocaleField(expert, 'bio', locale);
  const quote = getLocaleField(expert, 'quote', locale);
  const specialties = expert[`specialties${locale === 'en' ? 'En' : locale === 'ja' ? 'Jp' : 'Cn'}`] || expert.specialtiesCn;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
      {expert.avatar && (<div className="relative aspect-square"><Image src={expert.avatar} alt={name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" /></div>)}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
        <p className="text-yellow-600 text-sm font-medium mb-3">{title}</p>
        {bio && (<p className="text-gray-600 text-sm mb-4 line-clamp-3">{bio}</p>)}
        {quote && (<blockquote className="text-sm text-gray-500 italic border-l-2 border-yellow-600 pl-3 mb-4">&ldquo;{quote}&rdquo;</blockquote>)}
        <div className="flex flex-wrap gap-2">{specialties.slice(0, 3).map((s: string, i: number) => (<span key={i} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">{s}</span>))}</div>
      </div>
    </div>
  );
}
