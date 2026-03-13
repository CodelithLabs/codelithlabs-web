import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n/request';
import { buildContentSecurityPolicy, CSP_NONCE_HEADER } from './lib/csp';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Always show locale in URL for SEO clarity (/en, /es, ...)
  localePrefix: 'always',

  // Auto-detect locale from Accept-Language and persisted preference
  localeDetection: true,
});

function createNonce() {
  return btoa(crypto.randomUUID()).replace(/=+$/g, '');
}

export default function proxy(request: NextRequest) {
  const nonce = createNonce();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(CSP_NONCE_HEADER, nonce);

  const response = intlMiddleware(
    new NextRequest(request.url, {
      method: request.method,
      headers: requestHeaders,
    })
  );

  response.headers.set(
    'Content-Security-Policy',
    buildContentSecurityPolicy(nonce, process.env.NODE_ENV === 'production')
  );
  response.headers.set(CSP_NONCE_HEADER, nonce);

  return response;
}

export const config = {
  // Skip API routes, static assets, and Next internals
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
