'use client';

import { useMemo, useState } from 'react';
import type { Locale } from '@/i18n/request';
import { GameFrame } from '@/components/games/shared/GameFrame';
import { useGameAudio } from '@/components/games/shared/useGameAudio';
import { usePseudoLeaderboard } from '@/components/games/shared/usePseudoLeaderboard';

type Puzzle = {
  start: string;
  target: string;
  options: string[][];
  path: string[];
};

const PUZZLES: Puzzle[] = [
  {
    start: 'code',
    target: 'data',
    options: [['cade', 'coda', 'core'], ['cada', 'coda', 'cate'], ['data', 'dada', 'date']],
    path: ['code', 'coda', 'cada', 'data'],
  },
  {
    start: 'node',
    target: 'game',
    options: [['mode', 'rode', 'none'], ['made', 'gode', 'mole'], ['gade', 'game', 'gate']],
    path: ['node', 'mode', 'made', 'game'],
  },
];

interface Props { locale: Locale }

export default function WordWireGame({ locale }: Props) {
  const [idx, setIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [chain, setChain] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => (typeof window !== 'undefined' ? Number(localStorage.getItem('wordwire_best') ?? 0) : 0));
  const [message, setMessage] = useState('Connect start word to target by picking one-letter changes.');
  const { muted, beep, toggleMuted } = useGameAudio();

  const puzzle = useMemo(() => PUZZLES[idx % PUZZLES.length], [idx]);
  const current = chain.length === 0 ? puzzle.start : chain[chain.length - 1];
  const done = current === puzzle.target;
  const leaderboard = usePseudoLeaderboard('wordwire', score || best);

  const choose = (word: string) => {
    if (done) return;
    const expected = puzzle.path[step + 1];
    setChain((prev) => [...prev, word]);
    if (word === expected) {
      const add = 45;
      const next = score + add;
      setScore(next);
      setMessage('Clean link.');
      beep(760, 0.05, 'triangle');
      if (word === puzzle.target) {
        setMessage('Wire complete. Target reached.');
        const bonus = next + 120;
        setScore(bonus);
        if (bonus > best) {
          setBest(bonus);
          if (typeof window !== 'undefined') localStorage.setItem('wordwire_best', String(bonus));
        }
      }
      setStep((s) => s + 1);
    } else {
      setMessage('Broken link. That branch dead-ends.');
      beep(180, 0.1, 'sawtooth');
    }
  };

  const reset = () => {
    setStep(0);
    setChain([]);
    setMessage('Puzzle reset. Rebuild the chain.');
  };

  const nextPuzzle = () => {
    setIdx((i) => i + 1);
    setStep(0);
    setChain([]);
    setMessage('New word circuit loaded.');
  };

  return (
    <GameFrame
      locale={locale}
      title="Word Wire"
      score={score}
      best={best}
      muted={muted}
      onToggleMuted={toggleMuted}
      controls="Pick one option each stage to transform start word into target"
      leaderboard={leaderboard}
    >
      <div className="space-y-4 max-w-2xl">
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">Start: {puzzle.start} · Target: {puzzle.target}</p>
          <p className="mt-2 text-sm text-zinc-300">Chain: {[puzzle.start, ...chain].join(' → ')}</p>
        </div>

        {!done && step < puzzle.options.length && (
          <div className="grid grid-cols-3 gap-2 max-w-md">
            {puzzle.options[step].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => choose(opt)}
                className="px-3 py-2 rounded border border-zinc-700 text-xs font-mono uppercase hover:border-zinc-500"
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <button type="button" onClick={reset} className="px-3 py-2 rounded border border-zinc-700 text-xs font-mono uppercase">Reset</button>
          <button type="button" onClick={nextPuzzle} className="px-3 py-2 rounded border border-zinc-700 text-xs font-mono uppercase">Next Puzzle</button>
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">{message}</p>
        </div>
      </div>
    </GameFrame>
  );
}
