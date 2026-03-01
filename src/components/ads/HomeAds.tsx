// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/ads/HomeAds.tsx
// Ad units for the homepage — placed between major content sections.
// Hidden for premium users. Imported by the server-rendered home page.
// ═══════════════════════════════════════════════════════════════════════════

'use client';

import { AdBanner } from '@/components/ads/AdBanner';
import { useUser } from '@/lib/user-context';

/** Horizontal leaderboard below the hero / stats section */
export function HomeAdBelowHero() {
  const { isPremium } = useUser();
  if (isPremium) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <AdBanner slot="home-leaderboard-top" format="horizontal" />
    </div>
  );
}

/** Rectangle ad between featured projects and categories */
export function HomeAdMid() {
  const { isPremium } = useUser();
  if (isPremium) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <AdBanner slot="home-in-content" format="rectangle" />
    </div>
  );
}

/** Horizontal leaderboard above the CTA section */
export function HomeAdBottom() {
  const { isPremium } = useUser();
  if (isPremium) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <AdBanner slot="home-leaderboard-bottom" format="horizontal" />
    </div>
  );
}
