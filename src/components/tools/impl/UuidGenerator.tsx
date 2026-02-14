// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/tools/impl/UuidGenerator.tsx
// UUID v4 Generator with Bulk Generation (1-100 UUIDs)
// ═══════════════════════════════════════════════════════════════════════════
'use client';

import { useState } from 'react';

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [copied, setCopied] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Generate UUID v4 using crypto API
  const generateUuid = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (crypto.getRandomValues(new Uint8Array(1))[0] % 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  // Generate multiple UUIDs
  const generate = () => {
    const newUuids = Array.from({ length: count }, () => generateUuid());
    setUuids(newUuids);
    setCopied(false);
    setCopiedIndex(null);
  };

  // Copy all UUIDs to clipboard
  const copyAll = async () => {
    if (uuids.length === 0) return;

    try {
      await navigator.clipboard.writeText(uuids.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('Failed to copy UUIDs');
    }
  };

  // Copy single UUID
  const copySingle = async (uuid: string, index: number) => {
    try {
      await navigator.clipboard.writeText(uuid);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      alert('Failed to copy UUID');
    }
  };

  return (
    <div className="space-y-6">

      {/* Controls */}
      <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6 space-y-4">

        {/* Count Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-zinc-300">
              Number of UUIDs:
            </label>
            <span className="text-sm font-bold text-white bg-zinc-900 px-3 py-1 rounded-lg">
              {count}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                     [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
                     [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500
                     [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
          />
          <div className="flex justify-between text-xs text-zinc-500 mt-1">
            <span>1</span>
            <span>100</span>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-2">
          {[1, 5, 10, 25, 50, 100].map((preset) => (
            <button
              key={preset}
              onClick={() => setCount(preset)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                count === preset
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600 hover:text-white'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Generate Button */}
        <button
          onClick={generate}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold
                   rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Generate {count} UUID{count !== 1 ? 's' : ''}
        </button>

      </div>

      {/* Generated UUIDs */}
      {uuids.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-zinc-300">
              Generated UUIDs ({uuids.length}):
            </label>
            <button
              onClick={copyAll}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                copied
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {copied ? (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied All!
                </span>
              ) : (
                'Copy All'
              )}
            </button>
          </div>

          <div className="bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
            {uuids.map((uuid, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-3 border-b border-zinc-700 last:border-b-0
                         hover:bg-zinc-700/50 transition-colors group"
              >
                <code className="text-sm text-zinc-300 font-mono flex-1">{uuid}</code>
                <button
                  onClick={() => copySingle(uuid, index)}
                  className={`ml-4 px-3 py-1 rounded text-xs font-medium transition-all ${
                    copiedIndex === index
                      ? 'bg-green-600 text-white'
                      : 'bg-zinc-600 text-zinc-300 hover:bg-zinc-500 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {copiedIndex === index ? (
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied
                    </span>
                  ) : (
                    'Copy'
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* UUID Format Info */}
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-zinc-300">
            <p className="font-medium text-purple-400 mb-1">UUID v4 Format:</p>
            <p className="text-xs leading-relaxed">
              Universally Unique Identifier version 4 (random). Format: <code className="bg-zinc-800 px-1 py-0.5 rounded">xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx</code>
              <br />Each UUID has 122 bits of randomness, making collisions virtually impossible.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-300 flex gap-3">
        <span className="text-xl">🔒</span>
        <p>
          <strong>100% Secure:</strong> UUIDs are generated using cryptographically secure random values
          in your browser. Nothing is sent to our servers.
        </p>
      </div>

    </div>
  );
}
