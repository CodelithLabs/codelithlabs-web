'use client';
import { useState } from 'react';

export default function CsvToJson() {
  const [csv, setCsv] = useState('');
  const [json, setJson] = useState('');

  const convert = () => {
    try {
      const lines = csv.split('\n').filter(l => l.trim());
      if (lines.length === 0) {
        setJson('[]');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim());
      const result = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const obj: any = {};
        headers.forEach((header, i) => {
          obj[header] = values[i] || '';
        });
        return obj;
      });

      setJson(JSON.stringify(result, null, 2));
    } catch (e: any) {
      setJson(`Error: ${e.message}`);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <textarea
        value={csv}
        onChange={e => setCsv(e.target.value)}
        className="h-64 bg-zinc-800 p-4 rounded text-white font-mono"
        placeholder="name,age,city&#10;John,30,NYC&#10;Jane,25,LA"
      />
      <textarea
        readOnly
        value={json}
        className="h-64 bg-zinc-900 p-4 rounded text-green-400 font-mono"
        placeholder="JSON Output"
      />
      <button
        onClick={convert}
        className="col-span-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Convert to JSON
      </button>
    </div>
  );
}
