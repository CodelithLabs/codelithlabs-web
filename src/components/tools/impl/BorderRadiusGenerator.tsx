'use client';

import { memo, useState, useCallback } from 'react';

function BorderRadiusGenerator() {
  const [topLeft, setTopLeft] = useState(8);
  const [topRight, setTopRight] = useState(8);
  const [bottomRight, setBottomRight] = useState(8);
  const [bottomLeft, setBottomLeft] = useState(8);
  const [linked, setLinked] = useState(true);
  const [unit, setUnit] = useState<'px' | '%'>('px');

  const handleChange = useCallback((corner: 'tl' | 'tr' | 'br' | 'bl', value: number) => {
    if (linked) {
      setTopLeft(value);
      setTopRight(value);
      setBottomRight(value);
      setBottomLeft(value);
    } else {
      switch (corner) {
        case 'tl': setTopLeft(value); break;
        case 'tr': setTopRight(value); break;
        case 'br': setBottomRight(value); break;
        case 'bl': setBottomLeft(value); break;
      }
    }
  }, [linked]);

  const cssValue = topLeft === topRight && topRight === bottomRight && bottomRight === bottomLeft
    ? `${topLeft}${unit}`
    : `${topLeft}${unit} ${topRight}${unit} ${bottomRight}${unit} ${bottomLeft}${unit}`;

  const presets = [
    { name: 'None', values: [0, 0, 0, 0] },
    { name: 'Small', values: [4, 4, 4, 4] },
    { name: 'Medium', values: [8, 8, 8, 8] },
    { name: 'Large', values: [16, 16, 16, 16] },
    { name: 'XL', values: [24, 24, 24, 24] },
    { name: 'Pill', values: [50, 50, 50, 50] },
    { name: 'Blob', values: [30, 70, 70, 30] },
    { name: 'Message', values: [20, 20, 20, 0] },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Border Radius Generator</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={linked}
                onChange={(e) => setLinked(e.target.checked)}
                className="mr-2"
              />
              <span className="text-zinc-300 text-sm">Link all corners</span>
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as 'px' | '%')}
              className="px-3 py-1 bg-zinc-900 border border-zinc-700 rounded text-white text-sm"
            >
              <option value="px">px</option>
              <option value="%">%</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Top Left</label>
              <input
                type="range"
                min="0"
                max={unit === '%' ? 50 : 100}
                value={topLeft}
                onChange={(e) => handleChange('tl', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-zinc-400 text-xs">{topLeft}{unit}</div>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Top Right</label>
              <input
                type="range"
                min="0"
                max={unit === '%' ? 50 : 100}
                value={topRight}
                onChange={(e) => handleChange('tr', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-zinc-400 text-xs">{topRight}{unit}</div>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Bottom Left</label>
              <input
                type="range"
                min="0"
                max={unit === '%' ? 50 : 100}
                value={bottomLeft}
                onChange={(e) => handleChange('bl', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-zinc-400 text-xs">{bottomLeft}{unit}</div>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Bottom Right</label>
              <input
                type="range"
                min="0"
                max={unit === '%' ? 50 : 100}
                value={bottomRight}
                onChange={(e) => handleChange('br', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-zinc-400 text-xs">{bottomRight}{unit}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
        <div className="flex items-center justify-center p-8 bg-zinc-900 rounded-lg">
          <div
            className="w-40 h-40 bg-gradient-to-br from-blue-500 to-purple-600"
            style={{ borderRadius: cssValue }}
          />
        </div>
      </div>

      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Presets</h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                setLinked(true);
                setTopLeft(preset.values[0]);
                setTopRight(preset.values[1]);
                setBottomRight(preset.values[2]);
                setBottomLeft(preset.values[3]);
                if (preset.values.some((v, i) => v !== preset.values[0])) {
                  setLinked(false);
                  setTopLeft(preset.values[0]);
                  setTopRight(preset.values[1]);
                  setBottomRight(preset.values[2]);
                  setBottomLeft(preset.values[3]);
                }
              }}
              className="bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-center hover:border-blue-500 transition-colors"
            >
              <div
                className="w-8 h-8 bg-blue-500 mx-auto mb-1"
                style={{ borderRadius: `${preset.values[0]}${unit} ${preset.values[1]}${unit} ${preset.values[2]}${unit} ${preset.values[3]}${unit}` }}
              />
              <div className="text-zinc-400 text-xs">{preset.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">CSS Output</h3>
          <button
            onClick={() => navigator.clipboard.writeText(`border-radius: ${cssValue};`)}
            className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded transition-colors"
          >
            Copy CSS
          </button>
        </div>
        <pre className="bg-zinc-900 rounded-lg p-4 text-green-400 text-sm overflow-x-auto font-mono">
{`border-radius: ${cssValue};`}
        </pre>
      </div>
    </div>
  );
}

export default memo(BorderRadiusGenerator);
