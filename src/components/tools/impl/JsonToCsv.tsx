'use client';
import { useState } from 'react';

export default function JsonToCsv() {
  const [json, setJson] = useState('');
  const [csv, setCsv] = useState('');

  const convert = () => {
    try {
      const data = JSON.parse(json);
      if (!Array.isArray(data) || data.length === 0) {
        setCsv('Error: Input must be a non-empty JSON array');
        return;
      }

      const headers = Object.keys(data[0]);
      const csvLines = [headers.join(',')];

      data.forEach(obj => {
        const values = headers.map(h => obj[h] || '');
        csvLines.push(values.join(','));
      });

      setCsv(csvLines.join('\n'));
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
      setCsv(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <textarea
        value={json}
        onChange={e => setJson(e.target.value)}
        className="h-64 bg-zinc-800 p-4 rounded text-white font-mono"
        placeholder='[{"name":"John","age":30},{"name":"Jane","age":25}]'
      />
      <textarea
        readOnly
        value={csv}
        className="h-64 bg-zinc-900 p-4 rounded text-green-400 font-mono"
        placeholder="CSV Output"
      />
      <button
        onClick={convert}
        className="col-span-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Convert to CSV
      </button>
    </div>
  );
}
