// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/dashboard/page.tsx
// User dashboard — redirects to locale-aware version
// ═══════════════════════════════════════════════════════════════════════════

import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/request';

export default function DashboardPage() {
  // Redirect to locale-aware dashboard page
  redirect(`/${defaultLocale}/dashboard`);
}
