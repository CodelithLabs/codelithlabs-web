// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/newsletter/NewsletterSignup.tsx
// Newsletter subscription form — embeds in Footer, Blog, or anywhere
// ═══════════════════════════════════════════════════════════════════════════

'use client';

import { useState, FormEvent } from 'react';
import { Mail, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface NewsletterSignupProps {
  /** Compact mode for footer/sidebar usage */
  compact?: boolean;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export function NewsletterSignup({ compact = false }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/newsletter/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Subscription failed');
      }

      setStatus('success');
      setEmail('');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Something went wrong';
      setErrorMsg(msg);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className={`flex items-center gap-2 ${compact ? 'py-2' : 'p-4 bg-green-500/10 border border-green-500/20 rounded-xl'}`}>
        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
        <p className="text-sm text-green-400">
          You&apos;re subscribed! Check your email for confirmation.
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg
                       text-sm text-white placeholder-zinc-500
                       focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none transition"
            aria-label="Email address for newsletter"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50
                       text-white text-sm font-semibold rounded-lg transition-colors
                       flex items-center gap-1.5"
          >
            {status === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Mail className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Subscribe</span>
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
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Mail className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold">Stay Updated</h3>
          <p className="text-zinc-400 text-sm">
            Get developer tips, new tool launches & guides. No spam, ever.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg
                     text-sm text-white placeholder-zinc-500
                     focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 focus:outline-none transition"
          aria-label="Email address for newsletter"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50
                     text-white text-sm font-semibold rounded-lg transition-colors
                     flex items-center justify-center gap-2
                     shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
        >
          {status === 'loading' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Mail className="w-4 h-4" />
              Subscribe Free
            </>
          )}
        </button>
      </form>

      {status === 'error' && (
        <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {errorMsg}
        </p>
      )}

      <p className="mt-3 text-xs text-zinc-600">
        Unsubscribe anytime. We respect your privacy.
      </p>
    </div>
  );
}
