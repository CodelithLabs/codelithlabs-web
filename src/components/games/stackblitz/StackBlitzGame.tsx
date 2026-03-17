'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '@/i18n/request';
import { GameFrame } from '@/components/games/shared/GameFrame';
import { useGameAudio } from '@/components/games/shared/useGameAudio';
import { usePseudoLeaderboard } from '@/components/games/shared/usePseudoLeaderboard';

interface Block {
  x: number;
  width: number;
}

interface Props { locale: Locale }

export default function StackBlitzGame({ locale }: Props) {
  const [stack, setStack] = useState<Block[]>([{ x: 60, width: 140 }]);
  const [runnerX, setRunnerX] = useState(20);
  const [dir, setDir] = useState(1);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => (typeof window !== 'undefined' ? Number(localStorage.getItem('stackblitz_best') ?? 0) : 0));
  const [over, setOver] = useState(false);
  const { muted, beep, toggleMuted } = useGameAudio();

  const leaderboard = usePseudoLeaderboard('stackblitz', score || best);

  useEffect(() => {
    if (over) return;
    const t = window.setInterval(() => {
      setRunnerX((x) => {
        let nx = x + 6 * dir;
        if (nx <= 0) {
          nx = 0;
          setDir(1);
        }
        if (nx >= 220) {
          nx = 220;
          setDir(-1);
        }
        return nx;
      });
    }, 40);
    return () => clearInterval(t);
  }, [dir, over]);

  const drop = () => {
    if (over) return;
    const prev = stack[stack.length - 1];
    const left = Math.max(prev.x, runnerX);
    const right = Math.min(prev.x + prev.width, runnerX + prev.width);
    const width = Math.max(0, right - left);

    if (width < 14) {
      setOver(true);
      beep(170, 0.12, 'sawtooth');
      if (score > best) {
        setBest(score);
        if (typeof window !== 'undefined') localStorage.setItem('stackblitz_best', String(score));
      }
      return;
    }

    setStack((s) => [...s, { x: left, width }]);
    setScore((v) => v + 55);
    beep(760, 0.04, 'triangle');
  };

  const restart = () => {
    setStack([{ x: 60, width: 140 }]);
    setRunnerX(20);
    setDir(1);
    setScore(0);
    setOver(false);
  };

  return (
    <GameFrame
      locale={locale}
      title="Stack Blitz"
      score={score}
      best={best}
      muted={muted}
      onToggleMuted={toggleMuted}
      controls="Tap drop to stack blocks. Perfect alignment keeps tower alive."
      leaderboard={leaderboard}
    >
      <div className="space-y-4">
        <div className="relative rounded-lg border border-zinc-800 bg-zinc-950" style={{ width: 280, height: 420 }}>
          {stack.map((b, i) => (
            <div
              key={i}
              className="absolute h-8 bg-cyan-500/90 border border-cyan-300"
              style={{ left: b.x, width: b.width, bottom: i * 26 }}
            />
          ))}

          {!over && (
            <div className="absolute h-8 bg-emerald-500/90 border border-emerald-300" style={{ left: runnerX, width: stack[stack.length - 1].width, top: 20 }} />
          )}

          {over && (
            <div className="absolute inset-0 bg-black/60 grid place-items-center">
              <p className="text-xs font-mono uppercase tracking-widest text-zinc-200">Tower collapsed</p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={drop} className="px-3 py-2 rounded border border-zinc-700 text-xs font-mono uppercase">Drop</button>
          <button type="button" onClick={restart} className="px-3 py-2 rounded border border-zinc-700 text-xs font-mono uppercase">Restart</button>
        </div>
      </div>
    </GameFrame>
  );
}
