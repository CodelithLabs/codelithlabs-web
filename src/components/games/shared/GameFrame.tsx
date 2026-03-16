'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Locale } from '@/i18n/request';

interface GameFrameProps {
  locale: Locale;
  title: string;
  score: number;
  best: number;
  muted: boolean;
  onToggleMuted: () => void;
  controls: string;
  leaderboard?: Array<{ rank: number; name: string; score: number }>;
  children: ReactNode;
}

export function GameFrame({
  locale,
  title,
  score,
  best,
  muted,
  onToggleMuted,
  controls,
  leaderboard,
  children,
}: GameFrameProps) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="border-b border-zinc-900 px-4 py-3 flex items-center justify-between">
        <Link href={`/${locale}/games`} className="text-zinc-500 hover:text-white font-mono text-xs tracking-widest uppercase">
          ← Games
        </Link>
        <div className="flex items-center gap-4 font-mono text-[11px] text-zinc-400" aria-live="polite">
          <span>SCORE <strong className="text-white">{score}</strong></span>
          <span>BEST <strong className="text-emerald-400">{best}</strong></span>
          <button
            type="button"
            onClick={onToggleMuted}
            aria-label={muted ? 'Unmute game audio' : 'Mute game audio'}
            className="px-2 py-1 rounded border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700"
          >
            {muted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>

      <div className="px-4 py-4 sm:px-6 sm:py-6 max-w-6xl w-full mx-auto flex-1 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        <section className="rounded-xl border border-zinc-900 bg-zinc-950/50 p-3 sm:p-4">
          <h1 className="font-mono text-lg tracking-widest mb-3 text-zinc-200 uppercase">{title}</h1>
          {children}
          <p className="mt-4 text-[11px] text-zinc-500 font-mono tracking-widest uppercase">{controls}</p>
        </section>

        <aside className="rounded-xl border border-zinc-900 bg-zinc-950/50 p-4">
          <h2 className="font-mono text-sm uppercase tracking-widest text-zinc-300 mb-3">Local Leaderboard</h2>
          <p className="text-[10px] text-zinc-600 font-mono uppercase mb-3">Pseudo-global · no backend</p>
          <ul className="space-y-2">
            {(leaderboard ?? []).map((entry) => (
              <li key={`${entry.rank}-${entry.name}`} className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-500">#{entry.rank} {entry.name}</span>
                <span className="text-zinc-200">{entry.score}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
