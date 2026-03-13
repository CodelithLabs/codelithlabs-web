'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import type { Locale } from '@/i18n/request';
import { useImmersiveMode } from '@/components/layout/immersive-mode';
import { VoidHUD } from './VoidHUD';
import { VoidStartScreen } from './VoidStartScreen';
import { VoidVirtualStick } from './VoidVirtualStick';
import { useVoidGame } from './useVoidGame';
import { useVoidAudio } from './useVoidAudio';
import { trackClientAnalytics } from '@/lib/analytics/client';

export type GameState = 'start' | 'playing' | 'dead';

interface VoidGameProps {
  locale: Locale;
}

type ScoreConsent = 'global' | 'local';

interface LeaderboardEntry {
  score: number;
  at: number;
  player: string;
}

const VOID_HISCORE_KEY = 'codelithlabs_void_hiscore';
const VOID_SCORE_CONSENT_KEY = 'codelithlabs_void_score_consent';
const VOID_GLOBAL_SCOREBOARD_KEY = 'codelithlabs_void_global_scoreboard_v1';

function getInitialHiScore(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const saved = window.localStorage.getItem(VOID_HISCORE_KEY);
    return saved ? Number.parseInt(saved, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

function getInitialConsent(): ScoreConsent | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = window.localStorage.getItem(VOID_SCORE_CONSENT_KEY);
    return saved === 'global' || saved === 'local' ? saved : null;
  } catch {
    return null;
  }
}

function getInitialGlobalScoreboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(VOID_GLOBAL_SCOREBOARD_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LeaderboardEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((entry) => typeof entry?.score === 'number' && typeof entry?.at === 'number' && typeof entry?.player === 'string')
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  } catch {
    return [];
  }
}

