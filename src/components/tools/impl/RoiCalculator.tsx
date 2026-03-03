'use client';
import { useState, useCallback, memo } from 'react';
import { TrendingUp, DollarSign, Percent, ArrowRight } from 'lucide-react';

const RoiCalculatorComponent = function RoiCalculator() {
  const [initialInvestment, setInitialInvestment] = useState('100000');
  const [finalValue, setFinalValue] = useState('150000');
  const [timePeriod, setTimePeriod] = useState('2');
  const [timeUnit, setTimeUnit] = useState<'years' | 'months'>('years');
  const [result, setResult] = useState<{
    absoluteReturn: number;
    roi: number;
    annualizedRoi: number;
    profitLoss: number;
    multiplier: number;
  } | null>(null);

  const calculate = useCallback(() => {
    const initial = parseFloat(initialInvestment) || 0;
    const final = parseFloat(finalValue) || 0;
    const period = parseFloat(timePeriod) || 0;

    if (initial <= 0 || period <= 0) return;

    const profitLoss = final - initial;
    const absoluteReturn = profitLoss;
    const roi = (profitLoss / initial) * 100;
    
    // Convert to years for annualized calculation
    const years = timeUnit === 'months' ? period / 12 : period;
    
    // CAGR formula: ((Final/Initial)^(1/years) - 1) × 100
    const annualizedRoi = years > 0 
      ? (Math.pow(final / initial, 1 / years) - 1) * 100 
      : roi;
    
    const multiplier = final / initial;

    setResult({
      absoluteReturn,
      roi,
      annualizedRoi,
      profitLoss,
      multiplier,
    });
  }, [initialInvestment, finalValue, timePeriod, timeUnit]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const isProfit = result ? result.profitLoss >= 0 : true;

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <TrendingUp className="w-4 h-4 inline mr-2" />
        <strong>ROI Calculator:</strong> Calculate Return on Investment including simple ROI, annualized returns (CAGR), and investment multiplier.
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Initial Investment</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
            <input
              type="number"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(e.target.value)}
              className="w-full bg-zinc-800 text-white p-3 pl-9 rounded-lg border border-zinc-700 focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Final Value</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
            <input
              type="number"
              value={finalValue}
              onChange={(e) => setFinalValue(e.target.value)}
              className="w-full bg-zinc-800 text-white p-3 pl-9 rounded-lg border border-zinc-700 focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Time Period</label>
          <input
            type="number"
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            min="0"
            step="0.5"
            className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Period Unit</label>
          <select
            value={timeUnit}
            onChange={(e) => setTimeUnit(e.target.value as 'years' | 'months')}
            className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700"
          >
            <option value="years">Years</option>
            <option value="months">Months</option>
          </select>
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
      >
        <TrendingUp className="w-4 h-4" />
        Calculate ROI
      </button>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`bg-gradient-to-br ${isProfit ? 'from-green-900/50 to-green-800/30 border-green-500/30' : 'from-red-900/50 to-red-800/30 border-red-500/30'} border rounded-lg p-4 text-center`}>
              <div className="text-xs text-zinc-400 mb-1">Total Return</div>
              <div className={`text-xl font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                {isProfit ? '+' : '-'}{formatCurrency(result.absoluteReturn)}
              </div>
            </div>
            <div className={`bg-gradient-to-br ${isProfit ? 'from-blue-900/50 to-blue-800/30 border-blue-500/30' : 'from-red-900/50 to-red-800/30 border-red-500/30'} border rounded-lg p-4 text-center`}>
              <div className="text-xs text-zinc-400 mb-1">ROI</div>
              <div className={`text-xl font-bold ${isProfit ? 'text-blue-400' : 'text-red-400'}`}>
                {result.roi >= 0 ? '+' : ''}{result.roi.toFixed(2)}%
              </div>
            </div>
            <div className={`bg-gradient-to-br ${isProfit ? 'from-purple-900/50 to-purple-800/30 border-purple-500/30' : 'from-red-900/50 to-red-800/30 border-red-500/30'} border rounded-lg p-4 text-center`}>
              <div className="text-xs text-zinc-400 mb-1">Annualized (CAGR)</div>
              <div className={`text-xl font-bold ${isProfit ? 'text-purple-400' : 'text-red-400'}`}>
                {result.annualizedRoi >= 0 ? '+' : ''}{result.annualizedRoi.toFixed(2)}%
              </div>
            </div>
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded-lg p-4 text-center">
              <div className="text-xs text-zinc-400 mb-1">Multiplier</div>
              <div className="text-xl font-bold text-white">{result.multiplier.toFixed(2)}x</div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-zinc-300 mb-3">Investment Summary</h4>
            <div className="flex items-center justify-between text-sm">
              <div className="text-center">
                <div className="text-xs text-zinc-500 mb-1">Initial</div>
                <div className="text-lg font-bold text-white">{formatCurrency(parseFloat(initialInvestment))}</div>
              </div>
              <ArrowRight className={`w-6 h-6 ${isProfit ? 'text-green-500' : 'text-red-500'}`} />
              <div className="text-center">
                <div className="text-xs text-zinc-500 mb-1">{timePeriod} {timeUnit}</div>
                <Percent className="w-4 h-4 mx-auto text-zinc-400" />
              </div>
              <ArrowRight className={`w-6 h-6 ${isProfit ? 'text-green-500' : 'text-red-500'}`} />
              <div className="text-center">
                <div className="text-xs text-zinc-500 mb-1">Final</div>
                <div className={`text-lg font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(parseFloat(finalValue))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-zinc-300 mb-3">Formulas Used</h4>
            <div className="space-y-2 text-sm text-zinc-400 font-mono">
              <div>
                <span className="text-zinc-500">ROI = </span>
                <span>((Final - Initial) / Initial) × 100</span>
              </div>
              <div>
                <span className="text-zinc-500">CAGR = </span>
                <span>((Final / Initial)^(1/years) - 1) × 100</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-400">
            <strong className="text-zinc-300">Note:</strong> CAGR (Compound Annual Growth Rate) represents the annualized return assuming compounding. It&apos;s useful for comparing investments with different time periods.
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(RoiCalculatorComponent);
