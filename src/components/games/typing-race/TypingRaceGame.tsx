'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '@/i18n/request';
import { GameFrame } from '@/components/games/shared/GameFrame';
import { usePseudoLeaderboard } from '@/components/games/shared/usePseudoLeaderboard';
import { useGameAudio } from '@/components/games/shared/useGameAudio';

const PASSAGES = [
  'Ship fast, test often, and keep performance budgets visible for every release.',
  'Clean architecture is not about perfection, it is about reducing accidental complexity.',
  'Mobile users deserve the same quality as desktop users, with touch-first controls and accessible UX.',
];

interface Props { locale: Locale }

export default function TypingRaceGame({ locale }: Props) {
  const [passage] = useState(() => PASSAGES[Math.floor(Math.random() * PASSAGES.length)]);
  const [value, setValue] = useState('');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState<number | null>(null);
  const [best, setBest] = useState(() => (typeof window !== 'undefined' ? Number(localStorage.getItem('typing_race_best') ?? 0) : 0));
  const { muted, beep, toggleMuted } = useGameAudio();

  const done = value.length >= passage.length;
  const elapsedMin = startedAt
    ? Math.max((((now ?? startedAt) - startedAt) / 60000), 1 / 60000)
    : 1;
  const wpm = done ? Math.round((passage.split(' ').length / elapsedMin)) : 0;
  const accuracy = Math.max(0, Math.round((Array.from(value).filter((c, i) => c === passage[i]).length / Math.max(1, value.length)) * 100));
  const score = done ? Math.max(0, wpm * 10 + accuracy * 3) : 0;

  useEffect(() => {
    if (!startedAt || done) return;
    const id = window.setInterval(() => setNow(Date.now()), 100);
    return () => window.clearInterval(id);
  }, [done, startedAt]);

  const leaderboard = usePseudoLeaderboard('typing-race', score || best);

  return (
    <GameFrame
      locale={locale}
      title="Typing Race"
      score={score || 0}
      best={best}
      muted={muted}
      onToggleMuted={toggleMuted}
      controls="Type the full passage as fast and accurately as possible"
      leaderboard={leaderboard}
    >
      <div className="space-y-4">
        <p className="text-zinc-300 leading-relaxed rounded-lg border border-zinc-800 bg-zinc-900 p-3">{passage}</p>
        <textarea
          value={value}
          onChange={(e) => {
            const ts = Date.now();
            let started = startedAt;
            if (!startedAt) {
              setStartedAt(ts);
              setNow(ts);
              started = ts;
            }
            const nextValue = e.target.value.slice(0, passage.length);
            setValue(nextValue);

            if (started && nextValue.length >= passage.length) {
              const elapsed = Math.max((ts - started) / 60000, 1 / 60000);
              const nextWpm = Math.round((passage.split(' ').length / elapsed));
              const nextAccuracy = Math.max(0, Math.round((Array.from(nextValue).filter((c, i) => c === passage[i]).length / Math.max(1, nextValue.length)) * 100));
              const nextScore = Math.max(0, nextWpm * 10 + nextAccuracy * 3);
              setBest((prev) => {
                if (nextScore > prev) {
                  if (typeof window !== 'undefined') localStorage.setItem('typing_race_best', String(nextScore));
                  return nextScore;
                }
                return prev;
              });
            }

            beep(540, 0.015, 'triangle');
          }}
          rows={4}
          className="w-full rounded border border-zinc-700 bg-zinc-950 p-3 text-zinc-100"
          aria-label="Typing race input"
        />
        <div className="flex gap-4 text-xs font-mono uppercase text-zinc-400">
          <span>WPM: <strong className="text-white">{wpm}</strong></span>
          <span>Accuracy: <strong className="text-emerald-400">{accuracy}%</strong></span>
        </div>
      </div>
    </GameFrame>
  );
}
