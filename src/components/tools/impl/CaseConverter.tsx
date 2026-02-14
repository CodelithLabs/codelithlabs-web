// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/tools/impl/CaseConverter.tsx
// Multi-Format Case Converter (UPPER, lower, Title, camelCase, snake_case, etc.)
// ═══════════════════════════════════════════════════════════════════════════
'use client';

import { useState } from 'react';

type CaseType = 'upper' | 'lower' | 'title' | 'camel' | 'pascal' | 'snake' | 'kebab' | 'constant';

export default function CaseConverter() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState<CaseType | null>(null);

  // Conversion functions
  const convertCase = (text: string, caseType: CaseType): string => {
    if (!text) return '';

    switch (caseType) {
      case 'upper':
        return text.toUpperCase();

      case 'lower':
        return text.toLowerCase();

      case 'title':
        return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

      case 'camel':
        return text
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());

      case 'pascal':
        return text
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
          .replace(/^./, (char) => char.toUpperCase());

      case 'snake':
        return text
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+/g, '_')
          .replace(/^_+|_+$/g, '');

      case 'kebab':
        return text
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

      case 'constant':
        return text
          .toUpperCase()
          .replace(/[^a-zA-Z0-9]+/g, '_')
          .replace(/^_+|_+$/g, '');

      default:
        return text;
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string, caseType: CaseType) => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(caseType);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      alert('Failed to copy text');
    }
  };

  const cases: Array<{ type: CaseType; label: string; example: string }> = [
    { type: 'upper', label: 'UPPERCASE', example: 'HELLO WORLD' },
    { type: 'lower', label: 'lowercase', example: 'hello world' },
    { type: 'title', label: 'Title Case', example: 'Hello World' },
    { type: 'camel', label: 'camelCase', example: 'helloWorld' },
    { type: 'pascal', label: 'PascalCase', example: 'HelloWorld' },
    { type: 'snake', label: 'snake_case', example: 'hello_world' },
    { type: 'kebab', label: 'kebab-case', example: 'hello-world' },
    { type: 'constant', label: 'CONSTANT_CASE', example: 'HELLO_WORLD' },
  ];

  return (
    <div className="space-y-6">

      {/* Input Area */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Enter text to convert:
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="hello world"
          className="w-full h-32 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3
                   text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500
                   focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
        />
      </div>

      {/* Conversion Results Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-zinc-400">Converted Results:</h3>

        {cases.map(({ type, label, example }) => {
          const convertedText = convertCase(input, type);
          const isCopied = copied === type;

          return (
            <div key={type} className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-white font-medium">{label}</span>
                  <span className="text-xs text-zinc-500 ml-2">({example})</span>
                </div>
                <button
                  onClick={() => copyToClipboard(convertedText, type)}
                  disabled={!convertedText}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isCopied
                      ? 'bg-green-600 text-white'
                      : convertedText
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  {isCopied ? (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied
                    </span>
                  ) : (
                    'Copy'
                  )}
                </button>
              </div>
              <div className="bg-zinc-900 rounded-lg px-3 py-2 font-mono text-sm text-zinc-300 break-all">
                {convertedText || <span className="text-zinc-600">No output</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Clear Button */}
      {input && (
        <button
          onClick={() => setInput('')}
          className="w-full px-4 py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-medium
                   rounded-lg transition-colors"
        >
          Clear Input
        </button>
      )}

      {/* Privacy Notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-300 flex gap-3">
        <span className="text-xl">🔒</span>
        <p>
          <strong>100% Client-Side:</strong> All conversions happen in your browser.
          No data is sent to our servers.
        </p>
      </div>

    </div>
  );
}
