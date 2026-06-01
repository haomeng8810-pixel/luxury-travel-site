import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

async function getMessages(locale: string) {
  // 加载主翻译文件
  const mainMessages = (await import(`../messages/${locale}.json`)).default;

  // 加载命名空间目录下的翻译文件
  let namespaceMessages: Record<string, any> = {};
  try {
    const namespaceFiles = ['aiPlanner'];
    for (const ns of namespaceFiles) {
      const module = await import(`../messages/${locale}/${ns}.json`);
      namespaceMessages[ns] = module.default;
    }
  } catch {
    // 如果命名空间文件不存在，跳过
  }

  return { ...mainMessages, ...namespaceMessages };
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale) {
    locale = routing.defaultLocale;
  }

  if (!routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: await getMessages(locale),
  };
});
