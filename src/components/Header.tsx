'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, Link as IntlLink } from '@/i18n/navigation';

// ============================================
// 语言配置
// ============================================

const LANGUAGES = [
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

// ============================================
// 语言切换器
// ============================================

function LanguageSwitcher({ isScrolled }: { isScrolled: boolean }) {
  const locale = useLocale();
  const pathname = usePathname();
  const tNav = useTranslations('nav');
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = LANGUAGES.find((l) => l.code === locale) || LANGUAGES[0];

  const navItems = [
    { label: tNav('destinations'), href: '/destinations' },
    { label: tNav('trips'), href: '/trips' },
    { label: tNav('feelings'), href: '/feelings' },
    { label: tNav('stories'), href: '/stories' },
    { label: tNav('about'), href: '/about' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
          isScrolled
            ? 'text-gray-700 border-gray-200 hover:bg-gray-50'
            : 'text-white border-white/30 hover:bg-white/10'
        }`}
        aria-label={tNav('switchLanguage') || '切换语言'}
      >
        <span>{currentLang.flag}</span>
        <span className="hidden sm:inline">{currentLang.label}</span>
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50"
            >
              {LANGUAGES.map((lang) => (
                <IntlLink
                  key={lang.code}
                  href={pathname || '/'}
                  locale={lang.code}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    lang.code === locale
                      ? 'bg-yellow-50 text-yellow-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.label}</span>
                  {lang.code === locale && (
                    <svg className="w-4 h-4 ml-auto text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </IntlLink>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// 组件实现
// ============================================

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('header');
  const tNav = useTranslations('nav');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: tNav('destinations'), href: '/destinations' },
    { label: tNav('trips'), href: '/trips' },
    { label: tNav('feelings'), href: '/feelings' },
    { label: tNav('stories'), href: '/stories' },
    { label: tNav('about'), href: '/about' },
  ];

  // 品牌名根据语言切换
  const brandName = locale === 'ja' ? t('brandJa') : locale === 'en' ? t('brandEn') : t('brandCn');

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <IntlLink href="/" className="flex items-center gap-2">
            <span
              className={`text-xl font-serif font-bold tracking-wider transition-colors ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}
            >
              APPLE TRAVEL
            </span>
            <span
              className={`text-sm font-medium transition-colors ${
                isScrolled ? 'text-yellow-600' : 'text-yellow-300'
              }`}
            >
              {brandName}
            </span>
          </IntlLink>

          {/* 桌面导航 */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <IntlLink
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:opacity-75 ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                {item.label}
              </IntlLink>
            ))}
          </nav>

          {/* 右侧操作区：语言切换 + CTA */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher isScrolled={isScrolled} />
            <IntlLink
              href="/#contact"
              className={`px-5 py-2 rounded text-sm font-medium transition-all ${
                isScrolled
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
            >
              {t('cta')}
            </IntlLink>
          </div>

          {/* 移动端菜单按钮 */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
            aria-label={t('menu')}
          >
            <svg
              className={`w-6 h-6 transition-colors ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* 移动端菜单 */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t"
          >
            <nav className="px-4 py-4 space-y-3">
              {/* 移动端语言切换 */}
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">{t('languageLabel')}：</span>
                {LANGUAGES.map((lang) => (
                  <IntlLink
                    key={lang.code}
                    href={pathname || '/'}
                    locale={lang.code}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
                      lang.code === locale
                        ? 'bg-yellow-100 text-yellow-700 font-medium'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </IntlLink>
                ))}
              </div>

              {navItems.map((item) => (
                <IntlLink
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 text-gray-700 hover:text-yellow-600 transition-colors"
                >
                  {item.label}
                </IntlLink>
              ))}
              <IntlLink
                href="/#contact"
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 bg-gray-900 text-white text-center rounded font-medium"
              >
                {t('cta')}
              </IntlLink>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
