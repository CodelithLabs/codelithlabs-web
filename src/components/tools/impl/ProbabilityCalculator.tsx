'use client';

import { memo, useState, useCallback } from 'react';

function ProbabilityCalculator() {
  const [mode, setMode] = useState<'single' | 'multiple' | 'combination' | 'permutation'>('single');
  const [favorable, setFavorable] = useState('');
  const [total, setTotal] = useState('');
  const [n, setN] = useState('');
  const [r, setR] = useState('');
  const [probA, setProbA] = useState('');
  const [probB, setProbB] = useState('');
  const [result, setResult] = useState<any>(null);

  const factorial = (num: number): number => {
    if (num < 0) return NaN;
    if (num === 0 || num === 1) return 1;
    let result = 1;
    for (let i = 2; i <= num; i++) result *= i;
    return result;
  };

  const combination = (n: number, r: number): number => {
    if (r > n || r < 0) return 0;
    return factorial(n) / (factorial(r) * factorial(n - r));
  };

  const permutation = (n: number, r: number): number => {
    if (r > n || r < 0) return 0;
    return factorial(n) / factorial(n - r);
  };

  const handleCalculate = useCallback(() => {
    switch (mode) {
      case 'single': {
        const fav = parseFloat(favorable) || 0;
        const tot = parseFloat(total) || 1;
        const prob = fav / tot;
        setResult({
          probability: prob,
          percentage: prob * 100,
          odds: fav === 0 ? '0:1' : `${fav}:${tot - fav}`,
        });
        break;
      }
      case 'multiple': {
        const pA = parseFloat(probA) || 0;
        const pB = parseFloat(probB) || 0;
        setResult({
          and: pA * pB,
          or: pA + pB - (pA * pB),
          notA: 1 - pA,
          notB: 1 - pB,
          aGivenB: pB === 0 ? 0 : (pA * pB) / pB,
        });
        break;
      }
      case 'combination': {
        const nVal = parseInt(n) || 0;
        const rVal = parseInt(r) || 0;
        const comb = combination(nVal, rVal);
        setResult({
          value: comb,
          formula: `C(${nVal}, ${rVal}) = ${nVal}! / (${rVal}! × ${nVal - rVal}!)`,
        });
        break;
      }
      case 'permutation': {
        const nVal = parseInt(n) || 0;
        const rVal = parseInt(r) || 0;
        const perm = permutation(nVal, rVal);
        setResult({
          value: perm,
          formula: `P(${nVal}, ${rVal}) = ${nVal}! / ${nVal - rVal}!`,
        });
        break;
      }
    }
  }, [mode, favorable, total, n, r, probA, probB]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Probability Calculator</h3>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { value: 'single', label: 'Single Event' },
            { value: 'multiple', label: 'Multiple Events' },
            { value: 'combination', label: 'Combination' },
            { value: 'permutation', label: 'Permutation' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setMode(opt.value as any)}
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
          {mode === 'single' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Favorable Outcomes</label>
                <input
                  type="number"
                  value={favorable}
                  onChange={(e) => setFavorable(e.target.value)}
                  placeholder="e.g., 1"
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Total Outcomes</label>
                <input
                  type="number"
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                  placeholder="e.g., 6"
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {mode === 'multiple' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">P(A) - Probability of A (0-1)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={probA}
                  onChange={(e) => setProbA(e.target.value)}
                  placeholder="e.g., 0.5"
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">P(B) - Probability of B (0-1)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={probB}
                  onChange={(e) => setProbB(e.target.value)}
                  placeholder="e.g., 0.3"
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {(mode === 'combination' || mode === 'permutation') && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">n (Total items)</label>
                <input
                  type="number"
                  value={n}
                  onChange={(e) => setN(e.target.value)}
                  placeholder="e.g., 10"
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">r (Items to choose)</label>
                <input
                  type="number"
                  value={r}
                  onChange={(e) => setR(e.target.value)}
                  placeholder="e.g., 3"
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
          <div className="space-y-3">
            {mode === 'single' && (
              <>
                <div className="flex justify-between items-center py-2 border-b border-zinc-700">
                  <span className="text-zinc-400">Probability:</span>
                  <span className="text-green-400 font-mono text-xl">{result.probability.toFixed(4)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-zinc-700">
                  <span className="text-zinc-400">Percentage:</span>
                  <span className="text-blue-400 font-mono">{result.percentage.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-zinc-400">Odds:</span>
                  <span className="text-yellow-400 font-mono">{result.odds}</span>
                </div>
              </>
            )}
            {mode === 'multiple' && (
              <>
                <div className="flex justify-between items-center py-2 border-b border-zinc-700">
                  <span className="text-zinc-400">P(A and B):</span>
                  <span className="text-green-400 font-mono">{result.and.toFixed(4)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-zinc-700">
                  <span className="text-zinc-400">P(A or B):</span>
                  <span className="text-blue-400 font-mono">{result.or.toFixed(4)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-zinc-700">
                  <span className="text-zinc-400">P(not A):</span>
                  <span className="text-yellow-400 font-mono">{result.notA.toFixed(4)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-zinc-400">P(not B):</span>
                  <span className="text-purple-400 font-mono">{result.notB.toFixed(4)}</span>
                </div>
              </>
            )}
            {(mode === 'combination' || mode === 'permutation') && (
              <>
                <div className="flex justify-between items-center py-2 border-b border-zinc-700">
                  <span className="text-zinc-400">Result:</span>
                  <span className="text-green-400 font-mono text-xl">{result.value.toLocaleString()}</span>
                </div>
                <div className="bg-zinc-900 rounded-lg p-3">
                  <span className="text-zinc-400 text-sm font-mono">{result.formula}</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(ProbabilityCalculator);
