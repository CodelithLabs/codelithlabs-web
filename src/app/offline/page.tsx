// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/offline/page.tsx
// Offline fallback page shown when the user has no internet connection
// ═══════════════════════════════════════════════════════════════════════════

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Offline — CodelithLabs',
  description: 'You appear to be offline. CodelithLabs offers 100+ free tools that work client-side — many features remain available even without an internet connection.',
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-center px-4">
      <div className="mb-8 p-6 bg-amber-500/10 rounded-full border border-amber-500/20">
        <svg className="w-12 h-12 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M18.364 5.636a9 9 0 010 12.728M5.636 5.636a9 9 0 000 12.728m12.728-9.9a5 5 0 010 7.072M8.464 8.464a5 5 0 000 7.072M12 12h.01" />
        </svg>
      </div>

      <h1 className="text-4xl font-bold text-white mb-2">You&apos;re Offline</h1>
      <p className="text-zinc-400 text-lg mb-8 max-w-md">
        It looks like you&apos;ve lost your internet connection. Don&apos;t worry — many of our tools
        work offline once loaded!
      </p>

      <div className="space-y-3">
        <Link
          href="/"
          className="block px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg
                     font-semibold transition-colors shadow-lg shadow-blue-500/20"
        >
          Try Again
        </Link>
        <p className="text-sm text-zinc-600">
          Previously loaded tool pages should still work.
        </p>
      </div>
    </div>
  );
}
