'use client';

type AnalyticsEventType =
  | 'PAGE_VIEW'
  | 'NAV_INTERACTION'
  | 'TOOL_USAGE'
  | 'GAME_USAGE'
  | 'CUSTOM';

type AnalyticsMetadataValue = string | number | boolean | null;

type AnalyticsPayload = {
  eventName: string;
  eventType: AnalyticsEventType;
  path: string;
  source?: string;
  locale?: string;
  toolSlug?: string;
  gameSlug?: string;
  metadata?: Record<string, AnalyticsMetadataValue>;
};

const ANALYTICS_ENDPOINT = '/api/analytics/event';
const SESSION_KEY = 'cl_analytics_session_id_v1';

function normalizePath(path: string): string {
  if (!path) return '/';
  if (!path.startsWith('/')) return `/${path}`;
  return path;
}

function createSessionId(): string {
  const randomPart = Math.random().toString(36).slice(2, 10);
  return `s_${Date.now().toString(36)}_${randomPart}`;
}

function getOrCreateSessionId(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const current = window.localStorage.getItem(SESSION_KEY);
    if (current) return current;

    const next = createSessionId();
    window.localStorage.setItem(SESSION_KEY, next);
    return next;
  } catch {
    return null;
  }
}

function sanitizeMetadata(metadata?: Record<string, AnalyticsMetadataValue>) {
  if (!metadata) return undefined;

  const entries = Object.entries(metadata)
    .slice(0, 20)
    .map(([key, value]) => {
      const safeKey = key.slice(0, 40);
      if (typeof value === 'string') {
        return [safeKey, value.slice(0, 300)] as const;
      }

      return [safeKey, value] as const;
    });

  return Object.fromEntries(entries);
}

export async function trackClientAnalytics(payload: AnalyticsPayload): Promise<void> {
  if (typeof window === 'undefined') return;

  const body = {
    ...payload,
    path: normalizePath(payload.path || window.location.pathname),
    sessionId: getOrCreateSessionId(),
    metadata: sanitizeMetadata(payload.metadata),
    occurredAt: Date.now(),
  };

  try {
    const serialized = JSON.stringify(body);

    if (typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([serialized], { type: 'application/json' });
      navigator.sendBeacon(ANALYTICS_ENDPOINT, blob);
      return;
    }

    await fetch(ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: serialized,
      keepalive: true,
      cache: 'no-store',
    });
  } catch {
    // Never block UX on analytics failures.
  }
}
