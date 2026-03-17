'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Locale } from '@/i18n/request';
import { GameFrame } from '@/components/games/shared/GameFrame';
import { useGameAudio } from '@/components/games/shared/useGameAudio';
import { usePseudoLeaderboard } from '@/components/games/shared/usePseudoLeaderboard';

const PUZZLE = [
  [0, 0, 0, 2, 6, 0, 7, 0, 1],
  [6, 8, 0, 0, 7, 0, 0, 9, 0],
  [1, 9, 0, 0, 0, 4, 5, 0, 0],
  [8, 2, 0, 1, 0, 0, 0, 4, 0],
  [0, 0, 4, 6, 0, 2, 9, 0, 0],
  [0, 5, 0, 0, 0, 3, 0, 2, 8],
  [0, 0, 9, 3, 0, 0, 0, 7, 4],
  [0, 4, 0, 0, 5, 0, 0, 3, 6],
  [7, 0, 3, 0, 1, 8, 0, 0, 0],
];

const SOLUTION = [
  [4, 3, 5, 2, 6, 9, 7, 8, 1],
  [6, 8, 2, 5, 7, 1, 4, 9, 3],
  [1, 9, 7, 8, 3, 4, 5, 6, 2],
  [8, 2, 6, 1, 9, 5, 3, 4, 7],
  [3, 7, 4, 6, 8, 2, 9, 1, 5],
  [9, 5, 1, 7, 4, 3, 6, 2, 8],
  [5, 1, 9, 3, 2, 6, 8, 7, 4],
  [2, 4, 8, 9, 5, 7, 1, 3, 6],
  [7, 6, 3, 4, 1, 8, 2, 5, 9],
];

interface Props {
  locale: Locale;
}

export default function SudokuGame({ locale }: Props) {
  const [grid, setGrid] = useState<number[][]>(() => PUZZLE.map((row) => [...row]));
  const [selected, setSelected] = useState<{ r: number; c: number } | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [won, setWon] = useState(false);
  const [best, setBest] = useState(() => (typeof window !== 'undefined' ? Number(localStorage.getItem('sudoku_best') ?? 0) : 0));
  const { muted, beep, toggleMuted } = useGameAudio();

  const solvedCount = useMemo(() => grid.flat().filter((n) => n !== 0).length, [grid]);
  const score = Math.max(0, solvedCount * 10 - mistakes * 5 + (won ? 300 : 0));
  const leaderboard = usePseudoLeaderboard('sudoku', score || best);

  const writeCell = (value: number) => {
    if (!selected || won) return;
    const { r, c } = selected;
    if (PUZZLE[r][c] !== 0) return;

    let solvedAfterWrite = false;
    setGrid((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = value;
      solvedAfterWrite = next.every((row, rr) => row.every((n, cc) => n === SOLUTION[rr][cc]));
      return next;
    });

    if (value === 0) return;
    if (value === SOLUTION[r][c]) {
      beep(680, 0.05, 'sine');
      if (solvedAfterWrite) {
        setWon(true);
        beep(980, 0.12, 'triangle');
        setBest((prev) => {
          const solvedCountAfter = solvedCount + 1;
          const nextScore = Math.max(0, solvedCountAfter * 10 - mistakes * 5 + 300);
          if (nextScore > prev) {
            if (typeof window !== 'undefined') localStorage.setItem('sudoku_best', String(nextScore));
            return nextScore;
          }
          return prev;
        });
      }
    } else {
      setMistakes((m) => m + 1);
      beep(180, 0.12, 'sawtooth');
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!selected) return;
      if (e.key >= '1' && e.key <= '9') {
        writeCell(Number(e.key));
      }
      if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        writeCell(0);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const restart = () => {
    setGrid(PUZZLE.map((row) => [...row]));
    setMistakes(0);
    setWon(false);
    setSelected(null);
  };

  return (
    <GameFrame
      locale={locale}
      title="Sudoku"
      score={score}
      best={best}
      muted={muted}
      onToggleMuted={toggleMuted}
      controls="Click a cell, then press 1-9 · Backspace clears · Mobile: use keypad"
      leaderboard={leaderboard}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-9 gap-[2px] bg-zinc-900 p-2 rounded-lg w-fit" role="grid" aria-label="Sudoku grid">
          {grid.flatMap((row, r) =>
            row.map((value, c) => {
              const fixed = PUZZLE[r][c] !== 0;
              const isSelected = selected?.r === r && selected?.c === c;
              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  onClick={() => setSelected({ r, c })}
                  className={`w-9 h-9 text-sm font-mono rounded-sm border ${
                    isSelected ? 'border-cyan-400 bg-cyan-950/40' : 'border-zinc-800 bg-zinc-950'
                  } ${fixed ? 'text-zinc-400' : 'text-white'}`}
                  aria-label={`Row ${r + 1} column ${c + 1}`}
                >
                  {value || ''}
                </button>
              );
            }),
          )}
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 max-w-md">
          {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => writeCell(n)}
              className="px-2 py-2 rounded border border-zinc-700 text-xs font-mono hover:border-zinc-500"
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => writeCell(0)}
            className="px-2 py-2 rounded border border-zinc-700 text-xs font-mono col-span-2"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={restart}
            className="px-2 py-2 rounded border border-zinc-700 text-xs font-mono col-span-3"
          >
            Restart
          </button>
        </div>

        <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
          Filled: {solvedCount}/81 · Mistakes: {mistakes} {won ? '· Solved!' : ''}
        </p>
      </div>
    </GameFrame>
  );
}
