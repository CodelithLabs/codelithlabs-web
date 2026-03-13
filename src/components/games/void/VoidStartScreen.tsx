'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/request';
import type { GameState } from './VoidGame';

interface Props {
  gameState: GameState;
  score: number;
  hiScore: number;
  bestCombo: number;
  scoreConsent: 'global' | 'local' | null;
  canUseGlobalScore: boolean;
  globalLeaderboard: Array<{ score: number; at: number; player: string }>;
  isReady: boolean;
  isStarting: boolean;
  locale: Locale;
  onStart: () => void;
  onRestart: () => void;
  onConsentChoice: (choice: 'global' | 'local') => void;
  onGlobalSignIn: () => void;
}

export function VoidStartScreen({
  gameState,
  score,
  hiScore,
  bestCombo,
  scoreConsent,
  canUseGlobalScore,
  globalLeaderboard,
  isReady,
  isStarting,
  locale,
  onStart,
  onRestart,
  onConsentChoice,
  onGlobalSignIn,
}: Props) {
  const t = useTranslations('Games.void');
  const isDead = gameState === 'dead';

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/85 backdrop-blur-sm">
      <div className="text-center px-6 max-w-md w-full">
        <div className="mb-8">
          <h1
            className="font-mono text-8xl font-black tracking-widest text-white"
            style={{
              textShadow:
                '0 0 40px rgba(255,20,50,0.6), -3px 0 rgba(0,200,255,0.2), 3px 0 rgba(255,0,100,0.2)',
            }}
          >
            {t('title')}
          </h1>
          <p className="text-red-900 font-mono text-xs tracking-widest uppercase mt-2">
            — {isDead ? t('tagline_dead') : t('tagline')} —
          </p>
        </div>

        {isDead && (
          <div className="mb-8 border border-red-950 bg-red-950/20 rounded p-6">
            <div className="text-zinc-500 font-mono text-xs tracking-widest uppercase mb-1">{t('your_score')}</div>
            <div
              className="font-mono text-5xl font-black text-white mb-4"
              style={{ textShadow: '0 0 20px rgba(255,20,50,0.6)' }}
            >
              {score.toLocaleString()}
            </div>
            {score >= hiScore && hiScore > 0 && (
              <div className="text-red-500 font-mono text-sm tracking-widest uppercase animate-pulse">
                {t('new_best')}
              </div>
            )}
            <div className="mt-4 text-zinc-600 font-mono text-xs space-y-1">
              <div>
                {t('best_label')}: {hiScore.toLocaleString()}
              </div>
              {bestCombo > 1 && (
                <div>
                  {t('best_combo')}: ×{bestCombo}
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={isDead ? onRestart : onStart}
          disabled={isStarting || (!isDead && !scoreConsent)}
          className="w-full py-4 border border-red-900 text-red-400 hover:bg-red-950/40 hover:text-red-300 font-mono text-sm tracking-widest uppercase transition-all duration-200 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-red-900"
          autoFocus
        >
          {isStarting ? t('loading') : isDead ? `↻ ${t('cta_restart')}` : `▶ ${t('cta_play')}`}
        </button>

        {!isDead && !isReady && (
          <p className="mb-5 text-zinc-600 font-mono text-[11px] tracking-widest uppercase animate-pulse">
            {t('loading')}
          </p>
        )}

        {!isDead && !scoreConsent && (
          <div className="mb-5 border border-zinc-900 rounded p-4 bg-zinc-950/60 text-left">
            <div className="text-zinc-200 font-mono text-xs tracking-widest uppercase mb-2">
              {t('score_consent_title')}
            </div>
            <p className="text-zinc-500 font-mono text-[11px] leading-relaxed mb-4">
              {t('score_consent_desc')}
            </p>
            <div className="space-y-2">
              <button
                onClick={() => onConsentChoice('local')}
                className="w-full py-2 rounded border border-zinc-800 text-zinc-300 hover:bg-zinc-900/70 font-mono text-[11px] tracking-widest uppercase transition-colors"
              >
                {t('score_consent_local')}
              </button>
              {canUseGlobalScore ? (
                <button
                  onClick={() => onConsentChoice('global')}
                  className="w-full py-2 rounded border border-blue-900 text-blue-300 hover:bg-blue-950/40 font-mono text-[11px] tracking-widest uppercase transition-colors"
                >
                  {t('score_consent_global')}
                </button>
              ) : (
                <button
                  onClick={onGlobalSignIn}
                  className="w-full py-2 rounded border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/70 font-mono text-[11px] tracking-widest uppercase transition-colors"
                >
                  {t('score_consent_signin')}
                </button>
              )}
            </div>
          </div>
        )}

        {!isDead && scoreConsent && (
          <p className="mb-5 text-zinc-600 font-mono text-[11px] tracking-widest uppercase">
            {scoreConsent === 'global' ? t('score_mode_global') : t('score_mode_local')}
          </p>
        )}

        {!isDead && (
          <div className="text-zinc-700 font-mono text-xs space-y-1 mb-6">
            <p>{t('controls_move')}</p>
            <p>{t('controls_mouse')}</p>
            <p>{t('controls_touch')}</p>
          </div>
        )}

        {!isDead && scoreConsent === 'global' && globalLeaderboard.length > 0 && (
          <div className="mb-6 border border-blue-950 bg-blue-950/10 rounded p-4 text-left">
            <div className="text-blue-300 font-mono text-xs tracking-widest uppercase mb-3">
              {t('global_leaderboard_title')}
            </div>
            <ol className="space-y-1">
              {globalLeaderboard.slice(0, 5).map((entry, idx) => (
                <li
                  key={`${entry.at}-${entry.player}-${entry.score}`}
                  className="flex items-center justify-between font-mono text-[11px]"
                >
                  <span className="text-zinc-500">#{idx + 1} {entry.player}</span>
                  <span className="text-zinc-200">{entry.score.toLocaleString()}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="mt-8 border-t border-zinc-900 pt-6">
          <p className="text-zinc-700 font-mono text-xs mb-2">{t('hollowmind_teaser')}</p>
          <span className="text-red-900 font-mono text-xs tracking-widest uppercase">
            {t('hollowmind_link')}
          </span>
          <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
            <Link
              href={`/${locale}/games`}
              className="text-zinc-500 hover:text-white font-mono text-xs tracking-widest uppercase transition-colors"
            >
              {t('back_games')}
            </Link>
            <Link
              href={`/${locale}`}
              className="text-zinc-700 hover:text-zinc-300 font-mono text-xs tracking-widest uppercase transition-colors"
            >
              CodelithLabs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
