// ═══════════════════════════════════════════════════════════════════════════
// Web Worker: JSON Formatter
// Offloads JSON parsing/formatting of large files to a background thread
// ═══════════════════════════════════════════════════════════════════════════

interface JsonFormatRequest {
  json: string;
  indent: number;
  action: 'format' | 'minify' | 'validate';
}

interface JsonFormatResponse {
  success: boolean;
  result?: string;
  error?: string;
  stats?: {
    keys: number;
    depth: number;
    size: number;
  };
}

function countKeys(obj: unknown, depth = 0): { keys: number; maxDepth: number } {
  if (typeof obj !== 'object' || obj === null) {
    return { keys: 0, maxDepth: depth };
  }

  let keys = 0;
  let maxDepth = depth;

  if (Array.isArray(obj)) {
    for (const item of obj) {
      const result = countKeys(item, depth + 1);
      keys += result.keys;
      maxDepth = Math.max(maxDepth, result.maxDepth);
    }
  } else {
    const entries = Object.entries(obj);
    keys += entries.length;
    for (const [, value] of entries) {
      const result = countKeys(value, depth + 1);
      keys += result.keys;
      maxDepth = Math.max(maxDepth, result.maxDepth);
    }
  }

  return { keys, maxDepth };
}

self.onmessage = (e: MessageEvent<JsonFormatRequest>) => {
  const { json, indent, action } = e.data;

  try {
    const parsed = JSON.parse(json);

    let result: string;
    switch (action) {
      case 'minify':
        result = JSON.stringify(parsed);
        break;
      case 'validate':
        result = 'Valid JSON';
        break;
      case 'format':
      default:
        result = JSON.stringify(parsed, null, indent);
        break;
    }

    const { keys, maxDepth } = countKeys(parsed);

    const response: JsonFormatResponse = {
      success: true,
      result,
      stats: {
        keys,
        depth: maxDepth,
        size: new Blob([result]).size,
      },
    };

    self.postMessage(response);
  } catch (err) {
    const response: JsonFormatResponse = {
      success: false,
      error: (err as Error).message,
    };
    self.postMessage(response);
  }
};
