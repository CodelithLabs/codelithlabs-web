'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { Locale } from '@/i18n/request';
import { GameFrame } from '@/components/games/shared/GameFrame';
import { usePseudoLeaderboard } from '@/components/games/shared/usePseudoLeaderboard';
import { useGameAudio } from '@/components/games/shared/useGameAudio';

const GRID = 20;
const CELL = 20;
const SIZE = GRID * CELL;
const BASE_TICK_MS = 150;

type Dir = 'U' | 'D' | 'L' | 'R';
type Point = { x: number; y: number };

function randCell(): Point {
  return { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
}

function initSnake() {
  const cx = Math.floor(GRID / 2);
  const cy = Math.floor(GRID / 2);
  return [{ x: cx, y: cy }, { x: cx - 1, y: cy }];
}

interface SnakeGameProps {
  locale: Locale;
}

export default function SnakeGame({ locale }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snakeRef = useRef<Point[]>(initSnake());
  const dirRef = useRef<Dir>('R');
  const nextDirRef = useRef<Dir>('R');
  const appleRef = useRef<Point>(randCell());
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { muted, beep, toggleMuted } = useGameAudio();

  const [phase, setPhase] = useState<'idle' | 'playing' | 'over'>('idle');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [best, setBest] = useState(() => {
    if (typeof window !== 'undefined') return Number(localStorage.getItem('snake_best') ?? 0);
    return 0;
  });
  const [isNewBest, setIsNewBest] = useState(false);
  const leaderboard = usePseudoLeaderboard('snake', Math.max(score, best));

  const tickMs = Math.max(70, BASE_TICK_MS - (level - 1) * 10);

  const resetGame = useCallback(() => {
    snakeRef.current = initSnake();
    dirRef.current = 'R';
    nextDirRef.current = 'R';
    appleRef.current = randCell();
    setScore(0);
    setLevel(1);
    setIsNewBest(false);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Grid lines (subtle)
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, SIZE); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(SIZE, i * CELL); ctx.stroke();
    }

    // Apple
    const ap = appleRef.current;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(ap.x * CELL + CELL / 2, ap.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Snake
    snakeRef.current.forEach((seg, i) => {
      const alpha = i === 0 ? 1 : 0.85 - (i / snakeRef.current.length) * 0.35;
      ctx.fillStyle = i === 0 ? `rgba(99,222,99,${alpha})` : `rgba(68,180,68,${alpha})`;
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    });
  }, []);

  const tick = useCallback(() => {
    dirRef.current = nextDirRef.current;
    const head = snakeRef.current[0];
    const dir = dirRef.current;
    const next: Point = {
      x: (head.x + (dir === 'R' ? 1 : dir === 'L' ? -1 : 0) + GRID) % GRID,
      y: (head.y + (dir === 'D' ? 1 : dir === 'U' ? -1 : 0) + GRID) % GRID,
    };

    // Self collision
    if (snakeRef.current.some((s) => s.x === next.x && s.y === next.y)) {
      if (tickRef.current) clearInterval(tickRef.current);
      setPhase('over');
      beep(150, 0.12, 'sawtooth');
      setBest((prev) => {
        const newScore = snakeRef.current.length - 2;
        if (newScore > prev) {
          setIsNewBest(true);
          localStorage.setItem('snake_best', String(newScore));
          return newScore;
        }
        return prev;
      });
      return;
    }

    const ateApple = next.x === appleRef.current.x && next.y === appleRef.current.y;
    snakeRef.current = [next, ...snakeRef.current.slice(0, ateApple ? undefined : -1)];

    if (ateApple) {
      setScore((s) => {
        const nextScore = s + 1;
        setLevel(Math.floor(nextScore / 6) + 1);
        return nextScore;
      });
      beep(780, 0.05, 'triangle');
      let newApple: Point;
      do { newApple = randCell(); }
      while (snakeRef.current.some((s) => s.x === newApple.x && s.y === newApple.y));
      appleRef.current = newApple;
    }

    draw();
  }, [beep, draw]);

  const startGame = useCallback(() => {
    resetGame();
    setPhase('playing');
    draw();
  }, [draw, resetGame]);

  const setDirection = useCallback((d: Dir) => {
    const OPPOSITES: Record<Dir, Dir> = { U: 'D', D: 'U', L: 'R', R: 'L' };
    if (d !== OPPOSITES[dirRef.current]) {
      nextDirRef.current = d;
    }
  }, []);

  // Keyboard controls
  useEffect(() => {
    const OPPOSITES: Record<Dir, Dir> = { U: 'D', D: 'U', L: 'R', R: 'L' };
    const MAP: Record<string, Dir> = {
      ArrowUp: 'U', w: 'U', W: 'U',
      ArrowDown: 'D', s: 'D', S: 'D',
      ArrowLeft: 'L', a: 'L', A: 'L',
      ArrowRight: 'R', d: 'R', D: 'R',
    };
    const onKey = (e: KeyboardEvent) => {
      const d = MAP[e.key];
      if (d && d !== OPPOSITES[dirRef.current]) {
        setDirection(d);
        e.preventDefault();
      }
      if (e.key === ' ') {
        if (phase === 'idle' || phase === 'over') startGame();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, setDirection, startGame]);

  // Touch swipe
  useEffect(() => {
    let sx = 0, sy = 0;
    const onStart = (e: TouchEvent) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; };
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      const OPPOSITES: Record<Dir, Dir> = { U: 'D', D: 'U', L: 'R', R: 'L' };
      let d: Dir;
      if (Math.abs(dx) > Math.abs(dy)) d = dx > 0 ? 'R' : 'L';
      else d = dy > 0 ? 'D' : 'U';
      if (d !== OPPOSITES[dirRef.current]) setDirection(d);
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchend', onEnd, { passive: true });
    return () => { window.removeEventListener('touchstart', onStart); window.removeEventListener('touchend', onEnd); };
  }, [setDirection]);

  // Redraw loop when playing
  useEffect(() => {
    if (phase === 'playing') {
      if (tickRef.current) clearInterval(tickRef.current);
      tickRef.current = setInterval(tick, tickMs);
    }
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [phase, tick, tickMs]);

  // Initial draw
  useEffect(() => { draw(); }, [draw]);

  return (
    <GameFrame
      locale={locale}
      title="Snake"
      score={score}
      best={best}
      muted={muted}
      onToggleMuted={toggleMuted}
      controls={`Arrow keys/WASD or swipe/D-pad · space to start · level ${level} · speed ${tickMs}ms`}
      leaderboard={leaderboard}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative" style={{ width: SIZE, height: SIZE }}>
          <canvas
            ref={canvasRef}
            width={SIZE}
            height={SIZE}
            className="block rounded-lg border border-zinc-900 w-full max-w-[400px] h-auto"
          />

          {phase === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 rounded-lg">
              <h1 className="font-mono text-4xl font-black tracking-widest text-white">SNAKE</h1>
              <p className="font-mono text-zinc-500 text-xs tracking-widest text-center px-4">
                LEVELS UNLOCK EVERY 6 APPLES
              </p>
              <button
                onClick={startGame}
                className="px-8 py-3 rounded-lg border border-green-700 bg-green-900/30 text-green-300 font-mono text-sm tracking-widest uppercase hover:bg-green-800/40 transition-colors"
              >
                ▶ Start Game
              </button>
            </div>
          )}

          {phase === 'over' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/85 rounded-lg">
              <h2 className="font-mono text-3xl font-black tracking-widest text-red-400">GAME OVER</h2>
              {isNewBest && (
                <p className="font-mono text-yellow-400 text-sm tracking-widest animate-pulse">★ NEW BEST ★</p>
              )}
              <p className="font-mono text-zinc-400 text-sm">Score: <span className="text-white font-bold">{score}</span></p>
              <p className="font-mono text-zinc-500 text-xs">Reached level {level}</p>
              <button
                onClick={startGame}
                className="mt-2 px-8 py-3 rounded-lg border border-zinc-700 bg-zinc-900/60 text-white font-mono text-sm tracking-widest uppercase hover:border-zinc-500 transition-colors"
              >
                Play Again
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 max-w-[220px] w-full select-none">
          <button className="col-start-2 px-4 py-2 rounded border border-zinc-700 text-xs font-mono" onClick={() => setDirection('U')} aria-label="Move up">↑</button>
          <button className="col-start-1 row-start-2 px-4 py-2 rounded border border-zinc-700 text-xs font-mono" onClick={() => setDirection('L')} aria-label="Move left">←</button>
          <button className="col-start-2 row-start-2 px-4 py-2 rounded border border-zinc-700 text-xs font-mono" onClick={() => setDirection('D')} aria-label="Move down">↓</button>
          <button className="col-start-3 row-start-2 px-4 py-2 rounded border border-zinc-700 text-xs font-mono" onClick={() => setDirection('R')} aria-label="Move right">→</button>
        </div>
      </div>
    </GameFrame>
  );
}
