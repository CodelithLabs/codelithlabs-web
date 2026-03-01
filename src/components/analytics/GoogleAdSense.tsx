// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/analytics/GoogleAdSense.tsx
// Global AdSense script loader — injected in <body> via root layout.
// The script is loaded on every page EXCEPT excluded paths.
// It does NOT serve ads by itself — AdBanner renders actual ad units.
// ═══════════════════════════════════════════════════════════════════════════

'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

/**
 * Pages that must never load the AdSense script
 * (legal, utility, sensitive, or company pages).
 */
const EXCLUDED_PATHS = [
  '/privacy',
  '/terms',
  '/contact',
  '/offline',
  '/dashboard',
  '/about',
  '/team',
];

export default function GoogleAdSense() {
  const pathname = usePathname();
  const adSenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  if (!adSenseId) return null;

  // Strip trailing slash for consistent comparison
  const normalised = pathname.replace(/\/+$/, '') || '/';
  if (EXCLUDED_PATHS.some((p) => normalised === p || normalised.startsWith(p + '/'))) {
    return null;
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
