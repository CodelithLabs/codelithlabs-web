'use client';

import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/i18n/request';
import { GameFrame } from '@/components/games/shared/GameFrame';
import { usePseudoLeaderboard } from '@/components/games/shared/usePseudoLeaderboard';
import { useGameAudio } from '@/components/games/shared/useGameAudio';

interface Props { locale: Locale }

type Pipe = { x: number; gapY: number; passed: boolean };

export default function FlappyGame({ locale }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const yRef = useRef(280);
  const vRef = useRef(0);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => (typeof window !== 'undefined' ? Number(localStorage.getItem('flappy_best') ?? 0) : 0));
  const { muted, beep, toggleMuted } = useGameAudio();

  const leaderboard = usePseudoLeaderboard('flappy', score || best);

  useEffect(() => {
    if (!running) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    yRef.current = H / 2;
    vRef.current = 0;
    const gravity = 0.35;
    const birdX = 90;
    const birdR = 10;
    const gap = 120;
    const pipeW = 42;
    let pipes: Pipe[] = [{ x: W + 120, gapY: 130 + Math.random() * (H - 260), passed: false }];

    let raf = 0;
    const loop = () => {
      ctx.fillStyle = '#05070d';
      ctx.fillRect(0, 0, W, H);

      vRef.current += gravity;
      yRef.current += vRef.current;

      if (pipes[pipes.length - 1].x < W - 180) {
        pipes.push({ x: W + 40, gapY: 100 + Math.random() * (H - 200), passed: false });
      }

      pipes = pipes.filter((p) => p.x > -pipeW - 10);
      pipes.forEach((p) => {
        p.x -= 2.6;
        ctx.fillStyle = '#1f8f5a';
        ctx.fillRect(p.x, 0, pipeW, p.gapY - gap / 2);
        ctx.fillRect(p.x, p.gapY + gap / 2, pipeW, H - (p.gapY + gap / 2));

        const hitX = birdX + birdR > p.x && birdX - birdR < p.x + pipeW;
        const hitY = yRef.current - birdR < p.gapY - gap / 2 || yRef.current + birdR > p.gapY + gap / 2;
        if (hitX && hitY) {
          setRunning(false);
          beep(140, 0.18, 'sawtooth');
        }

        if (!p.passed && p.x + pipeW < birdX) {
          p.passed = true;
          setScore((s) => s + 1);
          beep(760, 0.04, 'triangle');
        }
      });

      if (yRef.current < 0 || yRef.current > H) {
        setRunning(false);
        beep(140, 0.18, 'sawtooth');
      }

      ctx.fillStyle = '#f2d95c';
      ctx.beginPath();
      ctx.arc(birdX, yRef.current, birdR, 0, Math.PI * 2);
      ctx.fill();

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, beep]);

  useEffect(() => {
    if (!running && score > 0 && score > best) {
      setBest(score);
      if (typeof window !== 'undefined') localStorage.setItem('flappy_best', String(score));
    }
  }, [running, score, best]);

  const flap = () => {
    if (!running) {
      setScore(0);
      setRunning(true);
      vRef.current = -5.2;
      beep(560, 0.03, 'square');
      return;
    }
    beep(560, 0.03, 'square');
    vRef.current = -5.2;
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        flap();
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <GameFrame
      locale={locale}
      title="Flappy Bird"
      score={score}
      best={best}
      muted={muted}
      onToggleMuted={toggleMuted}
      controls="Tap screen or press Space to flap"
      leaderboard={leaderboard}
    >
      <div className="space-y-3">
        <canvas
          ref={canvasRef}
          width={360}
          height={560}
          role="img"
          aria-label="Flappy game canvas"
          onClick={flap}
          className="w-full max-w-[360px] rounded-lg border border-zinc-800 bg-zinc-900 cursor-pointer"
        />
        {!running && <button onClick={flap} className="px-4 py-2 rounded border border-zinc-700 text-xs font-mono uppercase">Start / Retry</button>}
      </div>
    </GameFrame>
  );
}
