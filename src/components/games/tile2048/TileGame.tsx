'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import type { Locale } from '@/i18n/request';

type Board = (number | null)[][];
type Dir = 'up' | 'down' | 'left' | 'right';

function emptyBoard(): Board {
  return Array.from({ length: 4 }, () => Array(4).fill(null));
}

function addRandom(board: Board): Board {
  const empty: [number, number][] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (!board[r][c]) empty.push([r, c]);
  if (!empty.length) return board;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const next = board.map((row) => [...row]) as Board;
  next[r][c] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

function initBoard(): Board {
  return addRandom(addRandom(emptyBoard()));
}

function slideRow(row: (number | null)[]): { row: (number | null)[]; score: number } {
  const nums = row.filter(Boolean) as number[];
  let score = 0;
  const merged: number[] = [];
  let i = 0;
  while (i < nums.length) {
    if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
      const val = nums[i] * 2;
      merged.push(val);
      score += val;
      i += 2;
    } else {
      merged.push(nums[i]);
      i++;
    }
  }
  while (merged.length < 4) merged.push(0);
  return { row: merged.map((n) => (n === 0 ? null : n)), score };
}

function move(board: Board, dir: Dir): { board: Board; score: number; moved: boolean } {
  let totalScore = 0;
  let moved = false;
  let next = board.map((r) => [...r]) as Board;

  const rotate90 = (b: Board): Board =>
    b[0].map((_, c) => b.map((row) => row[c]).reverse()) as Board;

  const applyHorizontal = (b: Board, reverse: boolean): { board: Board; score: number; moved: boolean } => {
    let sc = 0, mv = false;
    const nb = b.map((row) => {
      const r = reverse ? [...row].reverse() : row;
      const { row: slid, score } = slideRow(r);
      sc += score;
      const out = reverse ? slid.reverse() : slid;
      if (row.some((v, i) => v !== out[i])) mv = true;
      return out;
    }) as Board;
    return { board: nb, score: sc, moved: mv };
  };

  if (dir === 'left') {
    const res = applyHorizontal(next, false);
    next = res.board; totalScore = res.score; moved = res.moved;
  } else if (dir === 'right') {
    const res = applyHorizontal(next, true);
    next = res.board; totalScore = res.score; moved = res.moved;
  } else if (dir === 'up') {
    let rotated = rotate90(next);
    rotated = rotate90(rotated); rotated = rotate90(rotated);
    const res = applyHorizontal(rotated, false);
    next = rotate90(res.board);
    totalScore = res.score; moved = res.moved;
  } else {
    let rotated = rotate90(next);
    rotated = rotate90(rotated); rotated = rotate90(rotated);
    const res = applyHorizontal(rotated, true);
    next = rotate90(res.board);
    totalScore = res.score; moved = res.moved;
  }

  return { board: next, score: totalScore, moved };
}

function isGameOver(board: Board): boolean {
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    if (!board[r][c]) return false;
    if (r < 3 && board[r][c] === board[r + 1][c]) return false;
    if (c < 3 && board[r][c] === board[r][c + 1]) return false;
  }
  return true;
}

function hasWon(board: Board): boolean {
  return board.some((row) => row.some((v) => v !== null && v >= 2048));
}

const TILE_COLORS: Record<number, string> = {
  2: 'bg-zinc-700 text-zinc-100',
  4: 'bg-zinc-600 text-zinc-100',
  8: 'bg-orange-700 text-white',
  16: 'bg-orange-600 text-white',
  32: 'bg-orange-500 text-white',
  64: 'bg-orange-400 text-white',
  128: 'bg-yellow-500 text-white',
  256: 'bg-yellow-400 text-white',
  512: 'bg-yellow-300 text-zinc-900',
  1024: 'bg-yellow-200 text-zinc-900',
  2048: 'bg-yellow-100 text-zinc-900 ring-2 ring-yellow-400',
};

function tileClass(val: number | null): string {
  if (!val) return 'bg-zinc-900 border border-zinc-800';
  return TILE_COLORS[val] ?? 'bg-blue-400 text-white';
}

interface TileGameProps {
  locale: Locale;
}

