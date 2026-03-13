'use client';

import type { ReactNode } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import CookieBanner from '@/components/layout/CookieBanner';
import { useImmersiveMode } from '@/components/layout/immersive-mode';
import { PageUsageTracker } from '@/components/analytics/PageUsageTracker';

export function AppChrome({ children }: { children: ReactNode }) {
  const { immersive } = useImmersiveMode();

  return (
    <>
      <PageUsageTracker />
      {!immersive && <Navbar />}
      <div id="main-content" className={immersive ? '' : 'pt-16'}>
        {children}
      </div>
      {!immersive && <Footer />}
      {!immersive && <CookieBanner />}
    </>
  );
}