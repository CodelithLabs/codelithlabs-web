// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/auth/signin/page.tsx
// Custom branded sign-in page — replaces default NextAuth generic page
// Addresses Google Safe Browsing "deceptive page / phishing" warning
// ═══════════════════════════════════════════════════════════════════════════

import type { Metadata } from 'next';
import SignInClient from './SignInClient';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to CodelithLabs to access premium tools, save your preferences, and unlock your personalized dashboard.',
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return <SignInClient />;
}
