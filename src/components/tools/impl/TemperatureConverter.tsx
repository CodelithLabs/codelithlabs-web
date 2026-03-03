'use client';

import { memo, useState, useCallback } from 'react';

function TemperatureConverter() {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState<'celsius' | 'fahrenheit' | 'kelvin'>('celsius');
  const [result, setResult] = useState<{ celsius: number; fahrenheit: number; kelvin: number } | null>(null);

  const handleConvert = useCallback(() => {
    const val = parseFloat(value);
    if (isNaN(val)) {
      setResult(null);
      return;
    }

    let celsius: number;

    switch (fromUnit) {
      case 'celsius':
        celsius = val;
        break;
      case 'fahrenheit':
        celsius = (val - 32) * 5 / 9;
        break;
      case 'kelvin':
        celsius = val - 273.15;
        break;
    }

    setResult({
      celsius,
      fahrenheit: celsius * 9 / 5 + 32,
      kelvin: celsius + 273.15,
    });
  }, [value, fromUnit]);

  const commonTemps = [
    { name: 'Freezing Point', celsius: 0 },
    { name: 'Room Temperature', celsius: 22 },
    { name: 'Body Temperature', celsius: 37 },
    { name: 'Boiling Point', celsius: 100 },
    { name: 'Absolute Zero', celsius: -273.15 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Temperature Converter</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Temperature</label>
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
                onChange={(e) => setFromUnit(e.target.value as 'celsius' | 'fahrenheit' | 'kelvin')}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="celsius">Celsius (°C)</option>
                <option value="fahrenheit">Fahrenheit (°F)</option>
                <option value="kelvin">Kelvin (K)</option>
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
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{result.celsius.toFixed(2)}</div>
              <div className="text-sm text-zinc-400">°C (Celsius)</div>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{result.fahrenheit.toFixed(2)}</div>
              <div className="text-sm text-zinc-400">°F (Fahrenheit)</div>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{result.kelvin.toFixed(2)}</div>
              <div className="text-sm text-zinc-400">K (Kelvin)</div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Common Temperatures</h3>
        <div className="space-y-2">
          {commonTemps.map((temp) => (
            <button
              key={temp.name}
              onClick={() => {
                setValue(temp.celsius.toString());
                setFromUnit('celsius');
                setResult({
                  celsius: temp.celsius,
                  fahrenheit: temp.celsius * 9 / 5 + 32,
                  kelvin: temp.celsius + 273.15,
                });
              }}
              className="w-full flex justify-between items-center bg-zinc-900 hover:bg-zinc-700 rounded-lg p-3 transition-colors"
            >
              <span className="text-zinc-300">{temp.name}</span>
              <span className="text-green-400 font-mono">{temp.celsius}°C</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(TemperatureConverter);
