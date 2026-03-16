'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Locale } from '@/i18n/request';
import { GameFrame } from '@/components/games/shared/GameFrame';
import { useGameAudio } from '@/components/games/shared/useGameAudio';
import { usePseudoLeaderboard } from '@/components/games/shared/usePseudoLeaderboard';

const TOTAL_ROUNDS = 5;

interface Props {
  locale: Locale;
}

export default function ReactionTapGame({ locale }: Props) {
  const [round, setRound] = useState(1);
  const [state, setState] = useState<'idle' | 'waiting' | 'go' | 'done'>('idle');
  const [results, setResults] = useState<number[]>([]);
  const [message, setMessage] = useState('Tap Start, then wait for GO!');
  const [best, setBest] = useState(() => (typeof window !== 'undefined' ? Number(localStorage.getItem('reaction_tap_best') ?? 0) : 0));
  const startAt = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const { muted, beep, toggleMuted } = useGameAudio();

  const avgMs = useMemo(() => {
    if (results.length === 0) return 0;
    return Math.round(results.reduce((a, b) => a + b, 0) / results.length);
  }, [results]);

  const score = avgMs > 0 ? Math.max(0, 2000 - avgMs * 4 - (results.length < TOTAL_ROUNDS ? 100 : 0)) : 0;
  const leaderboard = usePseudoLeaderboard('reaction-tap', score || best);

  const clearPendingTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const queueRound = () => {
    clearPendingTimer();
    setState('waiting');
    setMessage('Wait for GO...');

    const delay = 900 + Math.floor(Math.random() * 2100);
    timerRef.current = window.setTimeout(() => {
      startAt.current = performance.now();
      setState('go');
      setMessage('GO! Tap now!');
      beep(780, 0.07, 'triangle');
    }, delay);
  };

  useEffect(() => () => clearPendingTimer(), []);

  const start = () => {
    setRound(1);
    setResults([]);
    setMessage('Get ready...');
    queueRound();
  };

  const onTap = () => {
    if (state === 'waiting') {
      clearPendingTimer();
      setMessage('Too soon! -150 score penalty');
      beep(160, 0.12, 'sawtooth');
      setResults((prev) => [...prev, 600]);

      if (round >= TOTAL_ROUNDS) {
        setState('done');
        return;
      }

      setRound((r) => r + 1);
      window.setTimeout(() => queueRound(), 700);
      return;
    }

    if (state !== 'go' || !startAt.current) return;

    const ms = Math.max(1, Math.round(performance.now() - startAt.current));
    setResults((prev) => [...prev, ms]);
    beep(620, 0.05, 'square');

    if (round >= TOTAL_ROUNDS) {
      setState('done');
      setMessage(`Done! Average ${Math.round((results.reduce((a, b) => a + b, 0) + ms) / TOTAL_ROUNDS)} ms`);
      const finalScore = Math.max(0, 2000 - Math.round((results.reduce((a, b) => a + b, 0) + ms) / TOTAL_ROUNDS) * 4);
      if (finalScore > best) {
        setBest(finalScore);
        if (typeof window !== 'undefined') localStorage.setItem('reaction_tap_best', String(finalScore));
      }
      return;
    }

    setRound((r) => r + 1);
    queueRound();
  };

  return (
    <GameFrame
      locale={locale}
      title="Reaction Tap"
      score={score}
      best={best}
      muted={muted}
      onToggleMuted={toggleMuted}
      controls="Wait for GO, then tap as fast as you can · Avoid false starts"
      leaderboard={leaderboard}
    >
      <div className="space-y-4 max-w-xl">
        <div
          className={`rounded-xl border p-8 text-center select-none cursor-pointer ${
            state === 'go' ? 'border-emerald-500 bg-emerald-500/20' : 'border-zinc-700 bg-zinc-900'
          }`}
          onClick={onTap}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') onTap();
          }}
          aria-label="Reaction area"
        >
          <p className="text-sm font-mono uppercase tracking-widest text-zinc-400">Round {Math.min(round, TOTAL_ROUNDS)} / {TOTAL_ROUNDS}</p>
          <p className="mt-3 text-lg font-semibold text-white">{message}</p>
          {state === 'go' && <p className="mt-2 text-emerald-300 text-sm">Tap now!</p>}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={start}
            className="px-3 py-2 rounded border border-zinc-700 text-xs font-mono uppercase"
          >
            Start Test
          </button>
          <button
            type="button"
            onClick={() => {
              clearPendingTimer();
              setState('idle');
              setRound(1);
              setResults([]);
              setMessage('Tap Start, then wait for GO!');
            }}
            className="px-3 py-2 rounded border border-zinc-700 text-xs font-mono uppercase"
          >
            Reset
          </button>
        </div>

        {results.length > 0 && (
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">
            Attempts: {results.join(' ms · ')} ms · Avg: {avgMs} ms
          </p>
        )}
      </div>
    </GameFrame>
  );
}
