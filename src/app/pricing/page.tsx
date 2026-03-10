// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/pricing/page.tsx
// Pricing page — redirects to locale-aware version
// ═══════════════════════════════════════════════════════════════════════════

import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/request';

export default function PricingPage() {
  // Redirect to locale-aware pricing page
  redirect(`/${defaultLocale}/pricing`);
}
