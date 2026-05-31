import type { Metadata } from 'next';
import { Inter, Playfair_Display, Noto_Sans_SC, Noto_Serif_SC } from 'next/font/google';
import '@/styles/globals.css';

// ============================================
// 字体配置
// ============================================

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  variable: '--font-noto-sans',
  display: 'swap',
});

const notoSerifSC = Noto_Serif_SC({
  subsets: ['latin'],
  variable: '--font-noto-serif',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

// ============================================
// SEO 元数据
// ============================================

export const metadata: Metadata = {
  title: {
    default: 'APPLE TRAVEL 苹果旅行 | 日本高端定制旅行专家',
    template: '%s | APPLE TRAVEL 苹果旅行',
  },
  description:
    '贅沢な時間を、あなたに。专注日本高端定制旅行体验，为您量身定制奢华、惬意的时光。',
  keywords: ['APPLE TRAVEL', '苹果旅行', '日本高端定制旅行', '日本豪华旅游', '日本私人定制', '日本行程规划'],
  openGraph: {
    title: 'APPLE TRAVEL 苹果旅行 | 日本高端定制旅行专家',
    description: '将奢华、惬意的时光，献给你。',
    type: 'website',
    locale: 'zh_CN',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ============================================
// 根布局（仅包含全局样式和字体，不含 Header/Footer）
// Header/Footer 已移至 [locale]/layout.tsx 以避免管理后台的 i18n 冲突
// ============================================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-CN"
      className={`${inter.variable} ${playfair.variable} ${notoSansSC.variable} ${notoSerifSC.variable}`}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
