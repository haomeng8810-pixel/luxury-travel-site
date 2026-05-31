// ============================================
// 高端定制旅行网站 - 首页组件
// 对标 Black Tomato | 情感化设计
// ============================================

import { HeroSection } from '@/components/HeroSection';
import { FeelingsSelector } from '@/components/FeelingsSelector';
import FeaturedTrips from '@/components/FeaturedTrips';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { DestinationsGrid } from '@/components/DestinationsGrid';
import { Testimonials } from '@/components/Testimonials';
import { LatestStories } from '@/components/LatestStories';
import { FinalCTA } from '@/components/FinalCTA';

// DEBUG BANNER component - remove after confirming page loads
const DebugBanner = () => (
  <div style={{
    background: '#FF0000',
    color: '#FFFFFF',
    textAlign: 'center',
    padding: '20px',
    fontSize: '32px',
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
    zIndex: 99999,
    position: 'relative',
  }}>
    ✅ APPLE TRAVEL 网站已加载成功！如果你看到这条红色横幅，说明页面正常！
    <br/>
    <span style={{fontSize: '18px'}}>端口 3000 | {new Date().toISOString()} | 服务器正常</span>
  </div>
);

// ============================================
// 数据获取（服务端组件）- MOCK DATA FOR DEMO
// ============================================

async function getFeaturedTrips() {
  // Mock data for demo - multi-language
  return [
    {
      id: '1', slug: 'tokyo-kyoto-classic',
      title: 'Tokyo & Kyoto Classic', titleCn: '东京京都经典之旅', titleJp: '東京京都クラシック旅',
      subtitle: 'Experience the perfect blend of modern and traditional Japan',
      subtitleJp: '現代と伝統の日本が融合する完璧な体験',
      tagline: 'Discover the essence of Japan',
      coverImage: 'https://picsum.photos/id/1039/800/600',
      destination: { name: 'Japan', nameCn: '日本', nameJp: '日本' },
      emotion: { name: 'Contentment', nameCn: '宁静满足', nameJp: '心やすらぐ' },
      duration: 7, nights: 6, priceFrom: 50000, isExclusive: true,
    },
    {
      id: '2', slug: 'hokkaido-winter',
      title: 'Hokkaido Winter Wonderland', titleCn: '北海道冬日仙境', titleJp: '北海道冬の仙境',
      subtitle: 'Powder snow, hot springs, and breathtaking landscapes',
      subtitleJp: 'パウダースノー、温泉、息をのむような景色',
      tagline: 'Embrace the winter magic',
      coverImage: 'https://picsum.photos/id/15/800/600',
      destination: { name: 'Japan', nameCn: '日本', nameJp: '日本' },
      emotion: { name: 'Revitalized', nameCn: '焕然一新', nameJp: 'リフレッシュ' },
      duration: 8, nights: 7, priceFrom: 65000, isExclusive: true,
    },
    {
      id: '3', slug: 'okinawa-beach',
      title: 'Okinawa Island Hopping', titleCn: '冲绳跳岛之旅', titleJp: '沖縄島めぐり',
      subtitle: 'Crystal clear waters, white sand beaches, and vibrant culture',
      subtitleJp: '透明な海、白い砂浜、活気ある文化',
      tagline: 'Tropical paradise awaits',
      coverImage: 'https://picsum.photos/id/1018/800/600',
      destination: { name: 'Japan', nameCn: '日本', nameJp: '日本' },
      emotion: { name: 'Freedom', nameCn: '自由自在', nameJp: '自由気まま' },
      duration: 6, nights: 5, priceFrom: 45000, isExclusive: false,
    },
    {
      id: '4', slug: 'osaka-gourmet',
      title: 'Osaka Culinary Adventure', titleCn: '大阪美食探险', titleJp: '大阪グルメアドベンチャー',
      subtitle: 'From street food to Michelin-starred restaurants',
      subtitleJp: 'ストリートフードからミシュラン星付きレストランまで',
      tagline: 'Savor the flavors of Japan',
      coverImage: 'https://picsum.photos/id/28/800/600',
      destination: { name: 'Japan', nameCn: '日本', nameJp: '日本' },
      emotion: { name: 'Distraction', nameCn: '忘却烦恼', nameJp: '悩みを忘れよう' },
      duration: 5, nights: 4, priceFrom: 35000, isExclusive: false,
    }
  ];
}

async function getDestinations() {
  // Mock data for demo - multi-language
  return [
    { id: '1', slug: 'tokyo', name: 'Tokyo', nameCn: '东京', nameJp: '東京', continent: 'Asia', coverImage: 'https://picsum.photos/id/1040/400/300', _count: { trips: 12 } },
    { id: '2', slug: 'kyoto', name: 'Kyoto', nameCn: '京都', nameJp: '京都', continent: 'Asia', coverImage: 'https://picsum.photos/id/1031/400/300', _count: { trips: 8 } },
    { id: '3', slug: 'osaka', name: 'Osaka', nameCn: '大阪', nameJp: '大阪', continent: 'Asia', coverImage: 'https://picsum.photos/id/29/400/300', _count: { trips: 6 } },
    { id: '4', slug: 'hokkaido', name: 'Hokkaido', nameCn: '北海道', nameJp: '北海道', continent: 'Asia', coverImage: 'https://picsum.photos/id/15/400/300', _count: { trips: 10 } },
    { id: '5', slug: 'okinawa', name: 'Okinawa', nameCn: '冲绳', nameJp: '沖縄', continent: 'Asia', coverImage: 'https://picsum.photos/id/1018/400/300', _count: { trips: 7 } }
  ];
}

