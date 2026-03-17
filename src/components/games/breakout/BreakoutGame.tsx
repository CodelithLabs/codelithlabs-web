'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Locale } from '@/i18n/request';
import { GameFrame } from '@/components/games/shared/GameFrame';
import { useGameAudio } from '@/components/games/shared/useGameAudio';
import { usePseudoLeaderboard } from '@/components/games/shared/usePseudoLeaderboard';

const BOARD_W = 320;
const BOARD_H = 420;
const PADDLE_W = 64;
const PADDLE_H = 10;
const BALL = 8;
const BRICK_COLS = 8;
const BRICK_ROWS = 5;
const BRICK_W = 34;
const BRICK_H = 14;

type Brick = { x: number; y: number; alive: boolean };

function createBricks(): Brick[] {
  return Array.from({ length: BRICK_ROWS * BRICK_COLS }, (_, i) => {
    const r = Math.floor(i / BRICK_COLS);
    const c = i % BRICK_COLS;
    return {
      x: 12 + c * (BRICK_W + 4),
      y: 40 + r * (BRICK_H + 6),
      alive: true,
    };
  });
}

interface Props {
  locale: Locale;
}

export default function BreakoutGame({ locale }: Props) {
  const [paddleX, setPaddleX] = useState(BOARD_W / 2 - PADDLE_W / 2);
  const [ball, setBall] = useState({ x: BOARD_W / 2, y: 300, vx: 2.5, vy: -2.5 });
  const [bricks, setBricks] = useState<Brick[]>(() => createBricks());
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [best, setBest] = useState(() => (typeof window !== 'undefined' ? Number(localStorage.getItem('breakout_best') ?? 0) : 0));
  const [running, setRunning] = useState(true);
  const { muted, beep, toggleMuted } = useGameAudio();

  const leaderboard = usePseudoLeaderboard('breakout', score || best);
  const cleared = useMemo(() => bricks.every((b) => !b.alive), [bricks]);

  useEffect(() => {
    if (!running) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setPaddleX((x) => Math.max(0, x - 22));
      if (e.key === 'ArrowRight') setPaddleX((x) => Math.min(BOARD_W - PADDLE_W, x + 22));
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [running]);

  useEffect(() => {
    if (!running || lives <= 0 || cleared) return;

    const t = window.setInterval(() => {
      setBall((prev) => {
        let nextX = prev.x + prev.vx;
        let nextY = prev.y + prev.vy;
        let nextVx = prev.vx;
        let nextVy = prev.vy;

        if (nextX <= 0 || nextX >= BOARD_W - BALL) {
          nextVx *= -1;
          beep(320, 0.02, 'square');
        }
        if (nextY <= 0) {
          nextVy *= -1;
          beep(320, 0.02, 'square');
        }

        const paddleY = BOARD_H - 26;
        const hitsPaddle =
          nextY + BALL >= paddleY &&
          nextY <= paddleY + PADDLE_H &&
          nextX + BALL >= paddleX &&
          nextX <= paddleX + PADDLE_W;

        if (hitsPaddle) {
          nextVy = -Math.abs(nextVy);
          const hitPos = (nextX - paddleX) / PADDLE_W - 0.5;
          nextVx += hitPos * 1.3;
          beep(500, 0.04, 'triangle');
        }

        setBricks((old) => {
          let collision = false;
          const updated = old.map((brick) => {
            if (!brick.alive) return brick;
            const overlap =
              nextX + BALL >= brick.x &&
              nextX <= brick.x + BRICK_W &&
              nextY + BALL >= brick.y &&
              nextY <= brick.y + BRICK_H;
            if (overlap) {
              collision = true;
              setScore((s) => {
                const nextScore = s + 15;
                setBest((prev) => {
                  if (nextScore > prev) {
                    if (typeof window !== 'undefined') localStorage.setItem('breakout_best', String(nextScore));
                    return nextScore;
                  }
                  return prev;
                });
                return nextScore;
              });
              beep(740, 0.03, 'sine');
              return { ...brick, alive: false };
            }
            return brick;
          });

          if (collision) {
            nextVy *= -1;
          }
          return updated;
        });

        if (nextY > BOARD_H) {
          setLives((l) => l - 1);
          beep(160, 0.11, 'sawtooth');
          return { x: BOARD_W / 2, y: 300, vx: 2.5, vy: -2.5 };
        }

        return { x: nextX, y: nextY, vx: nextVx, vy: nextVy };
      });
    }, 16);

    return () => clearInterval(t);
  }, [running, paddleX, lives, cleared, beep]);

  const reset = () => {
    setPaddleX(BOARD_W / 2 - PADDLE_W / 2);
    setBall({ x: BOARD_W / 2, y: 300, vx: 2.5, vy: -2.5 });
    setBricks(createBricks());
    setScore(0);
    setLives(3);
    setRunning(true);
  };

  return (
    <GameFrame
      locale={locale}
      title="Breakout"
      score={score}
      best={best}
      muted={muted}
      onToggleMuted={toggleMuted}
      controls="Arrow keys or touch buttons to move paddle"
      leaderboard={leaderboard}
    >
      <div className="space-y-4">
        <div className="relative rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden" style={{ width: BOARD_W, height: BOARD_H }}>
          {bricks.map((b, i) =>
            b.alive ? (
              <div
                key={i}
                className="absolute bg-cyan-500/90 rounded-sm"
                style={{ left: b.x, top: b.y, width: BRICK_W, height: BRICK_H }}
              />
            ) : null,
          )}

          <div className="absolute bg-white rounded" style={{ left: paddleX, top: BOARD_H - 26, width: PADDLE_W, height: PADDLE_H }} />
          <div className="absolute rounded-full bg-emerald-400" style={{ left: ball.x, top: ball.y, width: BALL, height: BALL }} />

          {(lives <= 0 || cleared) && (
            <div className="absolute inset-0 bg-black/70 grid place-items-center">
              <p className="font-mono text-xs uppercase tracking-widest text-zinc-200">{cleared ? 'Level cleared!' : 'Game over'}</p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={() => setPaddleX((x) => Math.max(0, x - 28))} className="px-3 py-2 rounded border border-zinc-700 text-xs">◀</button>
          <button type="button" onClick={() => setPaddleX((x) => Math.min(BOARD_W - PADDLE_W, x + 28))} className="px-3 py-2 rounded border border-zinc-700 text-xs">▶</button>
          <button type="button" onClick={reset} className="px-3 py-2 rounded border border-zinc-700 text-xs font-mono uppercase">Restart</button>
        </div>

        <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">Lives: {lives}</p>
      </div>
    </GameFrame>
  );
}
