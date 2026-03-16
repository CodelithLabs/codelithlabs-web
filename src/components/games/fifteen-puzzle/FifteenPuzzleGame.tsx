'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Locale } from '@/i18n/request';
import { GameFrame } from '@/components/games/shared/GameFrame';
import { useGameAudio } from '@/components/games/shared/useGameAudio';
import { usePseudoLeaderboard } from '@/components/games/shared/usePseudoLeaderboard';

const SOLVED = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];

function isSolvable(arr: number[]): boolean {
  let inversions = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] && arr[j] && arr[i] > arr[j]) inversions++;
    }
  }
  const blankRowFromBottom = 4 - Math.floor(arr.indexOf(0) / 4);
  return (inversions + blankRowFromBottom) % 2 === 1;
}

function shuffleBoard(): number[] {
  const a = [...SOLVED];
  do {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
  } while (!isSolvable(a) || a.every((v, i) => v === SOLVED[i]));
  return a;
}

function canMove(index: number, blank: number): boolean {
  const r1 = Math.floor(index / 4);
  const c1 = index % 4;
  const r2 = Math.floor(blank / 4);
  const c2 = blank % 4;
  return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
}

interface Props {
  locale: Locale;
}

export default function FifteenPuzzleGame({ locale }: Props) {
  const [tiles, setTiles] = useState<number[]>(() => shuffleBoard());
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [won, setWon] = useState(false);
  const [best, setBest] = useState(() => (typeof window !== 'undefined' ? Number(localStorage.getItem('fifteen_puzzle_best') ?? 0) : 0));
  const { muted, beep, toggleMuted } = useGameAudio();

  const score = Math.max(0, 2200 - moves * 20 - seconds * 4 + (won ? 400 : 0));
  const leaderboard = usePseudoLeaderboard('fifteen-puzzle', score || best);

  useEffect(() => {
    if (won) return;
    const t = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [won]);

  useEffect(() => {
    const complete = tiles.every((v, i) => v === SOLVED[i]);
    if (complete && !won) {
      setWon(true);
      beep(940, 0.14, 'triangle');
      if (score > best) {
        setBest(score);
        if (typeof window !== 'undefined') localStorage.setItem('fifteen_puzzle_best', String(score));
      }
    }
  }, [tiles, won, beep, score, best]);

  const moveTile = (index: number) => {
    if (won) return;
    const blank = tiles.indexOf(0);
    if (!canMove(index, blank)) return;

    setTiles((prev) => {
      const next = [...prev];
      [next[index], next[blank]] = [next[blank], next[index]];
      return next;
    });
    setMoves((m) => m + 1);
    beep(500, 0.03, 'square');
  };

  const reset = () => {
    setTiles(shuffleBoard());
    setMoves(0);
    setSeconds(0);
    setWon(false);
  };

  const status = useMemo(() => (won ? 'Solved!' : 'Arrange numbers from 1 to 15'), [won]);

  return (
    <GameFrame
      locale={locale}
      title="15 Puzzle"
      score={score}
      best={best}
      muted={muted}
      onToggleMuted={toggleMuted}
      controls="Tap a tile next to the empty slot"
      leaderboard={leaderboard}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-2 bg-zinc-900 p-2 rounded-lg w-fit" role="grid" aria-label="15 puzzle board">
          {tiles.map((tile, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => moveTile(idx)}
              className={`w-14 h-14 rounded text-sm font-mono border ${
                tile === 0
                  ? 'bg-zinc-950 border-zinc-800 text-zinc-800'
                  : 'bg-zinc-800 border-zinc-700 text-white hover:border-zinc-500'
              }`}
              aria-label={tile === 0 ? 'Empty slot' : `Tile ${tile}`}
            >
              {tile === 0 ? '' : tile}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="px-3 py-2 rounded border border-zinc-700 text-xs font-mono uppercase"
          >
            Shuffle
          </button>
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">Moves: {moves} · Time: {seconds}s · {status}</p>
        </div>
      </div>
    </GameFrame>
  );
}
