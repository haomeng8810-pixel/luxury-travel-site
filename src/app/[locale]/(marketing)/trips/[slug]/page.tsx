import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { InquiryForm } from '@/components/InquiryForm';
import { getTranslations } from 'next-intl/server';

// ============================================
// Mock 数据 - 多语言版本
// ============================================

const TRIPS = [
  {
    id: '1', slug: 'tokyo-kyoto-classic',
    titleCn: '东京京都经典之旅', titleEn: 'Tokyo & Kyoto Classic', titleJp: '東京・京都クラシック',
    subtitle: 'Experience the perfect blend of modern and traditional Japan',
    taglineCn: '从繁华东京到古都京都，感受日本传统与现代的完美交融',
    taglineEn: 'From bustling Tokyo to ancient Kyoto, experience the perfect fusion of tradition and modernity',
    taglineJp: '活気ある東京から古都京都まで、伝統と現代の完璧な融合を体験',
    coverImage: 'https://picsum.photos/id/1039/800/600',
    duration: 7, nights: 6, isFeatured: true, isExclusive: true,
    destination: { name: 'Japan', nameCn: '东京·京都', nameEn: 'Tokyo · Kyoto', nameJp: '東京・京都', slug: 'tokyo-kyoto', coverImage: 'https://picsum.photos/id/1039/800/600' },
    emotion: { name: 'contentment', nameCn: '宁静惬意', nameEn: 'Contentment', nameJp: '心安らぐ', color: '#9b8ec4', icon: '🌸' },
    categoriesCn: ['文化', '美食', '城市'], categoriesEn: ['Culture', 'Food', 'City'], categoriesJp: ['文化', 'グルメ', '都市'],
    subDestinationsCn: ['东京', '镰仓', '京都', '奈良'], subDestinationsEn: ['Tokyo', 'Kamakura', 'Kyoto', 'Nara'], subDestinationsJp: ['東京', '鎌倉', '京都', '奈良'],
    inclusionsCn: ['全程五星酒店', '每日早餐', '新干线指定席', '中文导游', '景点门票', '机场接送'],
    inclusionsEn: ['5-star hotels throughout', 'Daily breakfast', 'Shinkansen reserved seats', 'Chinese-speaking guide', 'Attraction tickets', 'Airport transfers'],
    inclusionsJp: ['全程五星ホテル', '毎朝朝食', '新幹線指定席', '中文ガイド', '観光チケット', '空港送迎'],
    exclusionsCn: ['国际机票', '个人消费', '午晚餐（部分含）'],
    exclusionsEn: ['International flights', 'Personal expenses', 'Lunch & dinner (partially included)'],
    exclusionsJp: ['国際線航空券', '個人消費', '昼晩餐（一部含む）'],
    priceCurrency: '¥', priceFrom: 28800, isInquireOnly: false,
    descriptionCn: '<p>这是一段穿越日本古今的旅程。从东京的霓虹闪烁到京都的禅意庭院，从镰仓的海风到奈良的小鹿，每一天都是独特的体验。</p><p>我们将带您走进最地道的日本，感受传统与现代的完美交融。</p>',
    descriptionEn: '<p>A journey through Japan\'s past and present. From Tokyo\'s neon lights to Kyoto\'s zen gardens, from Kamakura\'s sea breeze to Nara\'s friendly deer—every day is a unique experience.</p><p>We\'ll take you to the most authentic Japan, where tradition and modernity blend seamlessly.</p>',
    descriptionJp: '<p>日本の過去と現在を巡る旅。東京のネオンライトから京都の禅庭園、鎌倉の潮風から奈良の親しみ鹿まで—每一天がユニークな体験です。</p><p>伝統と現代がシームレスに融合する、最も本格的な日本にご案内します。</p>',
    itinerary: [
      { day: 1, titleCn: '抵达东京', titleEn: 'Arrive in Tokyo', titleJp: '東京到着', descriptionCn: '抵达东京，专车接机入住酒店。晚上漫步银座，感受东京夜生活。', descriptionEn: 'Arrive in Tokyo, private airport transfer to hotel. Evening stroll through Ginza to experience Tokyo nightlife.', descriptionJp: '東京到着、専用車で空港からホテルへ。夜は銀座を散策し東京のナイトライフを体験。', activitiesCn: ['专车接机', '入住五星酒店', '银座漫步'], activitiesEn: ['Private airport transfer', 'Check into 5-star hotel', 'Ginza stroll'], activitiesJp: ['専用車送迎', '五星ホテルチェックイン', '銀座散策'], accommodationCn: '东京半岛酒店', accommodationEn: 'The Peninsula Tokyo', accommodationJp: 'ザ・ペニンシュラ東京' },
      { day: 2, titleCn: '东京城市探索', titleEn: 'Tokyo City Exploration', titleJp: '東京シティ探索', descriptionCn: '参观浅草寺、东京塔、涩谷十字路口，感受东京的多元文化。', descriptionEn: 'Visit Senso-ji Temple, Tokyo Tower, and Shibuya Crossing to experience Tokyo\'s diverse culture.', descriptionJp: '浅草寺、東京タワー、渋谷スクランブル交差点を訪問し、東京の多様な文化を体験。', activitiesCn: ['浅草寺', '东京塔', '涩谷', '新宿御苑'], activitiesEn: ['Senso-ji Temple', 'Tokyo Tower', 'Shibuya', 'Shinjuku Gyoen'], activitiesJp: ['浅草寺', '東京タワー', '渋谷', '新宿御苑'], accommodationCn: '东京半岛酒店', accommodationEn: 'The Peninsula Tokyo', accommodationJp: 'ザ・ペニンシュラ東京' },
      { day: 3, titleCn: '镰仓一日游', titleEn: 'Kamakura Day Trip', titleJp: '鎌倉日帰り旅', descriptionCn: '前往镰仓，参观大佛、鹤岗八幡宫，漫步海岸线。', descriptionEn: 'Head to Kamakura to visit the Great Buddha, Tsurugaoka Hachimangu Shrine, and stroll along the coast.', descriptionJp: '鎌倉へ行き、大仏、鶴岡八幡宮を訪問し、海岸沿いを散策。', activitiesCn: ['镰仓大佛', '鹤岗八幡宫', '江之岛'], activitiesEn: ['Kamakura Great Buddha', 'Tsurugaoka Hachimangu', 'Enoshima'], activitiesJp: ['鎌倉大仏', '鶴岡八幡宮', '江の島'], accommodationCn: '东京半岛酒店', accommodationEn: 'The Peninsula Tokyo', accommodationJp: 'ザ・ペニンシュラ東京' },
      { day: 4, titleCn: '新干线前往京都', titleEn: 'Shinkansen to Kyoto', titleJp: '新幹線で京都へ', descriptionCn: '乘坐新干线前往京都，入住传统町屋，漫步花见小路。', descriptionEn: 'Take the Shinkansen to Kyoto, check into a traditional machiya townhouse, and stroll through Gion.', descriptionJp: '新幹線で京都へ、伝統的な町屋にチェックインし、祇園を散策。', activitiesCn: ['新干线', '伏见稻荷大社', '花见小路', '二年坂'], activitiesEn: ['Shinkansen', 'Fushimi Inari Shrine', 'Hanamikoji', 'Ninenzaka'], activitiesJp: ['新幹線', '伏見稲荷大社', '花見小路', '二年坂'], accommodationCn: '京都柊家旅馆', accommodationEn: 'Hiiragiya Ryokan', accommodationJp: '柊家旅館' },
      { day: 5, titleCn: '京都文化体验', titleEn: 'Kyoto Cultural Experience', titleJp: '京都文化体験', descriptionCn: '参观金阁寺、岚山竹林，体验茶道。', descriptionEn: 'Visit Kinkaku-ji Golden Pavilion, Arashiyama Bamboo Grove, and experience a traditional tea ceremony.', descriptionJp: '金閣寺、嵐山竹林を訪問し、伝統的な茶道を体験。', activitiesCn: ['金阁寺', '岚山竹林', '茶道体验', '渡月桥'], activitiesEn: ['Kinkaku-ji', 'Arashiyama Bamboo Grove', 'Tea ceremony', 'Togetsukyo Bridge'], activitiesJp: ['金閣寺', '嵐山竹林', '茶道体験', '渡月橋'], accommodationCn: '京都柊家旅馆', accommodationEn: 'Hiiragiya Ryokan', accommodationJp: '柊家旅館' },
      { day: 6, titleCn: '奈良半日游', titleEn: 'Nara Half-Day Trip', titleJp: '奈良半日旅', descriptionCn: '前往奈良公园与小鹿互动，参观东大寺。下午返回京都自由购物。', descriptionEn: 'Visit Nara Park to interact with friendly deer and explore Todai-ji Temple. Return to Kyoto for free afternoon shopping.', descriptionJp: '奈良公園で鹿と触れ合い、東大寺を参拝。午後は京都に戻り自由ショッピング。', activitiesCn: ['奈良公园', '东大寺', '春日大社'], activitiesEn: ['Nara Park', 'Todai-ji Temple', 'Kasuga Taisha'], activitiesJp: ['奈良公園', '東大寺', '春日大社'], accommodationCn: '京都柊家旅馆', accommodationEn: 'Hiiragiya Ryokan', accommodationJp: '柊家旅館' },
      { day: 7, titleCn: '返程', titleEn: 'Departure', titleJp: '帰国', descriptionCn: '根据航班时间送机，结束美好旅程。', descriptionEn: 'Airport transfer according to flight schedule, ending a wonderful journey.', descriptionJp: 'フライトスケジュールに合わせて空港送迎、素晴らしい旅の終わり。', activitiesCn: ['专车送机'], activitiesEn: ['Private airport transfer'], activitiesJp: ['専用車送迎'], accommodationCn: '', accommodationEn: '', accommodationJp: '' },
    ],
    reviews: [
      { id: '1', customerName: '张先生', location: '上海', rating: 5, titleCn: '完美的日本之旅', titleEn: 'Perfect Japan Trip', titleJp: '完璧な日本旅行', contentCn: '行程安排得非常合理，酒店和交通都很棒。导游专业，让我们对日本文化有了更深的了解。', contentEn: 'The itinerary was perfectly planned, hotels and transportation were excellent. Our guide was professional and gave us a deeper understanding of Japanese culture.', contentJp: '旅程は完璧に計画され、ホテルと交通は素晴らしかった。ガイドはプロフェッショナルで、日本文化をより深く理解できた。', createdAt: new Date('2026-05-20') },
      { id: '2', customerName: '李女士', location: '北京', rating: 5, titleCn: '超出期待', titleEn: 'Beyond Expectations', titleJp: '期待以上', contentCn: '柊家旅馆的入住体验太棒了！茶道体验也很有意义。强烈推荐！', contentEn: 'The stay at Hiiragiya Ryokan was incredible! The tea ceremony experience was very meaningful. Highly recommended!', contentJp: '柊家旅館での宿泊は素晴らしかった！茶道体験は非常に有意義だった。強くお勧めします！', createdAt: new Date('2026-05-15') },
    ],
  },
  {
    id: '2', slug: 'hokkaido-winter',
    titleCn: '北海道冬日奇缘', titleEn: 'Hokkaido Winter Wonderland', titleJp: '北海道ウインターワンダーランド',
    subtitle: 'Ski, hot springs, and snow festivals in Japan\'s winter wonderland',
    taglineCn: '在粉雪天堂滑雪，在温泉乡放松，感受北海道的冬日魅力',
    taglineEn: 'Ski in powder paradise, relax in hot spring villages, experience Hokkaido\'s winter charm',
    taglineJp: 'パウダーパラダイスでスキー、温泉郷でリラックス、北海道の冬の魅力を体験',
    coverImage: 'https://picsum.photos/id/15/800/600',
    duration: 6, nights: 5, isFeatured: true, isExclusive: false,
    destination: { name: 'Japan', nameCn: '北海道', nameEn: 'Hokkaido', nameJp: '北海道', slug: 'hokkaido', coverImage: 'https://picsum.photos/id/15/800/600' },
    emotion: { name: 'revitalized', nameCn: '焕然一新', nameEn: 'Revitalized', nameJp: '新しい自分', color: '#e67e22', icon: '🔥' },
    categoriesCn: ['滑雪', '温泉', '自然'], categoriesEn: ['Skiing', 'Hot Springs', 'Nature'], categoriesJp: ['スキー', '温泉', '自然'],
    subDestinationsCn: ['札幌', '小樽', '二世谷', '登别'], subDestinationsEn: ['Sapporo', 'Otaru', 'Niseko', 'Noboribetsu'], subDestinationsJp: ['札幌', '小樽', 'ニセコ', '登別'],
    inclusionsCn: ['全程四星以上酒店', '每日早餐', '滑雪设备租赁', '温泉体验', '中文导游'],
    inclusionsEn: ['4+ star hotels throughout', 'Daily breakfast', 'Ski equipment rental', 'Hot spring experience', 'Chinese-speaking guide'],
    inclusionsJp: ['四星以上ホテル', '毎朝朝食', 'スキー用具レンタル', '温泉体験', '中文ガイド'],
    exclusionsCn: ['国际机票', '个人消费', '部分餐饮'],
    exclusionsEn: ['International flights', 'Personal expenses', 'Some meals'],
    exclusionsJp: ['国際線航空券', '個人消費', '一部の食事'],
    priceCurrency: '¥', priceFrom: 22800, isInquireOnly: false,
    descriptionCn: '<p>北海道的冬天是一个童话世界。优质的粉雪、舒适的温泉、美味的海鲜，还有热闹的雪祭，让你的冬天不再寒冷。</p>',
    descriptionEn: '<p>Hokkaido\'s winter is a fairy tale world. World-class powder snow, relaxing hot springs, delicious seafood, and lively snow festivals make your winter anything but cold.</p>',
    descriptionJp: '<p>北海道の冬はおとぎ話の世界。世界クラスのパウダースノー、心地よい温泉、美味しい海鮮料理、そして賑やかな雪祭りが、あなたの冬を寒くないものにします。</p>',
    itinerary: [
      { day: 1, titleCn: '抵达札幌', titleEn: 'Arrive in Sapporo', titleJp: '札幌到着', descriptionCn: '抵达新千岁机场，专车接机。晚上逛大通公园雪祭会场。', descriptionEn: 'Arrive at New Chitose Airport, private transfer. Evening visit to Odori Park Snow Festival venue.', descriptionJp: '新千歳空港到着、専用車送迎。夜は大通公園雪祭会場を訪問。', activitiesCn: ['专车接机', '大通公园雪祭'], activitiesEn: ['Private airport transfer', 'Odori Park Snow Festival'], activitiesJp: ['専用車送迎', '大通公園雪祭'], accommodationCn: '札幌京王广场酒店', accommodationEn: 'Sapporo Keio Plaza Hotel', accommodationJp: '札幌京王プラザホテル' },
      { day: 2, titleCn: '小樽浪漫之旅', titleEn: 'Romantic Otaru', titleJp: 'ロマンチックな小樽', descriptionCn: '漫步小樽运河，参观音乐盒堂，品尝新鲜寿司。', descriptionEn: 'Stroll along the Otaru Canal, visit the Music Box Museum, and enjoy fresh sushi.', descriptionJp: '小樽運河を散策、オルゴール堂を訪問し、新鮮な寿司を堪能。', activitiesCn: ['小樽运河', '音乐盒堂', '寿司午餐'], activitiesEn: ['Otaru Canal', 'Music Box Museum', 'Sushi lunch'], activitiesJp: ['小樽運河', 'オルゴール堂', '寿司ランチ'], accommodationCn: '札幌京王广场酒店', accommodationEn: 'Sapporo Keio Plaza Hotel', accommodationJp: '札幌京王プラザホテル' },
      { day: 3, titleCn: '二世谷滑雪', titleEn: 'Niseko Skiing', titleJp: 'ニセコスキー', descriptionCn: '前往二世谷滑雪场，享受世界级粉雪。晚上泡温泉。', descriptionEn: 'Head to Niseko ski resort to enjoy world-class powder snow. Evening hot spring soak.', descriptionJp: 'ニセコスキー場へ行き、世界クラスのパウダースノーを堪能。夜は温泉に浸かる。', activitiesCn: ['二世谷滑雪', '温泉体验'], activitiesEn: ['Niseko skiing', 'Hot spring experience'], activitiesJp: ['ニセコスキー', '温泉体験'], accommodationCn: '二世谷希尔顿酒店', accommodationEn: 'Hilton Niseko Village', accommodationJp: 'ニセコビレッジヒルトン' },
      { day: 4, titleCn: '全天滑雪', titleEn: 'Full Day Skiing', titleJp: '終日スキー', descriptionCn: '继续享受二世谷的粉雪天堂。可自由选择滑雪课程。', descriptionEn: 'Continue enjoying Niseko\'s powder paradise. Optional ski lessons available.', descriptionJp: 'ニセコのパウダーパラダイスを继续堪能。スキーレッスンも選択可能。', activitiesCn: ['全天滑雪', '可选滑雪课程'], activitiesEn: ['Full day skiing', 'Optional ski lessons'], activitiesJp: ['終日スキー', 'スキーレッスン（選択可）'], accommodationCn: '二世谷希尔顿酒店', accommodationEn: 'Hilton Niseko Village', accommodationJp: 'ニセコビレッジヒルトン' },
      { day: 5, titleCn: '登别温泉', titleEn: 'Noboribetsu Hot Springs', titleJp: '登別温泉', descriptionCn: '前往登别地狱谷，体验露天温泉。下午自由休闲。', descriptionEn: 'Visit Noboribetsu Jigokudani (Hell Valley) and experience open-air hot springs. Free afternoon for relaxation.', descriptionJp: '登別地獄谷を訪問し、露天温泉を体験。午後は自由休闲。', activitiesCn: ['登别地狱谷', '露天温泉', '温泉街漫步'], activitiesEn: ['Noboribetsu Jigokudani', 'Open-air onsen', 'Hot spring town stroll'], activitiesJp: ['登別地獄谷', '露天温泉', '温泉街散策'], accommodationCn: '登别泷乃家', accommodationEn: 'Noboribetsu Takinoya', accommodationJp: '登別滝乃家' },
      { day: 6, titleCn: '返程', titleEn: 'Departure', titleJp: '帰国', descriptionCn: '根据航班时间送机。', descriptionEn: 'Airport transfer according to flight schedule.', descriptionJp: 'フライトスケジュールに合わせて空港送迎。', activitiesCn: ['专车送机'], activitiesEn: ['Private airport transfer'], activitiesJp: ['専用車送迎'], accommodationCn: '', accommodationEn: '', accommodationJp: '' },
    ],
    reviews: [
      { id: '3', customerName: '王先生', location: '深圳', rating: 5, titleCn: '滑雪天堂', titleEn: 'Ski Paradise', titleJp: 'スキー天国', contentCn: '二世谷的雪质真的太棒了！酒店温泉也很舒服。', contentEn: 'The snow quality at Niseko is truly amazing! The hotel hot springs were also very comfortable.', contentJp: 'ニセコの雪質は本当に素晴らしい！ホテルの温泉も非常に心地よかった。', createdAt: new Date('2026-04-10') },
    ],
  },
  {
    id: '3', slug: 'okinawa-beach',
    titleCn: '冲绳海岛度假', titleEn: 'Okinawa Island Paradise', titleJp: '沖縄アイランドパラダイス',
    subtitle: 'Crystal clear waters, coral reefs, and island paradise',
    taglineCn: '在碧蓝海域浮潜，在白色沙滩漫步，享受冲绳的慢生活',
    taglineEn: 'Snorkel in crystal blue waters, stroll on white sand beaches, enjoy Okinawa\'s slow life',
    taglineJp: '透き通る青い海でシュノーケリング、白い砂浜を散策、沖縄のスローライフを楽しむ',
    coverImage: 'https://picsum.photos/id/1018/800/600',
    duration: 5, nights: 4, isFeatured: false, isExclusive: false,
    destination: { name: 'Japan', nameCn: '冲绳', nameEn: 'Okinawa', nameJp: '沖縄', slug: 'okinawa', coverImage: 'https://picsum.photos/id/1018/800/600' },
    emotion: { name: 'freedom', nameCn: '自由无束', nameEn: 'Freedom', nameJp: '自由', color: '#3498db', icon: '🕊️' },
    categoriesCn: ['海滩', '浮潜', '休闲'], categoriesEn: ['Beach', 'Snorkeling', 'Relaxation'], categoriesJp: ['ビーチ', 'シュノーケリング', 'リラックス'],
    subDestinationsCn: ['那霸', '恩纳村', '石垣岛', '竹富岛'], subDestinationsEn: ['Naha', 'Onna Village', 'Ishigaki Island', 'Taketomi Island'], subDestinationsJp: ['那覇', '恩納村', '石垣島', '竹富島'],
    inclusionsCn: ['海景酒店', '每日早餐', '浮潜设备', '出海体验', '租车服务'],
    inclusionsEn: ['Ocean-view hotel', 'Daily breakfast', 'Snorkeling equipment', 'Boat excursions', 'Car rental'],
    inclusionsJp: ['オーシャンビューホテル', '毎朝朝食', 'シュノーケリング用具', 'ボツアー', 'レンタカー'],
    exclusionsCn: ['国际机票', '个人消费', '餐饮'],
    exclusionsEn: ['International flights', 'Personal expenses', 'Meals'],
    exclusionsJp: ['国際線航空券', '個人消費', '食事'],
    priceCurrency: '¥', priceFrom: 15800, isInquireOnly: false,
    descriptionCn: '<p>冲绳是日本的热带天堂。清澈的海水、丰富的珊瑚礁、独特的琉球文化，让你在国内就能感受到海岛度假的惬意。</p>',
    descriptionEn: '<p>Okinawa is Japan\'s tropical paradise. Crystal clear waters, rich coral reefs, and unique Ryukyu culture let you experience island resort vibes without going abroad.</p>',
    descriptionJp: '<p>沖縄は日本の熱帯楽園。透き通る海、豊かな珊瑚礁、そして独特の琉球文化で、海外に行かなくてもアイランドリゾートの雰囲気を体験できる。</p>',
    itinerary: [
      { day: 1, titleCn: '抵达冲绳', titleEn: 'Arrive in Okinawa', titleJp: '沖縄到着', descriptionCn: '抵达那霸机场，提车自驾。下午逛国际通，品尝冲绳美食。', descriptionEn: 'Arrive at Naha Airport, pick up rental car. Afternoon explore Kokusai Dori and taste Okinawan cuisine.', descriptionJp: '那覇空港到着、レンタカーをピックアップ。午後は国際通りを散策し沖縄料理を堪能。', activitiesCn: ['提车自驾', '国际通', '首里城'], activitiesEn: ['Rental car pickup', 'Kokusai Dori', 'Shuri Castle'], activitiesJp: ['レンタカー', '国際通り', '首里城'], accommodationCn: '冲绳万豪度假村', accommodationEn: 'Okinawa Marriott Resort', accommodationJp: '沖縄マリオットリゾート' },
      { day: 2, titleCn: '恩纳村出海', titleEn: 'Onna Village Boat Trip', titleJp: '恩納村ボツアー', descriptionCn: '前往恩纳村浮潜，观赏热带鱼和珊瑚。下午海滩休闲。', descriptionEn: 'Head to Onna Village for snorkeling with tropical fish and coral reefs. Afternoon beach relaxation.', descriptionJp: '恩納村へシュノーケリングに行き、熱帯魚と珊瑚礁を観察。午後はビーチでリラックス。', activitiesCn: ['浮潜', '海滩休闲', '日落观赏'], activitiesEn: ['Snorkeling', 'Beach relaxation', 'Sunset viewing'], activitiesJp: ['シュノーケリング', 'ビーチリラックス', '夕日観賞'], accommodationCn: '冲绳万豪度假村', accommodationEn: 'Okinawa Marriott Resort', accommodationJp: '沖縄マリオットリゾート' },
      { day: 3, titleCn: '美丽海水族馆', titleEn: 'Churaumi Aquarium', titleJp: '美ら海水族館', descriptionCn: '参观世界级的冲绳美丽海水族馆。下午前往备濑福木林道骑行。', descriptionEn: 'Visit the world-class Churaumi Aquarium. Afternoon cycling through Bise Fukugi Tree Path.', descriptionJp: '世界クラスの美ら海水族館を訪問。午後は備瀬フクギ並木道をサイクリング。', activitiesCn: ['美丽海水族馆', '备濑福木林道骑行'], activitiesEn: ['Churaumi Aquarium', 'Bise Fukugi Tree Path cycling'], activitiesJp: ['美ら海水族館', '備瀬フクギ並木道サイクリング'], accommodationCn: '冲绳万豪度假村', accommodationEn: 'Okinawa Marriott Resort', accommodationJp: '沖縄マリオットリゾート' },
      { day: 4, titleCn: '石垣岛一日游', titleEn: 'Ishigaki Island Day Trip', titleJp: '石垣島日帰り旅', descriptionCn: '飞往石垣岛，川平湾浮潜，竹富岛漫步。', descriptionEn: 'Fly to Ishigaki Island, snorkel at Kabira Bay, stroll through Taketomi Island.', descriptionJp: '石垣島へ飛行し、川平湾でシュノーケリング、竹富島を散策。', activitiesCn: ['川平湾浮潜', '竹富岛', '水牛车'], activitiesEn: ['Kabira Bay snorkeling', 'Taketomi Island', 'Water buffalo cart'], activitiesJp: ['川平湾シュノーケリング', '竹富島', '水牛車'], accommodationCn: '冲绳万豪度假村', accommodationEn: 'Okinawa Marriott Resort', accommodationJp: '沖縄マリオットリゾート' },
      { day: 5, titleCn: '返程', titleEn: 'Departure', titleJp: '帰国', descriptionCn: '根据航班时间还车，结束旅程。', descriptionEn: 'Return rental car according to flight schedule, ending the journey.', descriptionJp: 'フライトスケジュールに合わせてレンタカーを返却、旅の終わり。', activitiesCn: ['还车', '送机'], activitiesEn: ['Car return', 'Airport transfer'], activitiesJp: ['レンタカー返却', '空港送迎'], accommodationCn: '', accommodationEn: '', accommodationJp: '' },
    ],
    reviews: [],
  },
  {
    id: '4', slug: 'osaka-gourmet',
    titleCn: '大阪美食文化之旅', titleEn: 'Osaka Culinary Adventure', titleJp: '大阪グルメアドベンチャー',
    subtitle: 'Street food, Michelin stars, and culinary adventures',
    taglineCn: '从米其林三星到街头小吃，在大阪开启味蕾盛宴',
    taglineEn: 'From Michelin 3-star to street food, embark on a culinary feast in Osaka',
    taglineJp: 'ミシュラン三つ星からストリートフードまで、大阪でグルメの宴を開始',
    coverImage: 'https://picsum.photos/id/28/800/600',
    duration: 4, nights: 3, isFeatured: false, isExclusive: true,
    destination: { name: 'Japan', nameCn: '大阪', nameEn: 'Osaka', nameJp: '大阪', slug: 'osaka', coverImage: 'https://picsum.photos/id/28/800/600' },
    emotion: { name: 'distraction', nameCn: '逃离喧嚣', nameEn: 'Escape', nameJp: '日常からの逃避', color: '#e74c3c', icon: '🏝️' },
    categoriesCn: ['美食', '文化', '购物'], categoriesEn: ['Food', 'Culture', 'Shopping'], categoriesJp: ['グルメ', '文化', 'ショッピング'],
    subDestinationsCn: ['大阪', '神户', '奈良'], subDestinationsEn: ['Osaka', 'Kobe', 'Nara'], subDestinationsJp: ['大阪', '神戸', '奈良'],
    inclusionsCn: ['精品酒店', '米其林餐厅预订', '美食向导', '交通卡'],
    inclusionsEn: ['Boutique hotel', 'Michelin restaurant reservations', 'Food guide', 'Transport card'],
    inclusionsJp: ['ブティックホテル', 'ミシュランレストラン予約', 'グルメガイド', '交通カード'],
    exclusionsCn: ['国际机票', '餐饮费用', '购物消费'],
    exclusionsEn: ['International flights', 'Meal costs', 'Shopping expenses'],
    exclusionsJp: ['国際線航空券', '食事費用', 'ショッピング費用'],
    priceCurrency: '¥', priceFrom: 18800, isInquireOnly: true,
    descriptionCn: '<p>大阪是日本的厨房。这里汇聚了从米其林三星到街头小吃的各种美食，还有神户牛、奈良茶粥等地方特色，是美食爱好者的天堂。</p>',
    descriptionEn: '<p>Osaka is Japan\'s kitchen. Here you\'ll find everything from Michelin 3-star restaurants to street food, plus local specialties like Kobe beef and Nara cha-gayu—a paradise for food lovers.</p>',
    descriptionJp: '<p>大阪は日本の台所。ミシュラン三つ星レストランからストリートフードまで、そして神戸牛や奈良茶粥などの地元名物—グルメ愛好家の天国。</p>',
    itinerary: [
      { day: 1, titleCn: '抵达大阪', titleEn: 'Arrive in Osaka', titleJp: '大阪到着', descriptionCn: '抵达关西机场，入住酒店。晚上道顿堀美食之旅。', descriptionEn: 'Arrive at Kansai Airport, check into hotel. Evening food tour in Dotonbori.', descriptionJp: '関西空港到着、ホテルにチェックイン。夜は道頓堀でグルメツアー。', activitiesCn: ['道顿堀', '黑门市场', '蟹道乐'], activitiesEn: ['Dotonbori', 'Kuromon Market', 'Kani Doraku'], activitiesJp: ['道頓堀', '黒門市場', 'かに道楽'], accommodationCn: '大阪丽思卡尔顿', accommodationEn: 'The Ritz-Carlton Osaka', accommodationJp: 'ザ・リッツ・カールトン大阪' },
      { day: 2, titleCn: '米其林体验', titleEn: 'Michelin Experience', titleJp: 'ミシュラン体験', descriptionCn: '午餐米其林一星寿司，晚餐三星怀石料理。', descriptionEn: 'Lunch at a Michelin 1-star sushi restaurant, dinner at a 3-star kaiseki.', descriptionJp: 'ランチはミシュラン一つ星寿司、ディナーは三つ星懐石料理。', activitiesCn: ['米其林午餐', '大阪城', '米其林晚餐'], activitiesEn: ['Michelin lunch', 'Osaka Castle', 'Michelin dinner'], activitiesJp: ['ミシュランランチ', '大阪城', 'ミシュランディナー'], accommodationCn: '大阪丽思卡尔顿', accommodationEn: 'The Ritz-Carlton Osaka', accommodationJp: 'ザ・リッツ・カールトン大阪' },
      { day: 3, titleCn: '神户牛肉之旅', titleEn: 'Kobe Beef Experience', titleJp: '神戸牛体験', descriptionCn: '前往神户品尝顶级神户牛，参观北野异人馆。', descriptionEn: 'Head to Kobe for top-grade Kobe beef, visit the Kitano Ijinkan foreign settlement.', descriptionJp: '神戸へ行き、最高級の神戸牛を堪能し、北野異人館を訪問。', activitiesCn: ['神户牛午餐', '北野异人馆', '神户港'], activitiesEn: ['Kobe beef lunch', 'Kitano Ijinkan', 'Kobe Port'], activitiesJp: ['神戸牛ランチ', '北野異人館', '神戸港'], accommodationCn: '大阪丽思卡尔顿', accommodationEn: 'The Ritz-Carlton Osaka', accommodationJp: 'ザ・リッツ・カールトン大阪' },
      { day: 4, titleCn: '返程', titleEn: 'Departure', titleJp: '帰国', descriptionCn: '根据航班时间送机。', descriptionEn: 'Airport transfer according to flight schedule.', descriptionJp: 'フライトスケジュールに合わせて空港送迎。', activitiesCn: ['送机'], activitiesEn: ['Airport transfer'], activitiesJp: ['空港送迎'], accommodationCn: '', accommodationEn: '', accommodationJp: '' },
    ],
    reviews: [
      { id: '4', customerName: '赵女士', location: '广州', rating: 5, titleCn: '美食天堂', titleEn: 'Food Paradise', titleJp: 'グルメ天国', contentCn: '米其林餐厅体验太棒了！向导安排得很用心。', contentEn: 'The Michelin restaurant experience was incredible! The guide arranged everything with great care.', contentJp: 'ミシュランレストランの体験は素晴らしかった！ガイドは細心の注意で手配してくれた。', createdAt: new Date('2026-03-25') },
    ],
  },
];