async function getEmotions() {
  // Mock data for demo - multi-language
  return [
    { id: '1', name: 'Contentment', nameCn: '宁静满足', nameJp: '心やすらぐ', description: 'Find peace and tranquility in beautiful surroundings', descriptionJp: '美しい景色の中で安らぎを見つける', color: '#9b8ec4', icon: '🌸' },
    { id: '2', name: 'Revitalized', nameCn: '焕然一新', nameJp: 'リフレッシュ', description: 'Recharge and refresh your spirit with invigorating experiences', descriptionJp: '活気ある体験で心身をリフレッシュ', color: '#e67e22', icon: '🔥' },
    { id: '3', name: 'Freedom', nameCn: '自由自在', nameJp: '自由気まま', description: 'Break free from routine and embrace spontaneity', descriptionJp: '日常から抜け出し、自由に楽しむ', color: '#3498db', icon: '🕊️' },
    { id: '4', name: 'Distraction', nameCn: '忘却烦恼', nameJp: '悩みを忘れよう', description: 'Escape from everyday worries and immerse yourself in joy', descriptionJp: '日常の悩みを忘れて、楽しみに没頭する', color: '#e74c3c', icon: '🏝️' },
    { id: '5', name: 'Challenged', nameCn: '挑战自我', nameJp: 'チャレンジ', description: 'Push your boundaries and discover new capabilities', descriptionJp: '限界を超えて、新しい能力を発見する', color: '#2c3e50', icon: '🏔️' }
  ];
}

async function getTestimonials() {
  // Mock data for demo - multi-language
  return [
    { id: '1', customerName: 'Sarah J.', location: 'Beijing', rating: 5, title: 'An unforgettable journey', titleCn: '难忘的旅程', titleJp: '忘れられない旅', content: 'An unforgettable journey that exceeded all expectations!', tripDate: new Date('2026-03-15') },
    { id: '2', customerName: 'Michael T.', location: 'Shanghai', rating: 5, title: 'Impeccable service', titleCn: '极致服务', titleJp: '完璧なサービス', content: 'The attention to detail was impeccable. Truly bespoke service.', tripDate: new Date('2026-04-01') },
    { id: '3', customerName: 'Emma L.', location: 'Guangzhou', rating: 5, title: 'Perfect experience', titleCn: '完美体验', titleJp: '完璧な体験', content: 'I felt completely taken care of from start to finish.', tripDate: new Date('2026-02-20') },
    { id: '4', customerName: 'David K.', location: 'Shenzhen', rating: 5, title: 'Luxury and authenticity', titleCn: '奢华与真实', titleJp: '贅沢さと本物', content: 'The perfect balance of luxury and authenticity.', tripDate: new Date('2026-01-10') },
    { id: '5', customerName: 'Lisa M.', location: 'Chengdu', rating: 5, title: 'Once in a lifetime', titleCn: '一生一次的体验', titleJp: '一生に一度の体験', content: 'A once-in-a-lifetime experience that I will cherish forever.', tripDate: new Date('2026-04-20') }
  ];
}

async function getLatestStories() {
  // Mock data for demo
  return {
    articles: [
      { id: '1', slug: 'kyoto-hidden-temples', type: 'STORY', title: 'Top 10 Hidden Temples in Kyoto', coverImage: 'https://picsum.photos/id/1031/800/600', readTime: 8, publishedAt: new Date('2026-05-15') },
      { id: '2', slug: 'japan-tea-ceremony', type: 'FEATURE', title: 'The Art of Japanese Tea Ceremony', coverImage: 'https://picsum.photos/id/1039/800/600', readTime: 12, publishedAt: new Date('2026-05-10') }
    ],
    podcasts: [
      { id: '3', slug: 'hokkaido-national-parks', type: 'GUIDE', title: "Exploring Hokkaido's National Parks", coverImage: 'https://picsum.photos/id/15/800/600', duration: 1800, episodeNumber: 1 }
    ]
  };
}

// ============================================
// 首页组件
// ============================================

export default async function HomePage() {
  const [trips, destinations, emotions, testimonials, stories] =
    await Promise.all([
      getFeaturedTrips(),
      getDestinations(),
      getEmotions(),
      getTestimonials(),
      getLatestStories(),
    ]);

  return (
    <main className="min-h-screen">
      {/* Hero Section - 全屏首屏 */}
      <HeroSection />

      {/* Feelings Engine - 情感选择器（核心差异化） */}
      <section id="feelings">
        <FeelingsSelector emotions={emotions} />
      </section>

      {/* Featured Trips - 精选行程 */}
      <section id="trips">
        <FeaturedTrips trips={trips} />
      </section>

      {/* Why Choose Us - 品牌优势 */}
      <section id="why-us">
        <WhyChooseUs />
      </section>

      {/* Destinations - 目的地探索 */}
      <section id="destinations">
        <DestinationsGrid destinations={destinations} />
      </section>

      {/* Testimonials - 客户评价 */}
      <section id="testimonials">
        <Testimonials reviews={testimonials} />
      </section>

      {/* Latest Stories - 最新灵感 */}
      <section id="stories">
        <LatestStories articles={stories.articles} podcasts={stories.podcasts} />
      </section>

      {/* Final CTA - 最终转化 */}
      <section id="contact">
        <FinalCTA />
      </section>
    </main>
  );
}