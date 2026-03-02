// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/ads/AdBanner.tsx
// Re-usable AdSense ad-unit component — imported by ToolLayout, BlogAds, etc.
// Includes ad-blocker detection, format sizing, and fallback states.
// ═══════════════════════════════════════════════════════════════════════════

'use client';

import { useEffect, useState } from 'react';

export interface AdBannerProps {
  /** AdSense ad-unit slot ID (e.g. "1234567890") */
  slot: string;
  /** Display format — controls default dimensions */
  format?: 'horizontal' | 'vertical' | 'rectangle' | 'auto';
  className?: string;
}

const FORMAT_STYLES: Record<NonNullable<AdBannerProps['format']>, string> = {
  horizontal: 'min-h-[90px] w-full',
  vertical: 'min-h-[600px] w-[160px]',
  rectangle: 'min-h-[250px] w-full max-w-[300px] mx-auto',
  auto: 'min-h-[90px] w-full',
};

const FORMAT_RATIOS: Record<NonNullable<AdBannerProps['format']>, string> = {
  horizontal: '728 / 90',
  vertical: '160 / 600',
  rectangle: '300 / 250',
  auto: '728 / 90',
};

export function AdBanner({ slot, format = 'auto', className = '' }: AdBannerProps) {
  const [isAdBlocked, setIsAdBlocked] = useState(false);
  const adSenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  // ── Ad-blocker detection via bait element ────────────────────────────
  useEffect(() => {
    const bait = document.createElement('div');
    bait.className = 'adsbygoogle';
    bait.style.position = 'absolute';
    bait.style.height = '1px';
    bait.style.width = '1px';
    bait.style.top = '-1000px';
    document.body.appendChild(bait);

    const check = () => {
      const computed = window.getComputedStyle(bait);
      const blocked = computed.display === 'none' || bait.offsetHeight === 0;
      setIsAdBlocked(blocked);
      document.body.removeChild(bait);
    };

    const raf = requestAnimationFrame(check);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ── Push ad once the global adsbygoogle script is ready ──────────────
  useEffect(() => {
    if (adSenseId && !isAdBlocked) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch {
        // AdSense script not loaded yet — silently ignored
      }
    }
  }, [adSenseId, isAdBlocked]);

  return (
    <div
      className={`ad-container bg-zinc-900/30 border border-zinc-800/50 rounded-lg
                  flex items-center justify-center overflow-hidden
                  ${FORMAT_STYLES[format]} ${className}`}
      style={{ aspectRatio: FORMAT_RATIOS[format] }}
    >
      {adSenseId && !isAdBlocked ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={adSenseId}
          data-ad-slot={slot}
          data-ad-format={format === 'auto' ? 'auto' : undefined}
          data-full-width-responsive="true"
        />
      ) : isAdBlocked ? (
        <div className="text-center p-4">
          <div className="border border-dashed border-amber-500/40 rounded p-3">
            <div className="text-amber-300 text-xs font-semibold">Support Us</div>
            <div className="text-zinc-500 text-xs">
              Ads help keep these tools free.
            </div>
          </div>
        </div>
      ) : (
        <div className="text-zinc-700 text-xs text-center p-4">
          <div className="border border-dashed border-zinc-700 rounded p-3">
            Ad Space<br />
            <span className="text-zinc-600">{slot}</span>
          </div>
        </div>
      )}
    </div>
  );
}
