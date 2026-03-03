'use client';

import { memo, useState, useCallback } from 'react';

type CalculationMode = 'pace' | 'time' | 'distance';

function PaceCalculator() {
  const [mode, setMode] = useState<CalculationMode>('pace');
  const [distance, setDistance] = useState('');
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'mi'>('km');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [paceMin, setPaceMin] = useState('');
  const [paceSec, setPaceSec] = useState('');
  const [result, setResult] = useState<{
    pace: { min: number; sec: number };
    pacePerMile: { min: number; sec: number };
    speed: { kmh: number; mph: number };
    time: { hours: number; minutes: number; seconds: number };
    distance: { km: number; mi: number };
    splits: { km: number; time: string }[];
  } | null>(null);

  const handleCalculate = useCallback(() => {
    let distanceKm: number;
    let totalSeconds: number;
    let paceSecondsPerKm: number;

    const dist = parseFloat(distance) || 0;
    const h = parseFloat(hours) || 0;
    const m = parseFloat(minutes) || 0;
    const s = parseFloat(seconds) || 0;
    const pM = parseFloat(paceMin) || 0;
    const pS = parseFloat(paceSec) || 0;

    switch (mode) {
      case 'pace': {
        // Calculate pace from distance and time
        distanceKm = distanceUnit === 'mi' ? dist * 1.60934 : dist;
        totalSeconds = h * 3600 + m * 60 + s;
        paceSecondsPerKm = totalSeconds / distanceKm;
        break;
      }
      case 'time': {
        // Calculate time from distance and pace
        distanceKm = distanceUnit === 'mi' ? dist * 1.60934 : dist;
        paceSecondsPerKm = pM * 60 + pS;
        totalSeconds = paceSecondsPerKm * distanceKm;
        break;
      }
      case 'distance': {
        // Calculate distance from time and pace
        totalSeconds = h * 3600 + m * 60 + s;
        paceSecondsPerKm = pM * 60 + pS;
        distanceKm = totalSeconds / paceSecondsPerKm;
        break;
      }
    }

    const paceMinPerKm = Math.floor(paceSecondsPerKm / 60);
    const paceSecPerKm = Math.round(paceSecondsPerKm % 60);

    const paceSecondsPerMile = paceSecondsPerKm * 1.60934;
    const paceMinPerMile = Math.floor(paceSecondsPerMile / 60);
    const paceSecPerMile = Math.round(paceSecondsPerMile % 60);

    const speedKmh = 3600 / paceSecondsPerKm;
    const speedMph = speedKmh / 1.60934;

    const totalHours = Math.floor(totalSeconds / 3600);
    const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
    const totalSecs = Math.round(totalSeconds % 60);

    // Generate splits
    const splits: { km: number; time: string }[] = [];
    for (let km = 1; km <= Math.ceil(distanceKm); km++) {
      const splitSeconds = paceSecondsPerKm * Math.min(km, distanceKm);
      const splitH = Math.floor(splitSeconds / 3600);
      const splitM = Math.floor((splitSeconds % 3600) / 60);
      const splitS = Math.round(splitSeconds % 60);
      splits.push({
        km,
        time: splitH > 0 
          ? `${splitH}:${splitM.toString().padStart(2, '0')}:${splitS.toString().padStart(2, '0')}`
          : `${splitM}:${splitS.toString().padStart(2, '0')}`,
      });
    }

    setResult({
      pace: { min: paceMinPerKm, sec: paceSecPerKm },
      pacePerMile: { min: paceMinPerMile, sec: paceSecPerMile },
      speed: { kmh: speedKmh, mph: speedMph },
      time: { hours: totalHours, minutes: totalMinutes, seconds: totalSecs },
      distance: { km: distanceKm, mi: distanceKm / 1.60934 },
      splits,
    });
  }, [mode, distance, distanceUnit, hours, minutes, seconds, paceMin, paceSec]);

  const commonDistances = [
    { name: '5K', km: 5 },
    { name: '10K', km: 10 },
    { name: 'Half Marathon', km: 21.0975 },
    { name: 'Marathon', km: 42.195 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Running Pace Calculator</h3>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { value: 'pace', label: 'Calculate Pace' },
            { value: 'time', label: 'Calculate Time' },
            { value: 'distance', label: 'Calculate Distance' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setMode(opt.value as CalculationMode)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                mode === opt.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {mode !== 'distance' && (
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Distance</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="e.g., 5"
                  className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={distanceUnit}
                  onChange={(e) => setDistanceUnit(e.target.value as 'km' | 'mi')}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="km">km</option>
                  <option value="mi">mi</option>
                </select>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {commonDistances.map(d => (
                  <button
                    key={d.name}
                    onClick={() => {
                      setDistance(d.km.toString());
                      setDistanceUnit('km');
                    }}
                    className="px-2 py-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs rounded transition-colors"
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode !== 'time' && (
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Time</label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    placeholder="HH"
                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs text-zinc-500 mt-1">Hours</span>
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    placeholder="MM"
                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs text-zinc-500 mt-1">Minutes</span>
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    value={seconds}
                    onChange={(e) => setSeconds(e.target.value)}
                    placeholder="SS"
                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs text-zinc-500 mt-1">Seconds</span>
                </div>
              </div>
            </div>
          )}

          {mode !== 'pace' && (
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Pace (per km)</label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="number"
                    value={paceMin}
                    onChange={(e) => setPaceMin(e.target.value)}
                    placeholder="MM"
                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs text-zinc-500 mt-1">Minutes</span>
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    value={paceSec}
                    onChange={(e) => setPaceSec(e.target.value)}
                    placeholder="SS"
                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs text-zinc-500 mt-1">Seconds</span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleCalculate}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Calculate
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Results</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {result.pace.min}:{result.pace.sec.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-zinc-400">min/km</div>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {result.pacePerMile.min}:{result.pacePerMile.sec.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-zinc-400">min/mi</div>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{result.speed.kmh.toFixed(2)}</div>
              <div className="text-sm text-zinc-400">km/h</div>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {result.time.hours > 0 && `${result.time.hours}:`}
                {result.time.minutes.toString().padStart(2, '0')}:
                {result.time.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-zinc-400">Total Time</div>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-pink-400">{result.distance.km.toFixed(2)}</div>
              <div className="text-sm text-zinc-400">km</div>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">{result.distance.mi.toFixed(2)}</div>
              <div className="text-sm text-zinc-400">miles</div>
            </div>
          </div>

          {result.splits.length > 0 && result.splits.length <= 50 && (
            <div>
              <h4 className="text-sm font-medium text-zinc-300 mb-2">Kilometer Splits</h4>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                {result.splits.map(split => (
                  <div key={split.km} className="bg-zinc-900 rounded p-2 text-center">
                    <div className="text-xs text-zinc-500">KM {split.km}</div>
                    <div className="text-sm text-green-400 font-mono">{split.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(PaceCalculator);
