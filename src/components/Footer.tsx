'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const locale = useLocale();

  const brandName = locale === 'ja' ? '林檎旅行' : locale === 'en' ? 'Apple Travel' : '苹果旅行';
  const tagline = locale === 'ja'
    ? '贅沢な時間を、あなたに。日本的高端定制旅行の専門家。'
    : locale === 'en'
    ? 'Luxurious moments, just for you. Japan luxury custom travel experts.'
    : '贅沢な時間を、あなたに。将奢华、惬意的时光，献给你。专注日本高端定制旅行体验。';

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* 品牌 */}
          <div>
            <div className="flex flex-col mb-4">
              <span className="text-xl font-serif font-bold tracking-wider">APPLE TRAVEL</span>
              <span className="text-sm font-medium text-yellow-500">{brandName}</span>
              <span className="text-xs text-gray-500 mt-1">
                {locale === 'ja' ? '日本高端定制旅行专家' : locale === 'en' ? 'Japan Luxury Travel Experts' : '日本高端定制旅行专家'}
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{tagline}</p>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-3">
              <li><Link href="/destinations" className="text-gray-400 hover:text-white transition-colors text-sm">{tNav('destinations')}</Link></li>
              <li><Link href="/trips" className="text-gray-400 hover:text-white transition-colors text-sm">{tNav('trips')}</Link></li>
              <li><Link href="/feelings" className="text-gray-400 hover:text-white transition-colors text-sm">{tNav('feelings')}</Link></li>
              <li><Link href="/stories" className="text-gray-400 hover:text-white transition-colors text-sm">{tNav('stories')}</Link></li>
            </ul>
          </div>

          {/* 关于 */}
          <div>
            <h3 className="text-lg font-bold mb-4">{tNav('about')}</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                {locale === 'en' ? 'Brand Story' : locale === 'ja' ? 'ブランドストーリー' : '品牌故事'}
              </Link></li>
              <li><Link href="/about#team" className="text-gray-400 hover:text-white transition-colors text-sm">
                {locale === 'en' ? 'Expert Team' : locale === 'ja' ? 'エキスパートチーム' : '专家团队'}
              </Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">{tNav('contact')}</Link></li>
            </ul>
          </div>

          {/* 联系方式 */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('contactUs')}</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>📞 +86 400-XXX-XXXX</li>
              <li>✉️ hello@luxurytravel.com</li>
              <li>📍 上海市 XXXX 路 XXX 号</li>
              <li className="pt-2">
                <div className="flex gap-4">
                  <a href="#" className="hover:text-white transition-colors">微信</a>
                  <a href="#" className="hover:text-white transition-colors">小红书</a>
                  <a href="#" className="hover:text-white transition-colors">微博</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 底部栏 */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} APPLE TRAVEL. {t('rights')}.</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">{t('privacy')}</Link>
            <Link href="/terms" className="hover:text-white transition-colors">{t('terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
