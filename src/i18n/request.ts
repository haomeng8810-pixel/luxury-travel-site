import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

// 主翻译文件
import zhMain from '../messages/zh.json';
import enMain from '../messages/en.json';
import jaMain from '../messages/ja.json';

// 命名空间翻译文件
import zhAiPlanner from '../messages/zh/aiPlanner.json';
import enAiPlanner from '../messages/en/aiPlanner.json';
import jaAiPlanner from '../messages/ja/aiPlanner.json';

const messagesMap: Record<string, any> = {
  zh: {
    ...zhMain,
    aiPlanner: zhAiPlanner,
  },
  en: {
    ...enMain,
    aiPlanner: enAiPlanner,
  },
  ja: {
    ...jaMain,
    aiPlanner: jaAiPlanner,
  },
};

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
    messages: messagesMap[locale],
  };
});
