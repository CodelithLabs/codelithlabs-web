'use client';

import { memo, useState, useCallback } from 'react';

function PixelToRem() {
  const [pixels, setPixels] = useState('');
  const [baseSize, setBaseSize] = useState('16');
  const [mode, setMode] = useState<'toRem' | 'toPx'>('toRem');
  const [result, setResult] = useState<string | null>(null);

  const handleConvert = useCallback(() => {
    const value = parseFloat(pixels) || 0;
    const base = parseFloat(baseSize) || 16;

    if (value === 0) {
      setResult(null);
      return;
    }

    if (mode === 'toRem') {
      const rem = value / base;
      setResult(`${rem.toFixed(4).replace(/\.?0+$/, '')}rem`);
    } else {
      const px = value * base;
      setResult(`${px.toFixed(2).replace(/\.?0+$/, '')}px`);
    }
  }, [pixels, baseSize, mode]);

  const commonSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 96];

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Pixel ↔ REM Converter</h3>
        <div className="space-y-4">
          <div className="flex gap-4 mb-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={mode === 'toRem'}
                onChange={() => setMode('toRem')}
                className="mr-2"
              />
              <span className="text-zinc-300 text-sm">Pixels to REM</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={mode === 'toPx'}
                onChange={() => setMode('toPx')}
                className="mr-2"
              />
              <span className="text-zinc-300 text-sm">REM to Pixels</span>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                {mode === 'toRem' ? 'Pixels' : 'REM'}
              </label>
              <input
                type="number"
                value={pixels}
                onChange={(e) => setPixels(e.target.value)}
                placeholder={mode === 'toRem' ? 'e.g., 16' : 'e.g., 1'}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Base Font Size (px)</label>
              <input
                type="number"
                value={baseSize}
                onChange={(e) => setBaseSize(e.target.value)}
                placeholder="16"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            onClick={handleConvert}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Convert
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Result</h3>
          <div className="flex items-center justify-between bg-zinc-900 rounded-lg p-4">
            <span className="text-green-400 font-mono text-2xl">{result}</span>
            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded transition-colors"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Reference (base: {baseSize}px)</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {commonSizes.map((size) => {
            const base = parseFloat(baseSize) || 16;
            const rem = size / base;
            return (
              <button
                key={size}
                onClick={() => {
                  setPixels(size.toString());
                  setMode('toRem');
                  setResult(`${rem.toFixed(4).replace(/\.?0+$/, '')}rem`);
                }}
                className="bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-center hover:border-blue-500 transition-colors"
              >
                <div className="text-blue-400 font-mono text-sm">{size}px</div>
                <div className="text-zinc-400 text-xs">{rem.toFixed(3).replace(/\.?0+$/, '')}rem</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default memo(PixelToRem);
