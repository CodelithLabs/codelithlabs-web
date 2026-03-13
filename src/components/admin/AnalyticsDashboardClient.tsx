'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/i18n/request';

type TrendPoint = {
  hour: string;
  events: number;
  pageViews: number;
  toolUsage: number;
  gameUsage: number;
};

type DashboardResponse = {
  generatedAt: string;
  requestedBy: string;
  timeframe: {
    hours: number;
    since: string;
    until: string;
  };
  summary: {
    totalEvents24h: number;
    totalPageViews24h: number;
    totalToolUsage24h: number;
    totalGameUsage24h: number;
  };
  top: {
    pages: Array<{ path: string; count: number }>;
    tools: Array<{ slug: string; count: number }>;
    games: Array<{ slug: string; count: number }>;
  };
  trend24h: TrendPoint[];
};

interface AnalyticsDashboardClientProps {
  locale: Locale;
}

function formatShortHour(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatCount(value: number): string {
  return new Intl.NumberFormat().format(value);
}

function getLinePoints(values: number[], width: number, height: number, padding: number, maxY: number): string {
  if (!values.length) return '';
  const usableW = width - padding * 2;
  const usableH = height - padding * 2;

  return values
    .map((value, idx) => {
      const x = padding + (idx / Math.max(values.length - 1, 1)) * usableW;
      const y = padding + (1 - value / Math.max(maxY, 1)) * usableH;
      return `${x},${y}`;
    })
    .join(' ');
}

export function AnalyticsDashboardClient({ locale }: AnalyticsDashboardClientProps) {
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardResponse | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/analytics/dashboard?limit=${limit}`, {
        method: 'GET',
        cache: 'no-store',
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Request failed (${response.status})`);
      }

      const payload = (await response.json()) as DashboardResponse;
      setData(payload);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : 'Failed to load analytics dashboard';
      setError(message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard]);

  const chartModel = useMemo(() => {
    const trend = data?.trend24h ?? [];
    const width = 960;
    const height = 300;
    const padding = 28;

    const events = trend.map((item) => item.events);
    const pageViews = trend.map((item) => item.pageViews);
    const toolUsage = trend.map((item) => item.toolUsage);
    const gameUsage = trend.map((item) => item.gameUsage);
    const allValues = [...events, ...pageViews, ...toolUsage, ...gameUsage];
    const maxY = Math.max(...allValues, 1);

    return {
      trend,
      width,
      height,
      padding,
      maxY,
      points: {
        events: getLinePoints(events, width, height, padding, maxY),
        pageViews: getLinePoints(pageViews, width, height, padding, maxY),
        toolUsage: getLinePoints(toolUsage, width, height, padding, maxY),
        gameUsage: getLinePoints(gameUsage, width, height, padding, maxY),
      },
    };
  }, [data]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <nav className="mb-3 flex items-center gap-2 text-sm text-zinc-500">
              <Link href={`/${locale}`} className="hover:text-zinc-300 transition">Home</Link>
              <span className="text-zinc-700">/</span>
              <span className="text-zinc-300">Admin Analytics</span>
            </nav>
            <h2 className="text-3xl font-bold text-white">Analytics Dashboard</h2>
            <p className="mt-1 text-sm text-zinc-400">Top pages/tools/games and a rolling 24-hour trend.</p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs uppercase tracking-wider text-zinc-500" htmlFor="analytics-limit">
              Top limit
            </label>
            <select
              id="analytics-limit"
              value={limit}
              onChange={(event) => setLimit(Number(event.target.value))}
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200"
            >
              {[5, 10, 15, 20, 25].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => void fetchDashboard()}
              className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200 hover:border-zinc-500 hover:bg-zinc-900 transition"
            >
              Refresh
            </button>
          </div>
        </header>

        {loading && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-zinc-300">
            Loading analytics dashboard...
          </div>
        )}

        {error && !loading && (
          <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-6 text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && data && (
          <div className="space-y-6">
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                <p className="text-xs uppercase tracking-wider text-zinc-500">Events (24h)</p>
                <p className="mt-2 text-2xl font-semibold text-white">{formatCount(data.summary.totalEvents24h)}</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                <p className="text-xs uppercase tracking-wider text-zinc-500">Page Views (24h)</p>
                <p className="mt-2 text-2xl font-semibold text-white">{formatCount(data.summary.totalPageViews24h)}</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                <p className="text-xs uppercase tracking-wider text-zinc-500">Tool Usage (24h)</p>
                <p className="mt-2 text-2xl font-semibold text-white">{formatCount(data.summary.totalToolUsage24h)}</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                <p className="text-xs uppercase tracking-wider text-zinc-500">Game Usage (24h)</p>
                <p className="mt-2 text-2xl font-semibold text-white">{formatCount(data.summary.totalGameUsage24h)}</p>
              </div>
            </section>

            <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-white">24h Trend</h3>
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1.5 text-zinc-300"><span className="h-2 w-2 rounded-full bg-sky-400" /> Events</span>
                  <span className="inline-flex items-center gap-1.5 text-zinc-300"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Page Views</span>
                  <span className="inline-flex items-center gap-1.5 text-zinc-300"><span className="h-2 w-2 rounded-full bg-violet-400" /> Tool Usage</span>
                  <span className="inline-flex items-center gap-1.5 text-zinc-300"><span className="h-2 w-2 rounded-full bg-amber-400" /> Game Usage</span>
                </div>
              </div>

              <div className="w-full overflow-x-auto">
                <svg
                  viewBox={`0 0 ${chartModel.width} ${chartModel.height}`}
                  className="h-[280px] min-w-[720px] w-full"
                  role="img"
                  aria-label="24 hour analytics trend chart"
                >
                  {[0, 1, 2, 3, 4].map((idx) => {
                    const y = chartModel.padding + (idx / 4) * (chartModel.height - chartModel.padding * 2);
                    return (
                      <line
                        key={`grid-${idx}`}
                        x1={chartModel.padding}
                        y1={y}
                        x2={chartModel.width - chartModel.padding}
                        y2={y}
                        stroke="rgba(255,255,255,0.1)"
                        strokeDasharray="4 6"
                      />
                    );
                  })}

                  <polyline fill="none" stroke="#38bdf8" strokeWidth="2.5" points={chartModel.points.events} />
                  <polyline fill="none" stroke="#34d399" strokeWidth="2.5" points={chartModel.points.pageViews} />
                  <polyline fill="none" stroke="#a78bfa" strokeWidth="2.5" points={chartModel.points.toolUsage} />
                  <polyline fill="none" stroke="#fbbf24" strokeWidth="2.5" points={chartModel.points.gameUsage} />

                  <text x={chartModel.padding} y={chartModel.height - 8} fill="rgba(255,255,255,0.7)" fontSize="12">
                    {chartModel.trend[0] ? formatShortHour(chartModel.trend[0].hour) : ''}
                  </text>
                  <text
                    x={chartModel.width / 2}
                    y={chartModel.height - 8}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.7)"
                    fontSize="12"
                  >
                    {chartModel.trend[Math.floor(chartModel.trend.length / 2)]
                      ? formatShortHour(chartModel.trend[Math.floor(chartModel.trend.length / 2)].hour)
                      : ''}
                  </text>
                  <text
                    x={chartModel.width - chartModel.padding}
                    y={chartModel.height - 8}
                    textAnchor="end"
                    fill="rgba(255,255,255,0.7)"
                    fontSize="12"
                  >
                    {chartModel.trend[chartModel.trend.length - 1]
                      ? formatShortHour(chartModel.trend[chartModel.trend.length - 1].hour)
                      : ''}
                  </text>
                </svg>
              </div>

              <p className="mt-3 text-xs text-zinc-500">
                Range: {new Date(data.timeframe.since).toLocaleString()} → {new Date(data.timeframe.until).toLocaleString()}
              </p>
            </section>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-5">
                <h3 className="text-lg font-semibold text-white">Top Pages</h3>
                <ul className="mt-4 space-y-2">
                  {data.top.pages.length ? (
                    data.top.pages.map((page) => (
                      <li key={page.path} className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 px-3 py-2">
                        <Link href={page.path} className="truncate text-sm text-zinc-200 hover:text-white hover:underline">
                          {page.path}
                        </Link>
                        <span className="text-xs font-semibold text-zinc-400">{formatCount(page.count)}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-zinc-500">No page view events in this window.</li>
                  )}
                </ul>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-5">
                <h3 className="text-lg font-semibold text-white">Top Tools</h3>
                <ul className="mt-4 space-y-2">
                  {data.top.tools.length ? (
                    data.top.tools.map((tool) => (
                      <li key={tool.slug} className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 px-3 py-2">
                        <Link
                          href={`/${locale}/tools/${tool.slug}`}
                          className="truncate text-sm text-zinc-200 hover:text-white hover:underline"
                        >
                          {tool.slug}
                        </Link>
                        <span className="text-xs font-semibold text-zinc-400">{formatCount(tool.count)}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-zinc-500">No tool usage events in this window.</li>
                  )}
                </ul>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-5">
                <h3 className="text-lg font-semibold text-white">Top Games</h3>
                <ul className="mt-4 space-y-2">
                  {data.top.games.length ? (
                    data.top.games.map((game) => (
                      <li key={game.slug} className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 px-3 py-2">
                        <Link
                          href={`/${locale}/games/${game.slug}`}
                          className="truncate text-sm text-zinc-200 hover:text-white hover:underline"
                        >
                          {game.slug}
                        </Link>
                        <span className="text-xs font-semibold text-zinc-400">{formatCount(game.count)}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-zinc-500">No game usage events in this window.</li>
                  )}
                </ul>
              </div>
            </section>

            <footer className="text-xs text-zinc-600">
              Last generated: {new Date(data.generatedAt).toLocaleString()} · Requested by {data.requestedBy}
            </footer>
          </div>
        )}
      </div>
    </div>
  );
}
