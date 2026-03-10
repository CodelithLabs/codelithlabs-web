'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { GameMeta } from '@/lib/games-registry';
import type { Locale } from '@/i18n/request';

interface GameCardProps {
  game: GameMeta;
  locale: Locale;
}

export function GameCard({ game, locale }: GameCardProps) {
  const t = useTranslations('Games.card');
  const href = `/${locale}/games/${game.isMultiplayer ? 'multiplayer/' : ''}${game.slug}`;

  return (
    <Link
      href={href}
      className="group block relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 hover:border-red-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-900"
    >
      <div className="relative aspect-video bg-black overflow-hidden">
        <Image
          src={game.thumbnail}
          alt={`${game.title} game thumbnail`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        />
        {game.isFeatured && (
          <span className="absolute top-2 left-2 bg-red-900 text-red-200 text-xs font-mono px-2 py-0.5 rounded uppercase tracking-wider">
            {t('badge_featured')}
          </span>
        )}
        {game.isMultiplayer && (
          <span className="absolute top-2 right-2 bg-zinc-900/80 text-zinc-300 text-xs font-mono px-2 py-0.5 rounded uppercase tracking-wider">
            {t('badge_multiplayer')}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-mono text-white font-bold tracking-widest text-sm uppercase mb-1 group-hover:text-red-400 transition-colors">
          {game.title}
        </h3>
        <div className="flex flex-wrap gap-1 mt-2">
          {game.genre.map((g) => (
            <span
              key={g}
              className="text-zinc-600 text-[10px] font-mono border border-zinc-800 px-1.5 py-0.5 rounded uppercase"
            >
              {g}
            </span>
          ))}
        </div>
        <p className="mt-3 text-red-800 group-hover:text-red-500 text-xs font-mono tracking-widest uppercase transition-colors">
          {t('cta')}
        </p>
      </div>
    </Link>
  );
}
