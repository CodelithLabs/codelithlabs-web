'use client';
import { useState, useCallback, memo } from 'react';
import { Landmark, IndianRupee, TrendingUp, Calendar, Shield } from 'lucide-react';

interface PpfResult {
  maturityAmount: number;
  totalInvestment: number;
  totalInterest: number;
  yearlyBreakdown: { year: number; deposit: number; interest: number; balance: number }[];
}

const PpfCalculatorComponent = function PpfCalculator() {
  const [yearlyDeposit, setYearlyDeposit] = useState('150000');
  const [duration, setDuration] = useState('15');
  const [existingBalance, setExistingBalance] = useState('0');
  const [interestRate, setInterestRate] = useState('7.1');
  const [result, setResult] = useState<PpfResult | null>(null);

  const calculate = useCallback(() => {
    const annual = Math.min(parseFloat(yearlyDeposit) || 0, 150000); // Max ₹1.5L/year
    const years = Math.max(parseFloat(duration) || 15, 15); // Minimum 15 years
    const existing = parseFloat(existingBalance) || 0;
    const rate = (parseFloat(interestRate) || 7.1) / 100;

    const yearlyBreakdown: { year: number; deposit: number; interest: number; balance: number }[] = [];
    let balance = existing;
    let totalDeposit = existing;

    for (let year = 1; year <= years; year++) {
      const deposit = annual;
      // PPF interest is calculated monthly but compounded yearly
      const interest = (balance + deposit) * rate;
      balance = balance + deposit + interest;
      totalDeposit += deposit;

      yearlyBreakdown.push({
        year,
        deposit,
        interest: Math.round(interest),
        balance: Math.round(balance),
      });
    }

    setResult({
      maturityAmount: Math.round(balance),
      totalInvestment: Math.round(totalDeposit),
      totalInterest: Math.round(balance - totalDeposit),
      yearlyBreakdown,
    });
  }, [yearlyDeposit, duration, existingBalance, interestRate]);

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

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Landmark className="w-4 h-4 inline mr-2" />
        <strong>PPF Calculator:</strong> Calculate Public Provident Fund maturity with 15-year lock-in. Tax-free returns under EEE (Exempt-Exempt-Exempt) category.
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Yearly Deposit (₹)</label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
            <input
              type="number"
              value={yearlyDeposit}
              onChange={(e) => setYearlyDeposit(e.target.value)}
              max="150000"
              className="w-full bg-zinc-800 text-white p-3 pl-9 rounded-lg border border-zinc-700 focus:border-blue-500"
            />
          </div>
          <div className="text-xs text-zinc-500 mt-1">Max ₹1,50,000/year</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Interest Rate (%/year)</label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            step="0.1"
            className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:border-blue-500"
          />
          <div className="text-xs text-zinc-500 mt-1">Current rate: 7.1% (Q4 FY24)</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Duration (Years)</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-zinc-800 text-white p-3 pl-9 rounded-lg border border-zinc-700"
            >
              <option value="15">15 years (Minimum)</option>
              <option value="20">20 years</option>
              <option value="25">25 years</option>
              <option value="30">30 years</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Existing Balance (₹)</label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
            <input
              type="number"
              value={existingBalance}
              onChange={(e) => setExistingBalance(e.target.value)}
              className="w-full bg-zinc-800 text-white p-3 pl-9 rounded-lg border border-zinc-700 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
      >
        <TrendingUp className="w-4 h-4" />
        Calculate PPF
      </button>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-500/30 rounded-lg p-4 text-center">
              <div className="text-xs text-zinc-400 mb-1">Maturity Value</div>
              <div className="text-xl font-bold text-green-400">{formatINR(result.maturityAmount)}</div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-500/30 rounded-lg p-4 text-center">
              <div className="text-xs text-zinc-400 mb-1">Total Invested</div>
              <div className="text-xl font-bold text-blue-400">{formatINR(result.totalInvestment)}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-500/30 rounded-lg p-4 text-center">
              <div className="text-xs text-zinc-400 mb-1">Interest Earned</div>
              <div className="text-xl font-bold text-purple-400">{formatINR(result.totalInterest)}</div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-zinc-300">Year-by-Year Growth</h4>
              <span className="text-xs text-green-400 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Tax-Free (EEE)
              </span>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {result.yearlyBreakdown.map(y => (
                <div key={y.year} className="flex items-center gap-3 text-sm">
                  <span className="w-8 text-zinc-500">Y{y.year}</span>
                  <div className="flex-1 bg-zinc-800 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-full"
                      style={{ width: `${(y.balance / result.maturityAmount) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono w-20 text-right text-zinc-300">{formatINR(y.balance)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              Tax Benefits
            </h4>
            <div className="space-y-2 text-sm text-zinc-400">
              <p>✅ Investment up to ₹1.5L/year qualifies under Section 80C</p>
              <p>✅ Interest earned is completely tax-free</p>
              <p>✅ Maturity amount is tax-free</p>
              <p>✅ Loan facility available from 3rd to 6th year</p>
              <p>✅ Partial withdrawal allowed from 7th year</p>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-400">
            <strong className="text-zinc-300">Note:</strong> PPF has a mandatory 15-year lock-in period. Can be extended in blocks of 5 years. Interest rate is revised quarterly by the government. Minimum annual deposit: ₹500. Maximum: ₹1,50,000.
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(PpfCalculatorComponent);
