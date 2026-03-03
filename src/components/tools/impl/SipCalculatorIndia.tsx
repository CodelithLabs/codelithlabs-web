'use client';

import { memo, useState, useCallback } from 'react';

interface SIPResult {
  totalInvestment: number;
  totalReturns: number;
  maturityValue: number;
  yearlyBreakdown: { year: number; investment: number; value: number; returns: number }[];
}

function SipCalculatorIndia() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<string>('10000');
  const [expectedReturn, setExpectedReturn] = useState<string>('12');
  const [tenure, setTenure] = useState<string>('15');
  const [result, setResult] = useState<SIPResult | null>(null);

  const calculateSIP = useCallback(() => {
    const P = parseFloat(monthlyInvestment) || 0;
    const annualRate = parseFloat(expectedReturn) || 0;
    const years = parseFloat(tenure) || 0;
    
    if (P <= 0 || annualRate <= 0 || years <= 0) {
      setResult(null);
      return;
    }

    const months = years * 12;
    const monthlyRate = annualRate / 12 / 100;
    
    // SIP Formula: M = P × ({[1 + i]^n – 1} / i) × (1 + i)
    const maturityValue = P * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const totalInvestment = P * months;
    const totalReturns = maturityValue - totalInvestment;

    // Yearly breakdown
    const yearlyBreakdown: SIPResult['yearlyBreakdown'] = [];
    for (let year = 1; year <= years; year++) {
      const monthsElapsed = year * 12;
      const investmentTillNow = P * monthsElapsed;
      const valueTillNow = P * ((Math.pow(1 + monthlyRate, monthsElapsed) - 1) / monthlyRate) * (1 + monthlyRate);
      yearlyBreakdown.push({
        year,
        investment: investmentTillNow,
        value: valueTillNow,
        returns: valueTillNow - investmentTillNow
      });
    }

    setResult({ totalInvestment, totalReturns, maturityValue, yearlyBreakdown });
  }, [monthlyInvestment, expectedReturn, tenure]);

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const presets = [
    { name: 'Conservative', return: 8, desc: 'Debt funds, FDs' },
    { name: 'Moderate', return: 12, desc: 'Hybrid funds' },
    { name: 'Aggressive', return: 15, desc: 'Equity funds' },
    { name: 'High Growth', return: 18, desc: 'Small/Mid caps' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Monthly SIP Amount (₹)
            </label>
            <input
              type="number"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 10000"
            />
            <div className="flex gap-2 mt-2">
              {[5000, 10000, 25000, 50000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setMonthlyInvestment(amount.toString())}
                  className="px-3 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded transition-colors"
                >
                  ₹{amount.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Expected Annual Return (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 12"
            />
            <div className="grid grid-cols-2 gap-2 mt-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setExpectedReturn(preset.return.toString())}
                  className="px-3 py-2 text-xs bg-zinc-700 hover:bg-zinc-600 text-left rounded transition-colors"
                >
                  <span className="text-zinc-300">{preset.name}</span>
                  <span className="text-green-400 ml-1">{preset.return}%</span>
                  <p className="text-zinc-500 text-[10px]">{preset.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Investment Period (Years)
            </label>
            <input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 15"
            />
            <div className="flex gap-2 mt-2">
              {[5, 10, 15, 20, 25, 30].map((years) => (
                <button
                  key={years}
                  onClick={() => setTenure(years.toString())}
                  className="px-3 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded transition-colors"
                >
                  {years}Y
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={calculateSIP}
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Calculate SIP Returns
          </button>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {result && (
            <>
              <div className="p-6 bg-zinc-800 rounded-lg border border-zinc-700 space-y-4">
                <div className="text-center">
                  <p className="text-sm text-zinc-400 mb-1">Maturity Value</p>
                  <p className="text-3xl font-bold text-green-400">{formatCurrency(result.maturityValue)}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-700">
                  <div className="text-center">
                    <p className="text-sm text-zinc-400 mb-1">Total Investment</p>
                    <p className="text-xl font-semibold text-blue-400">{formatCurrency(result.totalInvestment)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-zinc-400 mb-1">Total Returns</p>
                    <p className="text-xl font-semibold text-yellow-400">{formatCurrency(result.totalReturns)}</p>
                  </div>
                </div>

                {/* Visual breakdown */}
                <div className="pt-4 border-t border-zinc-700">
                  <div className="flex h-4 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500" 
                      style={{ width: `${(result.totalInvestment / result.maturityValue) * 100}%` }}
                    />
                    <div 
                      className="bg-green-500" 
                      style={{ width: `${(result.totalReturns / result.maturityValue) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-zinc-400 mt-1">
                    <span>Investment ({((result.totalInvestment / result.maturityValue) * 100).toFixed(0)}%)</span>
                    <span>Returns ({((result.totalReturns / result.maturityValue) * 100).toFixed(0)}%)</span>
                  </div>
                </div>
              </div>

              {/* Yearly Growth */}
              <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 max-h-64 overflow-y-auto">
                <h3 className="text-sm font-medium text-zinc-300 mb-3">Year-wise Growth</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-zinc-400">
                      <th className="text-left py-1">Year</th>
                      <th className="text-right py-1">Invested</th>
                      <th className="text-right py-1">Value</th>
                      <th className="text-right py-1">Returns</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.yearlyBreakdown.map((row) => (
                      <tr key={row.year} className="border-t border-zinc-700/50">
                        <td className="py-1 text-zinc-300">{row.year}</td>
                        <td className="py-1 text-right text-blue-400">{formatCurrency(row.investment)}</td>
                        <td className="py-1 text-right text-green-400">{formatCurrency(row.value)}</td>
                        <td className="py-1 text-right text-yellow-400">{formatCurrency(row.returns)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Tips */}
          <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700/50">
            <h3 className="text-sm font-medium text-blue-400 mb-2">SIP Investment Tips</h3>
            <ul className="text-xs text-zinc-400 space-y-1">
              <li>• Start early to maximize compounding benefits</li>
              <li>• Increase SIP amount yearly with step-up SIP</li>
              <li>• Stay invested for long-term wealth creation</li>
              <li>• ELSS funds offer tax benefits under Sec 80C</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(SipCalculatorIndia);
