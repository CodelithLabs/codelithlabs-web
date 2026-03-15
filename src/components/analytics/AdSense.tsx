// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/analytics/AdSense.tsx
// Consent-aware Google AdSense loader
// Only loads when user has accepted cookies
// ═══════════════════════════════════════════════════════════════════════════

'use client';

import { useEffect, useState } from 'react';

const ADSENSE_SRC = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6839552407587904';

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

  useEffect(() => {
    if (!hasConsent) return;

    const existing = document.querySelector<HTMLScriptElement>(`script[src^="${ADSENSE_SRC}"]`);
    if (existing) return;

    const script = document.createElement('script');
    script.src = ADSENSE_SRC;
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  }, [hasConsent]);

  return null;
}
