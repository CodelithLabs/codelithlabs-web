'use client';

import { memo, useState, useCallback } from 'react';

const speedUnits: { [key: string]: { name: string; toMs: number } } = {
  'ms': { name: 'Meters per second (m/s)', toMs: 1 },
  'kmh': { name: 'Kilometers per hour (km/h)', toMs: 1 / 3.6 },
  'mph': { name: 'Miles per hour (mph)', toMs: 0.44704 },
  'kn': { name: 'Knots (kn)', toMs: 0.514444 },
  'fps': { name: 'Feet per second (ft/s)', toMs: 0.3048 },
  'mach': { name: 'Mach (at sea level)', toMs: 343 },
  'c': { name: 'Speed of Light (c)', toMs: 299792458 },
};

function SpeedConverter() {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('kmh');
  const [result, setResult] = useState<{ [key: string]: number } | null>(null);

  const handleConvert = useCallback(() => {
    const val = parseFloat(value);
    if (isNaN(val)) {
      setResult(null);
      return;
    }

    // Convert to m/s first
    const msValue = val * speedUnits[fromUnit].toMs;

    // Convert to all other units
    const results: { [key: string]: number } = {};
    for (const [unit, data] of Object.entries(speedUnits)) {
      results[unit] = msValue / data.toMs;
    }

    setResult(results);
  }, [value, fromUnit]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Speed Converter</h3>
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
                {Object.entries(speedUnits).map(([key, data]) => (
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
            {Object.entries(speedUnits).map(([key, data]) => (
              <div
                key={key}
                className={`flex justify-between items-center py-2 px-3 rounded-lg ${
                  key === fromUnit ? 'bg-blue-900/20 border border-blue-700/50' : 'bg-zinc-900'
                }`}
              >
                <span className="text-zinc-300">{data.name}</span>
                <span className={`font-mono ${key === fromUnit ? 'text-blue-400' : 'text-green-400'}`}>
                  {result[key] < 0.000001 
                    ? result[key].toExponential(4) 
                    : result[key] > 1000000 
                    ? result[key].toExponential(4) 
                    : result[key].toFixed(6).replace(/\.?0+$/, '')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(SpeedConverter);
