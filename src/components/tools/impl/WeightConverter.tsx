'use client';

import { memo, useState, useCallback } from 'react';

const weightUnits: { [key: string]: { name: string; toKg: number } } = {
  'mg': { name: 'Milligrams (mg)', toKg: 0.000001 },
  'g': { name: 'Grams (g)', toKg: 0.001 },
  'kg': { name: 'Kilograms (kg)', toKg: 1 },
  'oz': { name: 'Ounces (oz)', toKg: 0.0283495 },
  'lb': { name: 'Pounds (lb)', toKg: 0.453592 },
  'st': { name: 'Stones (st)', toKg: 6.35029 },
  'ton': { name: 'Metric Tons (t)', toKg: 1000 },
  'uston': { name: 'US Tons (short ton)', toKg: 907.185 },
  'ukton': { name: 'UK Tons (long ton)', toKg: 1016.05 },
};

function WeightConverter() {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('kg');
  const [result, setResult] = useState<{ [key: string]: number } | null>(null);

  const handleConvert = useCallback(() => {
    const val = parseFloat(value);
    if (isNaN(val)) {
      setResult(null);
      return;
    }

    // Convert to kg first
    const kgValue = val * weightUnits[fromUnit].toKg;

    // Convert to all other units
    const results: { [key: string]: number } = {};
    for (const [unit, data] of Object.entries(weightUnits)) {
      results[unit] = kgValue / data.toKg;
    }

    setResult(results);
  }, [value, fromUnit]);

  const formatNumber = (num: number) => {
    if (num < 0.000001) return num.toExponential(4);
    if (num > 1000000) return num.toExponential(4);
    if (num < 0.01) return num.toFixed(8).replace(/\.?0+$/, '');
    if (num < 1) return num.toFixed(6).replace(/\.?0+$/, '');
    return num.toFixed(4).replace(/\.?0+$/, '');
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Weight Converter</h3>
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
                {Object.entries(weightUnits).map(([key, data]) => (
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
            {Object.entries(weightUnits).map(([key, data]) => (
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

export default memo(WeightConverter);
