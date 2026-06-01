import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

// ============================================
// Mock 数据 - 多语言版本
// ============================================

const ARTICLES: Record<string, {
  slug: string; type: string;
  titleCn: string; titleEn: string; titleJp: string;
  subtitleCn: string; subtitleEn: string; subtitleJp: string;
  coverImage: string;
  contentCn: string; contentEn: string; contentJp: string;
  readTime: number | null; publishedAt: Date | null;
  authorCn: string; authorEn: string; authorJp: string;
}> = {
  'kyoto-hidden-temples': {
    slug: 'kyoto-hidden-temples', type: 'STORY',
    titleCn: '京都十大隐秘寺庙', titleEn: 'Ten Hidden Temples of Kyoto', titleJp: '京都の隠れた十大寺院',
    subtitleCn: '远离游客，感受真正的禅意', subtitleEn: 'Away from tourists, feel true zen', subtitleJp: '観光客を離れ、本当の禅を感じる',
    coverImage: 'https://picsum.photos/id/1031/1920/1080',
    contentCn: '<p>京都，这座拥有千年历史的古都，散落着无数精美的寺庙。除了金阁寺、清水寺这些知名景点，还有许多隐藏在街巷深处的小寺，等待着有心人的发现。</p><h3>1. 法然院</h3><p>位于南禅寺附近的法然院，是一座鲜为人知的净土宗寺院。春天的樱花和秋天的红叶，让这里成为摄影爱好者的秘密基地。</p><h3>2. 真如堂</h3><p>比睿山脚下的真如堂，以其壮丽的秋色闻名。每到 11 月，满山红叶如同燃烧的火焰，美不胜收。</p><h3>3. 永观堂</h3><p>永观堂是京都著名的赏枫胜地，但很多游客不知道的是，清晨 6 点开门时，几乎可以独享整片红叶。</p><p>这些隐秘的寺庙，没有拥挤的人群，只有宁静的氛围和纯粹的美。如果你愿意放慢脚步，京都一定会给你不一样的惊喜。</p>',
    contentEn: '<p>Kyoto, this ancient capital with a thousand years of history, is scattered with countless beautiful temples. Beyond famous spots like Kinkaku-ji and Kiyomizu-dera, there are many small temples hidden deep in the streets, waiting for those who seek them out.</p><h3>1. Honen-in</h3><p>Honen-in, near Nanzen-ji, is a lesser-known Jodo-shu temple. Spring cherry blossoms and autumn foliage make it a secret spot for photography enthusiasts.</p><h3>2. Shinnyo-do</h3><p>Shinnyo-do at the foot of Mt. Hiei is famous for its magnificent autumn colors. Every November, the mountain\'s red leaves are like burning flames, breathtakingly beautiful.</p><h3>3. Eikan-do</h3><p>Eikan-do is Kyoto\'s famous autumn foliage spot, but many visitors don\'t know that at 6 AM opening, you can almost have the entire maple forest to yourself.</p><p>These hidden temples have no crowds, only tranquil atmosphere and pure beauty. If you\'re willing to slow down, Kyoto will surely give you a different kind of surprise.</p>',
    contentJp: '<p>京都、千年の歴史を持つ古都には、無数の美しい寺院が点在しています。金閣寺や清水寺などの有名スポット以外にも、路地裏に隠れた小さなお寺が、発見を待っています。</p><h3>1. 法然院</h3><p>南禅寺近くの法然院は、あまり知られていない浄土宗の寺院です。春の桜と秋の紅葉が、写真愛好家の秘密の場所となっています。</p><h3>2. 真如堂</h3><p>比叡山麓の真如堂は、壮麗な秋色で有名です。毎年11月、山々の紅葉は燃える炎のようで、息を呑む美しさです。</p><h3>3. 永観堂</h3><p>永観堂は京都の有名な紅葉スポットですが、多くの観光客が知らないのは、朝6時の開門時には、ほぼ貸し切りで紅葉を楽しめることです。</p><p>これらの隠れた寺院には、混雑した人々はおらず、静かな雰囲気と纯粹な美しさだけがあります。足をゆっくりと運べば、京都は必ず違う種類の驚きを与えてくれます。</p>',
    readTime: 8, publishedAt: new Date('2026-05-20'),
    authorCn: '田中先生', authorEn: 'Mr. Tanaka', authorJp: '田中先生' },
  'japan-tea-ceremony': {
    slug: 'japan-tea-ceremony', type: 'FEATURE',
    titleCn: '日本茶道艺术', titleEn: 'The Art of Japanese Tea Ceremony', titleJp: '日本茶道の芸術',
    subtitleCn: '一期一会的极致体验', subtitleEn: 'The ultimate experience of "once in a lifetime"', subtitleJp: '「一期一会」の究極体験',
    coverImage: 'https://picsum.photos/id/1039/1920/1080',
    contentCn: '<p>日本茶道，不仅是一种饮茶方式，更是一种生活哲学。"一期一会"的精神，提醒我们珍惜每一次相遇。</p><h3>茶道的起源</h3><p>茶道始于中国，在日本得到了极致的发展。千利休将茶道提升为一种艺术形式，强调"和敬清寂"的精神。</p><h3>体验茶道</h3><p>在京都，你可以预约一场真正的茶道体验。从点炭、点茶到品茶，每一个动作都蕴含着深刻的意义。</p>',
    contentEn: '<p>The Japanese tea ceremony is not just a way of drinking tea, but a philosophy of life. The spirit of "ichigo ichie" (once in a lifetime) reminds us to cherish every encounter.</p><h3>Origins of Tea Ceremony</h3><p>The tea ceremony originated in China and was developed to its极致 in Japan. Sen no Rikyu elevated it to an art form, emphasizing the spirit of "wa, kei, sei, jaku" (harmony, respect, purity, tranquility).</p><h3>Experiencing Tea Ceremony</h3><p>In Kyoto, you can book a genuine tea ceremony experience. From preparing the charcoal, whisking the tea, to tasting it, every movement carries profound meaning.</p>',
    contentJp: '<p>日本茶道は、単なる飲み方ではなく、生活哲学です。「一期一会」の精神は、每一次の出会いを大切にするよう教えてくれます。</p><h3>茶道の起源</h3><p>茶道は中国に始まり、日本で究極の発展を遂げました。千利休は茶道を芸術の域に高め、「和敬清寂」の精神を強調しました。</p><h3>茶道体験</h3><p>京都では、本格的な茶道体験を予約できます。炭を点て、茶を点て、品茶するまで、每一个の動作に深い意味が込められています。</p>',
    readTime: 12, publishedAt: new Date('2026-05-15'),
    authorCn: '佐藤女士', authorEn: 'Ms. Sato', authorJp: '佐藤女士' },
  'hokkaido-ski-guide': {
    slug: 'hokkaido-ski-guide', type: 'GUIDE',
    titleCn: '北海道滑雪完全指南', titleEn: 'Complete Hokkaido Ski Guide', titleJp: '北海道スキー完全ガイド',
    subtitleCn: '从新手到高手的进阶之路', subtitleEn: 'From beginner to advanced', subtitleJp: '初心者から上級者までのステップ',
    coverImage: 'https://picsum.photos/id/15/1920/1080',
    contentCn: '<p>北海道拥有世界顶级的粉雪资源，是滑雪爱好者的天堂。无论你是初学者还是资深玩家，都能在这里找到适合自己的雪场。</p><h3>二世谷（Niseko）</h3><p>二世谷是北海道最知名的滑雪胜地，以优质的粉雪和丰富的夜生活著称。这里有 4 个 interconnected 雪场，雪道总长超过 60 公里。</p><h3>富良野</h3><p>富良野滑雪场以其宽阔的雪道和美丽的风景闻名，适合家庭和中级滑雪者。</p>',
    contentEn: '<p>Hokkaido boasts world-class powder snow resources, making it a paradise for ski enthusiasts. Whether you\'re a beginner or a seasoned pro, you\'ll find the perfect resort here.</p><h3>Niseko</h3><p>Niseko is Hokkaido\'s most famous ski resort, renowned for its quality powder snow and vibrant nightlife. With 4 interconnected resorts and over 60 km of ski trails.</p><h3>Furano</h3><p>Furano Ski Resort is known for its wide slopes and beautiful scenery, perfect for families and intermediate skiers.</p>',
    contentJp: '<p>北海道は世界クラスのパウダースノー資源を誇り、スキー愛好家の楽園です。初心者からベテランまで、自分に合ったリゾートが見つかります。</p><h3>ニセコ</h3><p>ニセコは北海道で最も有名なスキーリゾートで、質の高いパウダースノーと活気あるナイトライフで知られています。4つの相互接続されたリゾートと60km以上のスキーコースがあります。</p><h3>富良野</h3><p>富良野スキー場は、広いコースと美しい風景で有名で、ファミリー和中級スキーヤーに最適です。</p>',
    readTime: 15, publishedAt: new Date('2026-05-10'),
    authorCn: '山本教练', authorEn: 'Coach Yamamoto', authorJp: '山本コーチ' },
  'tokyo-michelin': {
    slug: 'tokyo-michelin', type: 'FEATURE',
    titleCn: '东京米其林餐厅精选', titleEn: 'Tokyo Michelin Restaurant Picks', titleJp: '東京ミシュランレストラン厳選',
    subtitleCn: '2026 年必吃的 10 家餐厅', subtitleEn: '10 must-try restaurants in 2026', subtitleJp: '2026 年必食の10軒',
    coverImage: 'https://picsum.photos/id/28/1920/1080',
    contentCn: '<p>东京是全球米其林星级餐厅最多的城市。从传统的寿司之神到创新的法式料理，每一家都值得专程前往。</p><h3>数寄屋桥次郎</h3><p>小野二郎的寿司店，被誉为"寿司之神"。虽然已年过九旬，他依然每天都在柜台后捏着寿司。</p><h3>龙吟</h3><p>山本征治主理的龙吟，是将日本食材与法式技法完美融合的典范。需要至少提前三个月预约。</p>',
    contentEn: '<p>Tokyo is the city with the most Michelin-starred restaurants in the world. From the traditional God of Sushi to innovative French cuisine, each one is worth a special trip.</p><h3>Sukiyabashi Jiro</h3><p>Jiro Ono\'s sushi restaurant, hailed as the "God of Sushi." Despite being in his nineties, he still crafts sushi behind the counter every day.</p><h3>Ryugin</h3><p>Ryugin, led by Seiji Yamamoto, is a perfect fusion of Japanese ingredients and French techniques. Reservations are needed at least three months in advance.</p>',
    contentJp: '<p>東京は世界で最もミシュラン星付きレストランが多い都市です。伝統的な寿司の神様から革新的なフレンチまで、どの店も特別な旅に値します。</p><h3>数寄屋橋次郎</h3><p>小野二郎の寿司店は「寿司の神様」と称されています。90歳を超えてなお、毎日カウンター前で寿司を握り続けています。</p><h3>龍吟</h3><p>山本征治が率いる龍吟は、日本の食材とフランスの技法を完璧に融合した模範です。最低3ヶ月前の予約が必要です。</p>',
    readTime: 10, publishedAt: new Date('2026-05-05'),
    authorCn: '美食编辑部', authorEn: 'Food Editorial', authorJp: 'グルメ編集部' },
  'okinawa-beach-guide': {
    slug: 'okinawa-beach-guide', type: 'GUIDE',
    titleCn: '冲绳海滩浮潜攻略', titleEn: 'Okinawa Beach Snorkeling Guide', titleJp: '沖縄ビーチシュノーケリングガイド',
    subtitleCn: '最佳季节、地点和装备推荐', subtitleEn: 'Best season, spots, and gear', subtitleJp: 'ベストシーズン、スポット、装備',
    coverImage: 'https://picsum.photos/id/1018/1920/1080',
    contentCn: '<p>冲绳拥有日本最美的海滩和最丰富的珊瑚礁资源。无论你是否会游泳，都能在这里享受海洋的乐趣。</p><h3>最佳浮潜地点</h3><p>川平湾（石垣岛）：被米其林指南评为三星景点，珊瑚礁和热带鱼种类丰富。庆良间诸岛：从那霸出发仅需 1 小时，海水透明度极高。</p><h3>最佳季节</h3><p>4 月至 10 月是冲绳的最佳浮潜季节，水温舒适，能见度好。</p>',
    contentEn: '<p>Okinawa boasts Japan\'s most beautiful beaches and richest coral reef resources. Whether you can swim or not, you can enjoy the ocean here.</p><h3>Best Snorkeling Spots</h3><p>Kabira Bay (Ishigaki Island): Rated as a three-star attraction by Michelin Guide, rich in coral reefs and tropical fish. Kerama Islands: Only 1 hour from Naha, with extremely clear water.</p><h3>Best Season</h3><p>April to October is the best snorkeling season in Okinawa, with comfortable water temperature and good visibility.</p>',
    contentJp: '<p>沖縄は日本で最も美しいビーチと最も豊かな珊瑚礁資源を誇っています。泳げなくても、ここで海の楽しさを楽しめます。</p><h3>ベストシュノーケリングスポット</h3><p>川平湾（石垣島）：ミシュランガイドで三つ星の評価を受けたスポットで、珊瑚礁と熱帯魚が豊富。慶良間諸島：那覇からわずか1時間、透明度が非常に高い。</p><h3>ベストシーズン</h3><p>4月から10月が沖縄のベストシュノーケリングシーズンで、水温が快適で透明度も良好です。</p>',
    readTime: 8, publishedAt: new Date('2026-04-28'),
    authorCn: '旅行编辑部', authorEn: 'Travel Editorial', authorJp: '旅行編集部' },
  'japan-sakura-2026': {
    slug: 'japan-sakura-2026', type: 'NEWS',
    titleCn: '2026 日本樱花季预测', titleEn: '2026 Japan Cherry Blossom Forecast', titleJp: '2026 日本桜シーズン予測',
    subtitleCn: '各地开花时间与最佳观赏地', subtitleEn: 'Bloom times and best viewing spots', subtitleJp: '各地開花時期とベストスポット',
    coverImage: 'https://picsum.photos/id/1040/1920/1080',
    contentCn: '<p>2026 年的樱花季即将到来。根据气象厅的最新预测，今年樱花开花时间略早于往年平均水平。</p><h3>开花预测</h3><p>东京：3 月 22 日左右开花，3 月 30 日满开。京都：3 月 25 日左右开花，4 月 2 日满开。大阪：3 月 24 日左右开花，4 月 1 日满开。</p><h3>最佳观赏地</h3><p>东京：上野公园、目黑川、千鸟渊。京都：哲学之道、岚山、清水寺。</p>',
    contentEn: '<p>The 2026 cherry blossom season is approaching. According to the latest forecast from the Meteorological Agency, this year\'s bloom time is slightly earlier than the average.</p><h3>Bloom Forecast</h3><p>Tokyo: Blooms around March 22, full bloom March 30. Kyoto: Blooms around March 25, full bloom April 2. Osaka: Blooms around March 24, full bloom April 1.</p><h3>Best Viewing Spots</h3><p>Tokyo: Ueno Park, Meguro River, Chidorigafuchi. Kyoto: Philosopher\'s Path, Arashiyama, Kiyomizu-dera.</p>',
    contentJp: '<p>2026年の桜シーズンが近づいています。気象庁の最新予測によると、今年の開花時期は例年よりやや早めです。</p><h3>開花予測</h3><p>東京：3月22日頃開花、3月30日満開。京都：3月25日頃開花、4月2日満開。大阪：3月24日頃開花、4月1日満開。</p><h3>ベスト観賞スポット</h3><p>東京：上野公園、目黒川、千鳥ヶ淵。京都：哲学の道、嵐山、清水寺。</p>',
    readTime: 6, publishedAt: new Date('2026-04-20'),
    authorCn: '气象编辑部', authorEn: 'Weather Editorial', authorJp: '気象編集部' },
};

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

