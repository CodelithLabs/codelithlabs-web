'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '@/i18n/request';
import { GameFrame } from '@/components/games/shared/GameFrame';
import { useGameAudio } from '@/components/games/shared/useGameAudio';
import { usePseudoLeaderboard } from '@/components/games/shared/usePseudoLeaderboard';

const SYMBOLS = ['◆', '●', '■', '▲', '★', '✦', '⬢', '⬟'];

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

interface Props {
  locale: Locale;
}

export default function MemFlipGame({ locale }: Props) {
  const [round, setRound] = useState(1);
  const [sequence, setSequence] = useState<string[]>([]);
  const [input, setInput] = useState<string[]>([]);
  const [showing, setShowing] = useState(false);
  const [showIndex, setShowIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => (typeof window !== 'undefined' ? Number(localStorage.getItem('memflip_best') ?? 0) : 0));
  const [options, setOptions] = useState<string[]>(() => shuffle(SYMBOLS).slice(0, 6));
  const [message, setMessage] = useState('Press Start to begin sequence memory challenge.');
  const { muted, beep, toggleMuted } = useGameAudio();

  const leaderboard = usePseudoLeaderboard('memflip', score || best);

  const generateRound = (len: number) => {
    const pool = shuffle(SYMBOLS).slice(0, 6);
    const next = Array.from({ length: len }, () => pool[Math.floor(Math.random() * pool.length)]);
    setOptions(pool);
    setSequence(next);
    setInput([]);
    setShowing(true);
    setShowIndex(0);
    setMessage('Watch carefully...');
  };

  useEffect(() => {
    if (!showing || sequence.length === 0) return;

    if (showIndex >= sequence.length) {
      const t = window.setTimeout(() => {
        setShowing(false);
        setMessage('Now repeat the sequence.');
      }, 500);
      return () => clearTimeout(t);
    }

    const t = window.setTimeout(() => {
      beep(620 + showIndex * 25, 0.04, 'triangle');
      setShowIndex((i) => i + 1);
    }, 550);

    return () => clearTimeout(t);
  }, [showing, showIndex, sequence, beep]);

  const start = () => {
    setRound(1);
    setScore(0);
    generateRound(3);
  };

  const choose = (symbol: string) => {
    if (showing || sequence.length === 0) return;

    const nextInput = [...input, symbol];
    setInput(nextInput);
    beep(500, 0.03, 'square');

    const idx = nextInput.length - 1;
    if (sequence[idx] !== symbol) {
      setMessage('Wrong pattern. Round reset.');
      beep(170, 0.12, 'sawtooth');
      if (score > best) {
        setBest(score);
        if (typeof window !== 'undefined') localStorage.setItem('memflip_best', String(score));
      }
      generateRound(3);
      setRound(1);
      setScore(0);
      return;
    }

    if (nextInput.length === sequence.length) {
      const gained = round * 70;
      const nextScore = score + gained;
      setScore(nextScore);
      setMessage('Correct. Next round +1 length.');
      beep(840, 0.08, 'triangle');
      const nextRound = round + 1;
      setRound(nextRound);
      if (nextScore > best) {
        setBest(nextScore);
        if (typeof window !== 'undefined') localStorage.setItem('memflip_best', String(nextScore));
      }
      window.setTimeout(() => generateRound(Math.min(10, nextRound + 2)), 600);
    }
  };

  return (
    <GameFrame
      locale={locale}
      title="Mem Flip"
      score={score}
      best={best}
      muted={muted}
      onToggleMuted={toggleMuted}
      controls="Memorize the sequence, then tap symbols in exact order"
      leaderboard={leaderboard}
    >
      <div className="space-y-4 max-w-xl">
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">Round {round}</p>
          <p className="text-sm text-zinc-300 mt-2" aria-live="polite">{message}</p>
          {showing && sequence.length > 0 && (
            <p className="mt-3 text-3xl font-bold text-cyan-300 font-mono">{sequence[Math.min(showIndex, sequence.length - 1)]}</p>
          )}
          {!showing && input.length > 0 && (
            <p className="mt-3 text-lg font-mono text-zinc-300">Input: {input.join(' ')}</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 max-w-sm">
          {options.map((sym) => (
            <button
              key={sym}
              type="button"
              onClick={() => choose(sym)}
              disabled={showing || sequence.length === 0}
              className="px-3 py-3 rounded border border-zinc-700 text-xl font-mono hover:border-zinc-500 disabled:opacity-50"
            >
              {sym}
            </button>
          ))}
        </div>

        <button type="button" onClick={start} className="px-3 py-2 rounded border border-zinc-700 text-xs font-mono uppercase">
          Start / Restart
        </button>
      </div>
    </GameFrame>
  );
}
