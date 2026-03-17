'use client';

import { useEffect, useState } from 'react';
import { getOrCreateGameDeviceId, getStoredPlayerProfile } from '@/components/games/shared/playerProfile';
import { useSession } from 'next-auth/react';

export interface LeaderboardEntry {
  rank?: number;
  name: string;
  score: number;
  country?: string;
  state?: string;
  district?: string;
}

export function usePseudoLeaderboard(slug: string, playerScore: number) {
  const { status } = useSession();
  const [entries, setEntries] = useState<Array<LeaderboardEntry & { rank: number }>>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadLeaderboard() {
      try {
        const res = await fetch(`/api/games/leaderboard?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' });
        if (!res.ok) return;
        const json = (await res.json()) as { leaderboard?: Array<LeaderboardEntry & { rank: number }> };
        if (!cancelled && Array.isArray(json.leaderboard)) {
          setEntries(json.leaderboard);
        }
      } catch {
        // Keep empty fallback.
      }
    }

    void loadLeaderboard();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (typeof window === 'undefined' || status !== 'authenticated') return;

    const score = Math.floor(playerScore);
    if (!Number.isFinite(score) || score <= 0) return;

    const submittedKey = `games_leaderboard_submitted_${slug}`;
    const prevSubmitted = Number(localStorage.getItem(submittedKey) ?? 0);
    if (score <= prevSubmitted) return;

    const profile = getStoredPlayerProfile();
    const deviceId = getOrCreateGameDeviceId();

    const body = {
      slug,
      score,
      deviceId,
      playerName: profile?.playerName ?? 'Player',
      country: profile?.country ?? 'Unknown',
      state: profile?.state ?? 'Unknown',
      district: profile?.district ?? 'Unknown',
    };

    void fetch('/api/games/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then((res) => {
      if (res.ok || res.status === 202) {
        localStorage.setItem(submittedKey, String(score));
        void fetch(`/api/games/leaderboard?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' })
          .then((refresh) => refresh.ok ? refresh.json() : null)
          .then((json) => {
            if (json && Array.isArray(json.leaderboard)) {
              setEntries(json.leaderboard as Array<LeaderboardEntry & { rank: number }>);
            }
          });
      }
    }).catch(() => {
      // Ignore network issues; local game should continue.
    });
  }, [slug, playerScore, status]);

  return entries;
}
