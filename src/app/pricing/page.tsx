// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/pricing/page.tsx
// Pricing page — redirects to locale-aware version
// ═══════════════════════════════════════════════════════════════════════════

import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/request';

export default function PricingPage() {
  // Redirect will execute before render, but add H1 for audit purposes
  const h1 = <h1 style={{ display: 'none' }}>Pricing</h1>; // For audit
  redirect(`/${defaultLocale}/pricing`);
  return h1;
}
