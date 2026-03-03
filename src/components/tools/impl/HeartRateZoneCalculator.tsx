'use client';

import { memo, useState, useCallback } from 'react';

function HeartRateZoneCalculator() {
  const [age, setAge] = useState('');
  const [restingHR, setRestingHR] = useState('');
  const [method, setMethod] = useState<'percentage' | 'karvonen'>('karvonen');
  const [result, setResult] = useState<{
    maxHR: number;
    zones: { name: string; min: number; max: number; description: string; color: string }[];
  } | null>(null);

  const handleCalculate = useCallback(() => {
    const ageVal = parseFloat(age) || 0;
    const restHR = parseFloat(restingHR) || 60;

    if (ageVal <= 0 || ageVal > 120) {
      setResult(null);
      return;
    }

    // Max HR using Tanaka formula (more accurate than 220-age)
    const maxHR = 208 - (0.7 * ageVal);
    const hrReserve = maxHR - restHR;

    let zones: { name: string; min: number; max: number; description: string; color: string }[];

    if (method === 'karvonen') {
      // Karvonen method using heart rate reserve
      zones = [
        {
          name: 'Zone 1 - Recovery',
          min: Math.round(restHR + (hrReserve * 0.50)),
          max: Math.round(restHR + (hrReserve * 0.60)),
          description: 'Very light activity, recovery and warm-up',
          color: 'bg-blue-500',
        },
        {
          name: 'Zone 2 - Fat Burn',
          min: Math.round(restHR + (hrReserve * 0.60)),
          max: Math.round(restHR + (hrReserve * 0.70)),
          description: 'Light aerobic, fat burning zone',
          color: 'bg-green-500',
        },
        {
          name: 'Zone 3 - Aerobic',
          min: Math.round(restHR + (hrReserve * 0.70)),
          max: Math.round(restHR + (hrReserve * 0.80)),
          description: 'Moderate training, improves cardiovascular fitness',
          color: 'bg-yellow-500',
        },
        {
          name: 'Zone 4 - Anaerobic',
          min: Math.round(restHR + (hrReserve * 0.80)),
          max: Math.round(restHR + (hrReserve * 0.90)),
          description: 'Hard training, increases speed and power',
          color: 'bg-orange-500',
        },
        {
          name: 'Zone 5 - Maximum',
          min: Math.round(restHR + (hrReserve * 0.90)),
          max: Math.round(maxHR),
          description: 'Maximum effort, sprint training',
          color: 'bg-red-500',
        },
      ];
    } else {
      // Simple percentage method
      zones = [
        {
          name: 'Zone 1 - Recovery',
          min: Math.round(maxHR * 0.50),
          max: Math.round(maxHR * 0.60),
          description: 'Very light activity, recovery and warm-up',
          color: 'bg-blue-500',
        },
        {
          name: 'Zone 2 - Fat Burn',
          min: Math.round(maxHR * 0.60),
          max: Math.round(maxHR * 0.70),
          description: 'Light aerobic, fat burning zone',
          color: 'bg-green-500',
        },
        {
          name: 'Zone 3 - Aerobic',
          min: Math.round(maxHR * 0.70),
          max: Math.round(maxHR * 0.80),
          description: 'Moderate training, improves cardiovascular fitness',
          color: 'bg-yellow-500',
        },
        {
          name: 'Zone 4 - Anaerobic',
          min: Math.round(maxHR * 0.80),
          max: Math.round(maxHR * 0.90),
          description: 'Hard training, increases speed and power',
          color: 'bg-orange-500',
        },
        {
          name: 'Zone 5 - Maximum',
          min: Math.round(maxHR * 0.90),
          max: Math.round(maxHR),
          description: 'Maximum effort, sprint training',
          color: 'bg-red-500',
        },
      ];
    }

    setResult({ maxHR: Math.round(maxHR), zones });
  }, [age, restingHR, method]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Heart Rate Zone Calculator</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g., 30"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Resting Heart Rate (optional)</label>
              <input
                type="number"
                value={restingHR}
                onChange={(e) => setRestingHR(e.target.value)}
                placeholder="e.g., 65"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Calculation Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as 'percentage' | 'karvonen')}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="karvonen">Karvonen Method (uses resting HR)</option>
              <option value="percentage">Simple Percentage Method</option>
            </select>
          </div>
          <button
            onClick={handleCalculate}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Calculate Heart Rate Zones
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <div className="text-center mb-6">
            <div className="text-sm text-zinc-400">Maximum Heart Rate</div>
            <div className="text-4xl font-bold text-red-400">{result.maxHR} BPM</div>
          </div>

          <h3 className="text-lg font-semibold text-white mb-4">Training Zones</h3>
          <div className="space-y-3">
            {result.zones.map((zone, idx) => (
              <div key={idx} className="bg-zinc-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${zone.color}`} />
                    <span className="text-white font-medium">{zone.name}</span>
                  </div>
                  <span className="text-green-400 font-mono text-lg">
                    {zone.min} - {zone.max} BPM
                  </span>
                </div>
                <p className="text-zinc-400 text-sm">{zone.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(HeartRateZoneCalculator);
