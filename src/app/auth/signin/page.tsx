// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/auth/signin/page.tsx
// Custom branded sign-in page — redirects to locale-aware version
// Addresses Google Safe Browsing "deceptive page / phishing" warning
// ═══════════════════════════════════════════════════════════════════════════

import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/request';

export default function SignInPage() {
  // Redirect to locale-aware sign-in page
  redirect(`/${defaultLocale}/auth/signin`);
}
