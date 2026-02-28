// ═══════════════════════════════════════════════════════════════════════════
// Web Worker: Text Diff
// Offloads LCS-based text diff computation to a background thread
// ═══════════════════════════════════════════════════════════════════════════

interface DiffRequest {
  textA: string;
  textB: string;
  mode: 'line' | 'word' | 'char';
}

interface DiffSegment {
  type: 'equal' | 'added' | 'removed';
  value: string;
}

interface DiffResponse {
  success: boolean;
  diff?: DiffSegment[];
  stats?: {
    additions: number;
    deletions: number;
    unchanged: number;
  };
  error?: string;
}

function splitByMode(text: string, mode: 'line' | 'word' | 'char'): string[] {
  switch (mode) {
    case 'line':
      return text.split('\n');
    case 'word':
      return text.split(/(\s+)/).filter(s => s.length > 0);
    case 'char':
      return text.split('');
  }
}

function lcs(a: string[], b: string[]): number[][] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp;
}

function computeDiff(a: string[], b: string[]): DiffSegment[] {
  const dp = lcs(a, b);
  const result: DiffSegment[] = [];

  let i = a.length;
  let j = b.length;

  const segments: DiffSegment[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      segments.unshift({ type: 'equal', value: a[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      segments.unshift({ type: 'added', value: b[j - 1] });
      j--;
    } else if (i > 0) {
      segments.unshift({ type: 'removed', value: a[i - 1] });
      i--;
    }
  }

  // Merge consecutive segments of the same type
  for (const seg of segments) {
    const last = result[result.length - 1];
    if (last && last.type === seg.type) {
      last.value += seg.value;
    } else {
      result.push({ ...seg });
    }
  }

  return result;
}

self.onmessage = (e: MessageEvent<DiffRequest>) => {
  const { textA, textB, mode } = e.data;

  try {
    const tokensA = splitByMode(textA, mode);
    const tokensB = splitByMode(textB, mode);
    const diff = computeDiff(tokensA, tokensB);

    let additions = 0;
    let deletions = 0;
    let unchanged = 0;

    for (const seg of diff) {
      const count = seg.value.length;
      switch (seg.type) {
        case 'added': additions += count; break;
        case 'removed': deletions += count; break;
        case 'equal': unchanged += count; break;
      }
    }

    const response: DiffResponse = {
      success: true,
      diff,
      stats: { additions, deletions, unchanged },
    };
    self.postMessage(response);
  } catch (err) {
    const response: DiffResponse = {
      success: false,
      error: (err as Error).message,
    };
    self.postMessage(response);
  }
};
