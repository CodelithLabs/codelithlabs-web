'use client';

import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/i18n/request';
import { GameFrame } from '@/components/games/shared/GameFrame';
import { useGameAudio } from '@/components/games/shared/useGameAudio';
import { usePseudoLeaderboard } from '@/components/games/shared/usePseudoLeaderboard';
import { createPerfStatsTracker, getOrCreatePerfSessionTag } from '@/components/games/shared/perfStats';

const W = 520;
const H = 300;
const PADDLE_H = 70;
const PADDLE_W = 10;

interface Props {
  locale: Locale;
}

export default function PongGame({ locale }: Props) {
  const [playerY, setPlayerY] = useState(110);
  const [cpuY, setCpuY] = useState(110);
  const [ball, setBall] = useState({ x: W / 2, y: H / 2, vx: 4, vy: 2.2 });
  const [playerScore, setPlayerScore] = useState(0);
  const [cpuScore, setCpuScore] = useState(0);
  const [best, setBest] = useState(() => (typeof window !== 'undefined' ? Number(localStorage.getItem('pong_best') ?? 0) : 0));
  const { muted, beep, toggleMuted } = useGameAudio();

  const playerYRef = useRef(playerY);
  const cpuYRef = useRef(cpuY);
  const playerScoreRef = useRef(playerScore);
  const cpuScoreRef = useRef(cpuScore);
  const bestRef = useRef(best);
  const perfSessionTagRef = useRef('');

  useEffect(() => {
    playerYRef.current = playerY;
  }, [playerY]);

  useEffect(() => {
    cpuYRef.current = cpuY;
  }, [cpuY]);

  useEffect(() => {
    playerScoreRef.current = playerScore;
  }, [playerScore]);

  useEffect(() => {
    cpuScoreRef.current = cpuScore;
  }, [cpuScore]);

  useEffect(() => {
    bestRef.current = best;
  }, [best]);

  const score = playerScore * 100;
  const leaderboard = usePseudoLeaderboard('pong', score || best);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') setPlayerY((y) => Math.max(0, y - 22));
      if (e.key === 'ArrowDown') setPlayerY((y) => Math.min(H - PADDLE_H, y + 22));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const perfEnabled = process.env.NODE_ENV !== 'production';
    if (!perfSessionTagRef.current) {
      perfSessionTagRef.current = getOrCreatePerfSessionTag();
    }
    const perf = createPerfStatsTracker('[Perf][Pong] ', 240, perfEnabled, perfSessionTagRef.current);
    let lastTick = performance.now();

    const t = window.setInterval(() => {
      if (perfEnabled) {
        const now = performance.now();
        const dtMs = now - lastTick;
        lastTick = now;
        perf.sample(dtMs);
      }

      if (playerScoreRef.current >= 7 || cpuScoreRef.current >= 7) {
        return;
      }

      setBall((prev) => {
        let x = prev.x + prev.vx;
        let y = prev.y + prev.vy;
        let vx = prev.vx;
        let vy = prev.vy;

        setCpuY((cpuPrev) => {
          const center = cpuPrev + PADDLE_H / 2;
          let nextCpu = cpuPrev;
          if (center < prev.y - 8) nextCpu = Math.min(H - PADDLE_H, cpuPrev + 3.3);
          if (center > prev.y + 8) nextCpu = Math.max(0, cpuPrev - 3.3);
          cpuYRef.current = nextCpu;
          return nextCpu;
        });

        if (y <= 0 || y >= H) {
          vy *= -1;
          beep(300, 0.03, 'square');
        }

        const hitPlayer = x <= 24 && y >= playerYRef.current && y <= playerYRef.current + PADDLE_H;
        const hitCpu = x >= W - 24 && y >= cpuYRef.current && y <= cpuYRef.current + PADDLE_H;

        if (hitPlayer) {
          vx = Math.abs(vx) + 0.15;
          vy += ((y - (playerYRef.current + PADDLE_H / 2)) / PADDLE_H) * 1.2;
          beep(550, 0.04, 'triangle');
        }

        if (hitCpu) {
          vx = -Math.abs(vx) - 0.15;
          vy += ((y - (cpuYRef.current + PADDLE_H / 2)) / PADDLE_H) * 1.2;
          beep(420, 0.04, 'triangle');
        }

        if (x < -10) {
          setCpuScore((s) => {
            const nextCpu = s + 1;
            cpuScoreRef.current = nextCpu;
            return nextCpu;
          });
          beep(150, 0.12, 'sawtooth');
          return { x: W / 2, y: H / 2, vx: 4, vy: 2.2 };
        }

        if (x > W + 10) {
          setPlayerScore((s) => {
            const nextPlayerScore = s + 1;
            playerScoreRef.current = nextPlayerScore;
            const nextScore = nextPlayerScore * 100;
            if (nextScore > bestRef.current) {
              bestRef.current = nextScore;
              if (typeof window !== 'undefined') localStorage.setItem('pong_best', String(nextScore));
              setBest(nextScore);
            }
            return nextPlayerScore;
          });
          beep(820, 0.08, 'triangle');
          return { x: W / 2, y: H / 2, vx: -4, vy: 2.2 };
        }

        return { x, y, vx, vy };
      });
    }, 16);

    return () => {
      clearInterval(t);
      perf.flush();
    };
  }, [beep]);

  const reset = () => {
    setPlayerY(110);
    playerYRef.current = 110;
    setCpuY(110);
    cpuYRef.current = 110;
    setBall({ x: W / 2, y: H / 2, vx: 4, vy: 2.2 });
    setPlayerScore(0);
    playerScoreRef.current = 0;
    setCpuScore(0);
    cpuScoreRef.current = 0;
  };

  return (
    <GameFrame
      locale={locale}
      title="Pong"
      score={score}
      best={best}
      muted={muted}
      onToggleMuted={toggleMuted}
      controls="Arrow Up/Down or touch buttons · First to 7 points"
      leaderboard={leaderboard}
    >
      <div className="space-y-4">
        <div className="relative border border-zinc-800 rounded-lg bg-zinc-950" style={{ width: W, height: H }}>
          <div className="absolute left-1/2 top-0 bottom-0 border-l border-dashed border-zinc-700" />
          <div className="absolute bg-white" style={{ left: 14, top: playerY, width: PADDLE_W, height: PADDLE_H }} />
          <div className="absolute bg-white" style={{ right: 14, top: cpuY, width: PADDLE_W, height: PADDLE_H }} />
          <div className="absolute w-3 h-3 bg-emerald-400 rounded-full" style={{ left: ball.x, top: ball.y }} />

          <div className="absolute top-2 left-0 right-0 flex items-center justify-center gap-10 text-xs font-mono text-zinc-300">
            <span>You {playerScore}</span>
            <span>CPU {cpuScore}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={() => setPlayerY((y) => Math.max(0, y - 24))} className="px-3 py-2 rounded border border-zinc-700 text-xs">▲</button>
          <button type="button" onClick={() => setPlayerY((y) => Math.min(H - PADDLE_H, y + 24))} className="px-3 py-2 rounded border border-zinc-700 text-xs">▼</button>
          <button type="button" onClick={reset} className="px-3 py-2 rounded border border-zinc-700 text-xs font-mono uppercase">Restart</button>
        </div>

        {(playerScore >= 7 || cpuScore >= 7) && (
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">{playerScore >= 7 ? 'You win!' : 'CPU wins'} · restart to play again</p>
        )}
      </div>
    </GameFrame>
  );
}
