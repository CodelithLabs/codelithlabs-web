'use client';
import { useState } from 'react';

export default function HashGenerator() {
  const [text, setText] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({});

  const generate = async () => {
    if (!text) return;

    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const results: Record<string, string> = {};

    // SHA-256
    const sha256 = await crypto.subtle.digest('SHA-256', data);
    results['SHA-256'] = Array.from(new Uint8Array(sha256)).map(b => b.toString(16).padStart(2, '0')).join('');

    // SHA-384
    const sha384 = await crypto.subtle.digest('SHA-384', data);
    results['SHA-384'] = Array.from(new Uint8Array(sha384)).map(b => b.toString(16).padStart(2, '0')).join('');

    // SHA-512
    const sha512 = await crypto.subtle.digest('SHA-512', data);
    results['SHA-512'] = Array.from(new Uint8Array(sha512)).map(b => b.toString(16).padStart(2, '0')).join('');

    setHashes(results);
  };

  return (
    <div className="space-y-6">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Enter text to hash..."
        className="w-full h-32 px-4 py-3 bg-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
      />

      <button
        onClick={generate}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
      >
        Generate Hashes
      </button>

      {Object.keys(hashes).length > 0 && (
        <div className="space-y-4">
          {Object.entries(hashes).map(([algo, hash]) => (
            <div key={algo} className="bg-zinc-800 rounded-lg p-4">
              <p className="text-sm text-zinc-400 mb-2">{algo}</p>
              <p className="text-xs text-green-400 font-mono break-all">{hash}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
