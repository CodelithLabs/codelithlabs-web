'use client';

import { useMemo, useState } from 'react';
import type { Locale } from '@/i18n/request';
import { GameFrame } from '@/components/games/shared/GameFrame';
import { useGameAudio } from '@/components/games/shared/useGameAudio';
import { usePseudoLeaderboard } from '@/components/games/shared/usePseudoLeaderboard';

const WORDS = ['JAVASCRIPT', 'TYPESCRIPT', 'ALGORITHM', 'FUNCTION', 'REACT', 'NEXTJS', 'PRIVACY', 'SECURITY', 'PUZZLE', 'BROWSER'];
const MAX_WRONG = 6;

interface Props {
  locale: Locale;
}

function pickWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

export default function HangmanGame({ locale }: Props) {
  const [word, setWord] = useState(() => pickWord());
  const [guessed, setGuessed] = useState<Set<string>>(() => new Set());
  const [wrong, setWrong] = useState(0);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => (typeof window !== 'undefined' ? Number(localStorage.getItem('hangman_best') ?? 0) : 0));
  const { muted, beep, toggleMuted } = useGameAudio();

  const leaderboard = usePseudoLeaderboard('hangman', score || best);

  const letters = useMemo(() => word.split(''), [word]);
  const solved = letters.every((ch) => guessed.has(ch));
  const lost = wrong >= MAX_WRONG;

  const display = letters.map((ch) => (guessed.has(ch) ? ch : '_')).join(' ');

  const guess = (letter: string) => {
    if (solved || lost || guessed.has(letter)) return;

    setGuessed((prev) => {
      const next = new Set(prev);
      next.add(letter);
      return next;
    });

    if (word.includes(letter)) {
      setScore((s) => s + 14);
      beep(700, 0.05, 'sine');
      return;
    }

    setWrong((w) => w + 1);
    beep(200, 0.12, 'sawtooth');
  };

  const nextWord = () => {
    const finishedScore = solved ? score + Math.max(0, (MAX_WRONG - wrong) * 30) : score;
    if (finishedScore > best) {
      setBest(finishedScore);
      if (typeof window !== 'undefined') localStorage.setItem('hangman_best', String(finishedScore));
    }

    setScore((s) => (solved ? s + Math.max(0, (MAX_WRONG - wrong) * 30) : s));
    setWord(pickWord());
    setGuessed(new Set());
    setWrong(0);
  };

  return (
    <GameFrame
      locale={locale}
      title="Hangman"
      score={score}
      best={best}
      muted={muted}
      onToggleMuted={toggleMuted}
      controls="Tap letters to guess the hidden word"
      leaderboard={leaderboard}
    >
      <div className="space-y-4 max-w-2xl">
        <div className="rounded-lg border border-zinc-800 p-4 bg-zinc-950">
          <p className="text-sm font-mono tracking-[0.22em] text-zinc-200 break-all">{display}</p>
          <p className="mt-2 text-xs font-mono uppercase tracking-widest text-zinc-500">Wrong guesses: {wrong}/{MAX_WRONG}</p>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-9 gap-2">
          {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((ch) => {
            const used = guessed.has(ch);
            return (
              <button
                key={ch}
                type="button"
                onClick={() => guess(ch)}
                disabled={used || solved || lost}
                className={`px-2 py-2 rounded border text-xs font-mono ${
                  used ? 'border-zinc-800 text-zinc-600' : 'border-zinc-700 text-zinc-200 hover:border-zinc-500'
                }`}
              >
                {ch}
              </button>
            );
          })}
        </div>

        {(solved || lost) && (
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">
              {solved ? 'Solved!' : `Word was ${word}`}
            </p>
            <button type="button" onClick={nextWord} className="px-3 py-2 rounded border border-zinc-700 text-xs font-mono uppercase">
              Next Word
            </button>
          </div>
        )}
      </div>
    </GameFrame>
  );
}
