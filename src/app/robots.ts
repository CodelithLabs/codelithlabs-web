// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/robots.ts
// Robots.txt configuration - Optimized for maximum crawlability
// Explicitly allows Googlebot access to static assets for proper indexing
// ═══════════════════════════════════════════════════════════════════════════

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: ['/private/', '/api/'], // Only block private backend routes
      },
      {
        userAgent: 'Googlebot',
        allow: ['/_next/', '/static/', '/public/'], // EXPLICITLY ALLOW ASSETS
        disallow: [],
      }
    ],
    sitemap: 'https://codelithlabs.in/sitemap.xml',
  };
}
