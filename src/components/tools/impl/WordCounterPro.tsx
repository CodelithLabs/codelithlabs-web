// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/tools/impl/WordCounterPro.tsx
// Advanced Word & Character Counter with Reading/Speaking Time
// ═══════════════════════════════════════════════════════════════════════════
'use client';

import { useState, useEffect, useMemo } from 'react';

export default function WordCounterPro() {
  const [text, setText] = useState('');

  // Calculate statistics
  const stats = useMemo(() => {
    const trimmedText = text.trim();

    // Characters (with and without spaces)
    const charCount = text.length;
    const charCountNoSpaces = text.replace(/\s/g, '').length;

    // Words
    const wordCount = trimmedText === '' ? 0 : trimmedText.split(/\s+/).length;

    // Sentences (split by . ! ?)
    const sentenceCount = trimmedText === '' ? 0 : trimmedText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

    // Paragraphs (split by double newline)
    const paragraphCount = trimmedText === '' ? 0 : trimmedText.split(/\n\n+/).filter(p => p.trim().length > 0).length;

    // Reading time (average 200 words per minute)
    const readingTimeMinutes = Math.ceil(wordCount / 200);

    // Speaking time (average 130 words per minute)
    const speakingTimeMinutes = Math.ceil(wordCount / 130);

    return {
      charCount,
      charCountNoSpaces,
      wordCount,
      sentenceCount,
      paragraphCount,
      readingTimeMinutes,
      speakingTimeMinutes,
    };
  }, [text]);

  return (
    <div className="space-y-6">

      {/* Input Area */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Enter or paste your text:
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your text here..."
          className="w-full h-64 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3
                   text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500
                   focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
        />
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {/* Characters */}
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
          <div className="text-3xl font-bold text-blue-400 mb-1">
            {stats.charCount.toLocaleString()}
          </div>
          <div className="text-sm text-zinc-400">Characters</div>
          <div className="text-xs text-zinc-500 mt-1">
            {stats.charCountNoSpaces.toLocaleString()} without spaces
          </div>
        </div>

        {/* Words */}
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
          <div className="text-3xl font-bold text-green-400 mb-1">
            {stats.wordCount.toLocaleString()}
          </div>
          <div className="text-sm text-zinc-400">Words</div>
        </div>

        {/* Sentences */}
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
          <div className="text-3xl font-bold text-purple-400 mb-1">
            {stats.sentenceCount.toLocaleString()}
          </div>
          <div className="text-sm text-zinc-400">Sentences</div>
        </div>

        {/* Paragraphs */}
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
          <div className="text-3xl font-bold text-orange-400 mb-1">
            {stats.paragraphCount.toLocaleString()}
          </div>
          <div className="text-sm text-zinc-400">Paragraphs</div>
        </div>

      </div>

      {/* Time Estimates */}
      <div className="grid md:grid-cols-2 gap-4">

        {/* Reading Time */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {stats.readingTimeMinutes} min
              </div>
              <div className="text-sm text-zinc-400">Reading Time</div>
              <div className="text-xs text-zinc-500">Average 200 wpm</div>
            </div>
          </div>
        </div>

        {/* Speaking Time */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {stats.speakingTimeMinutes} min
              </div>
              <div className="text-sm text-zinc-400">Speaking Time</div>
              <div className="text-xs text-zinc-500">Average 130 wpm</div>
            </div>
          </div>
        </div>

      </div>

      {/* Clear Button */}
      {text && (
        <button
          onClick={() => setText('')}
          className="w-full px-4 py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-medium
                   rounded-lg transition-colors"
        >
          Clear Text
        </button>
      )}

      {/* Privacy Notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-300 flex gap-3">
        <span className="text-xl">🔒</span>
        <p>
          <strong>100% Client-Side:</strong> Your text is processed entirely within your browser.
          Nothing is uploaded to our servers.
        </p>
      </div>

    </div>
  );
}
