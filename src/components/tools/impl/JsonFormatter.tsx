// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/tools/impl/JsonFormatter.tsx
// Example tool implementation - JSON Formatter (100% client-side)
// ═══════════════════════════════════════════════════════════════════════════
'use client';

import { useState, useCallback } from 'react';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indentSize, setIndentSize] = useState(2);

  const formatJson = useCallback(() => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutput(formatted);
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }, [input, indentSize]);

  const minifyJson = useCallback(() => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }, [input]);

  const copyOutput = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-zinc-400">Indent:</label>
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-white text-sm"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={1}>Tab</option>
          </select>
        </div>
        <button
          onClick={formatJson}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Format / Beautify
        </button>
        <button
          onClick={minifyJson}
          className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
        >
          Minify
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
          ❌ Invalid JSON: {error}
        </div>
      )}

      {/* Input/Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Input JSON:
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"example": "Paste your JSON here..."}'
            className="w-full h-64 bg-zinc-800 border border-zinc-700 rounded-lg p-4 
                       text-white font-mono text-sm placeholder-zinc-500 resize-y
                       focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-zinc-300">Output:</label>
            <button
              onClick={copyOutput}
              disabled={!output}
              className="text-xs text-blue-400 hover:text-blue-300 disabled:text-zinc-600"
            >
              📋 Copy
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Formatted output will appear here..."
            className="w-full h-64 bg-zinc-900 border border-zinc-700 rounded-lg p-4 
                       text-green-400 font-mono text-sm placeholder-zinc-500 resize-y"
          />
        </div>
      </div>
    </div>
  );
}
