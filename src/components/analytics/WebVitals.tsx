'use client';

import { useReportWebVitals } from 'next/web-vitals';
import type { NextWebVitalsMetric } from 'next/app';

declare global {
  interface Window {
    gtag?: (
      command: 'event',
      action: string,
      params: Record<string, string | number>
    ) => void;
  }
}

function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('codelith_cookie_consent') === 'accepted';
}

function sendMetric(metric: NextWebVitalsMetric): void {
  if (!hasAnalyticsConsent()) return;

  // Send Web Vitals to GA4 (if loaded)
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: 1,
    });
  }

  // Keep dev visibility while avoiding noisy production console logs
  if (process.env.NODE_ENV !== 'production') {
    console.info('[WebVitals]', metric.name, metric.value, metric.id);
  }
}

export default function WebVitals() {
  useReportWebVitals(sendMetric);
  return null;
}
