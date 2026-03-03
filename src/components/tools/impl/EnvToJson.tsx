'use client';

import { memo, useState, useCallback } from 'react';

function EnvToJson() {
  const [env, setEnv] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<'toJson' | 'toEnv'>('toJson');

  const handleConvert = useCallback(() => {
    if (mode === 'toJson') {
      try {
        const lines = env.split('\n');
        const obj: { [key: string]: string } = {};

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;

          const eqIndex = trimmed.indexOf('=');
          if (eqIndex === -1) continue;

          const key = trimmed.substring(0, eqIndex).trim();
          let value = trimmed.substring(eqIndex + 1).trim();

          // Remove quotes if present
          if ((value.startsWith('"') && value.endsWith('"')) ||
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }

          obj[key] = value;
        }

        setResult(JSON.stringify(obj, null, 2));
      } catch (e) {
        setResult('Error: Could not parse .env file');
      }
    } else {
      try {
        const obj = JSON.parse(env);
        const lines: string[] = [];

        for (const [key, value] of Object.entries(obj)) {
          const strValue = String(value);
          const needsQuotes = strValue.includes(' ') || strValue.includes('=') || strValue.includes('#');
          lines.push(`${key}=${needsQuotes ? `"${strValue}"` : strValue}`);
        }

        setResult(lines.join('\n'));
      } catch (e) {
        setResult('Error: Invalid JSON input');
      }
    }
  }, [env, mode]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">.env ↔ JSON Converter</h3>
        <div className="space-y-4">
          <div className="flex gap-4 mb-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={mode === 'toJson'}
                onChange={() => setMode('toJson')}
                className="mr-2"
              />
              <span className="text-zinc-300 text-sm">.env to JSON</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={mode === 'toEnv'}
                onChange={() => setMode('toEnv')}
                className="mr-2"
              />
              <span className="text-zinc-300 text-sm">JSON to .env</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              {mode === 'toJson' ? '.env Input' : 'JSON Input'}
            </label>
            <textarea
              value={env}
              onChange={(e) => setEnv(e.target.value)}
              placeholder={mode === 'toJson' 
                ? 'DATABASE_URL=postgres://localhost\nAPI_KEY=secretkey123\nDEBUG=true'
                : '{"DATABASE_URL": "postgres://localhost", "API_KEY": "secretkey123"}'}
              rows={8}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>
          <button
            onClick={handleConvert}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Convert
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">
              {mode === 'toJson' ? 'JSON Output' : '.env Output'}
            </h3>
            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded transition-colors"
            >
              Copy
            </button>
          </div>
          <pre className="bg-zinc-900 rounded-lg p-4 text-green-400 text-sm overflow-x-auto font-mono whitespace-pre-wrap">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}

export default memo(EnvToJson);
