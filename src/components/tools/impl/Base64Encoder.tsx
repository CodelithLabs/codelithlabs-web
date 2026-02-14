// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/tools/impl/Base64Encoder.tsx
// Example tool implementation - Base64 Encoder/Decoder (100% client-side)
// ═══════════════════════════════════════════════════════════════════════════
'use client';

import { useState } from 'react';

export default function Base64Encoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');

  const process = () => {
    setError('');
    try {
      if (mode === 'encode') {
        // Encode: Handle Unicode properly
        const encoded = btoa(unescape(encodeURIComponent(input)));
        setOutput(encoded);
      } else {
        // Decode: Handle Unicode properly
        const decoded = decodeURIComponent(escape(atob(input)));
        setOutput(decoded);
      }
    } catch (e) {
      setError(mode === 'decode' ? 'Invalid Base64 string' : 'Encoding failed');
      setOutput('');
    }
  };

  const swap = () => {
    setInput(output);
    setOutput('');
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex items-center gap-2 p-1 bg-zinc-800 rounded-lg w-fit">
        <button
          onClick={() => setMode('encode')}
          className={`px-4 py-2 rounded-md transition-colors ${
            mode === 'encode' 
              ? 'bg-blue-600 text-white' 
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Encode
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`px-4 py-2 rounded-md transition-colors ${
            mode === 'decode' 
              ? 'bg-blue-600 text-white' 
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Decode
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
          ❌ {error}
        </div>
      )}

      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          {mode === 'encode' ? 'Text to Encode:' : 'Base64 to Decode:'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Paste Base64 string...'}
          className="w-full h-32 bg-zinc-800 border border-zinc-700 rounded-lg p-4 
                     text-white font-mono text-sm placeholder-zinc-500 resize-y
                     focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={process}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          {mode === 'encode' ? '🔒 Encode' : '🔓 Decode'}
        </button>
        <button
          onClick={swap}
          disabled={!output}
          className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 
                     disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          ↕️ Swap
        </button>
        <button
          onClick={() => { setInput(''); setOutput(''); setError(''); }}
          className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Output */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-zinc-300">
            {mode === 'encode' ? 'Encoded Base64:' : 'Decoded Text:'}
          </label>
          <button
            onClick={() => navigator.clipboard.writeText(output)}
            disabled={!output}
            className="text-xs text-blue-400 hover:text-blue-300 disabled:text-zinc-600"
          >
            📋 Copy
          </button>
        </div>
        <textarea
          value={output}
          readOnly
          placeholder="Result will appear here..."
          className="w-full h-32 bg-zinc-900 border border-zinc-700 rounded-lg p-4 
                     text-green-400 font-mono text-sm placeholder-zinc-500 resize-y"
        />
      </div>
    </div>
  );
}
