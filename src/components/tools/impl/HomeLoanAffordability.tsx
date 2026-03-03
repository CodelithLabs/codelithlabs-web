'use client';
import { useState, useCallback, memo } from 'react';
import { Home, IndianRupee, Percent, TrendingUp } from 'lucide-react';

const HomeLoanAffordabilityComponent = function HomeLoanAffordability() {
  const [monthlyIncome, setMonthlyIncome] = useState('100000');
  const [existingEmi, setExistingEmi] = useState('0');
  const [downPayment, setDownPayment] = useState('1000000');
  const [interestRate, setInterestRate] = useState('8.5');
  const [loanTenure, setLoanTenure] = useState('20');
  const [dtiLimit, setDtiLimit] = useState('50');
  const [result, setResult] = useState<{
    maxEmi: number;
    maxLoanAmount: number;
    maxPropertyValue: number;
    totalInterest: number;
    totalPayment: number;
  } | null>(null);

  const calculate = useCallback(() => {
    const income = parseFloat(monthlyIncome) || 0;
    const existing = parseFloat(existingEmi) || 0;
    const down = parseFloat(downPayment) || 0;
    const rate = (parseFloat(interestRate) || 0) / 100 / 12; // Monthly rate
    const tenure = (parseFloat(loanTenure) || 0) * 12; // Months
    const dti = (parseFloat(dtiLimit) || 50) / 100;

    // Maximum EMI = (Income × DTI) - Existing EMIs
    const maxEmi = Math.max(0, (income * dti) - existing);

    // Calculate maximum loan using EMI formula reversed
    // EMI = P × r × (1+r)^n / [(1+r)^n - 1]
    // P = EMI × [(1+r)^n - 1] / [r × (1+r)^n]
    const compoundFactor = Math.pow(1 + rate, tenure);
    const maxLoanAmount = maxEmi * (compoundFactor - 1) / (rate * compoundFactor);

    // Max property value = Loan + Down payment
    const maxPropertyValue = maxLoanAmount + down;

    // Total payment and interest
    const totalPayment = maxEmi * tenure;
    const totalInterest = totalPayment - maxLoanAmount;

    setResult({
      maxEmi: Math.round(maxEmi),
      maxLoanAmount: Math.round(maxLoanAmount),
      maxPropertyValue: Math.round(maxPropertyValue),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
    });
  }, [monthlyIncome, existingEmi, downPayment, interestRate, loanTenure, dtiLimit]);

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

  const formatINRFull = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Home className="w-4 h-4 inline mr-2" />
        <strong>Home Loan Affordability:</strong> Calculate how much home loan you can afford based on your income and existing obligations.
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Monthly Income (₹)</label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
            <input
              type="number"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              className="w-full bg-zinc-800 text-white p-3 pl-9 rounded-lg border border-zinc-700 focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Existing EMIs (₹/month)</label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
            <input
              type="number"
              value={existingEmi}
              onChange={(e) => setExistingEmi(e.target.value)}
              className="w-full bg-zinc-800 text-white p-3 pl-9 rounded-lg border border-zinc-700 focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Down Payment (₹)</label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              className="w-full bg-zinc-800 text-white p-3 pl-9 rounded-lg border border-zinc-700 focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Interest Rate (%/year)</label>
          <div className="relative">
            <Percent className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              step="0.1"
              className="w-full bg-zinc-800 text-white p-3 pl-9 rounded-lg border border-zinc-700 focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Loan Tenure (Years)</label>
          <select
            value={loanTenure}
            onChange={(e) => setLoanTenure(e.target.value)}
            className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700"
          >
            {[10, 15, 20, 25, 30].map(y => (
              <option key={y} value={y}>{y} years</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Max DTI Ratio (%)</label>
          <select
            value={dtiLimit}
            onChange={(e) => setDtiLimit(e.target.value)}
            className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700"
          >
            <option value="40">40% (Conservative)</option>
            <option value="50">50% (Standard)</option>
            <option value="60">60% (Aggressive)</option>
          </select>
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
      >
        <TrendingUp className="w-4 h-4" />
        Calculate Affordability
      </button>

      {result && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-500/30 rounded-lg p-6 text-center">
            <div className="text-sm text-zinc-400 mb-1">Maximum Property Value You Can Afford</div>
            <div className="text-3xl font-bold text-green-400">{formatINR(result.maxPropertyValue)}</div>
            <div className="text-xs text-zinc-500 mt-1">{formatINRFull(result.maxPropertyValue)}</div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center">
              <div className="text-xs text-zinc-400 mb-1">Max Loan Amount</div>
              <div className="text-lg font-bold text-blue-400">{formatINR(result.maxLoanAmount)}</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center">
              <div className="text-xs text-zinc-400 mb-1">Max Monthly EMI</div>
              <div className="text-lg font-bold text-purple-400">{formatINRFull(result.maxEmi)}</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center">
              <div className="text-xs text-zinc-400 mb-1">Down Payment</div>
              <div className="text-lg font-bold text-orange-400">{formatINR(parseFloat(downPayment))}</div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-zinc-300 mb-3">Loan Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Monthly Income</span>
                <span className="text-white">{formatINRFull(parseFloat(monthlyIncome))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Existing EMI Obligations</span>
                <span className="text-white">{formatINRFull(parseFloat(existingEmi))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Available for Home EMI ({dtiLimit}% DTI)</span>
                <span className="text-green-400">{formatINRFull(result.maxEmi)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-700">
                <span className="text-zinc-400">Total Interest ({loanTenure} years)</span>
                <span className="text-orange-400">{formatINR(result.totalInterest)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Total Payment</span>
                <span className="text-white">{formatINR(result.totalPayment)}</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-400">
            <strong className="text-zinc-300">Note:</strong> This is an estimate based on DTI (Debt-to-Income) ratio. Actual loan approval depends on credit score, employment stability, property value, and bank policies. Most banks prefer DTI under 50%.
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(HomeLoanAffordabilityComponent);
