// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/tools/impl/LoanCalculator.tsx
// Loan/EMI Calculator - Monthly Payment Estimator
// ═══════════════════════════════════════════════════════════════════════════
'use client';

import { useState, useMemo } from 'react';

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState('100000');
  const [interestRate, setInterestRate] = useState('7');
  const [loanTerm, setLoanTerm] = useState('12');

  // Calculate EMI
  const calculation = useMemo(() => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12; // Monthly rate
    const months = parseFloat(loanTerm);

    if (isNaN(principal) || isNaN(rate) || isNaN(months) || principal <= 0 || months <= 0) {
      return {
        emi: 0,
        totalPayment: 0,
        totalInterest: 0,
        valid: false,
      };
    }

    // EMI formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    let emi = 0;
    if (rate === 0) {
      emi = principal / months;
    } else {
      emi = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    }

    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;

    return {
      emi,
      totalPayment,
      totalInterest,
      valid: true,
    };
  }, [loanAmount, interestRate, loanTerm]);

  return (
    <div className="space-y-6">

      {/* Input Fields */}
      <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6 space-y-4">

        {/* Loan Amount */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-zinc-300">Loan Amount:</label>
            <span className="text-sm font-bold text-white bg-zinc-900 px-3 py-1 rounded-lg">
              ${parseFloat(loanAmount || '0').toLocaleString()}
            </span>
          </div>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3
                     text-white focus:outline-none focus:border-blue-500
                     focus:ring-2 focus:ring-blue-500/20 transition-all"
            placeholder="100000"
          />
          <input
            type="range"
            min="1000"
            max="1000000"
            step="1000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer mt-2 accent-blue-500"
          />
        </div>

        {/* Interest Rate */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-zinc-300">Annual Interest Rate:</label>
            <span className="text-sm font-bold text-white bg-zinc-900 px-3 py-1 rounded-lg">
              {interestRate}%
            </span>
          </div>
          <input
            type="number"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3
                     text-white focus:outline-none focus:border-blue-500
                     focus:ring-2 focus:ring-blue-500/20 transition-all"
            placeholder="7"
          />
          <input
            type="range"
            min="0"
            max="30"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer mt-2 accent-blue-500"
          />
        </div>

        {/* Loan Term */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-zinc-300">Loan Term:</label>
            <span className="text-sm font-bold text-white bg-zinc-900 px-3 py-1 rounded-lg">
              {loanTerm} months ({(parseFloat(loanTerm) / 12).toFixed(1)} years)
            </span>
          </div>
          <input
            type="number"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3
                     text-white focus:outline-none focus:border-blue-500
                     focus:ring-2 focus:ring-blue-500/20 transition-all"
            placeholder="12"
          />
          <input
            type="range"
            min="1"
            max="360"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer mt-2 accent-blue-500"
          />
        </div>

        {/* Quick Presets */}
        <div className="pt-2">
          <div className="text-xs text-zinc-500 mb-2">Quick Presets:</div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: '12 mo', value: '12' },
              { label: '24 mo', value: '24' },
              { label: '36 mo', value: '36' },
              { label: '5 yrs', value: '60' },
              { label: '10 yrs', value: '120' },
              { label: '15 yrs', value: '180' },
              { label: '20 yrs', value: '240' },
              { label: '30 yrs', value: '360' },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => setLoanTerm(preset.value)}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  loanTerm === preset.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Results */}
      {calculation.valid && (
        <>
          {/* EMI Result */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-6">
            <div className="text-center space-y-2">
              <div className="text-sm text-zinc-400">Monthly EMI Payment</div>
              <div className="text-4xl font-bold text-blue-400">
                ${calculation.emi.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-zinc-500">Per month for {loanTerm} months</div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="grid md:grid-cols-3 gap-4">

            {/* Principal */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 text-center">
              <div className="text-xs text-zinc-500 mb-1">Loan Amount</div>
              <div className="text-2xl font-bold text-green-400">
                ${parseFloat(loanAmount).toLocaleString()}
              </div>
            </div>

            {/* Interest */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 text-center">
              <div className="text-xs text-zinc-500 mb-1">Total Interest</div>
              <div className="text-2xl font-bold text-orange-400">
                ${calculation.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            {/* Total */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 text-center">
              <div className="text-xs text-zinc-500 mb-1">Total Payment</div>
              <div className="text-2xl font-bold text-purple-400">
                ${calculation.totalPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

          </div>

          {/* Visual Breakdown */}
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
            <h3 className="text-sm font-bold text-white mb-3">Payment Breakdown:</h3>
            <div className="flex h-8 rounded-lg overflow-hidden">
              <div
                className="bg-green-500 flex items-center justify-center text-xs font-bold text-white"
                style={{ width: `${(parseFloat(loanAmount) / calculation.totalPayment) * 100}%` }}
              >
                Principal
              </div>
              <div
                className="bg-orange-500 flex items-center justify-center text-xs font-bold text-white"
                style={{ width: `${(calculation.totalInterest / calculation.totalPayment) * 100}%` }}
              >
                Interest
              </div>
            </div>
            <div className="flex justify-between text-xs text-zinc-500 mt-2">
              <span>{((parseFloat(loanAmount) / calculation.totalPayment) * 100).toFixed(1)}% Principal</span>
              <span>{((calculation.totalInterest / calculation.totalPayment) * 100).toFixed(1)}% Interest</span>
            </div>
          </div>
        </>
      )}

      {/* Info Notice */}
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-sm text-purple-300 flex gap-3">
        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>
          <strong>Note:</strong> This calculator provides estimates only. Actual loan terms may include
          additional fees, insurance, and other costs. Consult with a financial advisor for accurate information.
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-300 flex gap-3">
        <span className="text-xl">🔒</span>
        <p>
          <strong>100% Client-Side:</strong> All calculations happen in your browser.
          No financial data is sent to our servers.
        </p>
      </div>

    </div>
  );
}
