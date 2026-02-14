// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/robots.ts
// Robots.txt configuration for search engine crawlers
// Allows all bots, points to dynamic sitemap
// ═══════════════════════════════════════════════════════════════════════════

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',          // Block API routes (if any)
          '/_next/',        // Block Next.js internal files
          '/admin/',        // Block admin areas (if any)
        ],
      },
      // Allow Google AdSense bot
      {
        userAgent: 'Mediapartners-Google',
        allow: '/',
      },
    ],
    sitemap: 'https://codelithlabs.in/sitemap.xml',
  };
}