export default function VoidGame({ locale }: VoidGameProps) {
  const t = useTranslations('Games.void');
  const router = useRouter();
  const { data: session } = useSession();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setImmersive } = useImmersiveMode();

  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore]         = useState(0);
  const [hiScore, setHiScore]     = useState(getInitialHiScore);
  const [combo, setCombo]         = useState(1);
  const [bestCombo, setBestCombo] = useState(1);
  const [speedTier, setSpeedTier] = useState<1 | 2 | 3>(1);
  const [flashKey, setFlashKey]   = useState(0);   // increment to trigger flash animation
  const [isPaused, setIsPaused]   = useState(false);
  const [pendingStart, setPendingStart] = useState(false);
  const [scoreConsent, setScoreConsent] = useState<ScoreConsent | null>(getInitialConsent);
  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardEntry[]>(getInitialGlobalScoreboard);

  // Virtual stick: shared mutable ref between VoidVirtualStick and useVoidGame
  const virtualStickRef = useRef({ x: 0, y: 0 });

  // Audio
  const audio = useVoidAudio();
  const [isMuted, setIsMuted] = useState(false);

  const handleMuteToggle = useCallback(() => {
    const next = !isMuted;
    setIsMuted(next);
    audio.setMuted(next);
  }, [audio, isMuted]);

  const handleStickMove = useCallback((x: number, y: number) => {
    virtualStickRef.current = { x, y };
  }, []);

  const { startGame, resetGame, resumeGame, endGame, isReady } = useVoidGame({
    canvasRef,
    onScoreUpdate: setScore,
    onGameOver: (finalScore) => {
      setGameState('dead');
      setPendingStart(false);
      setIsPaused(false);
      audio.playDeath();

      void trackClientAnalytics({
        eventName: 'void_game_over',
        eventType: 'GAME_USAGE',
        path: `/${locale}/games/void`,
        source: 'void_game',
        locale,
        gameSlug: 'void',
        metadata: {
          score: finalScore,
          best_combo: bestCombo,
          hi_score: Math.max(finalScore, hiScore),
        },
      });

      setHiScore((currentHi) => {
        const nextHi = Math.max(finalScore, currentHi);
        try { localStorage.setItem(VOID_HISCORE_KEY, String(nextHi)); } catch { /* ignore */ }
        return nextHi;
      });

      const canSubmitGlobal = scoreConsent === 'global' && !!session?.user;
      if (canSubmitGlobal) {
        const playerName = session.user?.name || session.user?.email || 'Player';
        setGlobalLeaderboard((prev) => {
          const next = [...prev, { score: finalScore, at: Date.now(), player: playerName }]
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
          try {
            localStorage.setItem(VOID_GLOBAL_SCOREBOARD_KEY, JSON.stringify(next));
          } catch {
            // ignore storage failures
          }
          return next;
        });
      }
    },
    onComboUpdate: (c) => {
      setCombo(c);
      setBestCombo((prev) => Math.max(prev, c));
    },
    onNearMiss: () => { audio.playNearMiss(); },
    onSpawn:    () => { audio.playSpawn(); },
    onMilestone: () => { audio.playMilestone(); },
    onFlash:    () => { setFlashKey((k) => k + 1); },
    onSpeedTierChange: setSpeedTier,
    onPause:    () => { setIsPaused(true); },
    onResume:   () => { setIsPaused(false); },
    virtualStickRef,
  });

  useEffect(() => {
    setImmersive(gameState === 'playing');
    return () => {
      setImmersive(false);
    };
  }, [gameState, setImmersive]);

  const beginGame = useCallback(() => {
    setPendingStart(false);
    setScore(0);
    setCombo(1);
    setBestCombo(1);
    setSpeedTier(1);
    setFlashKey(0);
    setIsPaused(false);
    setGameState('playing');
    void trackClientAnalytics({
      eventName: 'void_game_start',
      eventType: 'GAME_USAGE',
      path: `/${locale}/games/void`,
      source: 'void_game',
      locale,
      gameSlug: 'void',
      metadata: {
        score_consent: scoreConsent ?? 'unset',
        authenticated: Boolean(session?.user),
      },
    });
    startGame();
  }, [locale, scoreConsent, session?.user, startGame]);

  useEffect(() => {
    if (pendingStart && isReady && gameState !== 'playing') {
      const rafId = requestAnimationFrame(() => {
        beginGame();
      });
      return () => cancelAnimationFrame(rafId);
    }
  }, [beginGame, gameState, isReady, pendingStart]);

  const handleStart = useCallback(() => {
    if (!scoreConsent) return;
    audio.initAudio();
    if (!isReady) {
      setPendingStart(true);
      return;
    }
    beginGame();
  }, [audio, beginGame, isReady, scoreConsent]);

  const handleRestart = useCallback(() => {
    resetGame();
    setPendingStart(false);
    handleStart();
  }, [handleStart, resetGame]);

  const handleConsentChoice = useCallback((choice: ScoreConsent) => {
    const resolvedChoice: ScoreConsent = choice === 'global' && !session?.user ? 'local' : choice;
    setScoreConsent(resolvedChoice);
    try {
      localStorage.setItem(VOID_SCORE_CONSENT_KEY, resolvedChoice);
    } catch {
      // ignore storage failures
    }
  }, [session?.user]);

  const handlePauseResume = useCallback(() => {
    resumeGame();
  }, [resumeGame]);

  const handleSaveAndEnd = useCallback(() => {
    endGame();
  }, [endGame]);

  const handleBackToHub = useCallback(() => {
    resetGame();
    setPendingStart(false);
    setGameState('start');
    setIsPaused(false);
    router.push(`/${locale}/games`);
  }, [locale, resetGame, router]);

  const handleSignInForGlobal = useCallback(() => {
    void signIn('google', { callbackUrl: `/${locale}/games/void` });
  }, [locale]);

  return (
    <div className="relative w-full h-full bg-black select-none touch-none overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-label="VOID - 3D Horror Tunnel Runner Game"
        role="img"
      />

      {/* Red flash overlay on collision */}
      {flashKey > 0 && (
        <div
          key={flashKey}
          className="absolute inset-0 pointer-events-none z-20 bg-red-600/45 animate-void-flash"
        />
      )}

      {gameState === 'playing' && (
        <VoidHUD
          score={score}
          hiScore={hiScore}
          combo={combo}
          speedTier={speedTier}
          isMuted={isMuted}
          onMuteToggle={handleMuteToggle}
        />
      )}

      {/* Pause overlay */}
      {gameState === 'playing' && isPaused && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="text-center w-full max-w-sm px-6">
            <div
              className="font-mono text-5xl font-black text-white tracking-widest mb-3"
              style={{ textShadow: '0 0 30px rgba(255,20,50,0.5)' }}
            >
              {t('paused')}
            </div>
            <div className="text-zinc-600 font-mono text-xs tracking-widest uppercase">
              {t('controls_pause')}
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={handlePauseResume}
                className="w-full py-3 rounded border border-zinc-700 text-zinc-200 hover:bg-zinc-900/70 font-mono text-xs tracking-widest uppercase transition-colors"
              >
                {t('resume_cta')}
              </button>
              <button
                onClick={handleSaveAndEnd}
                className="w-full py-3 rounded border border-red-900 text-red-400 hover:bg-red-950/40 font-mono text-xs tracking-widest uppercase transition-colors"
              >
                {t('pause_save_end')}
              </button>
              <button
                onClick={handleBackToHub}
                className="w-full py-3 rounded border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/70 font-mono text-xs tracking-widest uppercase transition-colors"
              >
                {t('pause_back_hub')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Virtual thumbstick — only visible during play on touch devices */}
      {gameState === 'playing' && !isPaused && (
        <VoidVirtualStick onMove={handleStickMove} />
      )}

      {gameState !== 'playing' && (
        <VoidStartScreen
          gameState={gameState}
          score={score}
          hiScore={hiScore}
          bestCombo={bestCombo}
          scoreConsent={scoreConsent}
          canUseGlobalScore={!!session?.user}
          globalLeaderboard={globalLeaderboard}
          isReady={isReady}
          isStarting={pendingStart}
          locale={locale}
          onStart={handleStart}
          onRestart={handleRestart}
          onConsentChoice={handleConsentChoice}
          onGlobalSignIn={handleSignInForGlobal}
        />
      )}

      <div className="absolute top-4 left-4 z-50 flex items-center gap-3">
        <Link
          href={`/${locale}/games`}
          className="text-zinc-700 hover:text-white font-mono text-xs tracking-widest uppercase transition-colors"
          aria-label="Back to games"
        >
          {t('back_games')}
        </Link>
        <Link
          href={`/${locale}`}
          className="text-zinc-800 hover:text-zinc-300 font-mono text-xs tracking-widest uppercase transition-colors"
          aria-label="Back to home"
        >
          CodelithLabs
        </Link>
      </div>
    </div>
  );
}
