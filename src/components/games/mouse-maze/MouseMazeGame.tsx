'use client';

import { useMemo, useState } from 'react';
import type { Locale } from '@/i18n/request';
import { GameFrame } from '@/components/games/shared/GameFrame';
import { useGameAudio } from '@/components/games/shared/useGameAudio';
import { usePseudoLeaderboard } from '@/components/games/shared/usePseudoLeaderboard';
import { MousePointer2, Bomb, CircleDot, Trophy } from 'lucide-react';

type Item = { id: string; x: number; y: number; type: 'cheese' | 'trap' };

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildItems(level: number): Item[] {
  const cheeses = Array.from({ length: 5 + level }, (_, i) => ({
    id: `c-${i}`,
    x: rand(20, 320),
    y: rand(20, 320),
    type: 'cheese' as const,
  }));
  const traps = Array.from({ length: Math.min(10, 2 + level) }, (_, i) => ({
    id: `t-${i}`,
    x: rand(20, 320),
    y: rand(20, 320),
    type: 'trap' as const,
  }));
  return [...cheeses, ...traps];
}

interface Props { locale: Locale }

export default function MouseMazeGame({ locale }: Props) {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => (typeof window !== 'undefined' ? Number(localStorage.getItem('mouse_maze_best') ?? 0) : 0));
  const [items, setItems] = useState<Item[]>(() => buildItems(1));
  const [status, setStatus] = useState('Collect 🧀 and avoid traps 💣');
  const { muted, beep, toggleMuted } = useGameAudio();

  const leaderboard = usePseudoLeaderboard('mouse-maze', Math.max(score, best));
  const left = useMemo(() => items.filter((i) => i.type === 'cheese').length, [items]);

  function saveBest(next: number) {
    if (next > best) {
      setBest(next);
      if (typeof window !== 'undefined') localStorage.setItem('mouse_maze_best', String(next));
    }
  }

  function onHover(item: Item) {
    if (item.type === 'trap') {
      const penalty = Math.max(0, score - 60);
      setScore(penalty);
      saveBest(penalty);
      setStatus('Trap hit! Stay sharp.');
      beep(180, 0.08, 'sawtooth');
      setItems(buildItems(level));
      return;
    }

    const nextScore = score + 25;
    setScore(nextScore);
    saveBest(nextScore);
    beep(820, 0.04, 'triangle');
    const remaining = items.filter((i) => i.id !== item.id);
    setItems(remaining);

    if (remaining.every((i) => i.type !== 'cheese')) {
      const nextLevel = level + 1;
      setLevel(nextLevel);
      setStatus(`Level ${nextLevel} unlocked!`);
      beep(980, 0.07, 'triangle');
      setItems(buildItems(nextLevel));
    }
  }

  function reset() {
    setLevel(1);
    setScore(0);
    setStatus('Collect 🧀 and avoid traps 💣');
    setItems(buildItems(1));
  }

  return (
    <GameFrame
      locale={locale}
      title="Mouse Maze"
      score={score}
      best={best}
      muted={muted}
      onToggleMuted={toggleMuted}
      requiresLogin
      controls="Move your mouse/touch over cheese icons quickly; avoid bombs; each level adds density"
      leaderboard={leaderboard}
    >
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <span className="inline-flex items-center gap-1 rounded border border-zinc-700 px-2 py-1 text-fuchsia-300"><Trophy className="h-3.5 w-3.5" /> Level {level}</span>
          <span className="inline-flex items-center gap-1 rounded border border-zinc-700 px-2 py-1 text-emerald-300"><CircleDot className="h-3.5 w-3.5" /> Cheese left {left}</span>
          <span className="inline-flex items-center gap-1 rounded border border-zinc-700 px-2 py-1 text-cyan-300"><MousePointer2 className="h-3.5 w-3.5" /> Precision run</span>
        </div>

        <div className="relative w-[360px] h-[360px] max-w-full rounded-xl border border-zinc-800 bg-[radial-gradient(circle_at_top,#1f1149_0%,#0b1020_55%,#05070f_100%)] overflow-hidden">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onMouseEnter={() => onHover(item)}
              onTouchStart={() => onHover(item)}
              className={`absolute grid place-items-center rounded-full text-lg transition-transform duration-150 hover:scale-125 ${item.type === 'cheese' ? 'bg-yellow-400/25 border border-yellow-300 shadow-[0_0_24px_rgba(250,204,21,0.35)]' : 'bg-red-500/25 border border-red-400 shadow-[0_0_24px_rgba(239,68,68,0.35)]'}`}
              style={{ left: item.x, top: item.y, width: 38, height: 38 }}
              aria-label={item.type === 'cheese' ? 'Cheese' : 'Trap'}
            >
              {item.type === 'cheese' ? '🧀' : <Bomb className="h-4 w-4 text-red-300" />}
            </button>
          ))}
        </div>

        <p className="text-xs font-mono text-zinc-400">{status}</p>
        <button type="button" onClick={reset} className="px-4 py-2 rounded-lg border border-zinc-700 text-xs font-mono uppercase">Reset Maze</button>
      </div>
    </GameFrame>
  );
}
