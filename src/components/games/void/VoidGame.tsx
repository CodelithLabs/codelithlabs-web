'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import type { Locale } from '@/i18n/request';
import { VoidHUD } from './VoidHUD';
import { VoidStartScreen } from './VoidStartScreen';
import { useVoidGame } from './useVoidGame';

export type GameState = 'start' | 'playing' | 'dead';

interface VoidGameProps {
  locale: Locale;
}

function getInitialHiScore(): number {
  if (typeof window === 'undefined') {
    return 0;
  }

  try {
    const saved = window.localStorage.getItem('codelithlabs_void_hiscore');
    return saved ? Number.parseInt(saved, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

export default function VoidGame({ locale }: VoidGameProps) {
  const t = useTranslations('Games.void');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [hiScore, setHiScore] = useState(getInitialHiScore);

  const { startGame, resetGame } = useVoidGame({
    canvasRef,
    gameState,
    onScoreUpdate: setScore,
    onGameOver: (finalScore) => {
      setGameState('dead');
      setHiScore((currentHi) => {
        const nextHi = Math.max(finalScore, currentHi);
        try {
          localStorage.setItem('codelithlabs_void_hiscore', String(nextHi));
        } catch {
          // ignore storage failures
        }
        return nextHi;
      });
    },
  });

  const handleStart = () => {
    setScore(0);
    setGameState('playing');
    startGame();
  };

  const handleRestart = () => {
    resetGame();
    handleStart();
  };

  return (
    <div className="relative w-full h-full bg-black select-none touch-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-label="VOID - 3D Horror Tunnel Runner Game"
        role="img"
      />

      {gameState === 'playing' && <VoidHUD score={score} hiScore={hiScore} />}

      {gameState !== 'playing' && (
        <VoidStartScreen
          gameState={gameState}
          score={score}
          hiScore={hiScore}
          locale={locale}
          onStart={handleStart}
          onRestart={handleRestart}
        />
      )}

      <Link
        href={`/${locale}/games`}
        className="absolute top-4 left-4 z-50 text-zinc-700 hover:text-white font-mono text-xs tracking-widest uppercase transition-colors"
        aria-label="Back to games"
      >
        {t('back_games')}
      </Link>
    </div>
  );
}