export default function TileGame({ locale }: TileGameProps) {
  const [board, setBoard] = useState<Board>(initBoard);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    if (typeof window !== 'undefined') return Number(localStorage.getItem('tile2048_best') ?? 0);
    return 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [keepGoing, setKeepGoing] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);

  const handleMove = useCallback((dir: Dir) => {
    if (gameOver || (won && !keepGoing)) return;
    setBoard((prev) => {
      const { board: moved, score: gained, moved: didMove } = move(prev, dir);
      if (!didMove) return prev;

      const withNew = addRandom(moved);

      setScore((s) => {
        const next = s + gained;
        setBest((b) => {
          if (next > b) {
            setIsNewBest(true);
            localStorage.setItem('tile2048_best', String(next));
            return next;
          }
          return b;
        });
        return next;
      });

      if (!keepGoing && hasWon(withNew)) setWon(true);
      if (isGameOver(withNew)) setGameOver(true);
      return withNew;
    });
  }, [gameOver, won, keepGoing]);

  const restart = useCallback(() => {
    setBoard(initBoard());
    setScore(0);
    setGameOver(false);
    setWon(false);
    setKeepGoing(false);
    setIsNewBest(false);
  }, []);

  // Keyboard
  useEffect(() => {
    const MAP: Record<string, Dir> = {
      ArrowUp: 'up', w: 'up', W: 'up',
      ArrowDown: 'down', s: 'down', S: 'down',
      ArrowLeft: 'left', a: 'left', A: 'left',
      ArrowRight: 'right', d: 'right', D: 'right',
    };
    const onKey = (e: KeyboardEvent) => {
      const d = MAP[e.key];
      if (d) { handleMove(d); e.preventDefault(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleMove]);

  // Touch swipe
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const onStart = (e: TouchEvent) => { touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
    const onEnd = (e: TouchEvent) => {
      if (!touchRef.current) return;
      const dx = e.changedTouches[0].clientX - touchRef.current.x;
      const dy = e.changedTouches[0].clientY - touchRef.current.y;
      if (Math.abs(dx) > Math.abs(dy)) handleMove(dx > 0 ? 'right' : 'left');
      else handleMove(dy > 0 ? 'down' : 'up');
      touchRef.current = null;
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchend', onEnd, { passive: true });
    return () => { window.removeEventListener('touchstart', onStart); window.removeEventListener('touchend', onEnd); };
  }, [handleMove]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-zinc-900 px-6 py-3 flex items-center justify-between">
        <Link href={`/${locale}/games`} className="text-zinc-600 hover:text-white font-mono text-xs tracking-widest uppercase transition-colors">
          ← Games
        </Link>
        <div className="flex items-center gap-6 font-mono text-xs text-zinc-500">
          <span>SCORE <span className="text-white font-bold">{score}</span></span>
          <span>BEST <span className="text-yellow-400 font-bold">{best}</span></span>
        </div>
        <button onClick={restart} className="font-mono text-xs text-zinc-600 hover:text-white uppercase tracking-widest transition-colors">
          New Game
        </button>
      </div>

      {/* Board */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative">
          <div className="grid grid-cols-4 gap-2 p-3 bg-zinc-950 rounded-xl border border-zinc-900 select-none" style={{ width: 320 }}>
            {board.flat().map((val, i) => (
              <div
                key={i}
                className={`flex items-center justify-center rounded-lg font-mono font-black transition-all duration-100 ${tileClass(val)}`}
                style={{ width: 70, height: 70, fontSize: val && val >= 1024 ? 18 : val && val >= 128 ? 22 : 28 }}
              >
                {val ?? ''}
              </div>
            ))}
          </div>

          {/* Won overlay */}
          {won && !keepGoing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 rounded-xl">
              <p className="font-mono text-3xl font-black text-yellow-400">YOU WIN!</p>
              {isNewBest && <p className="font-mono text-xs text-yellow-300 animate-pulse tracking-widest">★ NEW BEST ★</p>}
              <div className="flex gap-3">
                <button onClick={() => setKeepGoing(true)} className="px-5 py-2 rounded-lg border border-yellow-700 bg-yellow-900/30 text-yellow-300 font-mono text-xs tracking-widest uppercase hover:bg-yellow-800/40 transition-colors">
                  Keep Going
                </button>
                <button onClick={restart} className="px-5 py-2 rounded-lg border border-zinc-700 bg-zinc-900/60 text-zinc-300 font-mono text-xs tracking-widest uppercase hover:border-zinc-500 transition-colors">
                  New Game
                </button>
              </div>
            </div>
          )}

          {/* Game over overlay */}
          {gameOver && !won && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/85 rounded-xl">
              <p className="font-mono text-3xl font-black text-red-400">GAME OVER</p>
              {isNewBest && <p className="font-mono text-xs text-yellow-300 animate-pulse tracking-widest">★ NEW BEST ★</p>}
              <p className="font-mono text-zinc-400 text-sm">Score: <span className="text-white font-bold">{score}</span></p>
              <button onClick={restart} className="px-8 py-3 rounded-lg border border-zinc-700 bg-zinc-900/60 text-white font-mono text-sm tracking-widest uppercase hover:border-zinc-500 transition-colors">
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Controls hint */}
      <div className="border-t border-zinc-900 px-6 py-3 flex justify-center">
        <p className="font-mono text-zinc-700 text-[10px] tracking-widest text-center">
          ARROW KEYS / WASD — SLIDE &nbsp;·&nbsp; SWIPE ON MOBILE
        </p>
      </div>
    </div>
  );
}
