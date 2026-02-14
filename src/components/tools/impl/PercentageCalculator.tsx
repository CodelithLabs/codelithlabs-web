// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/tools/impl/PercentageCalculator.tsx
// Percentage Calculator - Multiple calculation modes
// ═══════════════════════════════════════════════════════════════════════════
'use client';

import { useState } from 'react';

export default function PercentageCalculator() {
  const [mode, setMode] = useState<'what' | 'is' | 'change'>('what');

  // Mode 1: X is what % of Y
  const [xValue, setXValue] = useState('25');
  const [yValue, setYValue] = useState('100');
  const [result1, setResult1] = useState('25');

  // Mode 2: What is X% of Y
  const [percent, setPercent] = useState('20');
  const [ofValue, setOfValue] = useState('150');
  const [result2, setResult2] = useState('30');

  // Mode 3: Percentage change from X to Y
  const [oldValue, setOldValue] = useState('50');
  const [newValue, setNewValue] = useState('75');
  const [changeResult, setChangeResult] = useState('50');

  // Calculate: X is what % of Y
  const calculateWhat = (x: string, y: string) => {
    const xNum = parseFloat(x);
    const yNum = parseFloat(y);
    if (!isNaN(xNum) && !isNaN(yNum) && yNum !== 0) {
      setResult1(((xNum / yNum) * 100).toFixed(2));
    }
  };

  // Calculate: What is X% of Y
  const calculateIs = (p: string, v: string) => {
    const pNum = parseFloat(p);
    const vNum = parseFloat(v);
    if (!isNaN(pNum) && !isNaN(vNum)) {
      setResult2(((pNum * vNum) / 100).toFixed(2));
    }
  };

  // Calculate: Percentage change
  const calculateChange = (old: string, newVal: string) => {
    const oldNum = parseFloat(old);
    const newNum = parseFloat(newVal);
    if (!isNaN(oldNum) && !isNaN(newNum) && oldNum !== 0) {
      const change = ((newNum - oldNum) / oldNum) * 100;
      setChangeResult(change.toFixed(2));
    }
  };

  return (
    <div className="space-y-6">

      {/* Mode Selector */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Calculation Mode:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <button
            onClick={() => setMode('what')}
            className={`p-3 rounded-lg text-left transition-all ${
              mode === 'what'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            <div className="font-bold">X is what % of Y?</div>
            <div className="text-xs opacity-80">Find percentage value</div>
          </button>
          <button
            onClick={() => setMode('is')}
            className={`p-3 rounded-lg text-left transition-all ${
              mode === 'is'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            <div className="font-bold">What is X% of Y?</div>
            <div className="text-xs opacity-80">Calculate percentage</div>
          </button>
          <button
            onClick={() => setMode('change')}
            className={`p-3 rounded-lg text-left transition-all ${
              mode === 'change'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            <div className="font-bold">% Change</div>
            <div className="text-xs opacity-80">From X to Y</div>
          </button>
        </div>
      </div>

      {/* Calculator Forms */}
      <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6">

        {/* Mode 1: X is what % of Y */}
        {mode === 'what' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-4">X is what % of Y?</h3>
            <div className="grid grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">X Value:</label>
                <input
                  type="number"
                  value={xValue}
                  onChange={(e) => {
                    setXValue(e.target.value);
                    calculateWhat(e.target.value, yValue);
                  }}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2
                           text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="text-center text-zinc-500">is what % of</div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Y Value:</label>
                <input
                  type="number"
                  value={yValue}
                  onChange={(e) => {
                    setYValue(e.target.value);
                    calculateWhat(xValue, e.target.value);
                  }}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2
                           text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
              <div className="text-sm text-zinc-400 mb-1">Result:</div>
              <div className="text-3xl font-bold text-blue-400">{result1}%</div>
            </div>
          </div>
        )}

        {/* Mode 2: What is X% of Y */}
        {mode === 'is' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-4">What is X% of Y?</h3>
            <div className="grid grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Percentage (%):</label>
                <input
                  type="number"
                  value={percent}
                  onChange={(e) => {
                    setPercent(e.target.value);
                    calculateIs(e.target.value, ofValue);
                  }}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2
                           text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="text-center text-zinc-500">of</div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Value:</label>
                <input
                  type="number"
                  value={ofValue}
                  onChange={(e) => {
                    setOfValue(e.target.value);
                    calculateIs(percent, e.target.value);
                  }}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2
                           text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
              <div className="text-sm text-zinc-400 mb-1">Result:</div>
              <div className="text-3xl font-bold text-green-400">{result2}</div>
            </div>
          </div>
        )}

        {/* Mode 3: Percentage Change */}
        {mode === 'change' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-4">Percentage Change</h3>
            <div className="grid grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Old Value:</label>
                <input
                  type="number"
                  value={oldValue}
                  onChange={(e) => {
                    setOldValue(e.target.value);
                    calculateChange(e.target.value, newValue);
                  }}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2
                           text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="text-center text-zinc-500">to</div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">New Value:</label>
                <input
                  type="number"
                  value={newValue}
                  onChange={(e) => {
                    setNewValue(e.target.value);
                    calculateChange(oldValue, e.target.value);
                  }}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2
                           text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className={`border rounded-lg p-4 text-center ${
              parseFloat(changeResult) >= 0
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <div className="text-sm text-zinc-400 mb-1">Percentage Change:</div>
              <div className={`text-3xl font-bold ${
                parseFloat(changeResult) >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {parseFloat(changeResult) >= 0 ? '+' : ''}{changeResult}%
              </div>
              <div className="text-xs text-zinc-500 mt-2">
                {parseFloat(changeResult) >= 0 ? 'Increase' : 'Decrease'}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Common Percentages Reference */}
      <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
        <h3 className="text-sm font-bold text-white mb-3">Common Percentages:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-zinc-400">
          <div>50% = 1/2</div>
          <div>25% = 1/4</div>
          <div>75% = 3/4</div>
          <div>33% = 1/3</div>
          <div>20% = 1/5</div>
          <div>10% = 1/10</div>
          <div>5% = 1/20</div>
          <div>1% = 1/100</div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-300 flex gap-3">
        <span className="text-xl">🔒</span>
        <p>
          <strong>100% Client-Side:</strong> All calculations happen in your browser.
          No data is sent to our servers.
        </p>
      </div>

    </div>
  );
}
