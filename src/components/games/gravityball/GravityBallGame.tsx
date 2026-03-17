'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '@/i18n/request';
import { GameFrame } from '@/components/games/shared/GameFrame';
import { useGameAudio } from '@/components/games/shared/useGameAudio';
import { usePseudoLeaderboard } from '@/components/games/shared/usePseudoLeaderboard';

const W = 340;
const H = 460;
const BALL = 12;

type Pillar = { x: number; gapY: number };

interface Props {
  locale: Locale;
}

export default function GravityBallGame({ locale }: Props) {
  const [y, setY] = useState(H / 2);
  const [vy, setVy] = useState(0);
  const [gravity, setGravity] = useState(0.42);
  const [pillars, setPillars] = useState<Pillar[]>([{ x: W + 80, gapY: 210 }]);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => (typeof window !== 'undefined' ? Number(localStorage.getItem('gravityball_best') ?? 0) : 0));
  const [over, setOver] = useState(false);
  const { muted, beep, toggleMuted } = useGameAudio();

  const leaderboard = usePseudoLeaderboard('gravityball', score || best);

  const flipGravity = () => {
    if (!running) return;
    setGravity((g) => -g);
    beep(640, 0.04, 'square');
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        flipGravity();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => {
      setVy((v) => v + gravity);
      setY((prev) => prev + vy);

      setPillars((prev) => {
        let next = prev.map((p) => ({ ...p, x: p.x - 5 })).filter((p) => p.x > -48);

        if (next.length === 0 || next[next.length - 1].x < W - 180) {
          next = [...next, { x: W + 60, gapY: 120 + Math.random() * 220 }];
        }

        const hit = next.some((p) => {
          const inX = 72 + BALL > p.x && 72 - BALL < p.x + 42;
          const inGap = y > p.gapY - 60 && y < p.gapY + 60;
          return inX && !inGap;
        });

        if (hit || y < 0 || y > H) {
          setRunning(false);
          setOver(true);
          beep(170, 0.12, 'sawtooth');
          if (score > best) {
            setBest(score);
            if (typeof window !== 'undefined') localStorage.setItem('gravityball_best', String(score));
          }
          return next;
        }

        const passed = next.filter((p) => p.x < 72 && p.x > 67).length;
        if (passed > 0) {
          setScore((s) => s + passed * 15);
          beep(790, 0.03, 'triangle');
        }

        return next;
      });
    }, 30);

    return () => clearInterval(t);
  }, [running, gravity, vy, y, score, best, beep]);

  const start = () => {
    setY(H / 2);
    setVy(0);
    setGravity(0.42);
    setPillars([{ x: W + 80, gapY: 210 }]);
    setScore(0);
    setOver(false);
    setRunning(true);
    beep(760, 0.05, 'triangle');
  };

  return (
    <GameFrame
      locale={locale}
      title="Gravity Ball"
      score={score}
      best={best}
      muted={muted}
      onToggleMuted={toggleMuted}
      controls="Tap or press Space to flip gravity and thread through gaps"
      leaderboard={leaderboard}
    >
      <div className="space-y-4">
        <div className="relative rounded-lg border border-zinc-800 overflow-hidden bg-zinc-950" style={{ width: W, height: H }} onClick={flipGravity}>
          {pillars.map((p, i) => (
            <div key={`${i}-${p.x}`}>
              <div className="absolute bg-cyan-600" style={{ left: p.x, top: 0, width: 42, height: p.gapY - 60 }} />
              <div className="absolute bg-cyan-600" style={{ left: p.x, top: p.gapY + 60, width: 42, height: H - (p.gapY + 60) }} />
            </div>
          ))}

          <div className="absolute rounded-full bg-emerald-400" style={{ left: 72 - BALL, top: y - BALL, width: BALL * 2, height: BALL * 2 }} />

          {!running && (
            <div className="absolute inset-0 bg-black/55 grid place-items-center">
              <p className="text-xs font-mono uppercase tracking-widest text-zinc-200">{over ? 'Crashed. Tap start.' : 'Tap start to play.'}</p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={flipGravity} className="px-3 py-2 rounded border border-zinc-700 text-xs font-mono uppercase">Flip</button>
          <button type="button" onClick={start} className="px-3 py-2 rounded border border-zinc-700 text-xs font-mono uppercase">{running ? 'Restart' : 'Start'}</button>
        </div>
      </div>
    </GameFrame>
  );
}
