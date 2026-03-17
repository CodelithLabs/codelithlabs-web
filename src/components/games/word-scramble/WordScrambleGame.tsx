'use client';

import { useState } from 'react';
import type { Locale } from '@/i18n/request';
import { GameFrame } from '@/components/games/shared/GameFrame';
import { usePseudoLeaderboard } from '@/components/games/shared/usePseudoLeaderboard';
import { useGameAudio } from '@/components/games/shared/useGameAudio';

const WORDS = ['privacy', 'typescript', 'browser', 'analytics', 'security', 'algorithm', 'developer', 'frontend', 'refactor', 'performance'];

function scramble(word: string) {
  return word.split('').sort(() => Math.random() - 0.5).join('');
}

function pickWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

interface Props { locale: Locale }

export default function WordScrambleGame({ locale }: Props) {
  const [target, setTarget] = useState(() => pickWord());
  const [scrambled, setScrambled] = useState(() => scramble(target));
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => (typeof window !== 'undefined' ? Number(localStorage.getItem('word_scramble_best') ?? 0) : 0));
  const [message, setMessage] = useState('Unscramble the word!');
  const { muted, beep, toggleMuted } = useGameAudio();

  const leaderboard = usePseudoLeaderboard('word-scramble', score);

  const nextWord = () => {
    const nw = pickWord();
    setTarget(nw);
    setScrambled(scramble(nw));
    setInput('');
    setMessage('New word loaded');
  };

  const submit = () => {
    if (input.toLowerCase().trim() === target) {
      const ns = score + 100;
      setScore(ns);
      setMessage('Correct! +100');
      beep(900, 0.09, 'triangle');
      if (ns > best) {
        setBest(ns);
        if (typeof window !== 'undefined') localStorage.setItem('word_scramble_best', String(ns));
      }
    } else {
      setMessage(`Not quite. Hint: starts with ${target[0].toUpperCase()}`);
      beep(240, 0.08, 'sawtooth');
    }
  };

  return (
    <GameFrame
      locale={locale}
      title="Word Scramble"
      score={score}
      best={best}
      muted={muted}
      onToggleMuted={toggleMuted}
      controls="Type the correct word, press submit, then generate next round"
      leaderboard={leaderboard}
    >
      <div className="space-y-4">
        <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">Scrambled</p>
        <div className="text-3xl font-black tracking-[0.25em] text-center py-4 rounded-lg border border-zinc-800 bg-zinc-900">{scrambled}</div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3 py-2 rounded border border-zinc-700 bg-zinc-950 text-zinc-100"
            placeholder="Type answer..."
            aria-label="Unscrambled word input"
          />
          <button onClick={submit} className="px-4 py-2 rounded border border-emerald-700 text-emerald-300 font-mono text-xs uppercase">Submit</button>
          <button onClick={nextWord} className="px-4 py-2 rounded border border-zinc-700 font-mono text-xs uppercase">Next</button>
        </div>
        <p className="text-sm text-zinc-400" aria-live="polite">{message}</p>
      </div>
    </GameFrame>
  );
}
