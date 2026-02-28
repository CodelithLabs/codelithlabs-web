// ═══════════════════════════════════════════════════════════════════════════
// Web Worker: CSV Converter
// Offloads CSV ↔ JSON conversion for large datasets to a background thread
// ═══════════════════════════════════════════════════════════════════════════

interface CsvRequest {
  action: 'csvToJson' | 'jsonToCsv';
  data: string;
  delimiter?: string;
}

interface CsvResponse {
  success: boolean;
  result?: string;
  error?: string;
  stats?: {
    rows: number;
    columns: number;
  };
}

function csvToJson(csv: string, delimiter = ','): { json: string; rows: number; columns: number } {
  const lines = csv.trim().split('\n');
  if (lines.length === 0) {
    return { json: '[]', rows: 0, columns: 0 };
  }

  const headers = parseCsvLine(lines[0], delimiter);
  const result: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i], delimiter);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header.trim()] = values[index]?.trim() || '';
    });
    result.push(row);
  }

  return {
    json: JSON.stringify(result, null, 2),
    rows: result.length,
    columns: headers.length,
  };
}

function jsonToCsv(json: string, delimiter = ','): { csv: string; rows: number; columns: number } {
  const data = JSON.parse(json);
  if (!Array.isArray(data) || data.length === 0) {
    return { csv: '', rows: 0, columns: 0 };
  }

  const headers = Object.keys(data[0]);
  const rows = data.map((row: Record<string, unknown>) =>
    headers.map(h => {
      const val = String(row[h] ?? '');
      return val.includes(delimiter) || val.includes('"') || val.includes('\n')
        ? `"${val.replace(/"/g, '""')}"`
        : val;
    }).join(delimiter)
  );

  return {
    csv: [headers.join(delimiter), ...rows].join('\n'),
    rows: data.length,
    columns: headers.length,
  };
}

function parseCsvLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

self.onmessage = (e: MessageEvent<CsvRequest>) => {
  const { action, data, delimiter } = e.data;

  try {
    if (action === 'csvToJson') {
      const { json, rows, columns } = csvToJson(data, delimiter);
      const response: CsvResponse = {
        success: true,
        result: json,
        stats: { rows, columns },
      };
      self.postMessage(response);
    } else {
      const { csv, rows, columns } = jsonToCsv(data, delimiter);
      const response: CsvResponse = {
        success: true,
        result: csv,
        stats: { rows, columns },
      };
      self.postMessage(response);
    }
  } catch (err) {
    const response: CsvResponse = {
      success: false,
      error: (err as Error).message,
    };
    self.postMessage(response);
  }
};
