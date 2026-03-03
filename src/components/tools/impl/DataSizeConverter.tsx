'use client';

import { memo, useState, useCallback } from 'react';

const dataUnits: { [key: string]: { name: string; toBytes: number } } = {
  'b': { name: 'Bits (b)', toBytes: 0.125 },
  'B': { name: 'Bytes (B)', toBytes: 1 },
  'KB': { name: 'Kilobytes (KB)', toBytes: 1024 },
  'MB': { name: 'Megabytes (MB)', toBytes: 1024 * 1024 },
  'GB': { name: 'Gigabytes (GB)', toBytes: 1024 * 1024 * 1024 },
  'TB': { name: 'Terabytes (TB)', toBytes: 1024 * 1024 * 1024 * 1024 },
  'PB': { name: 'Petabytes (PB)', toBytes: 1024 * 1024 * 1024 * 1024 * 1024 },
  'Kb': { name: 'Kilobits (Kb)', toBytes: 1024 * 0.125 },
  'Mb': { name: 'Megabits (Mb)', toBytes: 1024 * 1024 * 0.125 },
  'Gb': { name: 'Gigabits (Gb)', toBytes: 1024 * 1024 * 1024 * 0.125 },
  'kB': { name: 'Kilobytes (SI) (kB)', toBytes: 1000 },
  'mB': { name: 'Megabytes (SI) (MB)', toBytes: 1000 * 1000 },
  'gB': { name: 'Gigabytes (SI) (GB)', toBytes: 1000 * 1000 * 1000 },
};

function DataSizeConverter() {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('MB');
  const [result, setResult] = useState<{ [key: string]: number } | null>(null);

  const handleConvert = useCallback(() => {
    const val = parseFloat(value);
    if (isNaN(val)) {
      setResult(null);
      return;
    }

    // Convert to bytes first
    const byteValue = val * dataUnits[fromUnit].toBytes;

    // Convert to all other units
    const results: { [key: string]: number } = {};
    for (const [unit, data] of Object.entries(dataUnits)) {
      results[unit] = byteValue / data.toBytes;
    }

    setResult(results);
  }, [value, fromUnit]);

  const formatNumber = (num: number) => {
    if (num === 0) return '0';
    if (Math.abs(num) < 0.000001) return num.toExponential(4);
    if (Math.abs(num) > 1000000000) return num.toExponential(4);
    if (Math.abs(num) >= 1) return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
    return num.toFixed(8).replace(/\.?0+$/, '');
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Data Size Converter</h3>
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
                {Object.entries(dataUnits).map(([key, data]) => (
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
          <h3 className="text-lg font-semibold text-white mb-4">Binary (Base 2)</h3>
          <div className="space-y-3 mb-6">
            {['b', 'B', 'KB', 'MB', 'GB', 'TB', 'PB'].map(key => (
              <div
                key={key}
                className={`flex justify-between items-center py-2 px-3 rounded-lg ${
                  key === fromUnit ? 'bg-blue-900/20 border border-blue-700/50' : 'bg-zinc-900'
                }`}
              >
                <span className="text-zinc-300">{dataUnits[key].name}</span>
                <span className={`font-mono ${key === fromUnit ? 'text-blue-400' : 'text-green-400'}`}>
                  {formatNumber(result[key])}
                </span>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-white mb-4">Network (Bits)</h3>
          <div className="space-y-3 mb-6">
            {['b', 'Kb', 'Mb', 'Gb'].map(key => (
              <div
                key={key + '_bits'}
                className={`flex justify-between items-center py-2 px-3 rounded-lg ${
                  key === fromUnit ? 'bg-blue-900/20 border border-blue-700/50' : 'bg-zinc-900'
                }`}
              >
                <span className="text-zinc-300">{dataUnits[key].name}</span>
                <span className={`font-mono ${key === fromUnit ? 'text-blue-400' : 'text-yellow-400'}`}>
                  {formatNumber(result[key])}
                </span>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-white mb-4">SI (Base 10)</h3>
          <div className="space-y-3">
            {['B', 'kB', 'mB', 'gB'].map(key => (
              <div
                key={key + '_si'}
                className="flex justify-between items-center py-2 px-3 rounded-lg bg-zinc-900"
              >
                <span className="text-zinc-300">{dataUnits[key].name}</span>
                <span className="font-mono text-purple-400">
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

export default memo(DataSizeConverter);
