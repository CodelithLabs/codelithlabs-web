// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/ads/ToolsIndexAd.tsx
// Ad unit for the /tools index and /tools/category/[category] pages.
// ═══════════════════════════════════════════════════════════════════════════

'use client';

import { AdBanner } from '@/components/ads/AdBanner';
import { useUser } from '@/lib/user-context';

/** Horizontal leaderboard below the header on tools/category pages */
export function ToolsLeaderboard() {
  const { isPremium } = useUser();
  if (isPremium) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-4">
      <AdBanner slot="tools-index-leaderboard" format="horizontal" />
    </div>
  );
}

/** Rectangle ad inserted between tool groups for mid-page engagement */
export function ToolsMidContent() {
  const { isPremium } = useUser();
  if (isPremium) return null;

  return (
    <div className="my-8">
      <AdBanner slot="tools-mid-content" format="rectangle" />
    </div>
  );
}
