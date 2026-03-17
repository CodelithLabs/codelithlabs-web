'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Locale } from '@/i18n/request';
import { GameFrame } from '@/components/games/shared/GameFrame';
import { useGameAudio } from '@/components/games/shared/useGameAudio';
import { usePseudoLeaderboard } from '@/components/games/shared/usePseudoLeaderboard';
import { Car, Fuel, Gauge, Siren } from 'lucide-react';

const LANES = 3;
const ROAD_H = 460;
const PLAYER_Y = ROAD_H - 68;

type Obstacle = { lane: number; y: number };
type Boost = { lane: number; y: number };

interface Props {
  locale: Locale;
}

export default function GetawayGame({ locale }: Props) {
  const [lane, setLane] = useState(1);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [running, setRunning] = useState(false);
  const [distance, setDistance] = useState(0);
  const [level, setLevel] = useState(1);
  const [boosts, setBoosts] = useState<Boost[]>([]);
  const [best, setBest] = useState(() => (typeof window !== 'undefined' ? Number(localStorage.getItem('getaway_best') ?? 0) : 0));
  const [crashed, setCrashed] = useState(false);
  const [nitro, setNitro] = useState(0);
  const { muted, beep, toggleMuted } = useGameAudio();

  const score = Math.floor(distance);
  const leaderboard = usePseudoLeaderboard('getaway', score || best);

  useEffect(() => {
    if (!running) return;
    const tick = window.setInterval(() => {
      const speedFactor = 1 + level * 0.08 + nitro * 0.1;
      setDistance((d) => d + 1.3 * speedFactor);
      setLevel(Math.max(1, Math.floor(distance / 120) + 1));

      setObstacles((prev) => {
        let next = prev
          .map((o) => ({ ...o, y: o.y + (6.8 + level * 0.7 + nitro * 1.6) }))
          .filter((o) => o.y < ROAD_H + 80);

        if (next.length === 0 || next[next.length - 1].y > 160) {
          next = [...next, { lane: Math.floor(Math.random() * LANES), y: -80 }];
        }

        const hit = next.some((o) => o.lane === lane && o.y + 54 >= PLAYER_Y && o.y <= PLAYER_Y + 54);
        if (hit) {
          setRunning(false);
          setCrashed(true);
          beep(170, 0.14, 'sawtooth');
          const finalScore = Math.floor(distance);
          if (finalScore > best) {
            setBest(finalScore);
            if (typeof window !== 'undefined') localStorage.setItem('getaway_best', String(finalScore));
          }
        }

        return next;
      });

      setBoosts((prev) => {
        let next = prev
          .map((b) => ({ ...b, y: b.y + 6 + level * 0.6 }))
          .filter((b) => b.y < ROAD_H + 60);

        if (Math.random() < 0.03 && next.length < 2) {
          next = [...next, { lane: Math.floor(Math.random() * LANES), y: -60 }];
        }

        const collected = next.some((b) => b.lane === lane && b.y + 36 >= PLAYER_Y && b.y <= PLAYER_Y + 54);
        if (collected) {
          setNitro((n) => Math.min(4, n + 1));
          beep(920, 0.06, 'triangle');
        }

        return next.filter((b) => !(b.lane === lane && b.y + 36 >= PLAYER_Y && b.y <= PLAYER_Y + 54));
      });

      setNitro((n) => Math.max(0, n - 0.02));
    }, 80);

    return () => clearInterval(tick);
  }, [running, lane, distance, level, best, beep, nitro]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setLane((l) => Math.max(0, l - 1));
        beep(520, 0.03, 'square');
      }
      if (e.key === 'ArrowRight') {
        setLane((l) => Math.min(LANES - 1, l + 1));
        beep(520, 0.03, 'square');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [beep]);

  const laneX = useMemo(() => [22, 104, 186], []);

  const start = () => {
    setLane(1);
    setObstacles([]);
    setBoosts([]);
    setDistance(0);
    setLevel(1);
    setNitro(0);
    setCrashed(false);
    setRunning(true);
    beep(760, 0.05, 'triangle');
  };

  return (
    <GameFrame
      locale={locale}
      title="Getaway Driver"
      score={score}
      best={best}
      muted={muted}
      onToggleMuted={toggleMuted}
      controls="Arrow keys or large touch controls · collect fuel boosts · survive higher police levels"
      leaderboard={leaderboard}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 items-center text-xs font-mono">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded border border-zinc-700 text-cyan-300"><Gauge className="h-3.5 w-3.5" /> Level {level}</span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded border border-zinc-700 text-emerald-300"><Fuel className="h-3.5 w-3.5" /> Nitro {nitro.toFixed(1)}</span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded border border-zinc-700 text-red-300"><Siren className="h-3.5 w-3.5" /> Heat {Math.min(5, Math.ceil(level / 2))}/5</span>
        </div>

        <div className="relative border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950" style={{ width: 260, height: ROAD_H }}>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#090d14_0%,#111827_100%)]" />
          <div className="absolute left-[86px] top-0 bottom-0 border-l border-dashed border-zinc-700" />
          <div className="absolute left-[172px] top-0 bottom-0 border-l border-dashed border-zinc-700" />
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-cyan-500/10 to-transparent" />

          {obstacles.map((o, idx) => (
            <div
              key={`${idx}-${o.y}`}
              className="absolute w-12 h-14 rounded bg-red-500/90 border border-red-300 shadow-[0_0_20px_rgba(239,68,68,0.35)]"
              style={{ left: laneX[o.lane], top: o.y }}
            />
          ))}

          {boosts.map((b, idx) => (
            <div key={`boost-${idx}-${b.y}`} className="absolute w-10 h-10 rounded-full border border-yellow-300 bg-yellow-400/40 grid place-items-center animate-pulse" style={{ left: laneX[b.lane] + 1, top: b.y }}>
              ⚡
            </div>
          ))}

          <div className="absolute w-12 h-14 rounded bg-emerald-500 border border-emerald-200 shadow-[0_0_24px_rgba(52,211,153,0.45)] grid place-items-center" style={{ left: laneX[lane], top: PLAYER_Y }}>
            <Car className="h-4 w-4 text-emerald-950" />
          </div>

          {!running && (
            <div className="absolute inset-0 bg-black/55 grid place-items-center">
              <p className="text-xs font-mono uppercase tracking-widest text-zinc-200">{crashed ? 'Busted. Start again.' : 'Tap start to run.'}</p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={() => setLane((l) => Math.max(0, l - 1))} className="px-4 py-3 rounded-xl border border-zinc-700 text-sm">⬅️</button>
          <button type="button" onClick={() => setLane((l) => Math.min(LANES - 1, l + 1))} className="px-4 py-3 rounded-xl border border-zinc-700 text-sm">➡️</button>
          <button type="button" onClick={start} className="px-4 py-3 rounded-xl border border-zinc-700 text-xs font-mono uppercase">{running ? 'Restart Run' : 'Start Chase'}</button>
        </div>
      </div>
    </GameFrame>
  );
}
