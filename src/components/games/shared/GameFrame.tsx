'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Locale } from '@/i18n/request';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Lock, Trophy, UserCircle2, Sparkles } from 'lucide-react';
import {
  getStoredPlayerProfile,
  savePlayerProfile,
  type PlayerProfile,
} from '@/components/games/shared/playerProfile';

interface GameFrameProps {
  locale: Locale;
  title: string;
  score: number;
  best: number;
  muted: boolean;
  onToggleMuted: () => void;
  controls: string;
  requiresLogin?: boolean;
  leaderboard?: Array<{
    rank: number;
    name: string;
    score: number;
    country?: string;
    state?: string;
    district?: string;
  }>;
  children: ReactNode;
}

export function GameFrame({
  locale,
  title,
  score,
  best,
  muted,
  onToggleMuted,
  controls,
  requiresLogin = true,
  leaderboard,
  children,
}: GameFrameProps) {
  const { status } = useSession();
  const pathname = usePathname();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [autoLoading, setAutoLoading] = useState(false);
  const [profileForm, setProfileForm] = useState<PlayerProfile>({
    playerName: '',
    country: '',
    state: '',
    district: '',
  });

  useEffect(() => {
    const existing = getStoredPlayerProfile();
    if (existing) {
      setProfile(existing);
      setProfileForm(existing);
      return;
    }

    setShowProfileForm(true);
    setProfileForm({
      playerName: 'Player',
      country: '',
      state: '',
      district: '',
    });
  }, []);

  const canSaveProfile = useMemo(
    () => Boolean(profileForm.country.trim() && profileForm.state.trim() && profileForm.district.trim()),
    [profileForm.country, profileForm.state, profileForm.district],
  );

  const isAuthenticated = status === 'authenticated';
  const signInHref = useMemo(() => {
    const callbackUrl = pathname || `/${locale}/games`;
    return `/${locale}/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  }, [locale, pathname]);

  async function autoDetectLocation() {
    if (typeof window === 'undefined' || !navigator.geolocation) return;
    setAutoLoading(true);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 9000,
          maximumAge: 60_000,
        });
      });

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lon))}`,
        { headers: { Accept: 'application/json' } },
      );

      if (!response.ok) return;
      const data = (await response.json()) as {
        address?: {
          country?: string;
          state?: string;
          state_district?: string;
          district?: string;
          county?: string;
          city_district?: string;
          suburb?: string;
        };
      };

      const country = data.address?.country ?? '';
      const state = data.address?.state ?? '';
      const district =
        data.address?.district ??
        data.address?.state_district ??
        data.address?.county ??
        data.address?.city_district ??
        data.address?.suburb ??
        '';

      setProfileForm((prev) => ({
        ...prev,
        country: prev.country || country,
        state: prev.state || state,
        district: prev.district || district,
      }));
    } catch {
      // User denied geolocation or reverse geocode failed.
    } finally {
      setAutoLoading(false);
    }
  }

  function saveProfile() {
    if (!canSaveProfile) return;
    setSaving(true);
    const normalized: PlayerProfile = {
      playerName: profileForm.playerName.trim() || 'Player',
      country: profileForm.country.trim(),
      state: profileForm.state.trim(),
      district: profileForm.district.trim(),
    };

    savePlayerProfile(normalized);
    setProfile(normalized);
    setShowProfileForm(false);
    setSaving(false);
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="border-b border-zinc-900 px-4 py-3 flex items-center justify-between">
        <Link href={`/${locale}/games`} className="text-zinc-500 hover:text-white font-mono text-xs tracking-widest uppercase">
          ← Games
        </Link>
        <div className="flex items-center gap-4 font-mono text-[11px] text-zinc-400" aria-live="polite">
          <span>SCORE <strong className="text-white">{score}</strong></span>
          <span>BEST <strong className="text-emerald-400">{best}</strong></span>
          <button
            type="button"
            onClick={onToggleMuted}
            aria-label={muted ? 'Unmute game audio' : 'Mute game audio'}
            className="px-2 py-1 rounded border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700"
          >
            {muted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>

      <div className="px-4 py-4 sm:px-6 sm:py-6 max-w-6xl w-full mx-auto flex-1 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        <section className="rounded-xl border border-zinc-900 bg-zinc-950/50 p-3 sm:p-4">
          <h1 className="font-mono text-lg tracking-widest mb-3 text-zinc-200 uppercase flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            {title}
          </h1>

          {requiresLogin && !isAuthenticated ? (
            <div className="rounded-xl border border-amber-700/40 bg-amber-950/20 p-6 text-center space-y-3">
              <Lock className="h-8 w-8 text-amber-300 mx-auto" />
              <p className="font-mono text-xs uppercase tracking-widest text-amber-200">Login required to play this game</p>
              <p className="text-zinc-400 text-sm">Sign in to unlock gameplay, real ranked scores, and global competition.</p>
              <Link href={signInHref} className="inline-flex items-center gap-2 rounded-lg border border-amber-600/50 px-4 py-2 text-xs font-mono uppercase tracking-widest text-amber-200 hover:bg-amber-900/30">
                <UserCircle2 className="h-4 w-4" />
                Sign in to play
              </Link>
            </div>
          ) : children}

          <p className="mt-4 text-[11px] text-zinc-500 font-mono tracking-widest uppercase">{controls}</p>
        </section>

        <aside className="rounded-xl border border-zinc-900 bg-zinc-950/50 p-4">
          <h2 className="font-mono text-sm uppercase tracking-widest text-zinc-300 mb-3 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-300" />
            Global Leaderboard
          </h2>

          {!isAuthenticated && (
            <div className="mb-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2">
              <p className="text-[10px] text-zinc-400 font-mono uppercase">Ranked mode is login-only</p>
              <Link href={signInHref} className="mt-2 inline-flex text-[10px] px-2 py-1 rounded border border-zinc-700 text-zinc-300 hover:text-white">
                Sign in to submit real scores
              </Link>
            </div>
          )}

          {isAuthenticated && profile && !showProfileForm && (
            <div className="mb-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2">
              <p className="text-[10px] text-zinc-400 font-mono uppercase">Player profile</p>
              <p className="text-[11px] text-zinc-200 font-mono truncate">{profile.playerName} · {profile.country}</p>
              <p className="text-[10px] text-zinc-500 font-mono truncate">{profile.state} · {profile.district}</p>
              <button
                type="button"
                onClick={() => setShowProfileForm((v) => !v)}
                className="mt-2 text-[10px] px-2 py-1 rounded border border-zinc-700 text-zinc-300 hover:text-white"
              >
                Edit profile
              </button>
            </div>
          )}

          {isAuthenticated && showProfileForm && (
            <div className="mb-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2 space-y-2">
              <p className="text-[10px] text-zinc-400 font-mono uppercase">Required for global rank</p>
              <input
                value={profileForm.playerName}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, playerName: e.target.value }))}
                placeholder="Player name"
                className="w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs"
                maxLength={40}
              />
              <input
                value={profileForm.country}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, country: e.target.value }))}
                placeholder="Country"
                className="w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs"
                maxLength={64}
              />
              <input
                value={profileForm.state}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, state: e.target.value }))}
                placeholder="State"
                className="w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs"
                maxLength={64}
              />
              <input
                value={profileForm.district}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, district: e.target.value }))}
                placeholder="District"
                className="w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs"
                maxLength={64}
              />

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={autoDetectLocation}
                  disabled={autoLoading}
                  className="text-[10px] px-2 py-1 rounded border border-zinc-700 text-zinc-300 hover:text-white disabled:opacity-60"
                >
                  {autoLoading ? 'Detecting…' : 'Auto-detect location'}
                </button>
                <button
                  type="button"
                  onClick={saveProfile}
                  disabled={!canSaveProfile || saving}
                  className="text-[10px] px-2 py-1 rounded border border-emerald-700 text-emerald-300 hover:text-emerald-200 disabled:opacity-60"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          <ul className="space-y-2">
            {(leaderboard ?? []).length === 0 && (
              <li className="text-xs font-mono text-zinc-600">No real scores yet — be the first.</li>
            )}
            {(leaderboard ?? []).map((entry) => (
              <li key={`${entry.rank}-${entry.name}-${entry.score}`} className="flex items-start justify-between gap-2 text-xs font-mono">
                <span className="text-zinc-400 min-w-0">
                  <span className="text-zinc-500">#{entry.rank}</span> {entry.name}
                  {(entry.country || entry.state || entry.district) && (
                    <span className="block text-[10px] text-zinc-600 truncate">
                      {[entry.country, entry.state, entry.district].filter(Boolean).join(' · ')}
                    </span>
                  )}
                </span>
                <span className="text-zinc-200">{entry.score}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
