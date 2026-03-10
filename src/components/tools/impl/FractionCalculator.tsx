'use client';

import { memo, useState, useCallback } from 'react';

interface Fraction {
  numerator: number;
  denominator: number;
}

function gcd(a: number, b: number): number {
  const absA = Math.abs(a);
  const absB = Math.abs(b);
  return absB === 0 ? absA : gcd(absB, absA % absB);
}

function simplify(num: number, den: number): Fraction {
  if (den === 0) return { numerator: NaN, denominator: NaN };
  const divisor = gcd(num, den);
  let n = num / divisor;
  let d = den / divisor;
  if (d < 0) {
    n = -n;
    d = -d;
  }
  return { numerator: n, denominator: d };
}

function toMixed(num: number, den: number): string {
  if (den === 0) return 'undefined';
  const whole = Math.floor(Math.abs(num) / den);
  const remainder = Math.abs(num) % den;
  const sign = num < 0 ? '-' : '';

  if (whole === 0) {
    return `${sign}${remainder}/${den}`;
  }

  if (remainder === 0) {
    return `${sign}${whole}`;
  }

  return `${sign}${whole} ${remainder}/${den}`;
}

function FractionCalculator() {
  const [num1, setNum1] = useState('1');
  const [den1, setDen1] = useState('2');
  const [num2, setNum2] = useState('1');
  const [den2, setDen2] = useState('4');
  const [operation, setOperation] = useState<'+' | '-' | '×' | '÷'>('+');
  const [result, setResult] = useState<{ fraction: Fraction; decimal: number; mixed: string } | null>(null);

  const handleCalculate = useCallback(() => {
    const n1 = parseInt(num1) || 0;
    const d1 = parseInt(den1) || 1;
    const n2 = parseInt(num2) || 0;
    const d2 = parseInt(den2) || 1;

    if (d1 === 0 || d2 === 0) {
      setResult(null);
      return;
    }

    let resultNum: number;
    let resultDen: number;

    switch (operation) {
      case '+':
        resultNum = n1 * d2 + n2 * d1;
        resultDen = d1 * d2;
        break;
      case '-':
        resultNum = n1 * d2 - n2 * d1;
        resultDen = d1 * d2;
        break;
      case '×':
        resultNum = n1 * n2;
        resultDen = d1 * d2;
        break;
      case '÷':
        if (n2 === 0) {
          setResult(null);
          return;
        }
        resultNum = n1 * d2;
        resultDen = d1 * n2;
        break;
    }

    const simplified = simplify(resultNum, resultDen);
    const decimal = simplified.numerator / simplified.denominator;
    const mixed = toMixed(simplified.numerator, simplified.denominator);

    setResult({ fraction: simplified, decimal, mixed });
  }, [num1, den1, num2, den2, operation]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Fraction Calculator</h3>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {/* First Fraction */}
          <div className="flex flex-col items-center">
            <input
              type="number"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              className="w-20 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="w-20 h-0.5 bg-white my-1" />
            <input
              type="number"
              value={den1}
              onChange={(e) => setDen1(e.target.value)}
              className="w-20 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Operation */}
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value as '+' | '-' | '×' | '÷')}
            className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="+">+</option>
            <option value="-">−</option>
            <option value="×">×</option>
            <option value="÷">÷</option>
          </select>

          {/* Second Fraction */}
          <div className="flex flex-col items-center">
            <input
              type="number"
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
              className="w-20 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="w-20 h-0.5 bg-white my-1" />
            <input
              type="number"
              value={den2}
              onChange={(e) => setDen2(e.target.value)}
              className="w-20 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Equals Button */}
          <button
            onClick={handleCalculate}
            className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-lg transition-colors"
          >
            =
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Result</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <div className="text-sm text-zinc-400 mb-2">Fraction (Simplified)</div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-green-400">{result.fraction.numerator}</span>
                <div className="w-12 h-0.5 bg-green-400 my-1" />
                <span className="text-2xl font-bold text-green-400">{result.fraction.denominator}</span>
              </div>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <div className="text-sm text-zinc-400 mb-2">Mixed Number</div>
              <div className="text-2xl font-bold text-blue-400">
                {result.mixed}
              </div>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <div className="text-sm text-zinc-400 mb-2">Decimal</div>
              <div className="text-2xl font-bold text-yellow-400">
                {isFinite(result.decimal) ? result.decimal.toFixed(6).replace(/\.?0+$/, '') : 'undefined'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(FractionCalculator);
