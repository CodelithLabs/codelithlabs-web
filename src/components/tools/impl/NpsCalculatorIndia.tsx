'use client';
import { useState, useCallback, memo } from 'react';
import { PiggyBank, IndianRupee, TrendingUp, Shield } from 'lucide-react';

interface NpsResult {
  totalInvestment: number;
  expectedCorpus: number;
  pensionCorpus: number;
  lumpsum: number;
  monthlyPension: number;
  taxSaved80CCD1: number;
  taxSaved80CCD1B: number;
  totalTaxSaved: number;
}

const NpsCalculatorIndiaComponent = function NpsCalculatorIndia() {
  const [monthlyContribution, setMonthlyContribution] = useState('5000');
  const [currentAge, setCurrentAge] = useState('30');
  const [retirementAge, setRetirementAge] = useState('60');
  const [expectedReturn, setExpectedReturn] = useState('10');
  const [annuityPercent, setAnnuityPercent] = useState('40');
  const [annuityReturn, setAnnuityReturn] = useState('6');
  const [taxSlab, setTaxSlab] = useState('30');
  const [result, setResult] = useState<NpsResult | null>(null);

  const calculate = useCallback(() => {
    const monthly = parseFloat(monthlyContribution) || 0;
    const current = parseFloat(currentAge) || 0;
    const retirement = parseFloat(retirementAge) || 0;
    const returnRate = (parseFloat(expectedReturn) || 0) / 100 / 12;
    const annuityPct = (parseFloat(annuityPercent) || 40) / 100;
    const annuityRate = (parseFloat(annuityReturn) || 6) / 100;
    const slab = (parseFloat(taxSlab) || 30) / 100;

    const years = retirement - current;
    const months = years * 12;

    if (months <= 0 || monthly <= 0) return;

    // Future Value of SIP
    // FV = P × [(1+r)^n - 1] / r × (1+r)
    const compoundFactor = Math.pow(1 + returnRate, months);
    const expectedCorpus = monthly * ((compoundFactor - 1) / returnRate) * (1 + returnRate);

    const totalInvestment = monthly * months;

    // At retirement, minimum 40% must be used for annuity
    const pensionCorpus = expectedCorpus * annuityPct;
    const lumpsum = expectedCorpus * (1 - annuityPct);

    // Monthly pension from annuity (simplified calculation)
    const monthlyPension = (pensionCorpus * annuityRate) / 12;

    // Tax benefits
    // Section 80CCD(1): Up to 10% of salary (max ₹1.5L under 80C)
    // Section 80CCD(1B): Additional ₹50,000
    const annual = monthly * 12;
    const taxSaved80CCD1 = Math.min(annual, 150000) * slab;
    const taxSaved80CCD1B = Math.min(annual, 50000) * slab;
    const totalTaxSaved = taxSaved80CCD1 + taxSaved80CCD1B;

    setResult({
      totalInvestment: Math.round(totalInvestment),
      expectedCorpus: Math.round(expectedCorpus),
      pensionCorpus: Math.round(pensionCorpus),
      lumpsum: Math.round(lumpsum),
      monthlyPension: Math.round(monthlyPension),
      taxSaved80CCD1: Math.round(taxSaved80CCD1),
      taxSaved80CCD1B: Math.round(taxSaved80CCD1B),
      totalTaxSaved: Math.round(totalTaxSaved),
    });
  }, [monthlyContribution, currentAge, retirementAge, expectedReturn, annuityPercent, annuityReturn, taxSlab]);

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
        <PiggyBank className="w-4 h-4 inline mr-2" />
        <strong>NPS Calculator (India):</strong> Plan your retirement with National Pension System. Calculate corpus, pension, and tax benefits.
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Monthly Contribution (₹)</label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
            <input
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(e.target.value)}
              className="w-full bg-zinc-800 text-white p-3 pl-9 rounded-lg border border-zinc-700 focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Expected Return (%/year)</label>
          <select
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(e.target.value)}
            className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700"
          >
            <option value="8">8% (Conservative - Govt bonds)</option>
            <option value="10">10% (Moderate - Mixed)</option>
            <option value="12">12% (Aggressive - Equity)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Current Age</label>
          <input
            type="number"
            value={currentAge}
            onChange={(e) => setCurrentAge(e.target.value)}
            min="18"
            max="65"
            className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Retirement Age</label>
          <input
            type="number"
            value={retirementAge}
            onChange={(e) => setRetirementAge(e.target.value)}
            min="60"
            max="70"
            className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Annuity Allocation (%)</label>
          <select
            value={annuityPercent}
            onChange={(e) => setAnnuityPercent(e.target.value)}
            className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700"
          >
            <option value="40">40% (Minimum required)</option>
            <option value="50">50%</option>
            <option value="60">60%</option>
            <option value="80">80%</option>
            <option value="100">100%</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Tax Slab</label>
          <select
            value={taxSlab}
            onChange={(e) => setTaxSlab(e.target.value)}
            className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700"
          >
            <option value="0">0% (No tax)</option>
            <option value="5">5%</option>
            <option value="20">20%</option>
            <option value="30">30%</option>
          </select>
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
      >
        <TrendingUp className="w-4 h-4" />
        Calculate NPS
      </button>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-500/30 rounded-lg p-4 text-center">
              <div className="text-xs text-zinc-400 mb-1">Expected Corpus</div>
              <div className="text-xl font-bold text-green-400">{formatINR(result.expectedCorpus)}</div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-500/30 rounded-lg p-4 text-center">
              <div className="text-xs text-zinc-400 mb-1">Monthly Pension</div>
              <div className="text-xl font-bold text-blue-400">{formatINR(result.monthlyPension)}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-500/30 rounded-lg p-4 text-center">
              <div className="text-xs text-zinc-400 mb-1">Lumpsum at 60</div>
              <div className="text-xl font-bold text-purple-400">{formatINR(result.lumpsum)}</div>
            </div>
            <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 border border-orange-500/30 rounded-lg p-4 text-center">
              <div className="text-xs text-zinc-400 mb-1">Total Invested</div>
              <div className="text-xl font-bold text-orange-400">{formatINR(result.totalInvestment)}</div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Tax Benefits (Annual)
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Section 80CCD(1) - Up to ₹1.5L</span>
                <span className="text-green-400">{formatINR(result.taxSaved80CCD1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Section 80CCD(1B) - Additional ₹50K</span>
                <span className="text-green-400">{formatINR(result.taxSaved80CCD1B)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-700">
                <span className="text-zinc-300 font-medium">Total Tax Saved/Year</span>
                <span className="text-green-400 font-bold">{formatINR(result.totalTaxSaved)}</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-400">
            <strong className="text-zinc-300">Note:</strong> NPS requires minimum 40% corpus to be used for annuity purchase. 60% can be withdrawn tax-free as lumpsum. Returns depend on asset allocation (Equity/Debt/Govt Securities). Actual pension depends on annuity rates at retirement.
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(NpsCalculatorIndiaComponent);
