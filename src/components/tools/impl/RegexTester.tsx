'use client';
import { useState } from 'react';

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState('');

  const test = () => {
    try {
      const regex = new RegExp(pattern, flags);
      const found = testString.match(regex);
      setMatches(found || []);
      setError('');
    } catch (e: any) {
      setError(e.message);
      setMatches([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <input
          type="text"
          value={pattern}
          onChange={e => setPattern(e.target.value)}
          placeholder="Regex pattern (e.g., \d+)"
          className="md:col-span-3 px-4 py-3 bg-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono"
        />
        <input
          type="text"
          value={flags}
          onChange={e => setFlags(e.target.value)}
          placeholder="Flags"
          className="px-4 py-3 bg-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono"
        />
      </div>

      <textarea
        value={testString}
        onChange={e => setTestString(e.target.value)}
        placeholder="Test string to match against..."
        className="w-full h-32 px-4 py-3 bg-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
      />

      <button
        onClick={test}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
      >
        Test Regex
      </button>

      {error && (
        <div className="bg-red-900/30 border border-red-500 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {matches.length > 0 && (
        <div className="bg-zinc-800 rounded-lg p-6">
          <p className="text-zinc-400 text-sm mb-3">{matches.length} match(es) found:</p>
          <div className="space-y-2">
            {matches.map((match, i) => (
              <div key={i} className="bg-zinc-900 rounded p-3">
                <span className="text-green-400 font-mono">{match}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!error && matches.length === 0 && testString && pattern && (
        <div className="text-center text-zinc-500 py-4">No matches found</div>
      )}
    </div>
  );
}
