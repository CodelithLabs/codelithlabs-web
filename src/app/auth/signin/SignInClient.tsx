// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/auth/signin/SignInClient.tsx
// Client component — branded Google OAuth sign-in with error handling
// ═══════════════════════════════════════════════════════════════════════════

'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import Link from 'next/link';

// ─── Error Messages ──────────────────────────────────────────────────────
const ERROR_MESSAGES: Record<string, string> = {
  OAuthSignin: 'Could not start the sign-in flow. Please try again.',
  OAuthCallback: 'Authentication callback failed. Please try again.',
  OAuthAccountNotLinked: 'This email is already linked to another account.',
  Callback: 'An unexpected error occurred. Please try again.',
  Default: 'Something went wrong. Please try again.',
};

// ─── Inner Component (uses useSearchParams) ──────────────────────────────
function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const errorCode = searchParams.get('error');
  const [loading, setLoading] = useState(false);

  const errorMessage = errorCode
    ? ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.Default
    : null;

  const handleSignIn = () => {
    setLoading(true);
    signIn('google', { callbackUrl });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Codelith<span className="text-blue-500">Labs</span>
            </h1>
          </Link>
          <p className="text-zinc-400 mt-3 text-sm">
            Sign in to access premium tools, save preferences, and unlock your dashboard.
          </p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 shadow-2xl shadow-black/40">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            Welcome back
          </h2>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {errorMessage}
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5
                       bg-white hover:bg-gray-100 text-gray-900 font-medium rounded-xl
                       transition-all duration-200 shadow-sm hover:shadow-md
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Google "G" SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {loading ? 'Redirecting…' : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div className="mt-6 text-center text-xs text-zinc-500">
            We only request your name and email — no passwords stored.
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center text-xs text-zinc-600 space-x-1">
          <span>By signing in you agree to our</span>
          <Link href="/terms" className="text-blue-500 hover:underline">Terms</Link>
          <span>and</span>
          <Link href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link>
          <span>.</span>
        </div>
      </div>
    </div>
  );
}

// ─── Exported Component with Suspense boundary ──────────────────────────
export default function SignInClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="text-zinc-400">Loading…</div>
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
