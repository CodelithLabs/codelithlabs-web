'use client';

import { memo, useState, useCallback } from 'react';

type Gender = 'male' | 'female';
type Formula = 'devine' | 'robinson' | 'miller' | 'hamwi' | 'average';

function IdealWeightCalculator() {
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [result, setResult] = useState<{ [key: string]: number } | null>(null);

  const handleCalculate = useCallback(() => {
    const heightCm = parseFloat(height) || 0;
    if (heightCm < 100 || heightCm > 250) {
      setResult(null);
      return;
    }

    // Convert to inches for formulas
    const heightInches = heightCm / 2.54;
    const inchesOver5Feet = Math.max(0, heightInches - 60);

    let results: { [key: string]: number } = {};

    if (gender === 'male') {
      // Devine Formula (1974)
      results.devine = 50 + 2.3 * inchesOver5Feet;
      // Robinson Formula (1983)
      results.robinson = 52 + 1.9 * inchesOver5Feet;
      // Miller Formula (1983)
      results.miller = 56.2 + 1.41 * inchesOver5Feet;
      // Hamwi Formula (1964)
      results.hamwi = 48.0 + 2.7 * inchesOver5Feet;
    } else {
      // Devine Formula (1974)
      results.devine = 45.5 + 2.3 * inchesOver5Feet;
      // Robinson Formula (1983)
      results.robinson = 49 + 1.7 * inchesOver5Feet;
      // Miller Formula (1983)
      results.miller = 53.1 + 1.36 * inchesOver5Feet;
      // Hamwi Formula (1964)
      results.hamwi = 45.5 + 2.2 * inchesOver5Feet;
    }

    // Calculate average
    results.average = (results.devine + results.robinson + results.miller + results.hamwi) / 4;

    // Calculate BMI-based range (18.5 - 24.9)
    const heightM = heightCm / 100;
    results.bmiLow = 18.5 * heightM * heightM;
    results.bmiHigh = 24.9 * heightM * heightM;

    setResult(results);
  }, [height, gender]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Ideal Weight Calculator</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Height (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="e.g., 175"
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleCalculate}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Calculate Ideal Weight
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Ideal Weight Results</h3>
          
          <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4 mb-4">
            <div className="text-center">
              <div className="text-sm text-zinc-400 mb-1">Recommended Range (Based on BMI 18.5-24.9)</div>
              <div className="text-2xl font-bold text-green-400">
                {result.bmiLow.toFixed(1)} - {result.bmiHigh.toFixed(1)} kg
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-zinc-700">
              <div>
                <span className="text-white font-medium">Average</span>
                <span className="text-zinc-500 text-sm ml-2">(All formulas)</span>
              </div>
              <span className="text-yellow-400 font-mono text-lg">{result.average.toFixed(1)} kg</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-zinc-700">
              <div>
                <span className="text-zinc-300">Devine Formula</span>
                <span className="text-zinc-500 text-sm ml-2">(1974)</span>
              </div>
              <span className="text-blue-400 font-mono">{result.devine.toFixed(1)} kg</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-zinc-700">
              <div>
                <span className="text-zinc-300">Robinson Formula</span>
                <span className="text-zinc-500 text-sm ml-2">(1983)</span>
              </div>
              <span className="text-blue-400 font-mono">{result.robinson.toFixed(1)} kg</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-zinc-700">
              <div>
                <span className="text-zinc-300">Miller Formula</span>
                <span className="text-zinc-500 text-sm ml-2">(1983)</span>
              </div>
              <span className="text-blue-400 font-mono">{result.miller.toFixed(1)} kg</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <div>
                <span className="text-zinc-300">Hamwi Formula</span>
                <span className="text-zinc-500 text-sm ml-2">(1964)</span>
              </div>
              <span className="text-blue-400 font-mono">{result.hamwi.toFixed(1)} kg</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(IdealWeightCalculator);
