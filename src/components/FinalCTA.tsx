'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { InquiryForm } from './InquiryForm';

export function FinalCTA() {
  const [showForm, setShowForm] = useState(false);
  const t = useTranslations('home.cta');
  const locale = useLocale();

  const ctaButton = locale === 'en' ? 'Customize Your Japan Trip' : locale === 'ja' ? '日本旅行をカスタマイズ' : '定制您的日本之旅';
  const formTitle = locale === 'en' ? 'Inquiry Form' : locale === 'ja' ? 'お問い合わせフォーム' : '咨询表单';
  const formSubtitle = locale === 'en'
    ? 'Fill in the details below and our travel experts will contact you within 24 hours'
    : locale === 'ja'
    ? '以下の情報をご記入ください。旅行エキスパートが24時間以内にご連絡いたします'
    : '填写以下信息，我们的旅行专家将在 24 小时内与您联系';
  const callLabel = locale === 'en' ? 'Or call us directly' : locale === 'ja' ? 'またはお電話ください' : '或直接致电';

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://picsum.photos/id/253/1920/1080)' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-2">APPLE TRAVEL</h2>
          <p className="text-xl opacity-90 mb-2">贅沢な時間を、あなたに。</p>
          <p className="text-lg opacity-75 mb-8 max-w-2xl mx-auto">
            {locale === 'en' ? 'Luxurious moments, just for you' : '将奢华、惬意的时光，献给你'}
          </p>
        </motion.div>

        <div className="mb-8">
          <p className="text-sm opacity-70 mb-2">{callLabel}</p>
          <a href="tel:+864000000000" className="text-3xl font-bold hover:text-yellow-400 transition-colors">+86 400-XXX-XXXX</a>
        </div>

        {!showForm && (
          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            onClick={() => setShowForm(true)}
            className="px-8 py-4 bg-yellow-600 hover:bg-yellow-700 text-white text-lg font-medium rounded transition-colors"
          >
            {t('button')}
          </motion.button>
        )}

        {showForm && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white text-gray-900 rounded-lg p-8 max-w-2xl mx-auto text-left mt-8">
            <h3 className="text-2xl font-bold mb-2">{formTitle}</h3>
            <p className="text-gray-600 mb-6 text-sm">{formSubtitle}</p>
            <InquiryForm />
          </motion.div>
        )}
      </div>
    </section>
  );
}
