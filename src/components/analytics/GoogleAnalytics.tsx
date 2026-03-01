// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/analytics/GoogleAnalytics.tsx
// Consent-aware Google Analytics 4 integration via @next/third-parties
// Only loads when user has accepted cookies
// ═══════════════════════════════════════════════════════════════════════════

'use client';

import { useEffect, useState } from 'react';
import { GoogleAnalytics as GA4 } from '@next/third-parties/google';

export default function GoogleAnalytics() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('codelith_cookie_consent');
    if (consent === 'accepted') {
      setHasConsent(true);
    }

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

  return <GA4 gaId={gaId} />;
}
