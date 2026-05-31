'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Link removed (use IntlLink);
import { useTranslations, useLocale } from 'next-intl';
import { Link as IntlLink } from '@/i18n/navigation';

interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  cta: string;
}

export function HeroSection() {
  const t = useTranslations('home.hero');
  const locale = useLocale();
  const [current, setCurrent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // 根据语言生成轮播数据
  const getSlides = (): HeroSlide[] => {
    const base = [
      {
        image: 'https://cdn.pixabay.com/photo/2017/01/11/11/33/city-1973597_1280.jpg',
        cta: t('cta'),
      },
    ];

    if (locale === 'en') {
      return [
        { ...base[0], title: '贅沢な時間を、あなたに', subtitle: 'Luxurious moments, just for you', cta: base[0].cta },
        { ...base[0], image: 'https://cdn.pixabay.com/photo/2014/10/08/00/26/palace-479404_1280.jpg', title: 'Japan Luxury Travel Experts', subtitle: 'Mount Fuji · Cherry Blossoms · Hot Springs · Ancient Temples', cta: 'Start Planning Your Journey' },
        { ...base[0], image: 'https://cdn.pixabay.com/photo/2016/10/18/09/02/cherry-blossoms-1750073_1280.jpg', title: 'PREMIUM TRAVEL EXPERIENCE', subtitle: 'Every journey deserves to be remembered for a lifetime', cta: 'Learn About Our Story' },
      ];
    }
    if (locale === 'ja') {
      return [
        { ...base[0], title: '贅沢な時間を、あなたに', subtitle: '豪華でくつろぎの時間を、あなたへ。', cta: base[0].cta },
        { ...base[0], image: 'https://cdn.pixabay.com/photo/2014/10/08/00/26/palace-479404_1280.jpg', title: '日本高端定制旅行专家', subtitle: '富士山の下 · 桜の季節 · 温泉郷 · 古寺禅', cta: '旅の計画を始める' },
        { ...base[0], image: 'https://cdn.pixabay.com/photo/2016/10/18/09/02/cherry-blossoms-1750073_1280.jpg', title: 'PREMIUM TRAVEL EXPERIENCE', subtitle: '每一次旅行，都值得被铭记一生', cta: '私たちのストーリー' },
      ];
    }
    // zh (default)
    return [
      { ...base[0], title: '贅沢な時間を、あなたに', subtitle: '将奢华、惬意的时光，献给你', cta: base[0].cta },
      { ...base[0], image: 'https://cdn.pixabay.com/photo/2014/10/08/00/26/palace-479404_1280.jpg', title: '日本高端定制旅行专家', subtitle: '富士山下 · 樱花季 · 温泉乡 · 古寺禅', cta: '开始规划您的旅程' },
      { ...base[0], image: 'https://cdn.pixabay.com/photo/2016/10/18/09/02/cherry-blossoms-1750073_1280.jpg', title: 'PREMIUM TRAVEL EXPERIENCE', subtitle: '每一次旅行，都值得被铭记一生', cta: '了解我们的故事' },
    ];
  };

  const slides = getSlides();

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleScrollToFeelings = () => {
    document.getElementById('feelings')?.scrollIntoView({ behavior: 'smooth' });
  };

  const slide = slides[current];

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 leading-tight">{slide.title}</h1>
          <p className="text-xl md:text-2xl lg:text-3xl font-light mb-4 opacity-90">{slide.subtitle}</p>
          <div className="w-24 h-0.5 bg-yellow-500 mx-auto my-8" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <IntlLink href="/trips" className="px-8 py-4 bg-yellow-600 hover:bg-yellow-700 text-white text-lg font-medium rounded transition-colors duration-200">
            {slide.cta}
          </IntlLink>
          <button
            onClick={handleScrollToFeelings}
            className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white text-lg font-medium rounded transition-all duration-200"
          >
            {locale === 'en' ? 'What Do You Want to Feel?' : locale === 'ja' ? '何を感じたいですか？' : '你想感受什么？'}
          </button>
        </motion.div>
      </div>

      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === current ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70'}`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={isLoaded ? { opacity: 1 } : {}} transition={{ delay: 1.2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white rounded-full" />
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 h-1 bg-yellow-500 z-20 transition-all duration-600" style={{ width: `${((current + 1) / slides.length) * 100}%` }} />
    </section>
  );
}
