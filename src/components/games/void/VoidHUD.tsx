'use client';

import { useTranslations } from 'next-intl';

interface VoidHUDProps {
  score: number;
  hiScore: number;
  combo: number;
  speedTier: 1 | 2 | 3;
  isMuted: boolean;
  onMuteToggle: () => void;
}

const TIER_LABELS: Record<1 | 2 | 3, string> = {
  1: 'speed_tier_1',
  2: 'speed_tier_2',
  3: 'speed_tier_3',
};

const TIER_COLORS: Record<1 | 2 | 3, string> = {
  1: 'text-red-800',
  2: 'text-purple-700',
  3: 'text-cyan-700',
};

export function VoidHUD({ score, hiScore, combo, speedTier, isMuted, onMuteToggle }: VoidHUDProps) {
  const t = useTranslations('Games.void');

  // Vignette opacity grows with speed tier
  const vignetteOpacity = speedTier === 1 ? 0.15 : speedTier === 2 ? 0.3 : 0.5;

  return (
    <div className="absolute inset-0 pointer-events-none z-10" aria-live="polite" aria-label={`Score: ${score}`}>

      {/* Speed-reactive vignette */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-[3000ms]"
        style={{
          opacity: vignetteOpacity,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.95) 100%)',
        }}
      />

      {/* Score — top centre */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center">
        <div
          className="font-mono text-4xl font-black text-white tabular-nums tracking-wider"
          style={{ textShadow: '0 0 20px rgba(255,20,50,0.8)' }}
        >
          {score.toLocaleString()}
        </div>
        <div className="text-red-900 font-mono text-xs tracking-widest uppercase mt-1">{t('score_label')}</div>
      </div>

      {/* Hi-score — top right */}
      <div className="absolute top-6 right-6 text-right">
        <div className="font-mono text-lg font-bold text-zinc-600 tabular-nums">{hiScore.toLocaleString()}</div>
        <div className="text-zinc-800 font-mono text-[10px] tracking-widest uppercase">{t('best_label')}</div>
      </div>

      {/* Combo — below hi-score (only when > 1x) */}
      {combo > 1 && (
        <div className="absolute top-20 right-6 text-right animate-pulse">
          <div
            className="font-mono text-xl font-black tabular-nums"
            style={{ color: combo === 4 ? '#00eeff' : combo === 3 ? '#ff8800' : '#ff4444', textShadow: '0 0 10px currentColor' }}
          >
            ×{combo}
          </div>
          <div className="text-zinc-700 font-mono text-[10px] tracking-widest uppercase">{t('combo_label')}</div>
        </div>
      )}

      {/* Speed tier badge — top left area, below mute */}
      <div className={`absolute top-14 left-4 font-mono text-[10px] tracking-widest uppercase ${TIER_COLORS[speedTier]}`}>
        {t(TIER_LABELS[speedTier])}
      </div>

      {/* Mute toggle — top left corner (pointer-events-auto so it's clickable) */}
      <button
        className="absolute top-4 right-20 z-40 pointer-events-auto text-zinc-700 hover:text-white font-mono text-[10px] tracking-widest uppercase transition-colors px-2 py-1 border border-zinc-900 hover:border-zinc-700 rounded"
        onClick={onMuteToggle}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? t('unmuted') : t('muted')}
      </button>

      {/* Progress bar — bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900">
        <div
          className="h-full bg-gradient-to-r from-red-900 to-red-500 transition-all duration-1000"
          style={{ width: `${Math.min((score / 5000) * 100, 100)}%` }}
        />
      </div>

      {/* Control hints — desktop only */}
      <div className="absolute bottom-8 left-6 text-zinc-800 font-mono text-xs hidden md:block space-y-0.5">
        <div>{t('controls_move')}</div>
        <div>{t('controls_mouse')}</div>
        <div>{t('controls_pause')}</div>
      </div>
    </div>
  );
}
