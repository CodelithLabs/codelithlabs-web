// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/page.tsx
// Root Redirect — Redirects to default locale
// ═══════════════════════════════════════════════════════════════════════════

import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/request';

export default function RootPage() {
  // Redirect to default locale
  redirect(`/${defaultLocale}`);
}
