import { getRequestConfig } from 'next-intl/server';
import { routing } from './src/i18n/routing';

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
    messages: (await import(`./src/messages/${locale}.json`)).default,
  };
});
