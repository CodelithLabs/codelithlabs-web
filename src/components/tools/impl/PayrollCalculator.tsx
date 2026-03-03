'use client';

import { memo, useState, useCallback } from 'react';

interface PayrollResult {
  basicSalary: number;
  hra: number;
  otherAllowances: number;
  grossSalary: number;
  pfEmployee: number;
  pfEmployer: number;
  esiEmployee: number;
  esiEmployer: number;
  professionalTax: number;
  netSalary: number;
  ctc: number;
}

function PayrollCalculator() {
  const [basicSalary, setBasicSalary] = useState('');
  const [hraPercent, setHraPercent] = useState('40');
  const [otherAllowances, setOtherAllowances] = useState('0');
  const [result, setResult] = useState<PayrollResult | null>(null);

  const handleCalculate = useCallback(() => {
    const basic = parseFloat(basicSalary) || 0;
    const hraPerc = parseFloat(hraPercent) || 40;
    const other = parseFloat(otherAllowances) || 0;

    if (basic <= 0) {
      setResult(null);
      return;
    }

    const hra = basic * (hraPerc / 100);
    const grossSalary = basic + hra + other;

    // PF: 12% of basic (capped at 15000)
    const pfBasic = Math.min(basic, 15000);
    const pfEmployee = pfBasic * 0.12;
    const pfEmployer = pfBasic * 0.12;

    // ESI: applicable if gross <= 21000
    let esiEmployee = 0;
    let esiEmployer = 0;
    if (grossSalary <= 21000) {
      esiEmployee = grossSalary * 0.0075;
      esiEmployer = grossSalary * 0.0325;
    }

    // Professional Tax (Karnataka example)
    let professionalTax = 0;
    if (grossSalary > 15000) professionalTax = 200;
    else if (grossSalary > 10000) professionalTax = 150;

    const totalDeductions = pfEmployee + esiEmployee + professionalTax;
    const netSalary = grossSalary - totalDeductions;
    const ctc = grossSalary + pfEmployer + esiEmployer;

    setResult({
      basicSalary: basic,
      hra,
      otherAllowances: other,
      grossSalary,
      pfEmployee,
      pfEmployer,
      esiEmployee,
      esiEmployer,
      professionalTax,
      netSalary,
      ctc,
    });
  }, [basicSalary, hraPercent, otherAllowances]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Indian Payroll Calculator</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Basic Salary (₹/month)</label>
            <input
              type="number"
              value={basicSalary}
              onChange={(e) => setBasicSalary(e.target.value)}
              placeholder="e.g., 30000"
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">HRA Percentage (%)</label>
            <input
              type="number"
              value={hraPercent}
              onChange={(e) => setHraPercent(e.target.value)}
              placeholder="e.g., 40"
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Other Allowances (₹)</label>
            <input
              type="number"
              value={otherAllowances}
              onChange={(e) => setOtherAllowances(e.target.value)}
              placeholder="e.g., 5000"
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleCalculate}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Calculate Payroll
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Payroll Breakdown</h3>
          <div className="space-y-4">
            <div className="bg-zinc-900 rounded-lg p-4">
              <h4 className="text-green-400 font-medium mb-2">Earnings</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Basic Salary</span>
                  <span className="text-white">₹{result.basicSalary.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">HRA</span>
                  <span className="text-white">₹{result.hra.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Other Allowances</span>
                  <span className="text-white">₹{result.otherAllowances.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-zinc-700 pt-2">
                  <span className="text-zinc-300 font-medium">Gross Salary</span>
                  <span className="text-green-400 font-medium">₹{result.grossSalary.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4">
              <h4 className="text-red-400 font-medium mb-2">Deductions</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">PF (Employee)</span>
                  <span className="text-white">₹{result.pfEmployee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">ESI (Employee)</span>
                  <span className="text-white">₹{result.esiEmployee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Professional Tax</span>
                  <span className="text-white">₹{result.professionalTax.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4">
              <h4 className="text-blue-400 font-medium mb-2">Employer Contributions</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">PF (Employer)</span>
                  <span className="text-white">₹{result.pfEmployer.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">ESI (Employer)</span>
                  <span className="text-white">₹{result.esiEmployer.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center py-3 border-t border-zinc-700">
              <span className="text-zinc-300 font-medium">Net Salary (Take Home)</span>
              <span className="text-green-400 font-mono text-xl">₹{result.netSalary.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-t border-zinc-700">
              <span className="text-zinc-300 font-medium">Cost to Company (CTC)</span>
              <span className="text-yellow-400 font-mono text-xl">₹{result.ctc.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(PayrollCalculator);
