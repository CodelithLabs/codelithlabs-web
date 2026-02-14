// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/tools/impl/LoremIpsumGen.tsx
// Lorem Ipsum Generator with Paragraphs, Sentences, and Words
// ═══════════════════════════════════════════════════════════════════════════
'use client';

import { useState } from 'react';

export default function LoremIpsumGen() {
  const [generated, setGenerated] = useState('');
  const [count, setCount] = useState(3);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [copied, setCopied] = useState(false);

  // Lorem ipsum word bank
  const words = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
  ];

  // Generate random word
  const getRandomWord = () => words[Math.floor(Math.random() * words.length)];

  // Generate sentence (5-15 words)
  const generateSentence = () => {
    const length = Math.floor(Math.random() * 11) + 5;
    const sentence = Array.from({ length }, () => getRandomWord()).join(' ');
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
  };

  // Generate paragraph (3-7 sentences)
  const generateParagraph = () => {
    const length = Math.floor(Math.random() * 5) + 3;
    return Array.from({ length }, () => generateSentence()).join(' ');
  };

  // Generate lorem ipsum
  const generate = () => {
    let result = '';

    if (type === 'paragraphs') {
      result = Array.from({ length: count }, () => generateParagraph()).join('\n\n');
    } else if (type === 'sentences') {
      result = Array.from({ length: count }, () => generateSentence()).join(' ');
    } else if (type === 'words') {
      result = Array.from({ length: count }, () => getRandomWord()).join(' ');
    }

    setGenerated(result);
    setCopied(false);
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    if (!generated) return;

    try {
      await navigator.clipboard.writeText(generated);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('Failed to copy text');
    }
  };

  return (
    <div className="space-y-6">

      {/* Controls */}
      <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6 space-y-4">

        {/* Type Selector */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Generate:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['paragraphs', 'sentences', 'words'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  type === t
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Count Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-zinc-300">
              Count:
            </label>
            <span className="text-sm font-bold text-white bg-zinc-900 px-3 py-1 rounded-lg">
              {count}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max={type === 'words' ? 100 : type === 'sentences' ? 20 : 10}
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
            <span>{type === 'words' ? 100 : type === 'sentences' ? 20 : 10}</span>
          </div>
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
          Generate Lorem Ipsum
        </button>

      </div>

      {/* Output Area */}
      {generated && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-zinc-300">
              Generated Text:
            </label>
            <button
              onClick={copyToClipboard}
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
                  Copied!
                </span>
              ) : (
                'Copy'
              )}
            </button>
          </div>
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 max-h-96 overflow-y-auto">
            <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
              {generated}
            </p>
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-300 flex gap-3">
        <span className="text-xl">🔒</span>
        <p>
          <strong>100% Client-Side:</strong> All text is generated in your browser.
          Nothing is uploaded to our servers.
        </p>
      </div>

    </div>
  );
}
