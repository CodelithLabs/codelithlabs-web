// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/tools/impl/TextDiffChecker.tsx
// Side-by-Side Text Comparison with Line-by-Line Diff
// ═══════════════════════════════════════════════════════════════════════════
'use client';

import { useState, useMemo } from 'react';

type DiffLine = {
  left: string;
  right: string;
  type: 'same' | 'different' | 'leftOnly' | 'rightOnly';
};

export default function TextDiffChecker() {
  const [leftText, setLeftText] = useState('');
  const [rightText, setRightText] = useState('');

  // Calculate diff
  const diff = useMemo(() => {
    const leftLines = leftText.split('\n');
    const rightLines = rightText.split('\n');
    const maxLines = Math.max(leftLines.length, rightLines.length);

    const result: DiffLine[] = [];
    let diffCount = 0;

    for (let i = 0; i < maxLines; i++) {
      const left = leftLines[i] || '';
      const right = rightLines[i] || '';

      let type: DiffLine['type'];
      if (left === right) {
        type = 'same';
      } else if (left && !right) {
        type = 'leftOnly';
        diffCount++;
      } else if (!left && right) {
        type = 'rightOnly';
        diffCount++;
      } else {
        type = 'different';
        diffCount++;
      }

      result.push({ left, right, type });
    }

    return { lines: result, diffCount };
  }, [leftText, rightText]);

  const clearAll = () => {
    setLeftText('');
    setRightText('');
  };

  return (
    <div className="space-y-6">

      {/* Input Areas */}
      <div className="grid md:grid-cols-2 gap-4">

        {/* Left Text */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Original Text:
          </label>
          <textarea
            value={leftText}
            onChange={(e) => setLeftText(e.target.value)}
            placeholder="Paste original text here..."
            className="w-full h-48 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3
                     text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500
                     focus:ring-2 focus:ring-blue-500/20 transition-all resize-none font-mono text-sm"
          />
        </div>

        {/* Right Text */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Modified Text:
          </label>
          <textarea
            value={rightText}
            onChange={(e) => setRightText(e.target.value)}
            placeholder="Paste modified text here..."
            className="w-full h-48 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3
                     text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500
                     focus:ring-2 focus:ring-blue-500/20 transition-all resize-none font-mono text-sm"
          />
        </div>

      </div>

      {/* Stats */}
      {(leftText || rightText) && (
        <div className="flex flex-wrap items-center gap-4 p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-400">Differences:</span>
            <span className={`text-lg font-bold ${diff.diffCount > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {diff.diffCount}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-400">Lines:</span>
            <span className="text-lg font-bold text-blue-400">
              {diff.lines.length}
            </span>
          </div>
          <button
            onClick={clearAll}
            className="ml-auto px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm
                     font-medium rounded-lg transition-colors"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Diff View */}
      {(leftText || rightText) && (
        <div>
          <h3 className="text-sm font-medium text-zinc-300 mb-2">Line-by-Line Comparison:</h3>
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 divide-x divide-zinc-700">

                {/* Headers */}
                <div className="sticky top-0 bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-400 border-b border-zinc-700">
                  Original
                </div>
                <div className="sticky top-0 bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-400 border-b border-zinc-700">
                  Modified
                </div>

                {/* Lines */}
                {diff.lines.map((line, index) => (
                  <>
                    <div
                      key={`left-${index}`}
                      className={`px-4 py-2 font-mono text-xs whitespace-pre-wrap break-all border-b border-zinc-800 ${
                        line.type === 'same'
                          ? 'bg-zinc-900 text-zinc-400'
                          : line.type === 'leftOnly'
                          ? 'bg-red-500/10 text-red-300'
                          : line.type === 'different'
                          ? 'bg-orange-500/10 text-orange-300'
                          : 'bg-zinc-900/50 text-zinc-600'
                      }`}
                    >
                      {line.left || <span className="text-zinc-700">(empty)</span>}
                    </div>
                    <div
                      key={`right-${index}`}
                      className={`px-4 py-2 font-mono text-xs whitespace-pre-wrap break-all border-b border-zinc-800 ${
                        line.type === 'same'
                          ? 'bg-zinc-900 text-zinc-400'
                          : line.type === 'rightOnly'
                          ? 'bg-green-500/10 text-green-300'
                          : line.type === 'different'
                          ? 'bg-orange-500/10 text-orange-300'
                          : 'bg-zinc-900/50 text-zinc-600'
                      }`}
                    >
                      {line.right || <span className="text-zinc-700">(empty)</span>}
                    </div>
                  </>
                ))}

              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <div className="w-4 h-4 bg-zinc-900 border border-zinc-700 rounded"></div>
              Same
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <div className="w-4 h-4 bg-orange-500/20 border border-orange-500/30 rounded"></div>
              Different
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <div className="w-4 h-4 bg-red-500/20 border border-red-500/30 rounded"></div>
              Removed
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <div className="w-4 h-4 bg-green-500/20 border border-green-500/30 rounded"></div>
              Added
            </div>
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-300 flex gap-3">
        <span className="text-xl">🔒</span>
        <p>
          <strong>100% Client-Side:</strong> Text comparison happens entirely in your browser.
          No data is uploaded to our servers.
        </p>
      </div>

    </div>
  );
}
