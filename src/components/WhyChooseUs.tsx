'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';

export function WhyChooseUs() {
  const t = useTranslations('home.testimonials');
  const locale = useLocale();

  const getFeatures = () => {
    if (locale === 'en') {
      return [
        { icon: '⛩️', title: 'Japan Travel Experts', description: 'Over 30 years of combined experience living in Japan, specializing in luxury custom travel.' },
        { icon: '🗾', title: 'Deep Japan Experiences', description: 'From Kyoto temples to Hokkaido snow country, discover hidden gems only locals know.' },
        { icon: '', title: '1-on-1 Dedicated Service', description: 'Each client gets a dedicated travel expert for personalized, caring service.' },
        { icon: '✨', title: 'Exclusive Resources', description: 'Deep partnerships with Japan\'s top hotels, restaurants, and cultural experience providers.' },
      ];
    }
    if (locale === 'ja') {
      return [
        { icon: '⛩️', title: '日本旅行专家', description: '日本高端定制旅行深耕、日本生活累計 30 年以上のチーム' },
        { icon: '🗾', title: '深度日本体験', description: '京都古寺から北海道雪国まで、地元しか知らない秘境へ' },
        { icon: '', title: '1対1専属サービス', description: 'お客様ごとに専属旅行エキスパートが全程サポート' },
        { icon: '✨', title: '独占リソース', description: '日本顶级ホテル、レストラン、文化体験機関と深度合作' },
      ];
    }
    return [
      { icon: '⛩️', title: '日本旅行专家', description: '深耕日本高端定制旅行，团队在日本生活累计超过 30 年' },
      { icon: '🗾', title: '深度日本体验', description: '从京都古寺到北海道雪国，带您体验只有当地人知道的秘境' },
      { icon: '', title: '一对一专属服务', description: '每位客户配备专属旅行专家，全程贴心服务' },
      { icon: '✨', title: '独家资源', description: '与日本顶级酒店、餐厅、文化体验机构深度合作' },
    ];
  };

  const features = getFeatures();

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            {locale === 'en' ? 'Why Choose APPLE TRAVEL?' : locale === 'ja' ? 'なぜ APPLE TRAVEL を選ぶのか？' : '为什么选择 APPLE TRAVEL？'}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {locale === 'en' ? 'Luxurious moments, just for you' : '将奢华、惬意的时光，献给你'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center p-8 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
