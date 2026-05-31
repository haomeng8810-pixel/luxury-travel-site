'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';

function getLocaleField(obj: any, field: string, locale: string): string {
  const suffix = locale === 'en' ? '' : locale === 'ja' ? 'Jp' : 'Cn';
  const key = field + suffix;
  if (key in obj && (obj as any)[key]) return (obj as any)[key];
  const cnKey = field + 'Cn';
  if (cnKey in obj && (obj as any)[cnKey]) return (obj as any)[cnKey];
  return (obj as any)[field] || '';
}

export function Testimonials({
  reviews,
}: {
  reviews: Array<{
    id: string;
    customerName: string;
    location: string;
    rating: number;
    title: string;
    titleCn?: string;
    titleJp?: string;
    content: string;
    tripDate: Date | null;
  }>;
}) {
  const [current, setCurrent] = useState(0);
  const t = useTranslations('home.testimonials');
  const locale = useLocale();

  useEffect(() => {
    if (reviews.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  if (reviews.length === 0) return null;

  const review = reviews[current];
  const displayTitle = getLocaleField(review, 'title', locale);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-16">{t('sectionTitle')}</h2>

        <div className="relative min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="p-8 md:p-12 bg-gray-50 rounded-lg"
            >
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`text-2xl ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
                ))}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">&ldquo;{displayTitle}&rdquo;</h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-8 max-w-2xl mx-auto">{review.content}</p>
              <div>
                <p className="font-bold text-gray-900">{review.customerName}</p>
                <p className="text-sm text-gray-500">{review.location}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {reviews.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === current ? 'bg-gray-900 w-8' : 'bg-gray-300 hover:bg-gray-400'}`}
                aria-label={`Review ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
