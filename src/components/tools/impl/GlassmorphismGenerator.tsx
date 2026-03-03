'use client';

import { memo, useState, useCallback } from 'react';

function GlassmorphismGenerator() {
  const [blur, setBlur] = useState(10);
  const [transparency, setTransparency] = useState(0.25);
  const [saturation, setSaturation] = useState(180);
  const [borderOpacity, setBorderOpacity] = useState(0.2);
  const [bgColor, setBgColor] = useState('#ffffff');

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const cssCode = `background: ${hexToRgba(bgColor, transparency)};
backdrop-filter: blur(${blur}px) saturate(${saturation}%);
-webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
border: 1px solid ${hexToRgba(bgColor, borderOpacity)};
border-radius: 16px;`;

  const previewStyle = {
    background: hexToRgba(bgColor, transparency),
    backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
    border: `1px solid ${hexToRgba(bgColor, borderOpacity)}`,
    borderRadius: '16px',
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Glassmorphism Generator</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Blur: {blur}px</label>
            <input
              type="range"
              min="0"
              max="30"
              value={blur}
              onChange={(e) => setBlur(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Transparency: {Math.round(transparency * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={transparency}
              onChange={(e) => setTransparency(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Saturation: {saturation}%</label>
            <input
              type="range"
              min="100"
              max="300"
              value={saturation}
              onChange={(e) => setSaturation(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Border Opacity: {Math.round(borderOpacity * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={borderOpacity}
              onChange={(e) => setBorderOpacity(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Base Color</label>
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
        </div>
      </div>

      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
        <div 
          className="relative rounded-lg overflow-hidden p-8"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center gap-4">
            <div className="w-16 h-16 bg-pink-500 rounded-full" />
            <div className="w-20 h-20 bg-yellow-400 rounded-full" />
            <div className="w-12 h-12 bg-green-400 rounded-full" />
          </div>
          <div
            className="relative p-8 text-center"
            style={previewStyle}
          >
            <h4 className="text-white text-xl font-bold mb-2">Glassmorphism Effect</h4>
            <p className="text-white/80 text-sm">This box has a frosted glass effect with blur and transparency.</p>
          </div>
        </div>
      </div>

      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">CSS Output</h3>
          <button
            onClick={() => navigator.clipboard.writeText(cssCode)}
            className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded transition-colors"
          >
            Copy CSS
          </button>
        </div>
        <pre className="bg-zinc-900 rounded-lg p-4 text-green-400 text-sm overflow-x-auto font-mono">
          {cssCode}
        </pre>
      </div>
    </div>
  );
}

export default memo(GlassmorphismGenerator);
