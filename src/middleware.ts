// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/middleware.ts
// Security & Traffic Control - A+ Security Score Configuration
// ═══════════════════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Clone the response to add headers
  const response = NextResponse.next();

  // ═══════════════════════════════════════════════════════════════════════
  // SECURITY HEADERS - Best Practices for A+ Security Score
  // ═══════════════════════════════════════════════════════════════════════

  // Prevent DNS prefetching (privacy)
  response.headers.set('X-DNS-Prefetch-Control', 'off');

  // Prevent clickjacking attacks
  response.headers.set('X-Frame-Options', 'DENY');

  // Prevent MIME-type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // XSS Protection (legacy browsers)
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Referrer Policy - Strict for privacy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy - Disable unnecessary features
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  // Content Security Policy (CSP) - Production-grade
  // Note: Adjust for your AdSense and analytics domains
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https: http:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://www.google-analytics.com",
    "frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  // Strict-Transport-Security (HSTS) - Force HTTPS
  // Note: Cloudflare typically handles this, but app-level is best practice
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    );
  }

  // ═══════════════════════════════════════════════════════════════════════
  // PERFORMANCE HEADERS
  // ═══════════════════════════════════════════════════════════════════════

  // DNS Prefetch for critical resources
  response.headers.set(
    'Link',
    '<https://fonts.googleapis.com>; rel=dns-prefetch, ' +
    '<https://fonts.gstatic.com>; rel=preconnect; crossorigin'
  );

  return response;
}

// ═══════════════════════════════════════════════════════════════════════════
// MIDDLEWARE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

export const config = {
  // Apply to all routes
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
