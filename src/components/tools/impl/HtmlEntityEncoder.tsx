// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/tools/impl/HtmlEntityEncoder.tsx
// HTML Entity Encoder - Convert Special Characters to HTML Entities
// ═══════════════════════════════════════════════════════════════════════════
'use client';

import { useState } from 'react';

export default function HtmlEntityEncoder() {
  const [input, setInput] = useState('');
  const [encoded, setEncoded] = useState('');
  const [decoded, setDecoded] = useState('');
  const [copiedEncoded, setCopiedEncoded] = useState(false);
  const [copiedDecoded, setCopiedDecoded] = useState(false);

  // HTML entity map
  const entityMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };

  // Reverse map for decoding
  const reverseEntityMap: Record<string, string> = Object.entries(entityMap).reduce(
    (acc, [char, entity]) => {
      acc[entity] = char;
      return acc;
    },
    {} as Record<string, string>
  );

  // Encode HTML entities
  const encode = (text: string) => {
    const result = text.replace(/[&<>"'`=\/]/g, (char) => entityMap[char] || char);
    setEncoded(result);
    setDecoded(''); // Clear decode output
  };

  // Decode HTML entities
  const decode = (text: string) => {
    let result = text;

    // Decode named entities
    Object.entries(reverseEntityMap).forEach(([entity, char]) => {
      result = result.replace(new RegExp(entity, 'g'), char);
    });

    // Decode numeric entities (&#39; and &#x27;)
    result = result.replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)));
    result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

    setDecoded(result);
    setEncoded(''); // Clear encode output
  };

  // Handle input change
  const handleInputChange = (text: string) => {
    setInput(text);
    // Auto-detect and process
    if (text.includes('&') && (text.includes(';') || text.includes('&lt;') || text.includes('&gt;'))) {
      // Likely encoded, try decoding
      decode(text);
    } else {
      // Plain text, encode it
      encode(text);
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string, type: 'encoded' | 'decoded') => {
    if (!text) return;

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
          Enter HTML to encode or paste encoded HTML entities to decode:
        </label>
        <textarea
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder='<div class="example">Hello & "World"</div>'
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
              Encoded HTML:
            </label>
            <button
              onClick={() => copyToClipboard(encoded, 'encoded')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                copiedEncoded
                  ? 'bg-green-600 text-white'
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
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 font-mono text-sm break-all text-green-400">
            {encoded}
          </div>
        </div>
      )}

      {/* Decoded Output */}
      {decoded && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-green-400">
              Decoded HTML:
            </label>
            <button
              onClick={() => copyToClipboard(decoded, 'decoded')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                copiedDecoded
                  ? 'bg-green-600 text-white'
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
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 font-mono text-sm break-all text-blue-400">
            {decoded}
          </div>
        </div>
      )}

      {/* Entity Reference */}
      <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
        <h3 className="text-sm font-bold text-white mb-3">Common HTML Entities:</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-xs text-zinc-400 font-mono">
          <div><code className="text-zinc-300">&</code> → <code className="text-blue-400">&amp;amp;</code></div>
          <div><code className="text-zinc-300">&lt;</code> → <code className="text-blue-400">&amp;lt;</code></div>
          <div><code className="text-zinc-300">&gt;</code> → <code className="text-blue-400">&amp;gt;</code></div>
          <div><code className="text-zinc-300">"</code> → <code className="text-blue-400">&amp;quot;</code></div>
          <div><code className="text-zinc-300">'</code> → <code className="text-blue-400">&amp;#39;</code></div>
          <div><code className="text-zinc-300">/</code> → <code className="text-blue-400">&amp;#x2F;</code></div>
          <div><code className="text-zinc-300">`</code> → <code className="text-blue-400">&amp;#x60;</code></div>
          <div><code className="text-zinc-300">=</code> → <code className="text-blue-400">&amp;#x3D;</code></div>
          <div><code className="text-zinc-300">©</code> → <code className="text-blue-400">&amp;copy;</code></div>
        </div>
      </div>

      {/* Info Notice */}
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-sm text-purple-300 flex gap-3">
        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>
          <strong>HTML Entity Encoding:</strong> Prevents XSS attacks by converting special characters
          to their safe HTML entity equivalents. Essential for displaying user input securely.
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-300 flex gap-3">
        <span className="text-xl">🔒</span>
        <p>
          <strong>100% Client-Side:</strong> All encoding/decoding happens in your browser.
          No HTML content is sent to our servers.
        </p>
      </div>

    </div>
  );
}
