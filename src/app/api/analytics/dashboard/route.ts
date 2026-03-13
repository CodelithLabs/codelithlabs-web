import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { canAccessPremiumAudit, isPremiumAuditConfigured } from '@/lib/admin-access';
import { isDatabaseConfigured, prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const MAX_LIMIT = 25;
const DEFAULT_LIMIT = 10;

type HourlyTrendRow = {
  hour: Date;
  events: bigint | number;
  pageViews: bigint | number;
  toolUsage: bigint | number;
  gameUsage: bigint | number;
};

function asNumber(value: bigint | number): number {
  return typeof value === 'bigint' ? Number(value) : value;
}

function clampLimit(raw: string | null): number {
  const parsed = Number.parseInt(raw ?? '', 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_LIMIT;
  return Math.min(parsed, MAX_LIMIT);
}

function startOfUtcHour(date: Date): Date {
  const normalized = new Date(date);
  normalized.setUTCMinutes(0, 0, 0);
  return normalized;
}

function normalizeAnalyticsPath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) return '/';

  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withLeadingSlash.replace(/\/analutics(?=\/|$)/gi, '/analytics');
}

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  if (!isPremiumAuditConfigured()) {
    return NextResponse.json(
      { error: 'Analytics dashboard access is not configured' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  if (!canAccessPremiumAudit(session.user.email)) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: 'Database is not configured' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const { searchParams } = new URL(request.url);
  const limit = clampLimit(searchParams.get('limit'));
  const hours = 24;
  const now = new Date();
  const until = startOfUtcHour(now);
  const since = new Date(until.getTime() - (hours - 1) * 60 * 60 * 1000);

  let topPagesRaw;
  let topToolsRaw;
  let topGamesRaw;
  let trendRows;

  try {
    [topPagesRaw, topToolsRaw, topGamesRaw, trendRows] = await Promise.all([
      prisma.analyticsEvent.groupBy({
        by: ['path'],
        where: {
          eventType: 'PAGE_VIEW',
          occurredAt: { gte: since },
        },
        _count: { path: true },
        orderBy: { _count: { path: 'desc' } },
        take: limit,
      }),
      prisma.analyticsEvent.groupBy({
        by: ['toolSlug'],
        where: {
          eventType: 'TOOL_USAGE',
          toolSlug: { not: null },
          occurredAt: { gte: since },
        },
        _count: { toolSlug: true },
        orderBy: { _count: { toolSlug: 'desc' } },
        take: limit,
      }),
      prisma.analyticsEvent.groupBy({
        by: ['gameSlug'],
        where: {
          eventType: 'GAME_USAGE',
          gameSlug: { not: null },
          occurredAt: { gte: since },
        },
        _count: { gameSlug: true },
        orderBy: { _count: { gameSlug: 'desc' } },
        take: limit,
      }),
      prisma.$queryRaw<HourlyTrendRow[]>(Prisma.sql`
        SELECT
          date_trunc('hour', "occurredAt") AS hour,
          COUNT(*)::bigint AS events,
          SUM(CASE WHEN "eventType" = 'PAGE_VIEW' THEN 1 ELSE 0 END)::bigint AS "pageViews",
          SUM(CASE WHEN "eventType" = 'TOOL_USAGE' THEN 1 ELSE 0 END)::bigint AS "toolUsage",
          SUM(CASE WHEN "eventType" = 'GAME_USAGE' THEN 1 ELSE 0 END)::bigint AS "gameUsage"
        FROM "AnalyticsEvent"
        WHERE "occurredAt" >= ${since}
        GROUP BY 1
        ORDER BY 1 ASC
      `),
    ]);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021') {
      return NextResponse.json(
        { error: 'Analytics schema is not applied yet. Run prisma db push.' },
        { status: 503, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    throw error;
  }

  const trendMap = new Map<string, HourlyTrendRow>();
  for (const row of trendRows) {
    trendMap.set(new Date(row.hour).toISOString(), row);
  }

  const trend24h = Array.from({ length: hours }, (_, idx) => {
    const pointHour = new Date(since.getTime() + idx * 60 * 60 * 1000);
    const key = pointHour.toISOString();
    const row = trendMap.get(key);

    return {
      hour: key,
      events: row ? asNumber(row.events) : 0,
      pageViews: row ? asNumber(row.pageViews) : 0,
      toolUsage: row ? asNumber(row.toolUsage) : 0,
      gameUsage: row ? asNumber(row.gameUsage) : 0,
    };
  });

  const pageCounts = new Map<string, number>();
  for (const item of topPagesRaw) {
    const normalizedPath = normalizeAnalyticsPath(item.path);
    const current = pageCounts.get(normalizedPath) ?? 0;
    pageCounts.set(normalizedPath, current + (item._count.path ?? 0));
  }

  const topPages = Array.from(pageCounts.entries())
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  const topTools = topToolsRaw
    .filter((item) => item.toolSlug)
    .map((item) => ({
      slug: item.toolSlug,
      count: item._count.toolSlug ?? 0,
    }));

  const topGames = topGamesRaw
    .filter((item) => item.gameSlug)
    .map((item) => ({
      slug: item.gameSlug,
      count: item._count.gameSlug ?? 0,
    }));

  return NextResponse.json(
    {
      generatedAt: now.toISOString(),
      requestedBy: session.user.email,
      timeframe: {
        hours,
        since: since.toISOString(),
        until: until.toISOString(),
      },
      summary: {
        totalEvents24h: trend24h.reduce((acc, item) => acc + item.events, 0),
        totalPageViews24h: trend24h.reduce((acc, item) => acc + item.pageViews, 0),
        totalToolUsage24h: trend24h.reduce((acc, item) => acc + item.toolUsage, 0),
        totalGameUsage24h: trend24h.reduce((acc, item) => acc + item.gameUsage, 0),
      },
      top: {
        pages: topPages,
        tools: topTools,
        games: topGames,
      },
      trend24h,
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}