// ============================================
// 故事/文章详情页
// ============================================

export default async function StoryDetailPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const t = await getTranslations('stories');
  const { locale, slug } = await params;
  const article = ARTICLES[slug];
  if (!article) notFound();

  const title = getLocaleField(article, 'title', locale);
  const subtitle = getLocaleField(article, 'subtitle', locale);
  const content = getLocaleField(article, 'content', locale);
  const author = getLocaleField(article, 'author', locale);
  const typeLabel = TYPE_LABELS[article.type]?.[locale === 'ja' ? 'jp' : locale === 'en' ? 'en' : 'cn'] || article.type;

  const relatedArticles = Object.values(ARTICLES)
    .filter((a) => a.slug !== article.slug && a.type === article.type)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[50vh] overflow-hidden">
        <Image src={article.coverImage} alt={title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm mb-4">{typeLabel}</span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">{title}</h1>
            {subtitle && <p className="text-xl opacity-90">{subtitle}</p>}
            <div className="flex items-center gap-4 mt-4 text-sm opacity-80">
              {author && <span>{t('author')}: {author}</span>}
              {article.readTime && <span>{t('readTime', { minutes: article.readTime })}</span>}
              {article.publishedAt && <span>{t('published')}: {new Date(article.publishedAt).toLocaleDateString()}</span>}
            </div>
          </div>
        </div>
      </section>

      {/* 内容 */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: content }} />
      </article>

      {/* 相关文章 */}
      {relatedArticles.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">{t('relatedArticles')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((a) => {
                const relTitle = getLocaleField(a, 'title', locale);
                const relTypeLabel = TYPE_LABELS[a.type]?.[locale === 'ja' ? 'jp' : locale === 'en' ? 'en' : 'cn'] || a.type;
                return (
                  <Link key={a.slug} href={`/stories/${a.slug}`} className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image src={a.coverImage} alt={relTitle} fill className="object-cover group-hover:scale-105 transition-transform" sizes="33vw" />
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-gray-500">{relTypeLabel}</span>
                      <h3 className="font-bold text-gray-900 group-hover:text-yellow-600 transition-colors line-clamp-2">{relTitle}</h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
