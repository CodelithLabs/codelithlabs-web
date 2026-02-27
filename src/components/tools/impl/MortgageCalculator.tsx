// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/tools/impl/MortgageCalculator.tsx
// Mortgage/Loan Calculator - EMI, amortization schedule, interest breakdown
// Comprehensive financial calculations for home loans
// ═══════════════════════════════════════════════════════════════════════════
'use client';

import { useState } from 'react';
import { Home, TrendingUp, DollarSign, Calendar, PieChart } from 'lucide-react';

interface AmortizationEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export default function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState('300000');
  const [interestRate, setInterestRate] = useState('6.5');
  const [loanTerm, setLoanTerm] = useState('30');
  const [downPayment, setDownPayment] = useState('60000');
  
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);
  const [amortization, setAmortization] = useState<AmortizationEntry[]>([]);
  const [showSchedule, setShowSchedule] = useState(false);

  const calculate = () => {
    const principal = parseFloat(loanAmount) - parseFloat(downPayment);
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const numberOfPayments = parseFloat(loanTerm) * 12;

    // Calculate monthly payment using amortization formula
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
                    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    setMonthlyPayment(payment);

    // Calculate total interest and payment
    const total = payment * numberOfPayments;
    const interest = total - principal;
    setTotalInterest(interest);
    setTotalPayment(total);

    // Generate amortization schedule
    const schedule: AmortizationEntry[] = [];
    let balance = principal;

    for (let i = 1; i <= numberOfPayments; i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = payment - interestPayment;
      balance -= principalPayment;

      // Only show first year, last year, and every 12 months
      if (i <= 12 || i > numberOfPayments - 12 || i % 12 === 0) {
        schedule.push({
          month: i,
          payment,
          principal: principalPayment,
          interest: interestPayment,
          balance: Math.max(0, balance),
        });
      }
    }

    setAmortization(schedule);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const principalPercentage = totalInterest && totalPayment
    ? ((totalPayment - totalInterest) / totalPayment) * 100
    : 0;

  return (
    <div className="space-y-6">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Home className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-200">
            <strong>Calculate mortgage payments:</strong> Get monthly EMI, total interest,
            and complete amortization schedule for your home loan or mortgage.
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Loan Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="w-full bg-zinc-800 text-white p-3 pl-10 rounded-lg border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="300000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Down Payment</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                className="w-full bg-zinc-800 text-white p-3 pl-10 rounded-lg border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="60000"
              />
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {((parseFloat(downPayment) / parseFloat(loanAmount)) * 100).toFixed(1)}% of loan amount
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Interest Rate (%)</label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="6.5"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Loan Term (Years)</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                className="w-full bg-zinc-800 text-white p-3 pl-10 rounded-lg border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="30"
              />
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {parseFloat(loanTerm) * 12} monthly payments
            </div>
          </div>

          <button
            onClick={calculate}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            Calculate
          </button>
        </div>

        {/* Results Section */}
        {monthlyPayment !== null && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-blue-500/30 rounded-lg p-6">
              <div className="text-sm text-gray-300 mb-2">Monthly Payment (EMI)</div>
              <div className="text-4xl font-bold text-white mb-4">
                {formatCurrency(monthlyPayment)}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">Principal</div>
                  <div className="font-semibold">{formatCurrency(parseFloat(loanAmount) - parseFloat(downPayment))}</div>
                </div>
                <div>
                  <div className="text-gray-400">Loan Term</div>
                  <div className="font-semibold">{loanTerm} years</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Total Interest</div>
                <div className="text-xl font-bold text-red-400">
                  {totalInterest ? formatCurrency(totalInterest) : '-'}
                </div>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Total Payment</div>
                <div className="text-xl font-bold text-green-400">
                  {totalPayment ? formatCurrency(totalPayment) : '-'}
                </div>
              </div>
            </div>

            {/* Principal vs Interest Chart */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <PieChart className="w-5 h-5 text-blue-500" />
                <span className="font-semibold">Payment Breakdown</span>
              </div>
              <div className="h-8 flex rounded-full overflow-hidden">
                <div
                  className="bg-green-500 flex items-center justify-center text-xs font-semibold"
                  style={{ width: `${principalPercentage}%` }}
                >
                  {principalPercentage > 20 ? `${principalPercentage.toFixed(0)}%` : ''}
                </div>
                <div
                  className="bg-red-500 flex items-center justify-center text-xs font-semibold"
                  style={{ width: `${100 - principalPercentage}%` }}
                >
                  {100 - principalPercentage > 20 ? `${(100 - principalPercentage).toFixed(0)}%` : ''}
                </div>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-green-400">Principal</span>
                <span className="text-red-400">Interest</span>
              </div>
            </div>

            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="w-full py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors text-sm"
            >
              {showSchedule ? 'Hide' : 'Show'} Amortization Schedule
            </button>
          </div>
        )}
      </div>

      {/* Amortization Schedule */}
      {showSchedule && amortization.length > 0 && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-zinc-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold">Amortization Schedule</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-800/50">
                <tr className="text-left text-sm text-gray-400">
                  <th className="p-3">Month</th>
                  <th className="p-3 text-right">Payment</th>
                  <th className="p-3 text-right">Principal</th>
                  <th className="p-3 text-right">Interest</th>
                  <th className="p-3 text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {amortization.map((entry) => (
                  <tr key={entry.month} className="border-t border-zinc-800/50 hover:bg-zinc-800/30 text-sm">
                    <td className="p-3">{entry.month}</td>
                    <td className="p-3 text-right font-mono">{formatCurrency(entry.payment)}</td>
                    <td className="p-3 text-right font-mono text-green-400">{formatCurrency(entry.principal)}</td>
                    <td className="p-3 text-right font-mono text-red-400">{formatCurrency(entry.interest)}</td>
                    <td className="p-3 text-right font-mono">{formatCurrency(entry.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
