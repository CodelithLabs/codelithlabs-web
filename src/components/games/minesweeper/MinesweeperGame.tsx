'use client';

import { useMemo, useState } from 'react';
import type { Locale } from '@/i18n/request';
import { GameFrame } from '@/components/games/shared/GameFrame';
import { usePseudoLeaderboard } from '@/components/games/shared/usePseudoLeaderboard';
import { useGameAudio } from '@/components/games/shared/useGameAudio';

type Cell = { mine: boolean; revealed: boolean; flagged: boolean; count: number };
const SIZE = 9;
const MINES = 10;

function buildBoard(): Cell[][] {
  const board: Cell[][] = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => ({ mine: false, revealed: false, flagged: false, count: 0 })),
  );

  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * SIZE);
    const c = Math.floor(Math.random() * SIZE);
    if (!board[r][c].mine) {
      board[r][c].mine = true;
      placed++;
    }
  }

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c].mine) continue;
      let n = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc].mine) n++;
        }
      }
      board[r][c].count = n;
    }
  }

  return board;
}

interface Props { locale: Locale }

export default function MinesweeperGame({ locale }: Props) {
  const [board, setBoard] = useState<Cell[][]>(() => buildBoard());
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);
  const [best, setBest] = useState(() => (typeof window !== 'undefined' ? Number(localStorage.getItem('minesweeper_best') ?? 0) : 0));
  const { muted, beep, toggleMuted } = useGameAudio();

  const revealed = board.flat().filter((c) => c.revealed).length;
  const score = Math.max(0, revealed * 20 - board.flat().filter((c) => c.flagged).length * 2);
  const leaderboard = usePseudoLeaderboard('minesweeper', score);

  const open = (r: number, c: number) => {
    if (over || won) return;
    const next = board.map((row) => row.map((cell) => ({ ...cell })));
    const cell = next[r][c];
    if (cell.revealed || cell.flagged) return;

    if (cell.mine) {
      cell.revealed = true;
      setBoard(next);
      setOver(true);
      beep(120, 0.2, 'sawtooth');
      return;
    }

    const flood = (rr: number, cc: number) => {
      if (rr < 0 || cc < 0 || rr >= SIZE || cc >= SIZE) return;
      const cur = next[rr][cc];
      if (cur.revealed || cur.flagged || cur.mine) return;
      cur.revealed = true;
      if (cur.count === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) flood(rr + dr, cc + dc);
        }
      }
    };

    flood(r, c);
    beep(640, 0.03, 'triangle');

    const safeRevealed = next.flat().filter((x) => x.revealed && !x.mine).length;
    if (safeRevealed === SIZE * SIZE - MINES) {
      setWon(true);
      const ns = Math.max(0, safeRevealed * 20);
      if (ns > best) {
        setBest(ns);
        if (typeof window !== 'undefined') localStorage.setItem('minesweeper_best', String(ns));
      }
      beep(900, 0.1, 'sine');
    }

    setBoard(next);
  };

  const flag = (r: number, c: number) => {
    const next = board.map((row) => row.map((cell) => ({ ...cell })));
    const cell = next[r][c];
    if (!cell.revealed) {
      cell.flagged = !cell.flagged;
      beep(500, 0.02, 'square');
      setBoard(next);
    }
  };

  const reset = () => {
    setBoard(buildBoard());
    setOver(false);
    setWon(false);
  };

  return (
    <GameFrame
      locale={locale}
      title="Minesweeper"
      score={score}
      best={best}
      muted={muted}
      onToggleMuted={toggleMuted}
      controls="Tap to reveal · Long press/right click to flag"
      leaderboard={leaderboard}
    >
      <div className="grid grid-cols-9 gap-1 max-w-[420px]" role="grid" aria-label="Minesweeper board">
        {board.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => open(r, c)}
              onContextMenu={(e) => {
                e.preventDefault();
                flag(r, c);
              }}
              className={`aspect-square rounded text-xs font-bold border ${cell.revealed ? 'bg-zinc-900 border-zinc-700 text-zinc-100' : 'bg-zinc-800 border-zinc-800 hover:border-zinc-600'} `}
              aria-label={`Cell ${r + 1},${c + 1}`}
            >
              {cell.revealed ? (cell.mine ? '💣' : cell.count || '') : cell.flagged ? '🚩' : ''}
            </button>
          )),
        )}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button onClick={reset} className="px-3 py-2 rounded border border-zinc-700 text-xs font-mono uppercase">New Board</button>
        {over && <span className="text-red-400 text-sm font-mono">Boom! Game over.</span>}
        {won && <span className="text-emerald-400 text-sm font-mono">Clear! You won.</span>}
      </div>
    </GameFrame>
  );
}
