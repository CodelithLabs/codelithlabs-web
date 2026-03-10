'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/request';
import type { GameState } from './VoidGame';

interface Props {
  gameState: GameState;
  score: number;
  hiScore: number;
  locale: Locale;
  onStart: () => void;
  onRestart: () => void;
}

export function VoidStartScreen({
  gameState,
  score,
  hiScore,
  locale,
  onStart,
  onRestart,
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
            <div className="mt-4 text-zinc-600 font-mono text-xs">
              <span>
                {t('best_label')}: {hiScore.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={isDead ? onRestart : onStart}
          className="w-full py-4 border border-red-900 text-red-400 hover:bg-red-950/40 hover:text-red-300 font-mono text-sm tracking-widest uppercase transition-all duration-200 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-red-900"
          autoFocus
        >
          {isDead ? `↻ ${t('cta_restart')}` : `▶ ${t('cta_play')}`}
        </button>

        {!isDead && (
          <div className="text-zinc-700 font-mono text-xs space-y-1 mb-6">
            <p>{t('controls_move')}</p>
            <p>{t('controls_mouse')}</p>
            <p>{t('controls_touch')}</p>
          </div>
        )}

        <div className="mt-8 border-t border-zinc-900 pt-6">
          <p className="text-zinc-700 font-mono text-xs mb-2">{t('hollowmind_teaser')}</p>
          <Link
            href={`/${locale}/games/hollowmind`}
            className="text-red-900 hover:text-red-700 font-mono text-xs tracking-widest uppercase transition-colors"
          >
            {t('hollowmind_link')}
          </Link>
        </div>
      </div>
    </div>
  );
}
