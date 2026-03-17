'use client';

import { useMemo, useState } from 'react';
import type { Locale } from '@/i18n/request';
import { GameFrame } from '@/components/games/shared/GameFrame';
import { useGameAudio } from '@/components/games/shared/useGameAudio';
import { usePseudoLeaderboard } from '@/components/games/shared/usePseudoLeaderboard';

const SUSPECTS = ['Alex', 'Blair', 'Casey', 'Drew'];

interface CaseData {
  culprit: string;
  clueA: string;
  clueB: string;
  clueC: string;
}

const CASES: CaseData[] = [
  { culprit: 'Alex', clueA: 'The culprit was seen near the red car.', clueB: 'Only Alex and Drew own red items.', clueC: 'Drew has an alibi.' },
  { culprit: 'Blair', clueA: 'The culprit is left-handed.', clueB: 'Blair and Casey are left-handed.', clueC: 'Casey was on a live call.' },
  { culprit: 'Casey', clueA: 'The culprit wears size 9 shoes.', clueB: 'Alex wears size 8, Blair size 10.', clueC: 'Drew wears size 11.' },
  { culprit: 'Drew', clueA: 'The culprit knew the vault code.', clueB: 'Only Drew and Alex had code access.', clueC: 'Alex was locked out by admin.' },
];

interface Props { locale: Locale }

export default function DetectiveGame({ locale }: Props) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => (typeof window !== 'undefined' ? Number(localStorage.getItem('detective_best') ?? 0) : 0));
  const [picked, setPicked] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('Read clues and pick the most likely suspect.');
  const { muted, beep, toggleMuted } = useGameAudio();

  const data = CASES[round % CASES.length];
  const leaderboard = usePseudoLeaderboard('detective', score || best);

  const clues = useMemo(() => [data.clueA, data.clueB, data.clueC], [data]);

  const submit = (name: string) => {
    if (picked) return;
    setPicked(name);
    if (name === data.culprit) {
      const next = score + 120;
      setScore(next);
      setFeedback('Correct deduction. Case solved.');
      beep(860, 0.08, 'triangle');
      if (next > best) {
        setBest(next);
        if (typeof window !== 'undefined') localStorage.setItem('detective_best', String(next));
      }
    } else {
      setFeedback(`Wrong call. Culprit was ${data.culprit}.`);
      beep(170, 0.1, 'sawtooth');
    }
  };

  const nextCase = () => {
    setRound((r) => r + 1);
    setPicked(null);
    setFeedback('New file opened. Analyze clues.');
  };

  return (
    <GameFrame
      locale={locale}
      title="Detective Mind"
      score={score}
      best={best}
      muted={muted}
      onToggleMuted={toggleMuted}
      controls="Read clues, choose suspect, then advance to next case"
      leaderboard={leaderboard}
    >
      <div className="space-y-4 max-w-2xl">
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">Case #{round + 1}</p>
          <ul className="space-y-2">
            {clues.map((clue, idx) => (
              <li key={idx} className="text-sm text-zinc-300">• {clue}</li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-2 max-w-sm">
          {SUSPECTS.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => submit(name)}
              disabled={Boolean(picked)}
              className={`px-3 py-2 rounded border text-xs font-mono uppercase ${picked === name ? 'border-cyan-500 text-cyan-300' : 'border-zinc-700 text-zinc-200 hover:border-zinc-500'}`}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={nextCase} className="px-3 py-2 rounded border border-zinc-700 text-xs font-mono uppercase">Next Case</button>
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-500" aria-live="polite">{feedback}</p>
        </div>
      </div>
    </GameFrame>
  );
}
