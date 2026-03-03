'use client';

import { memo, useState, useCallback } from 'react';

function AspectRatioCalculator() {
  const [width1, setWidth1] = useState('');
  const [height1, setHeight1] = useState('');
  const [width2, setWidth2] = useState('');
  const [height2, setHeight2] = useState('');
  const [mode, setMode] = useState<'width' | 'height'>('width');
  const [result, setResult] = useState<{ ratio: string; calculated: number } | null>(null);

  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const handleCalculate = useCallback(() => {
    const w1 = parseFloat(width1) || 0;
    const h1 = parseFloat(height1) || 0;

    if (w1 <= 0 || h1 <= 0) {
      setResult(null);
      return;
    }

    const divisor = gcd(Math.round(w1), Math.round(h1));
    const ratioW = Math.round(w1) / divisor;
    const ratioH = Math.round(h1) / divisor;
    const ratio = `${ratioW}:${ratioH}`;

    let calculated = 0;
    if (mode === 'width' && width2) {
      calculated = (parseFloat(width2) * h1) / w1;
    } else if (mode === 'height' && height2) {
      calculated = (parseFloat(height2) * w1) / h1;
    }

    setResult({ ratio, calculated });
  }, [width1, height1, width2, height2, mode]);

  const commonRatios = [
    { name: '16:9', w: 1920, h: 1080 },
    { name: '4:3', w: 1024, h: 768 },
    { name: '1:1', w: 1080, h: 1080 },
    { name: '9:16', w: 1080, h: 1920 },
    { name: '21:9', w: 2560, h: 1080 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Aspect Ratio Calculator</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Original Width</label>
              <input
                type="number"
                value={width1}
                onChange={(e) => setWidth1(e.target.value)}
                placeholder="e.g., 1920"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Original Height</label>
              <input
                type="number"
                value={height1}
                onChange={(e) => setHeight1(e.target.value)}
                placeholder="e.g., 1080"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="border-t border-zinc-700 pt-4">
            <label className="block text-sm font-medium text-zinc-300 mb-2">Calculate New Dimension</label>
            <div className="flex gap-4 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={mode === 'width'}
                  onChange={() => setMode('width')}
                  className="mr-2"
                />
                <span className="text-zinc-300 text-sm">From New Width</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={mode === 'height'}
                  onChange={() => setMode('height')}
                  className="mr-2"
                />
                <span className="text-zinc-300 text-sm">From New Height</span>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">New Width</label>
                <input
                  type="number"
                  value={width2}
                  onChange={(e) => setWidth2(e.target.value)}
                  placeholder="e.g., 1280"
                  disabled={mode === 'height'}
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">New Height</label>
                <input
                  type="number"
                  value={height2}
                  onChange={(e) => setHeight2(e.target.value)}
                  placeholder="e.g., 720"
                  disabled={mode === 'width'}
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Calculate
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Results</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-zinc-700">
              <span className="text-zinc-400">Aspect Ratio:</span>
              <span className="text-green-400 font-mono text-xl">{result.ratio}</span>
            </div>
            {result.calculated > 0 && (
              <div className="flex justify-between items-center py-2">
                <span className="text-zinc-400">Calculated {mode === 'width' ? 'Height' : 'Width'}:</span>
                <span className="text-blue-400 font-mono text-xl">{Math.round(result.calculated)}px</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Common Aspect Ratios</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {commonRatios.map((r) => (
            <button
              key={r.name}
              onClick={() => {
                setWidth1(r.w.toString());
                setHeight1(r.h.toString());
              }}
              className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-center hover:border-blue-500 transition-colors"
            >
              <div className="text-blue-400 font-medium">{r.name}</div>
              <div className="text-zinc-400 text-sm">{r.w}×{r.h}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(AspectRatioCalculator);
