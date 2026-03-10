'use client';

import { useTranslations } from 'next-intl';

interface VoidHUDProps {
  score: number;
  hiScore: number;
}

export function VoidHUD({ score, hiScore }: VoidHUDProps) {
  const t = useTranslations('Games.void');

  return (
    <div className="absolute inset-0 pointer-events-none z-10" aria-live="polite" aria-label={`Score: ${score}`}>
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center">
        <div
          className="font-mono text-4xl font-black text-white tabular-nums tracking-wider"
          style={{ textShadow: '0 0 20px rgba(255,20,50,0.8)' }}
        >
          {score.toLocaleString()}
        </div>
        <div className="text-red-900 font-mono text-xs tracking-widest uppercase mt-1">{t('score_label')}</div>
      </div>

      <div className="absolute top-6 right-6 text-right">
        <div className="font-mono text-lg font-bold text-zinc-600 tabular-nums">{hiScore.toLocaleString()}</div>
        <div className="text-zinc-800 font-mono text-[10px] tracking-widest uppercase">{t('best_label')}</div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900">
        <div
          className="h-full bg-gradient-to-r from-red-900 to-red-500 transition-all duration-1000"
          style={{ width: `${Math.min((score / 5000) * 100, 100)}%` }}
        />
      </div>

      <div className="absolute bottom-8 left-6 text-zinc-800 font-mono text-xs hidden md:block">
        <div>{t('controls_move')}</div>
        <div>{t('controls_mouse')}</div>
      </div>
    </div>
  );
}
