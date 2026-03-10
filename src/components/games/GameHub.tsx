'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { GameCard } from './GameCard';
import type { GameMeta } from '@/lib/games-registry';
import type { Locale } from '@/i18n/request';

interface GameHubProps {
  games: GameMeta[];
  locale: Locale;
}

export function GameHub({ games, locale }: GameHubProps) {
  const t = useTranslations('Games.hub');

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-zinc-900 px-6 py-4 flex items-center justify-between">
        <Link
          href={`/${locale}`}
          className="text-zinc-600 hover:text-white font-mono text-xs tracking-widest uppercase transition-colors"
        >
          ← {t('breadcrumb')}
        </Link>
        <span className="text-zinc-700 font-mono text-xs tracking-widest uppercase">
          {t('section')}
        </span>
      </div>

      <div className="px-6 py-16 max-w-5xl mx-auto">
        <p className="text-red-800 font-mono text-xs tracking-widest uppercase mb-4">
          CodelithLabs / {t('section')}
        </p>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4">
          {t('title')}
        </h1>
        <p className="text-zinc-500 text-lg max-w-xl">{t('subtitle')}</p>
        <div className="flex gap-2 mt-6 flex-wrap">
          {(
            ['badge_privacy', 'badge_free', 'badge_noAccount', 'badge_offline'] as const
          ).map((key) => (
            <span
              key={key}
              className="text-zinc-600 text-xs font-mono border border-zinc-800 px-3 py-1 rounded-full"
            >
              ✓ {t(key)}
            </span>
          ))}
        </div>
      </div>

      <div className="px-6 pb-20 max-w-5xl mx-auto">
        {games.length === 0 ? (
          <div className="text-center py-20 text-zinc-700 font-mono">
            <p className="text-4xl mb-4">👾</p>
            <p>{t('empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((game) => (
              <GameCard key={game.slug} game={game} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
