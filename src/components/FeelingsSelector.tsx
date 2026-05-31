'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';

interface Emotion {
  id: string;
  name: string;
  nameCn: string;
  nameJp?: string;
  description: string;
  descriptionJp?: string;
  icon: string;
  color: string;
}

interface FeelingsSelectorProps { emotions: Emotion[]; }

export function FeelingsSelector({ emotions }: FeelingsSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations('home.feelings');
  const locale = useLocale();

  function getLocaleField(obj: Emotion, field: string, loc: string): string {
    const suffix = loc === 'en' ? '' : loc === 'ja' ? 'Jp' : 'Cn';
    const key = field + suffix;
    if (key in obj && (obj as any)[key]) return (obj as any)[key];
    // fallback to cn
    const cnKey = field + 'Cn';
    if (cnKey in obj && (obj as any)[cnKey]) return (obj as any)[cnKey];
    return (obj as any)[field] || '';
  }

  const handleSelect = (emotionId: string) => {
    setSelected(selected === emotionId ? null : emotionId);
  };

  const handleDiscover = () => {
    if (selected) {
      const emotion = emotions.find((e) => e.id === selected);
      router.push(`/trips?emotion=${emotion?.name.toLowerCase()}`);
    } else {
      router.push('/trips');
    }
  };

  const discoverLabel = locale === 'en' ? 'Discover Matching Trips' : locale === 'ja' ? 'matchingする旅行を見つける' : '发现匹配的行程';

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">{t('sectionTitle')}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('sectionSubtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          {emotions.map((emotion, index) => (
            <motion.button
              key={emotion.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => handleSelect(emotion.id)}
              className={`relative group p-8 rounded-lg border-2 transition-all duration-300 ${
                selected === emotion.id ? 'border-current shadow-lg scale-105' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
              style={{ color: emotion.color, backgroundColor: selected === emotion.id ? `${emotion.color}10` : 'white' }}
            >
              <div className="text-5xl mb-4">{emotion.icon}</div>
              <h3 className="text-xl font-bold mb-2">{getLocaleField(emotion, 'name', locale)}</h3>
              <p className="text-sm font-medium opacity-70 mb-3">{getLocaleField(emotion, 'description', locale)}</p>
              {selected === emotion.id && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4 w-6 h-6 rounded-full" style={{ backgroundColor: emotion.color }}>
                  <svg className="w-4 h-4 text-white mx-auto mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="text-center">
          <button onClick={handleDiscover} className="inline-flex items-center px-8 py-4 bg-gray-900 text-white text-lg font-medium rounded hover:bg-gray-800 transition-colors duration-200 group">
            {discoverLabel}
            <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
