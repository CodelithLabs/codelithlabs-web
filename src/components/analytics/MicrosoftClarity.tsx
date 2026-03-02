// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/analytics/MicrosoftClarity.tsx
// Consent-aware Microsoft Clarity integration
// Only loads when user has accepted cookies
// ═══════════════════════════════════════════════════════════════════════════

'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

const CLARITY_PROJECT_ID = 'vp62e5yyap';

export default function MicrosoftClarity() {
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

  if (!hasConsent) return null;

  return (
    <Script
      id="microsoft-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
        `,
      }}
    />
  );
}
