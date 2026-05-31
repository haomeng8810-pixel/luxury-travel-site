import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // 从请求中获取当前语言
  let locale = await requestLocale;

  // 如果没有指定语言，使用默认语言
  if (!locale) {
    locale = routing.defaultLocale;
  }

  // 验证语言是否在支持列表中
  if (!routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    // 加载对应语言的翻译文件
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
