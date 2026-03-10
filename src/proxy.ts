import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/request';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Always show locale in URL for SEO clarity (/en, /es, ...)
  localePrefix: 'always',

  // Auto-detect locale from Accept-Language and persisted preference
  localeDetection: true,
});

export const config = {
  // Skip API routes, static assets, and Next internals
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
