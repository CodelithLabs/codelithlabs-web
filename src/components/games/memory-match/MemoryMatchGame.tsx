'use client';

import { useMemo, useState } from 'react';
import type { Locale } from '@/i18n/request';
import { GameFrame } from '@/components/games/shared/GameFrame';
import { usePseudoLeaderboard } from '@/components/games/shared/usePseudoLeaderboard';
import { useGameAudio } from '@/components/games/shared/useGameAudio';

const ICONS = ['🎯', '🚀', '⚡', '🧠', '🎮', '🔥', '🌙', '💎'];

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

interface MemoryMatchProps {
  locale: Locale;
}

export default function MemoryMatchGame({ locale }: MemoryMatchProps) {
  const deck = useMemo(() => shuffle([...ICONS, ...ICONS]), []);
  const [cards, setCards] = useState(deck);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [best, setBest] = useState(() => (typeof window !== 'undefined' ? Number(localStorage.getItem('memory_match_best') ?? 0) : 0));
  const { muted, beep, toggleMuted } = useGameAudio();

  const score = Math.max(0, matched.length * 100 - moves * 5);
  const leaderboard = usePseudoLeaderboard('memory-match', score);

  const reset = () => {
    setCards(shuffle([...ICONS, ...ICONS]));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  const onCard = (idx: number) => {
    if (flipped.includes(idx) || matched.includes(idx) || flipped.length === 2) return;
    beep(560, 0.04, 'triangle');
    const next = [...flipped, idx];
    setFlipped(next);

    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next;
      if (cards[a] === cards[b]) {
        setMatched((prev) => {
          const nm = [...prev, a, b];
          const newScore = Math.max(0, nm.length * 100 - (moves + 1) * 5);
          if (newScore > best) {
            setBest(newScore);
            if (typeof window !== 'undefined') localStorage.setItem('memory_match_best', String(newScore));
          }
          beep(880, 0.08, 'sine');
          return nm;
        });
        setFlipped([]);
      } else {
        beep(220, 0.07, 'sawtooth');
        window.setTimeout(() => setFlipped([]), 700);
      }
    }
  };

  const done = matched.length === cards.length;

  return (
    <GameFrame
      locale={locale}
      title="Memory Match"
      score={score}
      best={best}
      muted={muted}
      onToggleMuted={toggleMuted}
      controls="Tap cards to reveal pairs · Keyboard/Screen-reader friendly buttons"
      leaderboard={leaderboard}
    >
      <div className="grid grid-cols-4 gap-2 sm:gap-3" role="grid" aria-label="Memory match board">
        {cards.map((icon, idx) => {
          const faceUp = flipped.includes(idx) || matched.includes(idx);
          return (
            <button
              key={`${icon}-${idx}`}
              onClick={() => onCard(idx)}
              className={`aspect-square rounded-lg border text-2xl sm:text-3xl transition-all ${faceUp ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-800 border-zinc-800 hover:border-zinc-600'}`}
              aria-label={faceUp ? `Card ${icon}` : 'Hidden card'}
            >
              {faceUp ? icon : '❓'}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex gap-3">
        <button onClick={reset} className="px-3 py-2 rounded border border-zinc-700 text-sm font-mono uppercase">New Game</button>
        <p className="text-zinc-400 text-sm font-mono">Moves: {moves}</p>
        {done && <p className="text-emerald-400 text-sm font-mono">All pairs matched!</p>}
      </div>
    </GameFrame>
  );
}
