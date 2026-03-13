// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/analytics/GoogleAnalytics.tsx
// Consent-aware Google Analytics 4 integration via @next/third-parties
// Only loads when user has accepted cookies
// ═══════════════════════════════════════════════════════════════════════════

'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useNonce } from '@/app/nonce-context';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export default function GoogleAnalytics() {
  const nonce = useNonce();
  const [hasConsent, setHasConsent] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('codelith_cookie_consent') === 'accepted';
    }
    return false;
  });

  useEffect(() => {
    // Listen for consent changes from CookieBanner
    const handler = () => {
      const updated = localStorage.getItem('codelith_cookie_consent');
      if (updated === 'accepted') setHasConsent(true);
    };

    window.addEventListener('cookie-consent-updated', handler);
    return () => window.removeEventListener('cookie-consent-updated', handler);
  }, []);

  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  if (!hasConsent || !gaId) return null;

  return (
    <>
      <Script
        id="ga-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
        nonce={nonce || undefined}
      />
      <Script
        id="ga-config"
        strategy="afterInteractive"
        nonce={nonce || undefined}
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            window.gtag = window.gtag || gtag;
            gtag('js', new Date());
            gtag('config', '${gaId}', { anonymize_ip: true });
          `,
        }}
      />
    </>
  );
}
