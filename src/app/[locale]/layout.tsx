import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

// ============================================
// 静态生成参数
// ============================================

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// ============================================
// Locale 布局组件
// ============================================

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = await params.locale;

  // 验证 locale 是否有效
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // 获取翻译消息
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
