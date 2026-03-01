// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/ads/BlogAds.tsx
// Client wrapper that drops AdBanner units into blog post pages.
// Hidden for premium users — imported by the server-rendered blog page.
// ═══════════════════════════════════════════════════════════════════════════

'use client';

import { AdBanner } from '@/components/ads/AdBanner';
import { useUser } from '@/lib/user-context';

/** Horizontal leaderboard above the article body */
export function BlogAdTop() {
  const { isPremium } = useUser();
  if (isPremium) return null;

  return (
    <div className="mb-8">
      <AdBanner slot="blog-leaderboard-top" format="horizontal" />
    </div>
  );
}

/** Rectangle ad between article body and tags / newsletter */
export function BlogAdMid() {
  const { isPremium } = useUser();
  if (isPremium) return null;

  return (
    <div className="my-10">
      <AdBanner slot="blog-in-content" format="rectangle" />
    </div>
  );
}

/** Horizontal leaderboard below comments */
export function BlogAdBottom() {
  const { isPremium } = useUser();
  if (isPremium) return null;

  return (
    <div className="mt-10">
      <AdBanner slot="blog-leaderboard-bottom" format="horizontal" />
    </div>
  );
}
