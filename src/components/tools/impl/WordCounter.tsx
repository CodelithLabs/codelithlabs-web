// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/tools/impl/WordCounter.tsx
// Example tool implementation - Word Counter (100% client-side)
// ═══════════════════════════════════════════════════════════════════════════
'use client';

import { useState, useMemo } from 'react';

export default function WordCounter() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const trimmed = text.trim();
    return {
      characters: text.length,
      charactersNoSpaces: text.replace(/\s/g, '').length,
      words: trimmed ? trimmed.split(/\s+/).length : 0,
      sentences: trimmed ? (trimmed.match(/[.!?]+/g) || []).length || (trimmed.length > 0 ? 1 : 0) : 0,
      paragraphs: trimmed ? trimmed.split(/\n\n+/).filter(p => p.trim()).length : 0,
      lines: trimmed ? trimmed.split('\n').length : 0,
    };
  }, [text]);

  const readingTime = Math.ceil(stats.words / 200); // Average reading speed
  const speakingTime = Math.ceil(stats.words / 150); // Average speaking speed

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Enter or paste your text:
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your text here..."
          className="w-full h-48 bg-zinc-800 border border-zinc-700 rounded-lg p-4 
                     text-white placeholder-zinc-500 resize-y
                     focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Words', value: stats.words, color: 'blue' },
          { label: 'Characters', value: stats.characters, color: 'green' },
          { label: 'No Spaces', value: stats.charactersNoSpaces, color: 'purple' },
          { label: 'Sentences', value: stats.sentences, color: 'orange' },
          { label: 'Paragraphs', value: stats.paragraphs, color: 'pink' },
          { label: 'Lines', value: stats.lines, color: 'cyan' },
        ].map(stat => (
          <div 
            key={stat.label}
            className="bg-zinc-800/50 rounded-lg p-3 text-center"
          >
            <div className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</div>
            <div className="text-xs text-zinc-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Time Estimates */}
      <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
        <span>📖 Reading time: ~{readingTime} min</span>
        <span>🎤 Speaking time: ~{speakingTime} min</span>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigator.clipboard.writeText(text)}
          disabled={!text}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 
                     disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          Copy Text
        </button>
        <button
          onClick={() => setText('')}
          disabled={!text}
          className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800
                     disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
