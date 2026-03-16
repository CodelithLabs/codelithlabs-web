'use client';

import { useMemo } from 'react';

export interface LeaderboardEntry {
  name: string;
  score: number;
}

function seededRandom(seed: number) {
  let x = seed % 2147483647;
  if (x <= 0) x += 2147483646;
  return () => (x = (x * 16807) % 2147483647) / 2147483647;
}

function hashSlug(slug: string): number {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const BOT_NAMES = ['Nova', 'Echo', 'Pixel', 'Blitz', 'Astra', 'Rook', 'Bolt', 'Cipher', 'Vega', 'Zen'];

export function usePseudoLeaderboard(slug: string, playerScore: number) {
  return useMemo(() => {
    const rnd = seededRandom(hashSlug(slug));
    const bots: LeaderboardEntry[] = BOT_NAMES.map((name) => ({
      name,
      score: Math.max(1, Math.floor(rnd() * 900 + 80)),
    }));

    const player = {
      name: 'You',
      score: Math.max(0, Math.min(999999, Math.floor(playerScore))),
    };

    return [...bots, player]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((entry, idx) => ({ ...entry, rank: idx + 1 }));
  }, [slug, playerScore]);
}
