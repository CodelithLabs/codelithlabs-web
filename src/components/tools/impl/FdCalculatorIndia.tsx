'use client';
import { useState, useCallback, memo } from 'react';
import { Landmark, IndianRupee, TrendingUp, Calendar } from 'lucide-react';

interface FdResult {
  maturityAmount: number;
  totalInterest: number;
  effectiveRate: number;
  taxDeducted: number;
  netMaturity: number;
  quarterlyBreakdown: { quarter: number; interest: number; balance: number }[];
}

const FdCalculatorIndiaComponent = function FdCalculatorIndia() {
  const [principal, setPrincipal] = useState('100000');
  const [rate, setRate] = useState('7');
  const [tenure, setTenure] = useState('12');
  const [compounding, setCompounding] = useState<'quarterly' | 'monthly' | 'yearly'>('quarterly');
  const [isSeniorCitizen, setIsSeniorCitizen] = useState(false);
  const [result, setResult] = useState<FdResult | null>(null);

  const calculate = useCallback(() => {
    let P = parseFloat(principal) || 0;
    let r = parseFloat(rate) || 0;
    const t = (parseFloat(tenure) || 0) / 12; // Convert months to years

    // Senior citizen bonus (typically +0.5%)
    if (isSeniorCitizen) {
      r += 0.5;
    }

    const annualRate = r / 100;

    // Compounding frequency
    const n = compounding === 'quarterly' ? 4 : compounding === 'monthly' ? 12 : 1;

    // FD Formula: A = P(1 + r/n)^(nt)
    const maturityAmount = P * Math.pow(1 + annualRate / n, n * t);
    const totalInterest = maturityAmount - P;

    // TDS calculation (10% if interest > ₹40,000 for non-senior, ₹50,000 for senior)
    const tdsThreshold = isSeniorCitizen ? 50000 : 40000;
    const taxDeducted = totalInterest > tdsThreshold ? totalInterest * 0.1 : 0;
    const netMaturity = maturityAmount - taxDeducted;

    // Effective annual rate
    const effectiveRate = (Math.pow(1 + annualRate / n, n) - 1) * 100;

    // Quarterly breakdown
    const quarterlyBreakdown: { quarter: number; interest: number; balance: number }[] = [];
    const totalQuarters = Math.ceil(t * 4);
    let balance = P;
    const quarterlyRate = annualRate / 4;

    for (let q = 1; q <= Math.min(totalQuarters, 20); q++) {
      const interest = balance * quarterlyRate;
      balance += interest;
      quarterlyBreakdown.push({
        quarter: q,
        interest: Math.round(interest),
        balance: Math.round(balance),
      });
    }

    setResult({
      maturityAmount: Math.round(maturityAmount),
      totalInterest: Math.round(totalInterest),
      effectiveRate,
      taxDeducted: Math.round(taxDeducted),
      netMaturity: Math.round(netMaturity),
      quarterlyBreakdown,
    });
  }, [principal, rate, tenure, compounding, isSeniorCitizen]);

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
        <Landmark className="w-4 h-4 inline mr-2" />
        <strong>FD Calculator (India):</strong> Calculate Fixed Deposit maturity with Indian tax rules. Includes TDS calculation and senior citizen benefits.
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Principal Amount (₹)</label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="w-full bg-zinc-800 text-white p-3 pl-9 rounded-lg border border-zinc-700 focus:border-blue-500"
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
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Tenure (Months)</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
            <input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              className="w-full bg-zinc-800 text-white p-3 pl-9 rounded-lg border border-zinc-700 focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Compounding</label>
          <select
            value={compounding}
            onChange={(e) => setCompounding(e.target.value as 'quarterly' | 'monthly' | 'yearly')}
            className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700"
          >
            <option value="quarterly">Quarterly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isSeniorCitizen}
          onChange={(e) => setIsSeniorCitizen(e.target.checked)}
          className="w-4 h-4 rounded bg-zinc-700 border-zinc-600"
        />
        <span className="text-sm text-zinc-300">Senior Citizen (+0.5% extra interest)</span>
      </label>

      <button
        onClick={calculate}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
      >
        <TrendingUp className="w-4 h-4" />
        Calculate FD
      </button>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-500/30 rounded-lg p-4 text-center">
              <div className="text-xs text-zinc-400 mb-1">Maturity Amount</div>
              <div className="text-lg font-bold text-green-400">{formatINR(result.maturityAmount)}</div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-500/30 rounded-lg p-4 text-center">
              <div className="text-xs text-zinc-400 mb-1">Total Interest</div>
              <div className="text-lg font-bold text-blue-400">{formatINR(result.totalInterest)}</div>
            </div>
            <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 border border-orange-500/30 rounded-lg p-4 text-center">
              <div className="text-xs text-zinc-400 mb-1">TDS Deducted</div>
              <div className="text-lg font-bold text-orange-400">{formatINR(result.taxDeducted)}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-500/30 rounded-lg p-4 text-center">
              <div className="text-xs text-zinc-400 mb-1">Net Maturity</div>
              <div className="text-lg font-bold text-purple-400">{formatINR(result.netMaturity)}</div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-zinc-300 mb-3">FD Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Effective Annual Rate</span>
                <span className="text-white">{result.effectiveRate.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Interest Earned</span>
                <span className="text-white">{formatINR(result.totalInterest)}</span>
              </div>
              {result.taxDeducted > 0 && (
                <div className="flex justify-between col-span-2">
                  <span className="text-zinc-400">TDS (10% above ₹{isSeniorCitizen ? '50,000' : '40,000'})</span>
                  <span className="text-orange-400">-{formatINR(result.taxDeducted)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-zinc-300 mb-3">Quarterly Growth</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {result.quarterlyBreakdown.map(q => (
                <div key={q.quarter} className="flex items-center gap-3 text-sm">
                  <span className="w-8 text-zinc-500">Q{q.quarter}</span>
                  <div className="flex-1 bg-zinc-800 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full"
                      style={{ width: `${(q.balance / result.maturityAmount) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono w-24 text-right text-zinc-300">{formatINR(q.balance)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(FdCalculatorIndiaComponent);
