import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================
// 种子数据 - APPLE TRAVEL 苹果旅行
// 专注日本高端定制旅行
// ============================================

// Unsplash 图片（使用日本相关的高质量图片）
const IMG = {
  // 目的地封面
  tokyo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80',
  kyoto: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80',
  osaka: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=1200&q=80',
  hokkaido: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1200&q=80',
  okinawa: 'https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?w=1200&q=80',

  // 行程封面
  japanZen: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=80',
  japanSakura: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1200&q=80',
  japanOnsen: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200&q=80',

  // 故事封面
  story1: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=1200&q=80',
  story2: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=1200&q=80',
  story3: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=1200&q=80',

  // 专家头像
  expert1: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
  expert2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  expert3: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
};

async function main() {
  console.log('开始填充种子数据...');

  // 1. 创建情感（5 种核心情感）
  const emotions = await Promise.all([
    prisma.emotion.upsert({
      where: { slug: 'contentment' },
      update: {},
      create: {
        slug: 'contentment',
        name: 'Contentment',
        nameCn: '宁静',
        description: '在京都古寺中聆听钟声，感受内心的平静与满足',
        color: '#9b8ec4',
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.emotion.upsert({
      where: { slug: 'revitalized' },
      update: {},
      create: {
        slug: 'revitalized',
        name: 'Revitalized',
        nameCn: '焕新',
        description: '在温泉乡中放松身心，重新焕发活力',
        color: '#e67e22',
        sortOrder: 2,
        isActive: true,
      },
    }),
    prisma.emotion.upsert({
      where: { slug: 'freedom' },
      update: {},
      create: {
        slug: 'freedom',
        name: 'Freedom',
        nameCn: '自在',
        description: '骑着自行车穿梭在樱花树下，享受无拘无束的自由',
        color: '#3498db',
        sortOrder: 3,
        isActive: true,
      },
    }),
    prisma.emotion.upsert({
      where: { slug: 'distraction' },
      update: {},
      create: {
        slug: 'distraction',
        name: 'Distraction',
        nameCn: '惊喜',
        description: '在东京街头偶遇一场樱花雨，感受意想不到的惊喜',
        color: '#e74c3c',
        sortOrder: 4,
        isActive: true,
      },
    }),
    prisma.emotion.upsert({
      where: { slug: 'challenged' },
      update: {},
      create: {
        slug: 'challenged',
        name: 'Challenged',
        nameCn: '挑战',
        description: '攀登富士山，在日出时分站在山顶，感受征服的成就感',
        color: '#2c3e50',
        sortOrder: 5,
        isActive: true,
      },
    }),
  ]);

  console.log('✅ 情感数据已创建');

  // 2. 创建目的地（日本主要目的地）
  const destinations = await Promise.all([
    prisma.destination.upsert({
      where: { slug: 'tokyo' },
      update: {},
      create: {
        slug: 'tokyo',
        name: 'Tokyo',
        nameCn: '东京',
        description: '日本首都，传统与现代完美融合的国际化大都市',
        coverImage: IMG.tokyo,
        gallery: [
          'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
          'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800&q=80',
        ],
        continent: 'Asia',
        region: '关东',
        highlights: ['浅草寺', '东京塔', '涩谷十字路口', '新宿御苑'],
        isActive: true,
        sortOrder: 1,
      },
    }),
    prisma.destination.upsert({
      where: { slug: 'kyoto' },
      update: {},
      create: {
        slug: 'kyoto',
        name: 'Kyoto',
        nameCn: '京都',
        description: '千年古都，日本传统文化的心脏',
        coverImage: IMG.kyoto,
        gallery: [
          'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
          'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
        ],
        continent: 'Asia',
        region: '关西',
        highlights: ['金阁寺', '伏见稻荷大社', '园', '岚山'],
        isActive: true,
        sortOrder: 2,
      },
    }),
    prisma.destination.upsert({
      where: { slug: 'osaka' },
      update: {},
      create: {
        slug: 'osaka',
        name: 'Osaka',
        nameCn: '大阪',
        description: '美食之都，关西地区的活力中心',
        coverImage: IMG.osaka,
        gallery: [
          'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800&q=80',
        ],
        continent: 'Asia',
        region: '关西',
        highlights: ['道顿堀', '大阪城', '环球影城'],
        isActive: true,
        sortOrder: 3,
      },
    }),
    prisma.destination.upsert({
      where: { slug: 'hokkaido' },
      update: {},
      create: {
        slug: 'hokkaido',
        name: 'Hokkaido',
        nameCn: '北海道',
        description: '雪国仙境，四季分明的自然天堂',
        coverImage: IMG.hokkaido,
        gallery: [
          'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80',
        ],
        continent: 'Asia',
        region: '北海道',
        highlights: ['富良野', '美瑛', '登别温泉', '函馆夜景'],
        isActive: true,
        sortOrder: 4,
      },
    }),
    prisma.destination.upsert({
      where: { slug: 'okinawa' },
      update: {},
      create: {
        slug: 'okinawa',
        name: 'Okinawa',
        nameCn: '冲绳',
        description: '东方夏威夷，碧海蓝天的度假天堂',
        coverImage: IMG.okinawa,
        gallery: [
          'https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?w=800&q=80',
        ],
        continent: 'Asia',
        region: '冲绳',
        highlights: ['美丽海水族馆', '首里城', '万座毛'],
        isActive: true,
        sortOrder: 5,
      },
    }),
  ]);

  console.log('✅ 目的地数据已创建');

  // 3. 创建行程
  const trips = await Promise.all([
    prisma.trip.upsert({
      where: { slug: 'japan-zen-journey' },
      update: {},
      create: {
        slug: 'japan-zen-journey',
        title: 'Zen Journey Through Japan',
        titleCn: '日本禅意之旅',
        subtitle: '从东京到京都，感受日本文化的精髓',
        tagline: '在喧嚣中寻找宁静，在古老中感受现代',
        description: '一段深度探索日本文化的旅程，从现代化的东京到千年古都京都，体验传统与现代的完美融合。',
        coverImage: IMG.japanZen,
        gallery: [
          'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
        ],
        duration: 10,
        nights: 9,
        minGuests: 2,
        difficulty: 'Easy',
        activityLevel: 'Relaxed',
        emotionId: emotions[0].id, // Contentment/宁静
        categories: ['Cultural', 'Wellness'],
        experiences: ['Temple Visit', 'Tea Ceremony', 'Onsen'],
        destinationId: destinations[0].id, // Tokyo
        subDestinations: ['东京', '箱根', '京都', '奈良'],
        priceFrom: 38000,
        priceCurrency: 'CNY',
        priceNote: '每人价格，基于 2 人出行',
        isInquireOnly: true,
        isFeatured: true,
        isExclusive: true,
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.trip.upsert({
      where: { slug: 'japan-sakura-season' },
      update: {},
      create: {
        slug: 'japan-sakura-season',
        title: 'Cherry Blossom Season',
        titleCn: '樱花季限定之旅',
        subtitle: '追逐日本最美的樱花季',
        tagline: '在樱花飞舞的季节，遇见最美的日本',
        description: '专为樱花季设计的限定行程，带您走遍日本最美的赏樱胜地。',
        coverImage: IMG.japanSakura,
        gallery: [
          'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&q=80',
        ],
        duration: 7,
        nights: 6,
        minGuests: 2,
        difficulty: 'Easy',
        activityLevel: 'Relaxed',
        emotionId: emotions[2].id, // Freedom/自在
        categories: ['Cultural', 'Nature'],
        experiences: ['Hanami', 'Garden Visit', 'Photography'],
        destinationId: destinations[1].id, // Kyoto
        subDestinations: ['东京', '京都', '大阪'],
        priceFrom: 32000,
        priceCurrency: 'CNY',
        priceNote: '每人价格，基于 2 人出行',
        isInquireOnly: true,
        isFeatured: true,
        isExclusive: true,
        sortOrder: 2,
        isActive: true,
      },
    }),
    prisma.trip.upsert({
      where: { slug: 'japan-onsen-wellness' },
      update: {},
      create: {
        slug: 'japan-onsen-wellness',
        title: 'Onsen & Wellness Retreat',
        titleCn: '温泉养生之旅',
        subtitle: '在日本温泉乡中放松身心',
        tagline: '让温泉治愈身心，让时光慢下来',
        description: '一段专注于放松和养生的旅程，体验日本最顶级的温泉文化。',
        coverImage: IMG.japanOnsen,
        gallery: [
          'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
        ],
        duration: 8,
        nights: 7,
        minGuests: 2,
        difficulty: 'Easy',
        activityLevel: 'Relaxed',
        emotionId: emotions[1].id, // Revitalized/焕新
        categories: ['Wellness', 'Luxury'],
        experiences: ['Onsen', 'Spa', 'Meditation'],
        destinationId: destinations[3].id, // Hokkaido
        subDestinations: ['登别', '箱根', '草津'],
        priceFrom: 45000,
        priceCurrency: 'CNY',
        priceNote: '每人价格，基于 2 人出行',
        isInquireOnly: true,
        isFeatured: true,
        isExclusive: false,
        sortOrder: 3,
        isActive: true,
      },
    }),
  ]);

  console.log('✅ 行程数据已创建');

  // 4. 创建旅行专家
  const experts = await Promise.all([
    prisma.travelExpert.upsert({
      where: { slug: 'sarah-chen' },
      update: {},
      create: {
        slug: 'sarah-chen',
        name: 'Sarah Chen',
        title: '资深日本旅行专家',
        avatar: IMG.expert1,
        bio: '在日本生活 15 年，精通日本文化和语言。擅长为客户设计深度文化体验行程。',
        specialties: ['日本文化', '茶道', '京都深度游'],
        languages: ['中文', '日语', '英语'],
        yearsExperience: 15,
        quote: '真正的旅行，是用心去感受每一个瞬间',
        isAvailable: true,
        sortOrder: 1,
      },
    }),
    prisma.travelExpert.upsert({
      where: { slug: 'marco-rossi' },
      update: {},
      create: {
        slug: 'marco-rossi',
        name: 'Marco Rossi',
        title: '日本美食与葡萄酒专家',
        avatar: IMG.expert2,
        bio: '意大利出身，在日本钻研美食文化 10 年。擅长为客户设计美食主题行程。',
        specialties: ['日本料理', '清酒品鉴', '美食之旅'],
        languages: ['英语', '日语', '意大利语'],
        yearsExperience: 10,
        quote: '美食是了解一个文化最好的方式',
        isAvailable: true,
        sortOrder: 2,
      },
    }),
    prisma.travelExpert.upsert({
      where: { slug: 'yuki-tanaka' },
      update: {},
      create: {
        slug: 'yuki-tanaka',
        name: 'Yuki Tanaka',
        title: '日本自然与户外专家',
        avatar: IMG.expert3,
        bio: '日本本地人，热爱自然和户外活动。擅长为客户设计户外探险行程。',
        specialties: ['富士山登山', '北海道自然', '户外探险'],
        languages: ['日语', '英语'],
        yearsExperience: 8,
        quote: '大自然是最好的治愈师',
        isAvailable: true,
        sortOrder: 3,
      },
    }),
  ]);

  console.log('✅ 旅行专家数据已创建');

  // 5. 创建评价
  await Promise.all([
    prisma.review.upsert({
      where: { id: 'review-1' },
      update: {},
      create: {
        id: 'review-1',
        customerName: '王女士',
        location: '上海',
        rating: 5,
        title: '一生难忘的日本之旅',
        content: '这次日本之旅完全超出了我的期待。Sarah 为我们设计的行程非常贴心，每一个环节都安排得恰到好处。在京都的和服体验和茶道课程是最难忘的部分。强烈推荐！',
        tripId: trips[0].id,
        tripDate: new Date('2026-03-15'),
        isVerified: true,
        isFeatured: true,
        isActive: true,
      },
    }),
    prisma.review.upsert({
      where: { id: 'review-2' },
      update: {},
      create: {
        id: 'review-2',
        customerName: '张先生',
        location: '北京',
        rating: 5,
        title: '完美的樱花季体验',
        content: '樱花季的日本真的太美了！苹果旅行的团队帮我们安排了最好的赏樱地点，避开人群，享受独属于我们的樱花时光。温泉酒店的选择也非常棒。',
        tripId: trips[1].id,
        tripDate: new Date('2026-04-05'),
        isVerified: true,
        isFeatured: true,
        isActive: true,
      },
    }),
  ]);

  console.log('✅ 评价数据已创建');

  // 6. 创建文章
  await Promise.all([
    prisma.article.create({
      data: {
        slug: 'why-emotion-travel-matters',
        type: 'STORY',
        title: '为什么情感旅行比目的地更重要？',
        subtitle: '从 APPLE TRAVEL 的 Feelings Engine 说起',
        coverImage: IMG.story1,
        content: '<p>在旅行行业 20 年，我们发现了一个有趣的现象：人们回来后记得的不是去了哪里，而是感受到了什么。这正是我们推出情感选择器的原因...</p>',
        author: 'Sarah Chen',
        readTime: 5,
        isFeatured: true,
        isPublished: true,
        publishedAt: new Date('2026-05-01'),
      },
    }),
    prisma.article.create({
      data: {
        slug: 'best-time-visit-japan',
        type: 'GUIDE',
        title: '日本最佳旅行时间完全指南',
        subtitle: '春夏秋冬，各有不同的美',
        coverImage: IMG.story2,
        content: '<p>日本四季分明，每个季节都有独特的魅力。春季赏樱，夏季花火，秋季红叶，冬季粉雪。本文为您详细分析每个季节的优缺点...</p>',
        author: 'Yuki Tanaka',
        readTime: 8,
        isFeatured: true,
        isPublished: true,
        publishedAt: new Date('2026-05-15'),
      },
    }),
    prisma.article.create({
      data: {
        slug: 'japan-onsen-guide',
        type: 'FEATURE',
        title: '日本温泉完全指南：从入门到精通',
        subtitle: '从钱汤到顶级温泉旅馆，一次搞懂日本温泉文化',
        coverImage: IMG.story3,
        content: '<p>温泉是日本文化的重要组成部分。从街头的钱汤到山顶的秘汤，每一种温泉都有其独特的魅力。本文将带您深入了解日本温泉文化...</p>',
        author: 'Marco Rossi',
        readTime: 10,
        isFeatured: true,
        isPublished: true,
        publishedAt: new Date('2026-05-20'),
      },
    }),
  ]);

  console.log('✅ 文章数据已创建');

  // 7. 创建播客
  await Promise.all([
    prisma.podcast.create({
      data: {
        slug: 'episode-1-japan-culture',
        title: '日本文化深度解析：传统与现代的融合',
        description: '本期节目我们邀请 Sarah Chen 分享她在日本生活 15 年的见闻，探讨日本文化中传统与现代的奇妙融合。',
        coverImage: IMG.story1,
        audioUrl: '#',
        duration: 1800,
        episodeNumber: 1,
        seasonNumber: 1,
        guests: ['Sarah Chen'],
        isPublished: true,
        publishedAt: new Date('2026-05-01'),
      },
    }),
    prisma.podcast.create({
      data: {
        slug: 'episode-2-japan-food',
        title: '日本美食地图：从街头小吃到米其林',
        description: 'Marco Rossi 带您探索日本美食的方方面面，从拉面到怀石料理，从居酒屋到米其林三星。',
        coverImage: IMG.story2,
        audioUrl: '#',
        duration: 2100,
        episodeNumber: 2,
        seasonNumber: 1,
        guests: ['Marco Rossi'],
        isPublished: true,
        publishedAt: new Date('2026-05-15'),
      },
    }),
  ]);

  console.log('✅ 播客数据已创建');

  console.log('🎉 所有种子数据已创建完成！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
