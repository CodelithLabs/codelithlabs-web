// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/tools/impl/UrlEncoder.tsx
// URL Encoder/Decoder - Safe URL Formatting
// ═══════════════════════════════════════════════════════════════════════════
'use client';

import { useState } from 'react';

export default function UrlEncoder() {
  const [input, setInput] = useState('');
  const [encoded, setEncoded] = useState('');
  const [decoded, setDecoded] = useState('');
  const [copiedEncoded, setCopiedEncoded] = useState(false);
  const [copiedDecoded, setCopiedDecoded] = useState(false);

  // Encode URL
  const encode = (text: string) => {
    try {
      const result = encodeURIComponent(text);
      setEncoded(result);
      setDecoded(''); // Clear decode output when encoding
    } catch (err) {
      setEncoded('Error: Invalid input');
    }
  };

  // Decode URL
  const decode = (text: string) => {
    try {
      const result = decodeURIComponent(text);
      setDecoded(result);
      setEncoded(''); // Clear encode output when decoding
    } catch (err) {
      setDecoded('Error: Invalid encoded string');
    }
  };

  // Handle input change
  const handleInputChange = (text: string) => {
    setInput(text);
    // Auto-detect and process
    if (text.includes('%')) {
      // Likely encoded, try decoding
      decode(text);
    } else {
      // Plain text, encode it
      encode(text);
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string, type: 'encoded' | 'decoded') => {
    if (!text || text.startsWith('Error:')) return;

    try {
      await navigator.clipboard.writeText(text);
      if (type === 'encoded') {
        setCopiedEncoded(true);
        setTimeout(() => setCopiedEncoded(false), 2000);
      } else {
        setCopiedDecoded(true);
        setTimeout(() => setCopiedDecoded(false), 2000);
      }
    } catch (err) {
      alert('Failed to copy text');
    }
  };

  return (
    <div className="space-y-6">

      {/* Input Area */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Enter text to encode or paste encoded URL to decode:
        </label>
        <textarea
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="https://example.com/search?q=hello world&lang=en"
          className="w-full h-32 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3
                   text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500
                   focus:ring-2 focus:ring-blue-500/20 transition-all resize-none font-mono text-sm"
        />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => encode(input)}
          disabled={!input}
          className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700
                   disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all
                   flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Encode
        </button>
        <button
          onClick={() => decode(input)}
          disabled={!input}
          className="px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-zinc-700
                   disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all
                   flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
          Decode
        </button>
      </div>

      {/* Encoded Output */}
      {encoded && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-blue-400">
              Encoded URL:
            </label>
            <button
              onClick={() => copyToClipboard(encoded, 'encoded')}
              disabled={encoded.startsWith('Error:')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                copiedEncoded
                  ? 'bg-green-600 text-white'
                  : encoded.startsWith('Error:')
                  ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {copiedEncoded ? (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </span>
              ) : (
                'Copy'
              )}
            </button>
          </div>
          <div className={`bg-zinc-800 border rounded-lg p-4 font-mono text-sm break-all ${
            encoded.startsWith('Error:') ? 'border-red-500/50 text-red-400' : 'border-zinc-700 text-green-400'
          }`}>
            {encoded}
          </div>
        </div>
      )}

      {/* Decoded Output */}
      {decoded && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-green-400">
              Decoded URL:
            </label>
            <button
              onClick={() => copyToClipboard(decoded, 'decoded')}
              disabled={decoded.startsWith('Error:')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                copiedDecoded
                  ? 'bg-green-600 text-white'
                  : decoded.startsWith('Error:')
                  ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {copiedDecoded ? (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </span>
              ) : (
                'Copy'
              )}
            </button>
          </div>
          <div className={`bg-zinc-800 border rounded-lg p-4 font-mono text-sm break-all ${
            decoded.startsWith('Error:') ? 'border-red-500/50 text-red-400' : 'border-zinc-700 text-blue-400'
          }`}>
            {decoded}
          </div>
        </div>
      )}

      {/* Character Reference */}
      <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
        <h3 className="text-sm font-bold text-white mb-3">Common URL Encodings:</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-xs text-zinc-400 font-mono">
          <div><code className="text-zinc-300">space</code> → <code className="text-blue-400">%20</code></div>
          <div><code className="text-zinc-300">!</code> → <code className="text-blue-400">%21</code></div>
          <div><code className="text-zinc-300">#</code> → <code className="text-blue-400">%23</code></div>
          <div><code className="text-zinc-300">$</code> → <code className="text-blue-400">%24</code></div>
          <div><code className="text-zinc-300">%</code> → <code className="text-blue-400">%25</code></div>
          <div><code className="text-zinc-300">&</code> → <code className="text-blue-400">%26</code></div>
          <div><code className="text-zinc-300">=</code> → <code className="text-blue-400">%3D</code></div>
          <div><code className="text-zinc-300">?</code> → <code className="text-blue-400">%3F</code></div>
          <div><code className="text-zinc-300">@</code> → <code className="text-blue-400">%40</code></div>
        </div>
      </div>

      {/* Info Notice */}
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-sm text-purple-300 flex gap-3">
        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>
          <strong>URL Encoding:</strong> Converts special characters to percent-encoded format (%XX)
          to safely transmit URLs. This tool auto-detects whether your input needs encoding or decoding.
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-300 flex gap-3">
        <span className="text-xl">🔒</span>
        <p>
          <strong>100% Client-Side:</strong> All encoding/decoding happens in your browser.
          No URLs are sent to our servers.
        </p>
      </div>

    </div>
  );
}
