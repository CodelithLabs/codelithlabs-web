'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Locale } from '@/i18n/request';
import { GameFrame } from '@/components/games/shared/GameFrame';
import { usePseudoLeaderboard } from '@/components/games/shared/usePseudoLeaderboard';
import { useGameAudio } from '@/components/games/shared/useGameAudio';
import { createPerfStatsTracker, getOrCreatePerfSessionTag } from '@/components/games/shared/perfStats';

interface Props {
  locale: Locale;
  customOnly?: boolean;
}

type Mode = 'classic' | 'infinite' | 'chaos';
type Pipe = { x: number; gapY: number; passed: boolean; phase: number };
type Orb = { x: number; y: number; taken: boolean };

const W = 360;
const H = 560;
const BIRD_X = 90;
const BIRD_R = 12;

function readLocal(key: string) {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(key) ?? '';
}

function saveLocal(key: string, value: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, value);
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export default function FlappyGame({ locale, customOnly = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const birdImgRef = useRef<HTMLImageElement | null>(null);
  const yRef = useRef(H / 2);
  const vRef = useRef(0);
  const flapVelocityRef = useRef(-320);
  const bestRef = useRef(0);
  const perfSessionTagRef = useRef('');

  const [mode, setMode] = useState<Mode>(customOnly ? 'infinite' : 'classic');
  const [running, setRunning] = useState(false);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    const initialMode: Mode = customOnly ? 'infinite' : 'classic';
    const nextBest = Number(readLocal(`flappy_best_${initialMode}`) || 0);
    return Number.isFinite(nextBest) ? nextBest : 0;
  });
  const [birdImage, setBirdImage] = useState(() => readLocal('flappy_custom_bird_image'));
  const [jumpSound, setJumpSound] = useState(() => readLocal('flappy_custom_jump_sound'));
  const [deathSound, setDeathSound] = useState(() => readLocal('flappy_custom_death_sound'));
  const [hint, setHint] = useState(customOnly ? 'Customize your bird and sounds, then tap to fly.' : 'Choose mode, then tap to fly.');
  const { muted, beep, toggleMuted } = useGameAudio();

  useEffect(() => {
    bestRef.current = best;
  }, [best]);

  const leaderboardSlug = useMemo(() => `flappy-bird-${mode}`, [mode]);
  const leaderboard = usePseudoLeaderboard(leaderboardSlug, Math.max(score, best));

  const applyScore = useCallback((nextScore: number, nextMode: Mode) => {
    setScore(nextScore);
    if (nextScore > bestRef.current) {
      bestRef.current = nextScore;
      saveLocal(`flappy_best_${nextMode}`, String(nextScore));
      setBest(nextScore);
    }
  }, []);

  useEffect(() => {
    if (!birdImage) {
      birdImgRef.current = null;
      return;
    }
    const img = new Image();
    img.src = birdImage;
    birdImgRef.current = img;
  }, [birdImage]);

  const playCustom = useCallback((soundDataUrl: string, fallbackFreq: number, fallbackWave: OscillatorType) => {
    if (muted) return;
    if (soundDataUrl) {
      const audio = new Audio(soundDataUrl);
      audio.volume = 0.28;
      void audio.play().catch(() => beep(fallbackFreq, 0.06, fallbackWave));
      return;
    }
    beep(fallbackFreq, 0.06, fallbackWave);
  }, [beep, muted]);

  useEffect(() => {
    if (!running) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    yRef.current = H / 2;
    vRef.current = 0;
    const gravity = 1220;
    const pipeW = 42;
    let pipes: Pipe[] = [{ x: W + 120, gapY: 130 + Math.random() * (H - 260), passed: false, phase: Math.random() * 10 }];
    let orbs: Orb[] = [];
    let spawnTimer = 0;
    let orbTimer = 0;
    let runScore = 0;
    let runLevel = 1;
    let last = performance.now();
    if (!perfSessionTagRef.current) {
      perfSessionTagRef.current = getOrCreatePerfSessionTag();
    }
    const perf = createPerfStatsTracker(`[Perf][Flappy][${mode}] `, 180, process.env.NODE_ENV !== 'production', perfSessionTagRef.current);

    let raf = 0;
    const loop = (ts: number) => {
      const dt = Math.min(0.035, (ts - last) / 1000);
      const dtMsRaw = ts - last;
      last = ts;
      perf.sample(dtMsRaw);

      const dynamicLevel = Math.max(1, Math.floor(runScore / 6) + 1);
      if (dynamicLevel !== runLevel) {
        runLevel = dynamicLevel;
        setLevel(dynamicLevel);
      }

      const speed = mode === 'classic' ? 156 : 156 + Math.min(45, (dynamicLevel - 1) * 16);
      const gap = mode === 'classic' ? 132 : Math.max(82, 132 - Math.min(40, (dynamicLevel - 1) * 3));

      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, '#0b1020');
      sky.addColorStop(1, '#09111f');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      spawnTimer += dt;
      orbTimer += dt;

      vRef.current += gravity * dt;
      yRef.current += vRef.current * dt;

      if (spawnTimer > 1.42) {
        spawnTimer = 0;
        pipes.push({
          x: W + 40,
          gapY: 100 + Math.random() * (H - 210),
          passed: false,
          phase: Math.random() * 10,
        });
      }

      if (orbTimer > 3.25) {
        orbTimer = 0;
        orbs.push({ x: W + 30, y: 80 + Math.random() * (H - 160), taken: false });
      }

      pipes = pipes.filter((p) => p.x > -pipeW - 10);
      orbs = orbs.filter((o) => o.x > -30 && !o.taken);

      pipes.forEach((p) => {
        p.x -= speed * dt;

        const wobble = mode === 'chaos' ? Math.sin((ts / 1000) * 1.7 + p.phase) * 22 : 0;
        const gapCenter = p.gapY + wobble;

        ctx.fillStyle = '#1f8f5a';
        ctx.fillRect(p.x, 0, pipeW, gapCenter - gap / 2);
        ctx.fillRect(p.x, gapCenter + gap / 2, pipeW, H - (gapCenter + gap / 2));

        const hitX = BIRD_X + BIRD_R > p.x && BIRD_X - BIRD_R < p.x + pipeW;
        const hitY = yRef.current - BIRD_R < gapCenter - gap / 2 || yRef.current + BIRD_R > gapCenter + gap / 2;
        if (hitX && hitY) {
          setRunning(false);
          playCustom(deathSound, 140, 'sawtooth');
          setHint('Crashed! Tune your timing and try again.');
        }

        if (!p.passed && p.x + pipeW < BIRD_X) {
          p.passed = true;
          runScore += mode === 'classic' ? 1 : 2;
          applyScore(runScore, mode);
          beep(760, 0.04, 'triangle');
        }
      });

      orbs.forEach((o) => {
        o.x -= speed * dt;
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(o.x, o.y, 7, 0, Math.PI * 2);
        ctx.fill();

        const dx = o.x - BIRD_X;
        const dy = o.y - yRef.current;
        if (Math.hypot(dx, dy) < BIRD_R + 8) {
          o.taken = true;
          runScore += 3;
          applyScore(runScore, mode);
          beep(980, 0.05, 'triangle');
        }
      });

      if (yRef.current < 0 || yRef.current > H) {
        setRunning(false);
        playCustom(deathSound, 140, 'sawtooth');
        setHint('Out of bounds! Keep your bird in the lane.');
      }

      const customBird = birdImgRef.current;
      if (customBird?.complete) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(BIRD_X, yRef.current, BIRD_R + 1, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(customBird, BIRD_X - BIRD_R - 2, yRef.current - BIRD_R - 2, (BIRD_R + 2) * 2, (BIRD_R + 2) * 2);
        ctx.restore();
      } else {
        ctx.fillStyle = '#f2d95c';
        ctx.beginPath();
        ctx.arc(BIRD_X, yRef.current, BIRD_R, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#d1d5db';
      ctx.font = '12px ui-monospace, monospace';
      ctx.fillText(`Mode: ${mode.toUpperCase()}  Level: ${dynamicLevel}`, 12, 22);

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame((t) => {
      last = t;
      loop(t);
    });
    return () => {
      cancelAnimationFrame(raf);
      perf.flush();
    };
  }, [running, beep, mode, deathSound, playCustom, applyScore]);

  const flap = useCallback(() => {
    if (!running) {
      setScore(0);
      setLevel(1);
      setHint('Fly through gaps, collect orbs, and climb levels.');
      setRunning(true);
      vRef.current = flapVelocityRef.current;
      playCustom(jumpSound, 560, 'square');
      return;
    }
    playCustom(jumpSound, 560, 'square');
    vRef.current = flapVelocityRef.current;
  }, [jumpSound, playCustom, running]);

  const onModeChange = (nextMode: Mode) => {
    if (customOnly) return;
    setMode(nextMode);
    const nextBest = Number(readLocal(`flappy_best_${nextMode}`) || 0);
    setBest(Number.isFinite(nextBest) ? nextBest : 0);
    setScore(0);
    setLevel(1);
    setRunning(false);
    setHint('Choose mode, then tap to fly.');
  };

  async function onUploadBird(file: File | null) {
    if (!file) return;
    const url = await fileToDataUrl(file);
    saveLocal('flappy_custom_bird_image', url);
    setBirdImage(url);
  }

  async function onUploadJump(file: File | null) {
    if (!file) return;
    const url = await fileToDataUrl(file);
    saveLocal('flappy_custom_jump_sound', url);
    setJumpSound(url);
  }

  async function onUploadDeath(file: File | null) {
    if (!file) return;
    const url = await fileToDataUrl(file);
    saveLocal('flappy_custom_death_sound', url);
    setDeathSound(url);
  }

  function resetCustomAssets() {
    saveLocal('flappy_custom_bird_image', '');
    saveLocal('flappy_custom_jump_sound', '');
    saveLocal('flappy_custom_death_sound', '');
    setBirdImage('');
    setJumpSound('');
    setDeathSound('');
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        flap();
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flap]);

  return (
    <GameFrame
      locale={locale}
      title={customOnly ? 'Custom Flappy Studio' : 'Flappy Bird'}
      score={score}
      best={best}
      muted={muted}
      onToggleMuted={toggleMuted}
      requiresLogin={customOnly}
      controls={customOnly
        ? 'Custom game: upload your bird + sounds · tap/screen/Space to flap · deep level scaling'
        : 'Phone-first controls: tap Flap button/screen or press Space · choose mode · level up every 6 points'}
      leaderboard={leaderboard}
    >
      <div className="space-y-3">
        {!customOnly && (
          <div className="flex flex-wrap gap-2 items-center">
            <label className="text-xs font-mono uppercase text-zinc-300">Mode</label>
            <select
              value={mode}
              onChange={(e) => onModeChange(e.target.value as Mode)}
              className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs"
              disabled={running}
            >
              <option value="classic">Classic</option>
              <option value="infinite">Infinite + Levels</option>
              <option value="chaos">Chaos + Levels</option>
            </select>
            <span className="text-[11px] font-mono text-cyan-300">Level {level}</span>
          </div>
        )}
        {customOnly && <p className="text-[11px] font-mono text-fuchsia-300">🛠️ Custom run · Level {level}</p>}

        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          role="img"
          aria-label="Flappy game canvas"
          onClick={flap}
          className="w-full max-w-[360px] rounded-lg border border-zinc-800 bg-zinc-900 cursor-pointer"
        />

        <div className="flex flex-wrap gap-2">
          <button onClick={flap} className="px-4 py-2 rounded border border-zinc-700 text-xs font-mono uppercase min-w-24">
            {running ? 'Flap' : 'Start / Retry'}
          </button>
          <button
            type="button"
            onClick={() => {
              setRunning(false);
              setScore(0);
              setLevel(1);
              setHint('Run reset. Choose mode and start again.');
            }}
            className="px-4 py-2 rounded border border-zinc-700 text-xs font-mono uppercase"
          >
            Reset Run
          </button>
        </div>

        <p className="text-xs font-mono text-zinc-400">{hint}</p>

        <details className="rounded border border-zinc-800 bg-zinc-900/40 p-3" open={customOnly}>
          <summary className="cursor-pointer text-xs font-mono uppercase text-zinc-300">{customOnly ? 'Custom Flappy assets (bird + sounds)' : 'Custom Flappy (bird + sounds)'}</summary>
          <div className="mt-3 space-y-2 text-xs font-mono">
            <label className="block text-zinc-400">Custom bird icon image</label>
            <input type="file" accept="image/*" onChange={(e) => void onUploadBird(e.target.files?.[0] ?? null)} className="text-xs" />

            <label className="block text-zinc-400">Jump sound</label>
            <input type="file" accept="audio/*" onChange={(e) => void onUploadJump(e.target.files?.[0] ?? null)} className="text-xs" />

            <label className="block text-zinc-400">Death sound</label>
            <input type="file" accept="audio/*" onChange={(e) => void onUploadDeath(e.target.files?.[0] ?? null)} className="text-xs" />

            <button type="button" onClick={resetCustomAssets} className="mt-2 px-3 py-1 rounded border border-zinc-700 text-zinc-300">
              Clear custom assets
            </button>
          </div>
        </details>
      </div>
    </GameFrame>
  );
}
