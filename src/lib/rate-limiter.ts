// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/lib/rate-limiter.ts
// Persistent rate limiter — Redis-backed with in-memory fallback
// If REDIS_URL is configured, uses Redis (survives deploys).
// Otherwise, falls back to in-memory Map (dev-friendly).
// ═══════════════════════════════════════════════════════════════════════════

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const DEFAULT_LIMIT = 5;
const REDIS_RETRY_COOLDOWN_MS = 60 * 1000;

// ─── Redis-backed implementation ─────────────────────────────────────────

let redisClient: import('ioredis').default | null = null;
let redisDisabledUntil = 0;

async function getRedis() {
  if (redisClient) return redisClient;

  if (Date.now() < redisDisabledUntil) {
    return null;
  }

  const url = process.env.REDIS_URL;
  if (!url) return null;

  try {
    const Redis = (await import('ioredis')).default;
    redisClient = new Redis(url, {
      maxRetriesPerRequest: 1,
      connectTimeout: 3000,
      lazyConnect: true,
      enableOfflineQueue: false,
      retryStrategy: () => null,
      reconnectOnError: () => false,
    });

    redisClient.on('error', (error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      console.warn('[RateLimiter] Redis client error, using in-memory fallback:', message);
      redisDisabledUntil = Date.now() + REDIS_RETRY_COOLDOWN_MS;
    });

    redisClient.on('end', () => {
      redisClient = null;
      redisDisabledUntil = Date.now() + REDIS_RETRY_COOLDOWN_MS;
    });

    await redisClient.connect();
    return redisClient;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    console.warn('[RateLimiter] Redis unavailable, using in-memory fallback:', msg);
    redisClient = null;
    redisDisabledUntil = Date.now() + REDIS_RETRY_COOLDOWN_MS;
    return null;
  }
}

// ─── In-memory fallback ──────────────────────────────────────────────────

const memoryStore = new Map<string, { count: number; resetAt: number }>();

// Periodic cleanup for memory store
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of memoryStore) {
    if (now > entry.resetAt) memoryStore.delete(key);
  }
}, WINDOW_MS);

// ─── Public API ──────────────────────────────────────────────────────────

interface RateLimitResult {
  limited: boolean;
  remaining: number;
  resetAt: number;
}

export async function checkRateLimit(
  identifier: string,
  limit: number = DEFAULT_LIMIT,
  prefix: string = 'rl'
): Promise<RateLimitResult> {
  const key = `${prefix}:${identifier}`;
  const redis = await getRedis();

  if (redis) {
    return checkRedisRateLimit(redis, key, limit);
  }

  return checkMemoryRateLimit(key, limit);
}

async function checkRedisRateLimit(
  redis: import('ioredis').default,
  key: string,
  limit: number
): Promise<RateLimitResult> {
  try {
    const windowSeconds = Math.ceil(WINDOW_MS / 1000);

    // Atomic increment + TTL using a multi/exec pipeline
    const pipeline = redis.pipeline();
    pipeline.incr(key);
    pipeline.ttl(key);
    const results = await pipeline.exec();

    const count = (results?.[0]?.[1] as number) ?? 1;
    const ttl = (results?.[1]?.[1] as number) ?? -1;

    // Set TTL on first request
    if (ttl === -1 || count === 1) {
      await redis.expire(key, windowSeconds);
    }

    const resetAt = Date.now() + (ttl > 0 ? ttl * 1000 : WINDOW_MS);
    const remaining = Math.max(0, limit - count);

    return {
      limited: count > limit,
      remaining,
      resetAt,
    };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    console.warn('[RateLimiter] Redis error, falling back to memory:', msg);

    redisDisabledUntil = Date.now() + REDIS_RETRY_COOLDOWN_MS;

    if (redis.status !== 'end') {
      try {
        redis.disconnect(false);
      } catch {
        // Ignore disconnect failures; fallback path continues.
      }
    }
    redisClient = null;

    return checkMemoryRateLimit(key, limit);
  }
}

function checkMemoryRateLimit(key: string, limit: number): RateLimitResult {
  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + WINDOW_MS;
    memoryStore.set(key, { count: 1, resetAt });
    return { limited: false, remaining: limit - 1, resetAt };
  }

  entry.count += 1;
  const remaining = Math.max(0, limit - entry.count);

  return {
    limited: entry.count > limit,
    remaining,
    resetAt: entry.resetAt,
  };
}
