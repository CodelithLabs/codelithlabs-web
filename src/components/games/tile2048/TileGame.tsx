'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import type { Locale } from '@/i18n/request';
import { GameFrame } from '@/components/games/shared/GameFrame';
import { usePseudoLeaderboard } from '@/components/games/shared/usePseudoLeaderboard';
import { useGameAudio } from '@/components/games/shared/useGameAudio';

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

const LEVEL_TARGETS = [2048, 4096, 8192] as const;

function getMaxTile(board: Board): number {
  let max = 0;
  for (const row of board) {
    for (const tile of row) {
      if (tile && tile > max) max = tile;
    }
  }
  return max;
}

export default function TileGame({ locale }: TileGameProps) {
  const [board, setBoard] = useState<Board>(initBoard);
  const [score, setScore] = useState(0);
  const [levelIndex, setLevelIndex] = useState(0);
  const [best, setBest] = useState(() => {
    if (typeof window !== 'undefined') return Number(localStorage.getItem('tile2048_best') ?? 0);
    return 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [levelCleared, setLevelCleared] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);
  const { muted, beep, toggleMuted } = useGameAudio();
  const level = levelIndex + 1;
  const currentTarget = LEVEL_TARGETS[Math.min(levelIndex, LEVEL_TARGETS.length - 1)];
  const leaderboard = usePseudoLeaderboard(`tile2048-l${level}`, Math.max(score, best));

  const handleMove = useCallback((dir: Dir) => {
    if (gameOver || levelCleared) return;

    let gainedPoints = 0;
    setBoard((prev) => {
      const { board: moved, score: gained, moved: didMove } = move(prev, dir);
      if (!didMove) return prev;

      const withNew = addRandom(moved);
      gainedPoints = gained;

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

      const maxTile = getMaxTile(withNew);
      if (maxTile >= currentTarget) {
        setLevelCleared(true);
      }
      if (isGameOver(withNew)) setGameOver(true);
      return withNew;
    });

    if (gainedPoints > 0) {
      beep(640, 0.04, 'triangle');
    }
  }, [beep, currentTarget, gameOver, levelCleared]);

  const restart = useCallback(() => {
    setBoard(initBoard());
    setScore(0);
    setGameOver(false);
    setLevelIndex(0);
    setLevelCleared(false);
    setIsNewBest(false);
  }, []);

  const continueNextLevel = useCallback(() => {
    setLevelIndex((prev) => Math.min(prev + 1, LEVEL_TARGETS.length - 1));
    setLevelCleared(false);
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
    <GameFrame
      locale={locale}
      title="2048"
      score={score}
      best={best}
      muted={muted}
      onToggleMuted={toggleMuted}
      controls={`Arrow keys/WASD, swipe, or mobile D-pad · level ${level} target ${currentTarget}`}
      leaderboard={leaderboard}
    >
      <div className="flex flex-col items-center gap-4">
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

          <div className="mt-2 text-center font-mono text-xs text-cyan-300">Level {level} · Target {currentTarget}</div>

          {levelCleared && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 rounded-xl">
              <p className="font-mono text-2xl font-black text-yellow-400">LEVEL CLEAR</p>
              {isNewBest && <p className="font-mono text-xs text-yellow-300 animate-pulse tracking-widest">★ NEW BEST ★</p>}
              <div className="flex gap-3">
                <button onClick={continueNextLevel} className="px-5 py-2 rounded-lg border border-yellow-700 bg-yellow-900/30 text-yellow-300 font-mono text-xs tracking-widest uppercase hover:bg-yellow-800/40 transition-colors">
                  Next Target
                </button>
                <button onClick={restart} className="px-5 py-2 rounded-lg border border-zinc-700 bg-zinc-900/60 text-zinc-300 font-mono text-xs tracking-widest uppercase hover:border-zinc-500 transition-colors">
                  New Run
                </button>
              </div>
            </div>
          )}

          {gameOver && (
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

        <div className="grid grid-cols-3 gap-2 max-w-[220px] w-full select-none">
          <button className="col-start-2 px-4 py-2 rounded border border-zinc-700 text-xs font-mono" onClick={() => handleMove('up')} aria-label="Move up">↑</button>
          <button className="col-start-1 row-start-2 px-4 py-2 rounded border border-zinc-700 text-xs font-mono" onClick={() => handleMove('left')} aria-label="Move left">←</button>
          <button className="col-start-2 row-start-2 px-4 py-2 rounded border border-zinc-700 text-xs font-mono" onClick={() => handleMove('down')} aria-label="Move down">↓</button>
          <button className="col-start-3 row-start-2 px-4 py-2 rounded border border-zinc-700 text-xs font-mono" onClick={() => handleMove('right')} aria-label="Move right">→</button>
        </div>

        <button onClick={restart} className="font-mono text-xs text-zinc-600 hover:text-white uppercase tracking-widest transition-colors">
          New Game
        </button>
      </div>
    </GameFrame>
  );
}
