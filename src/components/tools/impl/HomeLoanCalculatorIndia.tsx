'use client';

import { memo, useState, useCallback } from 'react';

interface LoanResult {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  maxLoan: number;
  taxBenefit80C: number;
  taxBenefit24: number;
}

const BANK_RATES = [
  { name: 'SBI', rate: 8.50 },
  { name: 'HDFC Bank', rate: 8.75 },
  { name: 'LIC Housing', rate: 8.50 },
  { name: 'ICICI Bank', rate: 8.75 },
  { name: 'Bank of Baroda', rate: 8.40 },
  { name: 'Axis Bank', rate: 8.70 },
  { name: 'PNB Housing', rate: 8.65 },
  { name: 'Kotak Mahindra', rate: 8.85 },
];

function HomeLoanCalculatorIndia() {
  const [principal, setPrincipal] = useState<string>('5000000');
  const [rate, setRate] = useState<string>('8.50');
  const [tenure, setTenure] = useState<string>('20');
  const [monthlyIncome, setMonthlyIncome] = useState<string>('150000');
  const [existingEMI, setExistingEMI] = useState<string>('0');
  const [result, setResult] = useState<LoanResult | null>(null);

  const calculateLoan = useCallback(() => {
    const P = parseFloat(principal) || 0;
    const annualRate = parseFloat(rate) || 0;
    const years = parseFloat(tenure) || 0;
    const income = parseFloat(monthlyIncome) || 0;
    const existing = parseFloat(existingEMI) || 0;
    
    if (P <= 0 || annualRate <= 0 || years <= 0) {
      setResult(null);
      return;
    }

    const months = years * 12;
    const monthlyRate = annualRate / 12 / 100;
    
    // EMI calculation
    const emi = P * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - P;

    // Max loan eligibility (60% of income - existing EMI)
    const maxEMI = (income * 0.6) - existing;
    const maxLoan = maxEMI > 0 
      ? maxEMI * (Math.pow(1 + monthlyRate, months) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, months))
      : 0;

    // Tax benefits under old regime
    const annualPrincipal = Math.min(emi * 12 * 0.3, P / years); // Approximate principal repaid per year
    const taxBenefit80C = Math.min(annualPrincipal, 150000); // Section 80C limit
    const taxBenefit24 = Math.min(totalInterest / years, 200000); // Section 24 limit for self-occupied

    setResult({ emi, totalInterest, totalPayment, maxLoan, taxBenefit80C, taxBenefit24 });
  }, [principal, rate, tenure, monthlyIncome, existingEMI]);

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

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Loan Amount (₹)
            </label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 5000000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Interest Rate (% p.a.)
            </label>
            <input
              type="number"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 8.50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Loan Tenure (Years)
            </label>
            <input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Monthly Income (₹)
              </label>
              <input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 150000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Existing EMIs (₹)
              </label>
              <input
                type="number"
                value={existingEMI}
                onChange={(e) => setExistingEMI(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 0"
              />
            </div>
          </div>

          <button
            onClick={calculateLoan}
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Calculate Home Loan
          </button>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {result && (
            <>
              <div className="p-6 bg-zinc-800 rounded-lg border border-zinc-700 space-y-4">
                <div className="text-center">
                  <p className="text-sm text-zinc-400 mb-1">Monthly EMI</p>
                  <p className="text-3xl font-bold text-green-400">{formatCurrency(result.emi)}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-700">
                  <div className="text-center">
                    <p className="text-sm text-zinc-400 mb-1">Total Interest</p>
                    <p className="text-xl font-semibold text-yellow-400">{formatCurrency(result.totalInterest)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-zinc-400 mb-1">Total Payment</p>
                    <p className="text-xl font-semibold text-blue-400">{formatCurrency(result.totalPayment)}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-700 text-center">
                  <p className="text-sm text-zinc-400 mb-1">Max Loan Eligibility</p>
                  <p className="text-xl font-semibold text-purple-400">{formatCurrency(result.maxLoan)}</p>
                  <p className="text-xs text-zinc-500 mt-1">Based on 60% FOIR (Fixed Obligation to Income Ratio)</p>
                </div>
              </div>

              <div className="p-4 bg-green-900/20 rounded-lg border border-green-700/50">
                <h3 className="text-sm font-medium text-green-400 mb-3">Tax Benefits (Old Regime)</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-zinc-400">Section 80C (Principal)</p>
                    <p className="text-white font-medium">Up to {formatCurrency(result.taxBenefit80C)}/year</p>
                  </div>
                  <div>
                    <p className="text-zinc-400">Section 24 (Interest)</p>
                    <p className="text-white font-medium">Up to {formatCurrency(result.taxBenefit24)}/year</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Bank Rates Reference */}
          <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <h3 className="text-sm font-medium text-zinc-300 mb-3">Bank Interest Rates (as of 2024)</h3>
            <div className="grid grid-cols-2 gap-2">
              {BANK_RATES.map((bank) => (
                <button
                  key={bank.name}
                  onClick={() => setRate(bank.rate.toString())}
                  className="text-left px-3 py-2 text-sm bg-zinc-700/50 hover:bg-zinc-700 rounded transition-colors"
                >
                  <span className="text-zinc-400">{bank.name}</span>
                  <span className="float-right text-green-400">{bank.rate}%</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(HomeLoanCalculatorIndia);
