// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/newsletter/NewsletterSignup.tsx
// Newsletter subscription form — embeds in Footer, Blog, or anywhere
// ═══════════════════════════════════════════════════════════════════════════

'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Mail, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface NewsletterSignupProps {
  /** Compact mode for footer/sidebar usage */
  compact?: boolean;
  /** Waitlist mode — shows countdown to launch date instead of standard subscribe copy */
  waitlist?: boolean;
}

type Status = 'idle' | 'success' | 'error';
const WAITLIST_STORAGE_KEY = 'codelithlabs_waitlist_joined_v1';

export function NewsletterSignup({ compact = false, waitlist = true }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [hasJoinedWaitlist, setHasJoinedWaitlist] = useState(false);

  // ─── Countdown to Sept 16, 2026 ───────────────────────────────────────
  type Countdown = { days: number; hours: number; minutes: number; seconds: number };
  const LAUNCH_DATE = new Date('2026-09-16T00:00:00+05:30');

  function getCountdown(): Countdown {
    const diff = Math.max(0, LAUNCH_DATE.getTime() - Date.now());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  }

  const [countdown, setCountdown] = useState<Countdown | null>(null);

  useEffect(() => {
    if (!waitlist) return;
    // Populate only on the client to avoid SSR/client mismatch
    setCountdown(getCountdown());
    const id = setInterval(() => setCountdown(getCountdown()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waitlist]);

  useEffect(() => {
    if (!waitlist) return;
    try {
      const joined = window.localStorage.getItem(WAITLIST_STORAGE_KEY) === '1';
      if (joined) {
        setHasJoinedWaitlist(true);
        setStatus('success');
      }
    } catch {
      // Ignore storage access issues and keep form visible.
    }
  }, [waitlist]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setErrorMsg('');

    try {
      if (waitlist) {
        window.localStorage.setItem(WAITLIST_STORAGE_KEY, '1');
      }

      setStatus('success');
      setHasJoinedWaitlist(true);
      setEmail('');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Something went wrong';
      setErrorMsg(msg);
      setStatus('error');
    }
  };

  if (status === 'success' || hasJoinedWaitlist) {
    return (
      <div className={`flex items-center gap-2 ${compact ? 'py-2' : 'p-4 bg-green-500/10 border border-green-500/20 rounded-xl'}`}>
        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
        <p className="text-sm text-green-400">
            {waitlist
              ? "You're on the waitlist. This form is now hidden for your device."
              : 'Almost there — check your email to confirm your subscription.'}
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-2" data-testid="newsletter-signup">
        <input
          type="email"
          id="newsletter-email-compact"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg
                       text-sm text-white placeholder-zinc-500
                       focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none transition"
          aria-label="Email address for waitlist"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={false}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50
                       text-white text-sm font-semibold rounded-lg transition-colors
                       flex items-center gap-1.5"
          >
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">{waitlist ? 'Join Waitlist' : 'Subscribe'}</span>
          </button>
        </div>
        {status === 'error' && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errorMsg}
          </p>
        )}
      </form>
    );
  }

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6" data-testid="newsletter-signup">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Mail className="w-5 h-5 text-blue-400" />
        </div>
        <div>
            <h3 className="text-white font-semibold">
              {waitlist ? 'Waitlist Launching Soon' : 'Stay Updated'}
            </h3>
            <p className="text-zinc-400 text-sm">
              {waitlist
                ? 'Join the waitlist — no backend signup required.'
                : 'Get developer tips, new tool launches & guides. No spam, ever.'}
            </p>
        </div>
      </div>

        {waitlist && countdown && (
          <div className="flex items-center gap-1.5 mb-4 p-3 rounded-lg bg-zinc-800/60 border border-zinc-700">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs text-zinc-400 mr-1">Launching in</span>
            <span className="font-mono text-sm font-bold text-amber-400">
              {String(countdown.days).padStart(3, '0')}d{' '}
              {String(countdown.hours).padStart(2, '0')}h{' '}
              {String(countdown.minutes).padStart(2, '0')}m{' '}
              {String(countdown.seconds).padStart(2, '0')}s
            </span>
          </div>
        )}


      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          id="newsletter-email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg
                     text-sm text-white placeholder-zinc-500
                     focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none transition"
          aria-label="Email address for waitlist"
        />
        <button
          type="submit"
          disabled={false}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50
                     text-white text-sm font-semibold rounded-lg transition-colors
                     flex items-center justify-center gap-2
                     shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
        >
          <>
            <Mail className="w-4 h-4" />
              {waitlist ? 'Join the Waitlist' : 'Subscribe Free'}
          </>
        </button>
      </form>

      {status === 'error' && (
        <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {errorMsg}
        </p>
      )}

      <p className="mt-3 text-xs text-zinc-400">
        No database required for this waitlist. Once you join, this form stays hidden on this device.
      </p>
    </div>
  );
}
