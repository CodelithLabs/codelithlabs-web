'use client';

import { memo, useState, useCallback } from 'react';

interface Shadow {
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

function BoxShadowGenerator() {
  const [shadows, setShadows] = useState<Shadow[]>([
    { offsetX: 0, offsetY: 4, blur: 6, spread: -1, color: '#000000', opacity: 0.1, inset: false },
    { offsetX: 0, offsetY: 2, blur: 4, spread: -2, color: '#000000', opacity: 0.1, inset: false },
  ]);

  const updateShadow = useCallback((index: number, field: keyof Shadow, value: any) => {
    setShadows(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  }, []);

  const addShadow = useCallback(() => {
    setShadows(prev => [...prev, { offsetX: 0, offsetY: 4, blur: 6, spread: 0, color: '#000000', opacity: 0.2, inset: false }]);
  }, []);

  const removeShadow = useCallback((index: number) => {
    setShadows(prev => prev.filter((_, i) => i !== index));
  }, []);

  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const generateCSS = useCallback(() => {
    return shadows.map(s => {
      const parts = [
        s.inset ? 'inset' : '',
        `${s.offsetX}px`,
        `${s.offsetY}px`,
        `${s.blur}px`,
        `${s.spread}px`,
        hexToRgba(s.color, s.opacity),
      ].filter(Boolean).join(' ');
      return parts;
    }).join(',\n    ');
  }, [shadows]);

  const cssValue = generateCSS();
  const previewStyle = { boxShadow: shadows.map(s => `${s.inset ? 'inset ' : ''}${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${hexToRgba(s.color, s.opacity)}`).join(', ') };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Box Shadow Generator</h3>
          <button
            onClick={addShadow}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
          >
            + Add Shadow
          </button>
        </div>
        <div className="space-y-4">
          {shadows.map((shadow, index) => (
            <div key={index} className="bg-zinc-900 rounded-lg p-4 border border-zinc-700">
              <div className="flex justify-between items-center mb-3">
                <span className="text-zinc-300 text-sm font-medium">Shadow {index + 1}</span>
                {shadows.length > 1 && (
                  <button
                    onClick={() => removeShadow(index)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Offset X</label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={shadow.offsetX}
                    onChange={(e) => updateShadow(index, 'offsetX', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-zinc-400 text-xs">{shadow.offsetX}px</div>
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Offset Y</label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={shadow.offsetY}
                    onChange={(e) => updateShadow(index, 'offsetY', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-zinc-400 text-xs">{shadow.offsetY}px</div>
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Blur</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={shadow.blur}
                    onChange={(e) => updateShadow(index, 'blur', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-zinc-400 text-xs">{shadow.blur}px</div>
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Spread</label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={shadow.spread}
                    onChange={(e) => updateShadow(index, 'spread', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-zinc-400 text-xs">{shadow.spread}px</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Color</label>
                  <input
                    type="color"
                    value={shadow.color}
                    onChange={(e) => updateShadow(index, 'color', e.target.value)}
                    className="w-full h-8 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Opacity</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={shadow.opacity}
                    onChange={(e) => updateShadow(index, 'opacity', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-zinc-400 text-xs">{Math.round(shadow.opacity * 100)}%</div>
                </div>
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shadow.inset}
                      onChange={(e) => updateShadow(index, 'inset', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-zinc-300 text-sm">Inset</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
        <div className="flex items-center justify-center p-12 bg-zinc-900 rounded-lg">
          <div
            className="w-32 h-32 bg-white rounded-lg"
            style={previewStyle}
          />
        </div>
      </div>

      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">CSS Output</h3>
          <button
            onClick={() => navigator.clipboard.writeText(`box-shadow: ${cssValue};`)}
            className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded transition-colors"
          >
            Copy CSS
          </button>
        </div>
        <pre className="bg-zinc-900 rounded-lg p-4 text-green-400 text-sm overflow-x-auto font-mono">
{`box-shadow: ${cssValue};`}
        </pre>
      </div>
    </div>
  );
}

export default memo(BoxShadowGenerator);