// ============================================
// 辅助函数：根据 locale 获取字段值
// ============================================

function getLocaleField(obj: any, field: string, locale: string): string {
  const suffix = locale === 'en' ? 'En' : locale === 'ja' ? 'Jp' : 'Cn';
  return obj[field + suffix] || obj[field + 'Cn'] || '';
}

// ============================================
// 行程详情页
// ============================================

export default async function TripDetailPage({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  const t = await getTranslations('tripDetail');
  const tCommon = await getTranslations('common');
  const locale = params.locale;
  const trip = TRIPS.find((item) => item.slug === params.slug);

  if (!trip) {
    notFound();
  }

  const title = getLocaleField(trip, 'title', locale);
  const tagline = getLocaleField(trip, 'tagline', locale);
  const description = getLocaleField(trip, 'description', locale);
  const destinationName = getLocaleField(trip.destination, 'name', locale);
  const emotionName = locale === 'en' ? trip.emotion.name.charAt(0).toUpperCase() + trip.emotion.name.slice(1) : locale === 'ja' ? trip.emotion.nameJp : trip.emotion.nameCn;
  const categories = trip[`categories${locale === 'en' ? 'En' : locale === 'ja' ? 'Jp' : 'Cn'}`] || trip.categoriesCn;
  const subDestinations = trip[`subDestinations${locale === 'en' ? 'En' : locale === 'ja' ? 'Jp' : 'Cn'}`] || trip.subDestinationsCn;
  const inclusions = trip[`inclusions${locale === 'en' ? 'En' : locale === 'ja' ? 'Jp' : 'Cn'}`] || trip.inclusionsCn;
  const exclusions = trip[`exclusions${locale === 'en' ? 'En' : locale === 'ja' ? 'Jp' : 'Cn'}`] || trip.exclusionsCn;

  const itinerary = (trip.itinerary as Array<any>).map((day: any) => ({
    day: day.day,
    title: getLocaleField(day, 'title', locale),
    description: getLocaleField(day, 'description', locale),
    activities: day[`activities${locale === 'en' ? 'En' : locale === 'ja' ? 'Jp' : 'Cn'}`] || day.activitiesCn,
    accommodation: getLocaleField(day, 'accommodation', locale),
  }));

  const reviews = trip.reviews.map((review: any) => ({
    ...review,
    title: getLocaleField(review, 'title', locale),
    content: getLocaleField(review, 'content', locale),
  }));

  const relatedTrips = TRIPS.filter((item) => item.id !== trip.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden">
        <Image
          src={trip.coverImage}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/trips"
              className="inline-block px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm mb-4 hover:bg-white/30 transition-colors"
            >
              {t('back')}
            </Link>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
              {title}
            </h1>
            {tagline && (
              <p className="text-xl opacity-90 max-w-2xl">{tagline}</p>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* 左侧内容 */}
          <div className="lg:col-span-2 space-y-16">
            {/* 快速信息 */}
            <QuickInfo trip={{
              duration: trip.duration,
              nights: trip.nights,
              minGuests: (trip as any).minGuests,
              maxGuests: (trip as any).maxGuests,
              difficulty: (trip as any).difficulty,
              activityLevel: (trip as any).activityLevel,
              emotion: trip.emotion,
              categories: categories,
              subDestinations: subDestinations,
            }} t={t} tCommon={tCommon} locale={locale} />

            {/* 旅程概要 */}
            <section>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">{t('overview')}</h2>
              <div
                className="prose prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </section>

            {/* 每日行程 */}
            {itinerary && itinerary.length > 0 && (
              <section>
                <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">{t('itinerary.title')}</h2>
                <div className="space-y-8">
                  {itinerary.map((day: any) => (
                    <DayCard key={day.day} day={day} t={t} />
                  ))}
                </div>
              </section>
            )}

            {/* 包含项目 */}
            {inclusions.length > 0 && (
              <section>
                <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">{t('included')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {inclusions.map((item: string, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-green-600">✓</span>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 不包含项目 */}
            {exclusions.length > 0 && (
              <section>
                <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">{t('excluded')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {exclusions.map((item: string, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-red-500">✕</span>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 客户评价 */}
            {reviews.length > 0 && (
              <section>
                <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">{t('reviews')}</h2>
                <div className="space-y-6">
                  {reviews.map((review: any) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </section>
            )}

            {/* 相关行程 */}
            {relatedTrips.length > 0 && (
              <section>
                <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">{t('relatedTrips')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedTrips.map((rt) => (
                    <Link key={rt.id} href={`/trips/${rt.slug}`} className="group block">
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3">
                        <Image
                          src={rt.coverImage}
                          alt={getLocaleField(rt, 'title', locale)}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          sizes="33vw"
                        />
                      </div>
                      <h3 className="font-bold text-gray-900 group-hover:text-yellow-600">{getLocaleField(rt, 'title', locale)}</h3>
                      <p className="text-sm text-gray-500">{rt.duration} {tCommon('day')} {rt.nights} {tCommon('night')}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* 右侧咨询表单 */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* 价格卡片 */}
              <div className="bg-gray-50 p-6 rounded-lg">
                {trip.isInquireOnly ? (
                  <>
                    <p className="text-sm text-gray-500 mb-1">{t('price.inquireOnly')}</p>
                    <p className="text-2xl font-bold text-gray-900">{t('price.customQuote')}</p>
                    {trip.priceFrom && (
                      <p className="text-sm text-gray-500 mt-2">
                        {t('price.startingFrom')}：{trip.priceCurrency} {trip.priceFrom.toString()} /{t('price.perPerson')}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-500 mb-1">{t('price.startingFrom')}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {trip.priceCurrency} {trip.priceFrom?.toString()}
                    </p>
                  </>
                )}
              </div>

              {/* 咨询表单 */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('inquiry.title')}</h3>
                <p className="text-gray-600 mb-6 text-sm">{t('inquiry.subtitle')}</p>
                <InquiryForm prefillDestination={destinationName} />
              </div>

              {/* 联系方式 */}
              <div className="text-center">
                <p className="text-sm text-gray-500">{t('inquiry.orCall')}</p>
                <a href="tel:+864000000000" className="text-xl font-bold text-gray-900 hover:text-yellow-600 transition-colors">
                  +86 400-XXX-XXXX
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 快速信息栏
// ============================================

function QuickInfo({
  trip,
  t,
  tCommon,
  locale,
}: {
  trip: {
    duration: number;
    nights: number;
    minGuests?: number;
    maxGuests?: number | null;
    difficulty?: string | null;
    activityLevel?: string | null;
    emotion: { name: string; nameCn: string; nameEn: string; nameJp: string; color: string; icon: string | null } | null;
    categories: string[];
    subDestinations: string[];
  };
  t: any;
  tCommon: any;
  locale: string;
}) {
  const peopleSuffix = locale === 'en' ? 'people' : locale === 'ja' ? '名' : '人';
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <QuickInfoItem icon="📅" label={t('quickInfo.duration')} value={`${trip.duration} ${tCommon('day')} ${trip.nights} ${tCommon('night')}`} />
        <QuickInfoItem icon="👥" label={t('quickInfo.travelers')} value={trip.maxGuests ? `${trip.minGuests || 2}-${trip.maxGuests} ${peopleSuffix}` : `${trip.minGuests || 2}+ ${peopleSuffix}`} />
        {trip.difficulty && <QuickInfoItem icon="📊" label={t('quickInfo.difficulty')} value={trip.difficulty} />}
        {trip.activityLevel && <QuickInfoItem icon="🏃" label={t('quickInfo.activityLevel')} value={trip.activityLevel} />}
      </div>
      {trip.emotion && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">{t('quickInfo.emotion')}</p>
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
            style={{ backgroundColor: `${trip.emotion.color}15`, color: trip.emotion.color }}
          >
            {trip.emotion.icon} {getLocaleField(trip.emotion, 'name', locale)}
          </span>
        </div>
      )}
      {trip.subDestinations.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">{t('quickInfo.subDestinations')}</p>
          <div className="flex flex-wrap gap-2">
            {trip.subDestinations.map((dest, i) => (
              <span key={i} className="px-3 py-1 bg-white rounded-full text-sm text-gray-700">{dest}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function QuickInfoItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  );
}

// ============================================
// 每日行程卡片
// ============================================

function DayCard({
  day,
  t,
}: {
  day: {
    day: number;
    title: string;
    description: string;
    activities: string[];
    accommodation?: string;
  };
  t: any;
}) {
  return (
    <div className="flex gap-6">
      <div className="flex-shrink-0 w-16 text-center">
        <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold mx-auto">
          {day.day}
        </div>
        <p className="text-xs text-gray-500 mt-1">{t('itinerary.dayLabel')}</p>
      </div>
      <div className="flex-1 pb-8 border-b border-gray-100 last:border-0">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{day.title}</h3>
        <p className="text-gray-700 mb-4">{day.description}</p>
        {day.activities.length > 0 && (
          <div className="space-y-2">
            {day.activities.map((activity, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-yellow-600 mt-0.5">•</span>
                {activity}
              </div>
            ))}
          </div>
        )}
        {day.accommodation && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <span>🏨</span>
            <span>{t('itinerary.accommodation')}: {day.accommodation}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// 评价卡片
// ============================================

function ReviewCard({
  review,
}: {
  review: {
    id: string;
    customerName: string;
    location: string;
    rating: number;
    title: string;
    content: string;
    createdAt: Date;
  };
}) {
  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-bold text-gray-900">{review.customerName}</p>
          <p className="text-sm text-gray-500">{review.location}</p>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}>★</span>
          ))}
        </div>
      </div>
      <h4 className="font-bold text-gray-900 mb-2">{review.title}</h4>
      <p className="text-gray-700">{review.content}</p>
    </div>
  );
}
