import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // 支持的语言列表
  locales: ['zh', 'en', 'ja'],
  // 默认语言
  defaultLocale: 'zh',
  // 默认语言的 URL 不显示前缀（/trips 而不是 /zh/trips）
  localePrefix: 'as-needed',
});
