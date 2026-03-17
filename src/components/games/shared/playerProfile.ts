'use client';

export interface PlayerProfile {
  playerName: string;
  country: string;
  state: string;
  district: string;
}

const PROFILE_KEY = 'games_player_profile_v1';
const DEVICE_ID_KEY = 'games_device_id_v1';

function safeParseProfile(raw: string | null): PlayerProfile | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<PlayerProfile>;
    if (!parsed || typeof parsed !== 'object') return null;

    const profile: PlayerProfile = {
      playerName: (parsed.playerName ?? '').toString().trim(),
      country: (parsed.country ?? '').toString().trim(),
      state: (parsed.state ?? '').toString().trim(),
      district: (parsed.district ?? '').toString().trim(),
    };

    if (!profile.country || !profile.state || !profile.district) {
      return null;
    }

    return {
      ...profile,
      playerName: profile.playerName || 'Player',
    };
  } catch {
    return null;
  }
}

function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function getOrCreateGameDeviceId(): string {
  if (typeof window === 'undefined') return 'server-device';

  const existing = localStorage.getItem(DEVICE_ID_KEY)?.trim();
  if (existing) return existing;

  const next = makeId();
  localStorage.setItem(DEVICE_ID_KEY, next);
  return next;
}

export function getStoredPlayerProfile(): PlayerProfile | null {
  if (typeof window === 'undefined') return null;
  return safeParseProfile(localStorage.getItem(PROFILE_KEY));
}

export function savePlayerProfile(profile: PlayerProfile): PlayerProfile {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }
  return profile;
}

export function hasStoredPlayerProfile(): boolean {
  return Boolean(getStoredPlayerProfile());
}
