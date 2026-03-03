'use client';

import { memo, useState, useCallback } from 'react';

const lengthUnits: { [key: string]: { name: string; toM: number } } = {
  'mm': { name: 'Millimeters (mm)', toM: 0.001 },
  'cm': { name: 'Centimeters (cm)', toM: 0.01 },
  'm': { name: 'Meters (m)', toM: 1 },
  'km': { name: 'Kilometers (km)', toM: 1000 },
  'in': { name: 'Inches (in)', toM: 0.0254 },
  'ft': { name: 'Feet (ft)', toM: 0.3048 },
  'yd': { name: 'Yards (yd)', toM: 0.9144 },
  'mi': { name: 'Miles (mi)', toM: 1609.34 },
  'nmi': { name: 'Nautical Miles (nmi)', toM: 1852 },
  'um': { name: 'Micrometers (μm)', toM: 0.000001 },
  'nm': { name: 'Nanometers (nm)', toM: 0.000000001 },
};

function LengthConverter() {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('m');
  const [result, setResult] = useState<{ [key: string]: number } | null>(null);

  const handleConvert = useCallback(() => {
    const val = parseFloat(value);
    if (isNaN(val)) {
      setResult(null);
      return;
    }

    // Convert to meters first
    const mValue = val * lengthUnits[fromUnit].toM;

    // Convert to all other units
    const results: { [key: string]: number } = {};
    for (const [unit, data] of Object.entries(lengthUnits)) {
      results[unit] = mValue / data.toM;
    }

    setResult(results);
  }, [value, fromUnit]);

  const formatNumber = (num: number) => {
    if (num === 0) return '0';
    if (Math.abs(num) < 0.000001) return num.toExponential(4);
    if (Math.abs(num) > 1000000) return num.toExponential(4);
    if (Math.abs(num) < 0.01) return num.toFixed(8).replace(/\.?0+$/, '');
    if (Math.abs(num) < 1) return num.toFixed(6).replace(/\.?0+$/, '');
    return num.toFixed(4).replace(/\.?0+$/, '');
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Length Converter</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Value</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter value"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">From Unit</label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(lengthUnits).map(([key, data]) => (
                  <option key={key} value={key}>{data.name}</option>
                ))}
              </select>
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
          <h3 className="text-lg font-semibold text-white mb-4">Results</h3>
          <div className="space-y-3">
            {Object.entries(lengthUnits).map(([key, data]) => (
              <div
                key={key}
                className={`flex justify-between items-center py-2 px-3 rounded-lg ${
                  key === fromUnit ? 'bg-blue-900/20 border border-blue-700/50' : 'bg-zinc-900'
                }`}
              >
                <span className="text-zinc-300">{data.name}</span>
                <span className={`font-mono ${key === fromUnit ? 'text-blue-400' : 'text-green-400'}`}>
                  {formatNumber(result[key])}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(LengthConverter);
