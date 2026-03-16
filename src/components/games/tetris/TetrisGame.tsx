'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Locale } from '@/i18n/request';
import { GameFrame } from '@/components/games/shared/GameFrame';
import { usePseudoLeaderboard } from '@/components/games/shared/usePseudoLeaderboard';
import { useGameAudio } from '@/components/games/shared/useGameAudio';

const W = 10;
const H = 20;

type Cell = 0 | 1;

type Piece = { x: number; y: number; shape: number[][] };

const SHAPES = [
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]],
  [[0, 1, 0], [1, 1, 1]],
  [[1, 1, 0], [0, 1, 1]],
  [[0, 1, 1], [1, 1, 0]],
];

const empty = (): Cell[][] => Array.from({ length: H }, () => Array.from({ length: W }, () => 0));

function rotate(shape: number[][]) {
  return shape[0].map((_, i) => shape.map((r) => r[i]).reverse());
}

function collides(board: Cell[][], piece: Piece) {
  return piece.shape.some((row, ry) =>
    row.some((v, rx) => {
      if (!v) return false;
      const x = piece.x + rx;
      const y = piece.y + ry;
      return x < 0 || x >= W || y >= H || (y >= 0 && board[y][x] === 1);
    }),
  );
}

interface Props { locale: Locale }

export default function TetrisGame({ locale }: Props) {
  const [board, setBoard] = useState<Cell[][]>(() => empty());
  const [piece, setPiece] = useState<Piece>({ x: 3, y: 0, shape: SHAPES[0] });
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => (typeof window !== 'undefined' ? Number(localStorage.getItem('tetris_best') ?? 0) : 0));
  const [over, setOver] = useState(false);
  const { muted, beep, toggleMuted } = useGameAudio();

  const leaderboard = usePseudoLeaderboard('tetris', score || best);

  const spawn = () => {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const np = { x: Math.floor((W - shape[0].length) / 2), y: 0, shape };
    if (collides(board, np)) {
      setOver(true);
      if (score > best) {
        setBest(score);
        if (typeof window !== 'undefined') localStorage.setItem('tetris_best', String(score));
      }
    }
    setPiece(np);
  };

  const merge = () => {
    const next = board.map((r) => [...r]) as Cell[][];
    piece.shape.forEach((row, ry) => row.forEach((v, rx) => {
      if (v) {
        const yy = piece.y + ry;
        if (yy >= 0) next[yy][piece.x + rx] = 1;
      }
    }));

    let cleared = 0;
    for (let y = H - 1; y >= 0; y--) {
      if (next[y].every((c) => c === 1)) {
        next.splice(y, 1);
        next.unshift(Array.from({ length: W }, () => 0));
        cleared++;
        y++;
      }
    }

    if (cleared > 0) {
      setScore((s) => s + cleared * 120);
      beep(860, 0.08, 'triangle');
    }

    setBoard(next);
    spawn();
  };

  useEffect(() => {
    if (over) return;
    const t = window.setInterval(() => {
      setPiece((p) => {
        const np = { ...p, y: p.y + 1 };
        if (collides(board, np)) {
          merge();
          return p;
        }
        return np;
      });
    }, 550);
    return () => clearInterval(t);
  }, [board, over]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (over) return;
      if (e.key === 'ArrowLeft') setPiece((p) => (collides(board, { ...p, x: p.x - 1 }) ? p : { ...p, x: p.x - 1 }));
      if (e.key === 'ArrowRight') setPiece((p) => (collides(board, { ...p, x: p.x + 1 }) ? p : { ...p, x: p.x + 1 }));
      if (e.key === 'ArrowDown') setPiece((p) => (collides(board, { ...p, y: p.y + 1 }) ? p : { ...p, y: p.y + 1 }));
      if (e.key === 'ArrowUp') {
        setPiece((p) => {
          const rp = { ...p, shape: rotate(p.shape) };
          return collides(board, rp) ? p : rp;
        });
        beep(540, 0.03, 'square');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [board, over, beep]);

  const cells = useMemo(() => {
    const temp = board.map((r) => [...r]) as Cell[][];
    piece.shape.forEach((row, ry) => row.forEach((v, rx) => {
      const y = piece.y + ry;
      const x = piece.x + rx;
      if (v && y >= 0 && y < H && x >= 0 && x < W) temp[y][x] = 1;
    }));
    return temp;
  }, [board, piece]);

  const restart = () => {
    setBoard(empty());
    setScore(0);
    setOver(false);
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    setPiece({ x: 3, y: 0, shape });
  };

  return (
    <GameFrame
      locale={locale}
      title="Tetris"
      score={score}
      best={best}
      muted={muted}
      onToggleMuted={toggleMuted}
      controls="Arrow keys: move/rotate · Mobile: use on-screen buttons"
      leaderboard={leaderboard}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="grid grid-cols-10 gap-[2px] bg-zinc-900 p-2 rounded w-fit" role="img" aria-label="Tetris board">
          {cells.flatMap((row, y) => row.map((v, x) => (
            <div key={`${x}-${y}`} className={`w-5 h-5 ${v ? 'bg-cyan-400' : 'bg-zinc-800'}`} />
          )))}
        </div>
        <div className="grid grid-cols-3 gap-2 w-40">
          <button onClick={() => setPiece((p) => (collides(board, { ...p, x: p.x - 1 }) ? p : { ...p, x: p.x - 1 }))} className="px-2 py-2 border border-zinc-700 rounded text-xs">◀</button>
          <button onClick={() => setPiece((p) => { const rp = { ...p, shape: rotate(p.shape) }; return collides(board, rp) ? p : rp; })} className="px-2 py-2 border border-zinc-700 rounded text-xs">⟳</button>
          <button onClick={() => setPiece((p) => (collides(board, { ...p, x: p.x + 1 }) ? p : { ...p, x: p.x + 1 }))} className="px-2 py-2 border border-zinc-700 rounded text-xs">▶</button>
          <button onClick={() => setPiece((p) => (collides(board, { ...p, y: p.y + 1 }) ? p : { ...p, y: p.y + 1 }))} className="col-span-3 px-2 py-2 border border-zinc-700 rounded text-xs">▼ Soft Drop</button>
          <button onClick={restart} className="col-span-3 px-2 py-2 border border-zinc-700 rounded text-xs font-mono uppercase">Restart</button>
          {over && <p className="col-span-3 text-red-400 text-xs font-mono uppercase">Game Over</p>}
        </div>
      </div>
    </GameFrame>
  );
}
