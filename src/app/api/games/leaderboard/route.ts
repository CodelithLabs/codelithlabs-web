import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma, isDatabaseConfigured } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limiter';
import { getClientIp } from '@/lib/request-security';

const submitSchema = z.object({
  slug: z.string().min(1).max(80),
  score: z.number().int().min(0).max(999999),
  deviceId: z.string().min(4).max(120).optional(),
  playerName: z.string().min(1).max(40).optional(),
  country: z.string().min(1).max(64).optional(),
  state: z.string().min(1).max(64).optional(),
  district: z.string().min(1).max(64).optional(),
});

const slugSchema = z.string().min(1).max(80);

type Row = {
  player_name: string;
  country: string;
  state: string;
  district: string;
  score: number;
  user_id: string;
};

async function resolveUserId() {
  try {
    const session = await auth();
    const candidate = session?.user?.id ?? null;
    if (!candidate) return null;

    const user = await prisma.user.findUnique({
      where: { id: candidate },
      select: { id: true },
    });

    return user?.id ?? null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const limit = await checkRateLimit(ip, 120, 'games_leaderboard_get');
  if (limit.limited) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const url = new URL(request.url);
  const parsedSlug = slugSchema.safeParse(url.searchParams.get('slug') ?? '');
  if (!parsedSlug.success) {
    return NextResponse.json({ error: 'Invalid game slug' }, { status: 400 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ leaderboard: [] }, { status: 200 });
  }

  try {
    const rows = await prisma.$queryRaw<Row[]>(Prisma.sql`
      WITH best_by_user AS (
        SELECT
          "userId" AS user_id,
          COALESCE(NULLIF(MAX("metadata"->>'playerName'), ''), 'Player') AS player_name,
          COALESCE(NULLIF(MAX("metadata"->>'country'), ''), 'Unknown') AS country,
          COALESCE(NULLIF(MAX("metadata"->>'state'), ''), 'Unknown') AS state,
          COALESCE(NULLIF(MAX("metadata"->>'district'), ''), 'Unknown') AS district,
          MAX(CASE
            WHEN ("metadata"->>'score') ~ '^[0-9]+$' THEN ("metadata"->>'score')::int
            ELSE 0
          END) AS score
        FROM "AnalyticsEvent"
        WHERE "eventType" = 'GAME_USAGE'
          AND "gameSlug" = ${parsedSlug.data}
          AND "eventName" = 'game_score_submit'
          AND "userId" IS NOT NULL
        GROUP BY
          "userId"
      )
      SELECT user_id, player_name, country, state, district, score
      FROM best_by_user
      ORDER BY score DESC
      LIMIT 10
    `);

    return NextResponse.json({
      leaderboard: rows.map((row, idx) => ({
        rank: idx + 1,
        name: row.player_name,
        score: Number(row.score) || 0,
        country: row.country,
        state: row.state,
        district: row.district,
      })),
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021') {
      return NextResponse.json({ leaderboard: [] }, { status: 200 });
    }
    console.error('[GamesLeaderboard] GET failed:', error);
    return NextResponse.json({ leaderboard: [] }, { status: 200 });
  }
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = await checkRateLimit(ip, 80, 'games_leaderboard_post');
  if (limit.limited) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ accepted: false, reason: 'database_not_configured' }, { status: 202 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const payload = parsed.data;
  const userId = await resolveUserId();
  if (!userId) {
    return NextResponse.json({ accepted: false, reason: 'login_required' }, { status: 401 });
  }

  try {
    await prisma.analyticsEvent.create({
      data: {
        userId,
        eventName: 'game_score_submit',
        eventType: 'GAME_USAGE',
        source: 'games-client',
        path: `/games/${payload.slug}`,
        gameSlug: payload.slug,
        metadata: {
          score: payload.score,
          deviceId: payload.deviceId ?? null,
          playerName: payload.playerName ?? null,
          country: payload.country ?? null,
          state: payload.state ?? null,
          district: payload.district ?? null,
        },
      },
    });

    return NextResponse.json({ accepted: true }, { status: 202 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021') {
      return NextResponse.json({ accepted: false, reason: 'analytics_schema_not_applied' }, { status: 202 });
    }
    console.error('[GamesLeaderboard] POST failed:', error);
    return NextResponse.json({ accepted: false, reason: 'failed' }, { status: 202 });
  }
}
