'use client';

import { memo, useState, useCallback } from 'react';

type Method = 'navy' | 'bmi' | 'jackson';
type Gender = 'male' | 'female';

function BodyFatCalculator() {
  const [method, setMethod] = useState<Method>('navy');
  const [gender, setGender] = useState<Gender>('male');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [waist, setWaist] = useState('');
  const [neck, setNeck] = useState('');
  const [hip, setHip] = useState('');
  const [age, setAge] = useState('');
  const [result, setResult] = useState<{ bodyFat: number; category: string; leanMass: number; fatMass: number } | null>(null);

  const getCategory = (bf: number, gender: Gender): string => {
    if (gender === 'male') {
      if (bf < 6) return 'Essential Fat';
      if (bf < 14) return 'Athletes';
      if (bf < 18) return 'Fitness';
      if (bf < 25) return 'Average';
      return 'Obese';
    } else {
      if (bf < 14) return 'Essential Fat';
      if (bf < 21) return 'Athletes';
      if (bf < 25) return 'Fitness';
      if (bf < 32) return 'Average';
      return 'Obese';
    }
  };

  const handleCalculate = useCallback(() => {
    const w = parseFloat(weight) || 0;
    const h = parseFloat(height) || 0;
    const waistCm = parseFloat(waist) || 0;
    const neckCm = parseFloat(neck) || 0;
    const hipCm = parseFloat(hip) || 0;
    const ageVal = parseFloat(age) || 0;

    let bodyFat = 0;

    switch (method) {
      case 'navy': {
        // US Navy Method
        if (gender === 'male') {
          bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(h)) - 450;
        } else {
          bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(h)) - 450;
        }
        break;
      }
      case 'bmi': {
        // BMI-based estimate
        const heightM = h / 100;
        const bmi = w / (heightM * heightM);
        if (gender === 'male') {
          bodyFat = (1.20 * bmi) + (0.23 * ageVal) - 16.2;
        } else {
          bodyFat = (1.20 * bmi) + (0.23 * ageVal) - 5.4;
        }
        break;
      }
      case 'jackson': {
        // Jackson-Pollock 1-site (simplified)
        const heightM = h / 100;
        const bmi = w / (heightM * heightM);
        if (gender === 'male') {
          bodyFat = (1.39 * bmi) + (0.16 * ageVal) - (10.34 * 1) - 9;
        } else {
          bodyFat = (1.39 * bmi) + (0.16 * ageVal) - (10.34 * 0) - 9;
        }
        break;
      }
    }

    bodyFat = Math.max(0, Math.min(60, bodyFat));
    const fatMass = (w * bodyFat) / 100;
    const leanMass = w - fatMass;

    setResult({
      bodyFat,
      category: getCategory(bodyFat, gender),
      leanMass,
      fatMass,
    });
  }, [method, gender, weight, height, waist, neck, hip, age]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Body Fat Calculator</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as Method)}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="navy">US Navy Method</option>
                <option value="bmi">BMI-Based Estimate</option>
                <option value="jackson">Jackson-Pollock</option>
              </select>
            </div>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g., 70"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
          </div>

          {(method === 'bmi' || method === 'jackson') && (
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Age (years)</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g., 30"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {method === 'navy' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Waist (cm)</label>
                <input
                  type="number"
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                  placeholder="e.g., 85"
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Neck (cm)</label>
                <input
                  type="number"
                  value={neck}
                  onChange={(e) => setNeck(e.target.value)}
                  placeholder="e.g., 38"
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {gender === 'female' && (
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Hip (cm)</label>
                  <input
                    type="number"
                    value={hip}
                    onChange={(e) => setHip(e.target.value)}
                    placeholder="e.g., 95"
                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleCalculate}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Calculate Body Fat
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Results</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{result.bodyFat.toFixed(1)}%</div>
              <div className="text-sm text-zinc-400">Body Fat</div>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{result.category}</div>
              <div className="text-sm text-zinc-400">Category</div>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{result.fatMass.toFixed(1)} kg</div>
              <div className="text-sm text-zinc-400">Fat Mass</div>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{result.leanMass.toFixed(1)} kg</div>
              <div className="text-sm text-zinc-400">Lean Mass</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(BodyFatCalculator);
