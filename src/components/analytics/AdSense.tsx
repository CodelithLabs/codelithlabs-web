// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/analytics/AdSense.tsx
// Consent-aware Google AdSense loader
// Only loads when user has accepted cookies
// ═══════════════════════════════════════════════════════════════════════════

'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function AdSense() {
  const [hasConsent, setHasConsent] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('codelith_cookie_consent') === 'accepted';
    }
    return false;
  });

  useEffect(() => {
    const handler = () => {
      const updated = localStorage.getItem('codelith_cookie_consent');
      if (updated === 'accepted') setHasConsent(true);
    };

    window.addEventListener('cookie-consent-updated', handler);
    return () => window.removeEventListener('cookie-consent-updated', handler);
  }, []);

  if (!hasConsent) return null;

  return (
    <Script
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6839552407587904"
      strategy="lazyOnload"
      crossOrigin="anonymous"
    />
  );
}
