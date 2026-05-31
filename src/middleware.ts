import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // 匹配所有路径，但排除：
  // - api (API routes)
  // - admin (后台管理，不需要多语言)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico
  matcher: [
    '/((?!api|admin|_next/static|_next/image|favicon.ico).*)',
  ],
};
