'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { GameCard } from './GameCard';
import type { GameMeta } from '@/lib/games-registry';
import type { Locale } from '@/i18n/request';
import { Rocket, Trophy, Gamepad2, Sparkles } from 'lucide-react';

interface GameHubProps {
  games: GameMeta[];
  upcomingGames?: GameMeta[];
  launchGames?: GameMeta[];
  locale: Locale;
}

export function GameHub({ games, upcomingGames = [], launchGames = [], locale }: GameHubProps) {
  const t = useTranslations('Games.hub');
  const featuredGame = games.find((game) => game.isFeatured) ?? games[0];

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
        <p className="text-red-800 font-mono text-xs tracking-widest uppercase mb-4 inline-flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          CodelithLabs / {t('section')}
        </p>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4">
          {t('title')}
        </h1>
        <p className="text-zinc-500 text-lg max-w-xl">{t('subtitle')}</p>
        <div className="flex flex-wrap gap-3 mt-8">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 px-4 py-3 text-sm font-mono uppercase tracking-widest text-zinc-300 transition-colors hover:border-zinc-700 hover:text-white"
          >
            ← {t('breadcrumb')}
          </Link>
          {featuredGame && (
            <Link
              href={`/${locale}/games/${featuredGame.slug}`}
              className="inline-flex items-center gap-2 rounded-xl border border-red-900/70 bg-red-950/40 px-4 py-3 text-sm font-mono uppercase tracking-widest text-red-300 transition-colors hover:border-red-700 hover:text-white"
            >
              <Gamepad2 className="h-4 w-4" /> Play {featuredGame.title}
            </Link>
          )}
        </div>
        <div className="flex gap-2 mt-6 flex-wrap">
          {(
            ['badge_privacy', 'badge_free', 'badge_offline'] as const
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

      {launchGames.length > 0 && (
        <div className="px-6 pb-20 max-w-5xl mx-auto">
          <h2 className="font-mono text-zinc-300 text-sm tracking-widest uppercase mb-6 border-b border-zinc-900 pb-3 inline-flex items-center gap-2">
            <Rocket className="h-4 w-4 text-cyan-300" /> New Launch Wave
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {launchGames.map((game) => (
              <GameCard key={`launch-${game.slug}`} game={game} locale={locale} />
            ))}
          </div>
        </div>
      )}

      {upcomingGames.length > 0 && (
          <div className="px-6 pb-20 max-w-5xl mx-auto">
            <h2 className="font-mono text-zinc-600 text-xs tracking-widest uppercase mb-6 border-b border-zinc-900 pb-3 inline-flex items-center gap-2">
              <Trophy className="h-3.5 w-3.5" /> Coming Soon
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingGames.map((game) => (
                <div
                  key={game.slug}
                  className="relative overflow-hidden rounded-lg border border-zinc-900 bg-zinc-950/50 opacity-60 cursor-not-allowed"
                >
                  <div className="relative aspect-video bg-zinc-900 overflow-hidden flex items-center justify-center">
                    <span className="font-mono text-zinc-700 text-xs uppercase tracking-widest">No Preview</span>
                    <span className="absolute top-2 left-2 bg-zinc-800 text-zinc-500 text-xs font-mono px-2 py-0.5 rounded uppercase tracking-wider">
                      Coming Soon
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-mono text-zinc-500 font-bold tracking-widest text-sm uppercase mb-1">
                      {game.title}
                    </h3>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {game.genre.map((g) => (
                        <span key={g} className="text-zinc-700 text-[10px] font-mono border border-zinc-900 px-1.5 py-0.5 rounded uppercase">
                          {g}
                        </span>
                      ))}
                    </div>
                    <p className="mt-3 text-zinc-700 text-xs font-mono tracking-widest uppercase">
                      {game.releaseDate ? `Est. ${new Date(game.releaseDate).toLocaleDateString('en', { month: 'short', year: 'numeric' })}` : 'TBD'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}
