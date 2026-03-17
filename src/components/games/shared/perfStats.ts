export interface PerfStatsTracker {
  sample: (dtMs: number) => void;
  flush: (suffix?: string) => void;
}

function buildTagPrefix(tag?: string) {
  return tag ? `[tag:${tag}] ` : '';
}

export function getOrCreatePerfSessionTag(storageKey = 'games_perf_session_id'): string {
  if (typeof window === 'undefined') return 'server';

  const existing = window.sessionStorage.getItem(storageKey);
  if (existing) return existing;

  const next = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);

  window.sessionStorage.setItem(storageKey, next);
  return next;
}

export function createPerfStatsTracker(label: string, logEvery: number, enabled: boolean, tag?: string): PerfStatsTracker {
  if (!enabled || logEvery <= 0) {
    return {
      sample: () => {
        // no-op
      },
      flush: () => {
        // no-op
      },
    };
  }

  let count = 0;
  let sumMs = 0;
  let sumSqMs = 0;
  let minMs = Number.POSITIVE_INFINITY;
  let maxMs = 0;

  function compute() {
    const avg = sumMs / count;
    const variance = Math.max(0, sumSqMs / count - avg * avg);
    const std = Math.sqrt(variance);
    return { avg, std };
  }

  function logSnapshot(snapshotLabel: string) {
    if (count <= 0) return;
    const { avg, std } = compute();
    const tagPrefix = buildTagPrefix(tag);
    console.debug(`${snapshotLabel} ${tagPrefix}frames=${count} avg=${avg.toFixed(2)}ms std=${std.toFixed(2)} min=${minMs.toFixed(2)} max=${maxMs.toFixed(2)}`);
  }

  return {
    sample(dtMs: number) {
      count += 1;
      sumMs += dtMs;
      sumSqMs += dtMs * dtMs;
      if (dtMs < minMs) minMs = dtMs;
      if (dtMs > maxMs) maxMs = dtMs;

      if (count % logEvery === 0) {
        logSnapshot(label);
      }
    },
    flush(suffix = 'final') {
      if (count <= 0) return;
      logSnapshot(`${label}[${suffix}]`);
    },
  };
}
