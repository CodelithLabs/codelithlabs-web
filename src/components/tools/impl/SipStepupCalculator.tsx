'use client';
import { useState, useCallback, memo } from 'react';
import { TrendingUp, IndianRupee, ArrowUp, PieChart } from 'lucide-react';

interface SipResult {
  totalInvestment: number;
  expectedReturns: number;
  maturityValue: number;
  yearlyBreakdown: { year: number; invested: number; value: number }[];
}

const SipStepupCalculatorComponent = function SipStepupCalculator() {
  const [monthlySip, setMonthlySip] = useState('10000');
  const [stepupPercent, setStepupPercent] = useState('10');
  const [duration, setDuration] = useState('10');
  const [expectedReturn, setExpectedReturn] = useState('12');
  const [result, setResult] = useState<SipResult | null>(null);

  const calculate = useCallback(() => {
    const initialSip = parseFloat(monthlySip) || 0;
    const stepup = (parseFloat(stepupPercent) || 0) / 100;
    const years = parseFloat(duration) || 0;
    const annualReturn = (parseFloat(expectedReturn) || 0) / 100;
    const monthlyReturn = annualReturn / 12;

    if (initialSip <= 0 || years <= 0) return;

    let totalInvestment = 0;
    let totalValue = 0;
    const yearlyBreakdown: { year: number; invested: number; value: number }[] = [];

    for (let year = 1; year <= years; year++) {
      const currentSip = initialSip * Math.pow(1 + stepup, year - 1);
      
      // For each month of this year
      for (let month = 1; month <= 12; month++) {
        totalInvestment += currentSip;
        // Calculate remaining months until maturity
        const remainingMonths = (years - year) * 12 + (12 - month) + 1;
        // Future value of this SIP
        totalValue += currentSip * Math.pow(1 + monthlyReturn, remainingMonths);
      }

      yearlyBreakdown.push({
        year,
        invested: Math.round(totalInvestment),
        value: Math.round(totalValue),
      });
    }

    setResult({
      totalInvestment: Math.round(totalInvestment),
      expectedReturns: Math.round(totalValue - totalInvestment),
      maturityValue: Math.round(totalValue),
      yearlyBreakdown,
    });
  }, [monthlySip, stepupPercent, duration, expectedReturn]);

  const formatINR = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate comparison with regular SIP
  const regularSipValue = useCallback(() => {
    const sip = parseFloat(monthlySip) || 0;
    const years = parseFloat(duration) || 0;
    const monthlyReturn = ((parseFloat(expectedReturn) || 0) / 100) / 12;
    const months = years * 12;
    
    if (months <= 0 || sip <= 0) return 0;
    
    const fv = sip * ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn) * (1 + monthlyReturn);
    return Math.round(fv);
  }, [monthlySip, duration, expectedReturn]);

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <TrendingUp className="w-4 h-4 inline mr-2" />
        <strong>Step-up SIP Calculator:</strong> Calculate SIP returns with annual increment. Ideal for increasing investments as your income grows.
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Monthly SIP (₹)</label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
            <input
              type="number"
              value={monthlySip}
              onChange={(e) => setMonthlySip(e.target.value)}
              className="w-full bg-zinc-800 text-white p-3 pl-9 rounded-lg border border-zinc-700 focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Annual Step-up (%)</label>
          <div className="relative">
            <ArrowUp className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
            <input
              type="number"
              value={stepupPercent}
              onChange={(e) => setStepupPercent(e.target.value)}
              className="w-full bg-zinc-800 text-white p-3 pl-9 rounded-lg border border-zinc-700 focus:border-blue-500"
            />
          </div>
          <div className="text-xs text-zinc-500 mt-1">Increase SIP by this % every year</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Duration (Years)</label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700"
          >
            {[5, 10, 15, 20, 25, 30].map(y => (
              <option key={y} value={y}>{y} years</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Expected Return (%/year)</label>
          <select
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(e.target.value)}
            className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700"
          >
            <option value="8">8% (Debt Funds)</option>
            <option value="10">10% (Balanced Funds)</option>
            <option value="12">12% (Large Cap Equity)</option>
            <option value="14">14% (Multi Cap Equity)</option>
            <option value="15">15% (Small/Mid Cap)</option>
          </select>
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
      >
        <TrendingUp className="w-4 h-4" />
        Calculate Step-up SIP
      </button>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-500/30 rounded-lg p-4 text-center">
              <div className="text-xs text-zinc-400 mb-1">Total Invested</div>
              <div className="text-xl font-bold text-blue-400">{formatINR(result.totalInvestment)}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-500/30 rounded-lg p-4 text-center">
              <div className="text-xs text-zinc-400 mb-1">Expected Returns</div>
              <div className="text-xl font-bold text-purple-400">{formatINR(result.expectedReturns)}</div>
            </div>
            <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-500/30 rounded-lg p-4 text-center">
              <div className="text-xs text-zinc-400 mb-1">Maturity Value</div>
              <div className="text-xl font-bold text-green-400">{formatINR(result.maturityValue)}</div>
            </div>
          </div>

          {/* Comparison with regular SIP */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-zinc-300 mb-3">Step-up vs Regular SIP</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-zinc-800 rounded-lg">
                <div className="text-xs text-zinc-400 mb-1">Regular SIP Value</div>
                <div className="text-lg font-bold text-zinc-300">{formatINR(regularSipValue())}</div>
                <div className="text-xs text-zinc-500">₹{monthlySip}/month fixed</div>
              </div>
              <div className="p-3 bg-green-900/30 border border-green-500/30 rounded-lg">
                <div className="text-xs text-zinc-400 mb-1">Step-up SIP Value</div>
                <div className="text-lg font-bold text-green-400">{formatINR(result.maturityValue)}</div>
                <div className="text-xs text-green-400">
                  +{formatINR(result.maturityValue - regularSipValue())} extra
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Year-by-Year Growth
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {result.yearlyBreakdown.map(y => (
                <div key={y.year} className="flex items-center gap-3 text-sm">
                  <span className="w-8 text-zinc-500">Y{y.year}</span>
                  <div className="flex-1 bg-zinc-800 rounded-full h-4 overflow-hidden relative">
                    <div
                      className="bg-blue-600 h-full absolute left-0"
                      style={{ width: `${(y.invested / result.maturityValue) * 100}%` }}
                    />
                    <div
                      className="bg-green-500 h-full absolute"
                      style={{ 
                        left: `${(y.invested / result.maturityValue) * 100}%`,
                        width: `${((y.value - y.invested) / result.maturityValue) * 100}%` 
                      }}
                    />
                  </div>
                  <span className="font-mono w-20 text-right text-zinc-300">{formatINR(y.value)}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-4 text-xs text-zinc-500 mt-3 pt-3 border-t border-zinc-700">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-600 rounded" /> Invested</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded" /> Returns</span>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-400">
            <strong className="text-zinc-300">About Step-up SIP:</strong> With a {stepupPercent}% annual increase, your SIP grows from ₹{Number(monthlySip).toLocaleString('en-IN')} to ₹{Math.round(parseFloat(monthlySip) * Math.pow(1 + parseFloat(stepupPercent)/100, parseFloat(duration) - 1)).toLocaleString('en-IN')} by year {duration}. This aligns with typical salary growth and helps build a larger corpus.
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(SipStepupCalculatorComponent);
