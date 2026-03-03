'use client';
import { useState, useCallback, memo } from 'react';
import { Award, IndianRupee, Calendar, Briefcase } from 'lucide-react';

const GratuityCalculatorIndiaComponent = function GratuityCalculatorIndia() {
  const [basicSalary, setBasicSalary] = useState('50000');
  const [daAmount, setDaAmount] = useState('10000');
  const [yearsOfService, setYearsOfService] = useState('10');
  const [monthsExtra, setMonthsExtra] = useState('6');
  const [employeeType, setEmployeeType] = useState<'government' | 'private'>('private');
  const [result, setResult] = useState<{
    gratuity: number;
    effectiveYears: number;
    lastDrawnSalary: number;
    taxExempt: number;
    taxable: number;
  } | null>(null);

  const calculate = useCallback(() => {
    const basic = parseFloat(basicSalary) || 0;
    const da = parseFloat(daAmount) || 0;
    const years = parseFloat(yearsOfService) || 0;
    const months = parseFloat(monthsExtra) || 0;

    // Minimum 5 years of service required
    if (years < 5 && !(years === 4 && months >= 6)) {
      setResult(null);
      return;
    }

    // Calculate effective years (round up if months >= 6)
    const effectiveYears = months >= 6 ? years + 1 : years;

    // Last drawn salary = Basic + DA
    const lastDrawnSalary = basic + da;

    // Gratuity Formula (Payment of Gratuity Act, 1972):
    // For employees covered under Act: (15 × Last Drawn Salary × Years) / 26
    // For employees not covered: (15 × Last Drawn Salary × Years) / 30

    let gratuity: number;
    if (employeeType === 'government') {
      // Government employees: (15 × Salary × Years) / 26
      gratuity = (15 * lastDrawnSalary * effectiveYears) / 26;
    } else {
      // Private sector under Payment of Gratuity Act
      gratuity = (15 * lastDrawnSalary * effectiveYears) / 26;
    }

    // Tax exemption limit (as per current rules - ₹20 lakh)
    const taxExemptLimit = 2000000;
    const taxExempt = Math.min(gratuity, taxExemptLimit);
    const taxable = Math.max(0, gratuity - taxExemptLimit);

    setResult({
      gratuity: Math.round(gratuity),
      effectiveYears,
      lastDrawnSalary,
      taxExempt: Math.round(taxExempt),
      taxable: Math.round(taxable),
    });
  }, [basicSalary, daAmount, yearsOfService, monthsExtra, employeeType]);

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalYears = parseFloat(yearsOfService) || 0;
  const totalMonths = parseFloat(monthsExtra) || 0;
  const isEligible = totalYears >= 5 || (totalYears === 4 && totalMonths >= 6);

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Award className="w-4 h-4 inline mr-2" />
        <strong>Gratuity Calculator (India):</strong> Calculate gratuity as per the Payment of Gratuity Act, 1972. Minimum 5 years of service required.
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Basic Salary (₹/month)</label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
            <input
              type="number"
              value={basicSalary}
              onChange={(e) => setBasicSalary(e.target.value)}
              className="w-full bg-zinc-800 text-white p-3 pl-9 rounded-lg border border-zinc-700 focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Dearness Allowance (₹/month)</label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
            <input
              type="number"
              value={daAmount}
              onChange={(e) => setDaAmount(e.target.value)}
              className="w-full bg-zinc-800 text-white p-3 pl-9 rounded-lg border border-zinc-700 focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Years of Service</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
            <input
              type="number"
              value={yearsOfService}
              onChange={(e) => setYearsOfService(e.target.value)}
              className="w-full bg-zinc-800 text-white p-3 pl-9 rounded-lg border border-zinc-700 focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Additional Months</label>
          <input
            type="number"
            value={monthsExtra}
            onChange={(e) => setMonthsExtra(e.target.value)}
            max="11"
            className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Employee Type</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={employeeType === 'private'}
              onChange={() => setEmployeeType('private')}
              className="w-4 h-4"
            />
            <Briefcase className="w-4 h-4 text-zinc-400" />
            <span className="text-sm text-zinc-300">Private Sector</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={employeeType === 'government'}
              onChange={() => setEmployeeType('government')}
              className="w-4 h-4"
            />
            <span className="text-sm text-zinc-300">Government</span>
          </label>
        </div>
      </div>

      {!isEligible && (
        <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-3 text-sm text-orange-300">
          ⚠️ Minimum 5 years of continuous service required for gratuity eligibility.
        </div>
      )}

      <button
        onClick={calculate}
        disabled={!isEligible}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg flex items-center justify-center gap-2"
      >
        <Award className="w-4 h-4" />
        Calculate Gratuity
      </button>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-500/30 rounded-lg p-4 text-center col-span-2">
              <div className="text-xs text-zinc-400 mb-1">Total Gratuity Amount</div>
              <div className="text-2xl font-bold text-green-400">{formatINR(result.gratuity)}</div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-500/30 rounded-lg p-4 text-center">
              <div className="text-xs text-zinc-400 mb-1">Tax Exempt</div>
              <div className="text-lg font-bold text-blue-400">{formatINR(result.taxExempt)}</div>
            </div>
            <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 border border-orange-500/30 rounded-lg p-4 text-center">
              <div className="text-xs text-zinc-400 mb-1">Taxable</div>
              <div className="text-lg font-bold text-orange-400">{formatINR(result.taxable)}</div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-zinc-300 mb-3">Calculation Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Last Drawn Salary (Basic + DA)</span>
                <span className="text-white">{formatINR(result.lastDrawnSalary)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Effective Years of Service</span>
                <span className="text-white">{result.effectiveYears} years</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-700">
                <span className="text-zinc-400">Formula Used</span>
                <span className="text-white text-xs">(15 × {formatINR(result.lastDrawnSalary)} × {result.effectiveYears}) / 26</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-400">
            <strong className="text-zinc-300">Note:</strong> Gratuity up to ₹20 lakhs is tax-exempt under Section 10(10) of the Income Tax Act. The calculation assumes the employee is covered under the Payment of Gratuity Act, 1972.
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(GratuityCalculatorIndiaComponent);
