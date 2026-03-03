'use client';

import { memo, useState, useCallback } from 'react';

interface LoanResult {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  schedule: { month: number; principal: number; interest: number; balance: number }[];
}

const BANK_RATES = [
  { name: 'SBI', rate: 8.85 },
  { name: 'HDFC Bank', rate: 8.75 },
  { name: 'ICICI Bank', rate: 8.90 },
  { name: 'Axis Bank', rate: 8.95 },
  { name: 'Kotak Mahindra', rate: 8.99 },
  { name: 'Bank of Baroda', rate: 8.70 },
  { name: 'Punjab National Bank', rate: 8.95 },
  { name: 'Canara Bank', rate: 8.85 },
];

function CarLoanEmiCalculatorIndia() {
  const [principal, setPrincipal] = useState<string>('800000');
  const [rate, setRate] = useState<string>('8.85');
  const [tenure, setTenure] = useState<string>('5');
  const [result, setResult] = useState<LoanResult | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);

  const calculateEMI = useCallback(() => {
    const P = parseFloat(principal) || 0;
    const annualRate = parseFloat(rate) || 0;
    const years = parseFloat(tenure) || 0;
    
    if (P <= 0 || annualRate <= 0 || years <= 0) {
      setResult(null);
      return;
    }

    const months = years * 12;
    const monthlyRate = annualRate / 12 / 100;
    
    // EMI = P * r * (1+r)^n / ((1+r)^n - 1)
    const emi = P * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - P;

    // Generate amortization schedule
    const schedule: LoanResult['schedule'] = [];
    let balance = P;
    
    for (let month = 1; month <= months; month++) {
      const interest = balance * monthlyRate;
      const principalPaid = emi - interest;
      balance -= principalPaid;
      
      schedule.push({
        month,
        principal: principalPaid,
        interest,
        balance: Math.max(0, balance)
      });
    }

    setResult({ emi, totalInterest, totalPayment, schedule });
  }, [principal, rate, tenure]);

  const formatCurrency = (amount: number) => {
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
              placeholder="e.g., 800000"
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
              placeholder="e.g., 8.85"
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
              placeholder="e.g., 5"
            />
          </div>

          <button
            onClick={calculateEMI}
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Calculate EMI
          </button>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {result && (
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

              <button
                onClick={() => setShowSchedule(!showSchedule)}
                className="w-full py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                {showSchedule ? 'Hide' : 'Show'} Amortization Schedule
              </button>
            </div>
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

      {/* Amortization Schedule */}
      {result && showSchedule && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-zinc-400 border-b border-zinc-700">
                <th className="px-4 py-2 text-left">Month</th>
                <th className="px-4 py-2 text-right">Principal</th>
                <th className="px-4 py-2 text-right">Interest</th>
                <th className="px-4 py-2 text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              {result.schedule.slice(0, 12).map((row) => (
                <tr key={row.month} className="border-b border-zinc-800">
                  <td className="px-4 py-2 text-zinc-300">{row.month}</td>
                  <td className="px-4 py-2 text-right text-green-400">{formatCurrency(row.principal)}</td>
                  <td className="px-4 py-2 text-right text-yellow-400">{formatCurrency(row.interest)}</td>
                  <td className="px-4 py-2 text-right text-zinc-300">{formatCurrency(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {result.schedule.length > 12 && (
            <p className="text-center text-zinc-500 text-sm mt-2">
              Showing first 12 months of {result.schedule.length} total months
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(CarLoanEmiCalculatorIndia);
