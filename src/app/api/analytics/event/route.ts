import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limiter';
import { getClientIp } from '@/lib/request-security';
import { isDatabaseConfigured, prisma } from '@/lib/prisma';

const EVENT_NAME_MAX = 80;
const PATH_MAX = 300;
const SOURCE_MAX = 40;
const SLUG_MAX = 120;
const USER_AGENT_MAX = 500;

const analyticsEventSchema = z.object({
  eventName: z.string().min(2).max(EVENT_NAME_MAX),
  eventType: z.enum(['PAGE_VIEW', 'NAV_INTERACTION', 'TOOL_USAGE', 'GAME_USAGE', 'CUSTOM']),
  path: z.string().min(1).max(PATH_MAX),
  source: z.string().min(1).max(SOURCE_MAX).optional(),
  locale: z.string().min(2).max(8).optional(),
  toolSlug: z.string().min(1).max(SLUG_MAX).optional(),
  gameSlug: z.string().min(1).max(SLUG_MAX).optional(),
  sessionId: z.string().min(1).max(80).optional(),
  occurredAt: z.number().int().positive().optional(),
  metadata: z
    .record(z.union([z.string().max(300), z.number(), z.boolean(), z.null()]))
    .optional(),
});

type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;

function normalizePath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) return '/';

  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;

  // Canonicalize common analytics endpoint typo to keep reporting clean.
  return withLeadingSlash.replace(/\/analutics(?=\/|$)/gi, '/analytics');
}

function buildIpHash(ip: string): string | null {
  if (!ip || ip === 'unknown') return null;

  const salt = process.env.ANALYTICS_HASH_SALT?.trim() || 'codelithlabs-analytics';
  return crypto.createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

function isLikelyBot(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return /bot|crawler|spider|headless|lighthouse|pagespeed|preview/i.test(userAgent);
}

function getUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function toSafeDate(timestamp?: number): Date {
  if (!timestamp) return new Date();

  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) {
    return new Date();
  }

  const maxSkewMs = 1000 * 60 * 60 * 24; // 24h safety window
  if (Math.abs(Date.now() - parsed.getTime()) > maxSkewMs) {
    return new Date();
  }

  return parsed;
}

async function persistEvent(input: AnalyticsEventInput, userId: string | null, ipHash: string | null, userAgent: string | null) {
  const occurredAt = toSafeDate(input.occurredAt);

  await prisma.analyticsEvent.create({
    data: {
      eventName: input.eventName,
      eventType: input.eventType,
      source: input.source,
      path: normalizePath(input.path),
      locale: input.locale,
      toolSlug: input.toolSlug,
      gameSlug: input.gameSlug,
      sessionId: input.sessionId,
      ipHash,
      userAgent: userAgent?.slice(0, USER_AGENT_MAX) ?? null,
      metadata: input.metadata,
      occurredAt,
      userId,
    },
  });

  if (input.eventType !== 'PAGE_VIEW') return;

  const localeKey = input.locale ?? 'und';

  await prisma.analyticsPageViewDaily.upsert({
    where: {
      date_path_locale: {
        date: getUtcDay(occurredAt),
        path: normalizePath(input.path),
        locale: localeKey,
      },
    },
    update: {
      views: {
        increment: 1,
      },
    },
    create: {
      date: getUtcDay(occurredAt),
      path: normalizePath(input.path),
      locale: localeKey,
      views: 1,
    },
  });
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateResult = await checkRateLimit(ip, 120, 'analytics');

    if (rateResult.limited) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    if (!isDatabaseConfigured()) {
      return NextResponse.json({ accepted: false, reason: 'database_not_configured' }, { status: 202 });
    }

    const userAgent = request.headers.get('user-agent');
    if (isLikelyBot(userAgent)) {
      return NextResponse.json({ accepted: true, ignored: 'bot' }, { status: 202 });
    }

    const body = await request.json();
    const parsed = analyticsEventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid analytics event payload' }, { status: 400 });
    }

    const session = await auth();
    const userId = session?.user?.id ?? null;
    const ipHash = buildIpHash(ip);

    await persistEvent(parsed.data, userId, ipHash, userAgent);

    return NextResponse.json({ accepted: true }, { status: 202 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021') {
      return NextResponse.json(
        { accepted: false, reason: 'analytics_schema_not_applied' },
        { status: 202 }
      );
    }

    console.error('[Analytics] Event ingestion failed:', error);
    return NextResponse.json({ error: 'Failed to ingest analytics event' }, { status: 500 });
  }
}
