import { InquiryForm } from '@/components/InquiryForm';
import { getTranslations } from 'next-intl/server';

// ============================================
// 联系我们页面
// ============================================

export default async function ContactPage() {
  const t = await getTranslations('contact');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-64 bg-gray-900 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              'url(https://picsum.photos/id/1044/1920/1080)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
          <div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">
              {t('title')}
            </h1>
            <p className="text-xl opacity-90">
              {t('subtitle') || '24 小时内回复，为您的旅行梦想保驾护航'}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* 左侧联系方式 */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('contactInfo')}</h2>
              <div className="space-y-4">
                <ContactItem
                  icon="📞"
                  label={t('phone')}
                  value="+86 400-XXX-XXXX"
                  href="tel:+864000000000"
                />
                <ContactItem
                  icon="✉️"
                  label={t('email')}
                  value="hello@luxurytravel.com"
                  href="mailto:hello@luxurytravel.com"
                />
                <ContactItem
                  icon="📍"
                  label={t('address')}
                  value="上海市 XXXX 路 XXX 号 XXX 室"
                />
                <ContactItem
                  icon="🕐"
                  label={t('hours') || '工作时间'}
                  value="周一至周日 9:00 - 21:00"
                />
              </div>
            </div>

            {/* 社交媒体 */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">{t('social') || '关注我们'}</h3>
              <div className="flex gap-4">
                <SocialLink label="微信" href="#" />
                <SocialLink label="小红书" href="#" />
                <SocialLink label="微博" href="#" />
                <SocialLink label="抖音" href="#" />
              </div>
            </div>

            {/* FAQ 链接 */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">{t('faq') || '常见问题'}</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#faq-1" className="text-sm text-yellow-600 hover:text-yellow-700">
                    → {t('faq1') || '定制旅行需要提前多久预订？'}
                  </a>
                </li>
                <li>
                  <a href="#faq-2" className="text-sm text-yellow-600 hover:text-yellow-700">
                    → {t('faq2') || '行程可以修改吗？'}
                  </a>
                </li>
                <li>
                  <a href="#faq-3" className="text-sm text-yellow-600 hover:text-yellow-700">
                    → {t('faq3') || '取消政策是怎样的？'}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* 右侧咨询表单 */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t('formTitle')}
              </h2>
              <p className="text-gray-600 mb-8">
                {t('formSubtitle')}
              </p>
              <InquiryForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 联系项
// ============================================

function ContactItem({
  icon,
  label,
  value,
  href,
}: {
  icon: string;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {content}
      </a>
    );
  }

  return <div className="p-4 bg-gray-50 rounded-lg">{content}</div>;
}

// ============================================
// 社交链接
// ============================================

function SocialLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="px-4 py-2 bg-gray-100 rounded text-sm text-gray-700 hover:bg-gray-200 transition-colors"
    >
      {label}
    </a>
  );
}
