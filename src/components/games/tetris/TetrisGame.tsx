'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Locale } from '@/i18n/request';
import { GameFrame } from '@/components/games/shared/GameFrame';
import { usePseudoLeaderboard } from '@/components/games/shared/usePseudoLeaderboard';
import { useGameAudio } from '@/components/games/shared/useGameAudio';
import { createPerfStatsTracker, getOrCreatePerfSessionTag } from '@/components/games/shared/perfStats';

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

  const boardRef = useRef(board);
  const pieceRef = useRef(piece);
  const scoreRef = useRef(score);
  const bestRef = useRef(best);
  const overRef = useRef(over);
  const perfSessionTagRef = useRef('');

  useEffect(() => {
    boardRef.current = board;
  }, [board]);

  useEffect(() => {
    pieceRef.current = piece;
  }, [piece]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    bestRef.current = best;
  }, [best]);

  useEffect(() => {
    overRef.current = over;
  }, [over]);

  const leaderboard = usePseudoLeaderboard('tetris', score || best);

  const spawn = useCallback((nextBoard: Cell[][], nextScore: number) => {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const np = { x: Math.floor((W - shape[0].length) / 2), y: 0, shape };
    if (collides(nextBoard, np)) {
      setOver(true);
      overRef.current = true;
      if (nextScore > bestRef.current) {
        bestRef.current = nextScore;
        setBest(nextScore);
        if (typeof window !== 'undefined') localStorage.setItem('tetris_best', String(nextScore));
      }
    }
    pieceRef.current = np;
    setPiece(np);
  }, []);

  const merge = useCallback(() => {
    const boardNow = boardRef.current;
    const pieceNow = pieceRef.current;
    const next = boardNow.map((r) => [...r]) as Cell[][];
    pieceNow.shape.forEach((row, ry) => row.forEach((v, rx) => {
      if (v) {
        const yy = pieceNow.y + ry;
        if (yy >= 0) next[yy][pieceNow.x + rx] = 1;
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

    const nextScore = scoreRef.current + cleared * 120;
    if (cleared > 0) {
      scoreRef.current = nextScore;
      setScore(nextScore);
      if (nextScore > bestRef.current) {
        bestRef.current = nextScore;
        setBest(nextScore);
        if (typeof window !== 'undefined') localStorage.setItem('tetris_best', String(nextScore));
      }
      beep(860, 0.08, 'triangle');
    }

    boardRef.current = next;
    setBoard(next);
    spawn(next, nextScore);
  }, [beep, spawn]);

  useEffect(() => {
    const perfEnabled = process.env.NODE_ENV !== 'production';
    if (!perfSessionTagRef.current) {
      perfSessionTagRef.current = getOrCreatePerfSessionTag();
    }
    const perf = createPerfStatsTracker('[Perf][Tetris] ', 30, perfEnabled, perfSessionTagRef.current);
    let lastTick = performance.now();

    const t = window.setInterval(() => {
      if (perfEnabled) {
        const now = performance.now();
        const dtMs = now - lastTick;
        lastTick = now;
        perf.sample(dtMs);
      }

      if (overRef.current) return;
      setPiece((p) => {
        pieceRef.current = p;
        const np = { ...p, y: p.y + 1 };
        if (collides(boardRef.current, np)) {
          merge();
          return p;
        }
        pieceRef.current = np;
        return np;
      });
    }, 550);
    return () => {
      clearInterval(t);
      perf.flush();
    };
  }, [merge]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (overRef.current) return;
      if (e.key === 'ArrowLeft') {
        setPiece((p) => {
          const np = { ...p, x: p.x - 1 };
          const nextPiece = collides(boardRef.current, np) ? p : np;
          pieceRef.current = nextPiece;
          return nextPiece;
        });
      }
      if (e.key === 'ArrowRight') {
        setPiece((p) => {
          const np = { ...p, x: p.x + 1 };
          const nextPiece = collides(boardRef.current, np) ? p : np;
          pieceRef.current = nextPiece;
          return nextPiece;
        });
      }
      if (e.key === 'ArrowDown') {
        setPiece((p) => {
          const np = { ...p, y: p.y + 1 };
          const nextPiece = collides(boardRef.current, np) ? p : np;
          pieceRef.current = nextPiece;
          return nextPiece;
        });
      }
      if (e.key === 'ArrowUp') {
        setPiece((p) => {
          const rp = { ...p, shape: rotate(p.shape) };
          const nextPiece = collides(boardRef.current, rp) ? p : rp;
          pieceRef.current = nextPiece;
          return nextPiece;
        });
        beep(540, 0.03, 'square');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [beep]);

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
    boardRef.current = empty();
    setScore(0);
    scoreRef.current = 0;
    setOver(false);
    overRef.current = false;
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const nextPiece = { x: 3, y: 0, shape };
    pieceRef.current = nextPiece;
    setPiece(nextPiece);
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
