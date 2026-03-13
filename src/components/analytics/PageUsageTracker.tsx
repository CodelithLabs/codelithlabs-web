'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackClientAnalytics } from '@/lib/analytics/client';

const SUPPORTED_LOCALES = new Set(['en', 'es', 'pt', 'fr', 'de', 'hi']);

function getLocaleFromPath(pathname: string): string | undefined {
  const firstSegment = pathname.split('/').filter(Boolean)[0];
  if (!firstSegment) return undefined;
  return SUPPORTED_LOCALES.has(firstSegment) ? firstSegment : undefined;
}

export function PageUsageTracker() {
  const pathname = usePathname();
  const lastTrackedPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith('/api/')) return;
    if (lastTrackedPathRef.current === pathname) return;

    lastTrackedPathRef.current = pathname;

    void trackClientAnalytics({
      eventName: 'page_view',
      eventType: 'PAGE_VIEW',
      path: pathname,
      source: 'app_router',
      locale: getLocaleFromPath(pathname),
      metadata: {
        title: document.title,
      },
    });
  }, [pathname]);

  return null;
}
