// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/[locale]/auth/signin/page.tsx
// Locale-aware sign-in page
// Custom branded sign-in page — replaces default NextAuth generic page
// ═══════════════════════════════════════════════════════════════════════════

import type { Metadata } from 'next';
import SignInClient from '../../../auth/signin/SignInClient';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to CodelithLabs to access premium tools, save your preferences, and unlock your personalized dashboard.',
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <>
      <h1 style={{ display: 'none' }}>Sign In</h1>
      <SignInClient />
    </>
  );
}
