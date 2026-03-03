'use client';
import { useState, useCallback, memo } from 'react';
import { Calculator, IndianRupee, TrendingUp } from 'lucide-react';

const EmiPrincipalCalculatorComponent = function EmiPrincipalCalculator() {
  const [emi, setEmi] = useState('25000');
  const [rate, setRate] = useState('10');
  const [tenure, setTenure] = useState('60');
  const [result, setResult] = useState<{
    principal: number;
    totalInterest: number;
    totalPayment: number;
  } | null>(null);

  const calculate = useCallback(() => {
    const E = parseFloat(emi) || 0;
    const r = (parseFloat(rate) || 0) / 100 / 12; // Monthly rate
    const n = parseFloat(tenure) || 0; // Months

    if (E <= 0 || r <= 0 || n <= 0) return;

    // Reverse EMI formula: P = E * [(1+r)^n - 1] / [r * (1+r)^n]
    const compoundFactor = Math.pow(1 + r, n);
    const principal = E * (compoundFactor - 1) / (r * compoundFactor);
    const totalPayment = E * n;
    const totalInterest = totalPayment - principal;

    setResult({
      principal: Math.round(principal),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
    });
  }, [emi, rate, tenure]);

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Calculator className="w-4 h-4 inline mr-2" />
        <strong>EMI Principal Calculator:</strong> Calculate the loan principal amount you can get for a fixed EMI. Useful for planning your loan budget.
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Monthly EMI (₹)</label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
            <input
              type="number"
              value={emi}
              onChange={(e) => setEmi(e.target.value)}
              className="w-full bg-zinc-800 text-white p-3 pl-9 rounded-lg border border-zinc-700 focus:border-blue-500"
              placeholder="25000"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Interest Rate (%/year)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            step="0.1"
            className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:border-blue-500"
            placeholder="10"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Tenure (Months)</label>
          <input
            type="number"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
            className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:border-blue-500"
            placeholder="60"
          />
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
      >
        <TrendingUp className="w-4 h-4" />
        Calculate Principal
      </button>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-500/30 rounded-lg p-4 text-center">
              <div className="text-xs text-zinc-400 mb-1">Loan Principal</div>
              <div className="text-xl font-bold text-green-400">{formatINR(result.principal)}</div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-500/30 rounded-lg p-4 text-center">
              <div className="text-xs text-zinc-400 mb-1">Total Interest</div>
              <div className="text-xl font-bold text-blue-400">{formatINR(result.totalInterest)}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-500/30 rounded-lg p-4 text-center">
              <div className="text-xs text-zinc-400 mb-1">Total Payment</div>
              <div className="text-xl font-bold text-purple-400">{formatINR(result.totalPayment)}</div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-zinc-300 mb-3">Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Monthly EMI</span>
                <span className="text-white">{formatINR(parseFloat(emi))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Loan Tenure</span>
                <span className="text-white">{tenure} months ({(parseFloat(tenure) / 12).toFixed(1)} years)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Interest Rate</span>
                <span className="text-white">{rate}% per annum</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-700">
                <span className="text-zinc-400">Interest to Principal Ratio</span>
                <span className="text-white">{((result.totalInterest / result.principal) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(EmiPrincipalCalculatorComponent);
