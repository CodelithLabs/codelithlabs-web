'use client';

import { memo, useState, useCallback, useRef } from 'react';

function FaviconGenerator() {
  const [text, setText] = useState('A');
  const [bgColor, setBgColor] = useState('#3b82f6');
  const [textColor, setTextColor] = useState('#ffffff');
  const [shape, setShape] = useState<'square' | 'circle'>('square');
  const [fontSize, setFontSize] = useState('60');
  const [result, setResult] = useState<{ ico: string; png16: string; png32: string; png192: string } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateFavicon = useCallback((size: number): string => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Background
    if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.fillStyle = bgColor;
      ctx.fill();
    } else {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);
    }

    // Text
    const fontSizeValue = (parseInt(fontSize) / 100) * size;
    ctx.font = `bold ${fontSizeValue}px Arial, sans-serif`;
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text.substring(0, 2), size / 2, size / 2 + fontSizeValue * 0.05);

    return canvas.toDataURL('image/png');
  }, [text, bgColor, textColor, shape, fontSize]);

  const handleGenerate = useCallback(() => {
    setResult({
      ico: generateFavicon(32),
      png16: generateFavicon(16),
      png32: generateFavicon(32),
      png192: generateFavicon(192),
    });
  }, [generateFavicon]);

  const handleDownload = useCallback((dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Favicon Generator</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Text (1-2 characters)</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value.substring(0, 2))}
              placeholder="A"
              maxLength={2}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Shape</label>
              <select
                value={shape}
                onChange={(e) => setShape(e.target.value as 'square' | 'circle')}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="square">Square</option>
                <option value="circle">Circle</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Font Size (%)</label>
              <input
                type="range"
                min="30"
                max="80"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="w-full"
              />
              <div className="text-zinc-400 text-sm text-center">{fontSize}%</div>
            </div>
          </div>
          <button
            onClick={handleGenerate}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Generate Favicons
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {result && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Generated Favicons</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center h-20 mb-2" style={{ backgroundImage: 'linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)', backgroundSize: '10px 10px' }}>
                <img src={result.png16} alt="16x16" className="w-4 h-4" />
              </div>
              <div className="text-zinc-400 text-sm mb-2">16×16</div>
              <button
                onClick={() => handleDownload(result.png16, 'favicon-16x16.png')}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
              >
                Download
              </button>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center h-20 mb-2" style={{ backgroundImage: 'linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)', backgroundSize: '10px 10px' }}>
                <img src={result.png32} alt="32x32" className="w-8 h-8" />
              </div>
              <div className="text-zinc-400 text-sm mb-2">32×32</div>
              <button
                onClick={() => handleDownload(result.png32, 'favicon-32x32.png')}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
              >
                Download
              </button>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center h-20 mb-2" style={{ backgroundImage: 'linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)', backgroundSize: '10px 10px' }}>
                <img src={result.ico} alt="favicon.ico" className="w-8 h-8" />
              </div>
              <div className="text-zinc-400 text-sm mb-2">favicon.ico</div>
              <button
                onClick={() => handleDownload(result.ico, 'favicon.ico')}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
              >
                Download
              </button>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center h-20 mb-2" style={{ backgroundImage: 'linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)', backgroundSize: '10px 10px' }}>
                <img src={result.png192} alt="192x192" className="w-12 h-12" />
              </div>
              <div className="text-zinc-400 text-sm mb-2">192×192</div>
              <button
                onClick={() => handleDownload(result.png192, 'android-chrome-192x192.png')}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(FaviconGenerator);
