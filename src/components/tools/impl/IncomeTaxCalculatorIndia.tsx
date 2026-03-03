'use client';

import { memo, useState, useCallback } from 'react';

interface TaxResult {
  oldRegime: {
    taxableIncome: number;
    tax: number;
    cess: number;
    totalTax: number;
  };
  newRegime: {
    taxableIncome: number;
    tax: number;
    cess: number;
    totalTax: number;
  };
  savings: number;
  betterRegime: 'old' | 'new';
}

const OLD_REGIME_SLABS = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 500000, rate: 5 },
  { min: 500000, max: 1000000, rate: 20 },
  { min: 1000000, max: Infinity, rate: 30 },
];

const NEW_REGIME_SLABS = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300000, max: 700000, rate: 5 },
  { min: 700000, max: 1000000, rate: 10 },
  { min: 1000000, max: 1200000, rate: 15 },
  { min: 1200000, max: 1500000, rate: 20 },
  { min: 1500000, max: Infinity, rate: 30 },
];

function IncomeTaxCalculatorIndia() {
  const [grossIncome, setGrossIncome] = useState<string>('1200000');
  const [hra, setHra] = useState<string>('200000');
  const [section80C, setSection80C] = useState<string>('150000');
  const [section80D, setSection80D] = useState<string>('25000');
  const [nps80CCD, setNps80CCD] = useState<string>('50000');
  const [homeLoanInterest, setHomeLoanInterest] = useState<string>('0');
  const [otherDeductions, setOtherDeductions] = useState<string>('0');
  const [result, setResult] = useState<TaxResult | null>(null);

  const calculateTax = useCallback((income: number, slabs: typeof OLD_REGIME_SLABS) => {
    let tax = 0;
    let remaining = income;

    for (const slab of slabs) {
      if (remaining <= 0) break;
      const taxableInSlab = Math.min(remaining, slab.max - slab.min);
      tax += taxableInSlab * slab.rate / 100;
      remaining -= taxableInSlab;
    }

    return tax;
  }, []);

  const calculate = useCallback(() => {
    const gross = parseFloat(grossIncome) || 0;
    const hraDeduction = Math.min(parseFloat(hra) || 0, gross * 0.5);
    const sec80C = Math.min(parseFloat(section80C) || 0, 150000);
    const sec80D = Math.min(parseFloat(section80D) || 0, 75000);
    const nps = Math.min(parseFloat(nps80CCD) || 0, 50000);
    const homeLoan = Math.min(parseFloat(homeLoanInterest) || 0, 200000);
    const others = parseFloat(otherDeductions) || 0;

    // Old Regime calculation
    const standardDeductionOld = 50000;
    const totalDeductionsOld = standardDeductionOld + hraDeduction + sec80C + sec80D + nps + homeLoan + others;
    const taxableIncomeOld = Math.max(0, gross - totalDeductionsOld);
    let taxOld = calculateTax(taxableIncomeOld, OLD_REGIME_SLABS);
    
    // 87A rebate for old regime (income up to 5L)
    if (taxableIncomeOld <= 500000) {
      taxOld = Math.max(0, taxOld - 12500);
    }
    const cessOld = taxOld * 0.04;

    // New Regime calculation (FY 2024-25)
    const standardDeductionNew = 75000;
    const taxableIncomeNew = Math.max(0, gross - standardDeductionNew);
    let taxNew = calculateTax(taxableIncomeNew, NEW_REGIME_SLABS);
    
    // 87A rebate for new regime (income up to 7L)
    if (taxableIncomeNew <= 700000) {
      taxNew = Math.max(0, taxNew - 25000);
    }
    const cessNew = taxNew * 0.04;

    const totalTaxOld = taxOld + cessOld;
    const totalTaxNew = taxNew + cessNew;

    setResult({
      oldRegime: {
        taxableIncome: taxableIncomeOld,
        tax: taxOld,
        cess: cessOld,
        totalTax: totalTaxOld
      },
      newRegime: {
        taxableIncome: taxableIncomeNew,
        tax: taxNew,
        cess: cessNew,
        totalTax: totalTaxNew
      },
      savings: Math.abs(totalTaxNew - totalTaxOld),
      betterRegime: totalTaxNew <= totalTaxOld ? 'new' : 'old'
    });
  }, [grossIncome, hra, section80C, section80D, nps80CCD, homeLoanInterest, otherDeductions, calculateTax]);

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
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
              Gross Annual Income (₹)
            </label>
            <input
              type="number"
              value={grossIncome}
              onChange={(e) => setGrossIncome(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 1200000"
            />
          </div>

          <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <h3 className="text-sm font-medium text-zinc-300 mb-3">Deductions (Old Regime)</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">HRA Exemption</label>
                  <input
                    type="number"
                    value={hra}
                    onChange={(e) => setHra(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white text-sm"
                    placeholder="200000"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Section 80C</label>
                  <input
                    type="number"
                    value={section80C}
                    onChange={(e) => setSection80C(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white text-sm"
                    placeholder="150000"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Section 80D (Health)</label>
                  <input
                    type="number"
                    value={section80D}
                    onChange={(e) => setSection80D(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white text-sm"
                    placeholder="25000"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">NPS 80CCD(1B)</label>
                  <input
                    type="number"
                    value={nps80CCD}
                    onChange={(e) => setNps80CCD(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white text-sm"
                    placeholder="50000"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Home Loan Interest</label>
                  <input
                    type="number"
                    value={homeLoanInterest}
                    onChange={(e) => setHomeLoanInterest(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white text-sm"
                    placeholder="200000"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Other Deductions</label>
                  <input
                    type="number"
                    value={otherDeductions}
                    onChange={(e) => setOtherDeductions(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white text-sm"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={calculate}
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Compare Tax Regimes
          </button>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {result && (
            <>
              {/* Recommendation */}
              <div className={`p-4 rounded-lg border ${result.betterRegime === 'new' ? 'bg-green-900/20 border-green-700/50' : 'bg-blue-900/20 border-blue-700/50'}`}>
                <p className="text-sm text-zinc-400">Recommended Regime</p>
                <p className={`text-xl font-bold ${result.betterRegime === 'new' ? 'text-green-400' : 'text-blue-400'}`}>
                  {result.betterRegime === 'new' ? 'New Regime' : 'Old Regime'}
                </p>
                <p className="text-sm text-zinc-300 mt-1">
                  Save {formatCurrency(result.savings)} per year
                </p>
              </div>

              {/* Comparison Table */}
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border ${result.betterRegime === 'old' ? 'bg-blue-900/20 border-blue-500' : 'bg-zinc-800 border-zinc-700'}`}>
                  <h3 className="text-sm font-medium text-blue-400 mb-3">Old Regime</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Taxable Income</span>
                      <span className="text-white">{formatCurrency(result.oldRegime.taxableIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Tax</span>
                      <span className="text-white">{formatCurrency(result.oldRegime.tax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Cess (4%)</span>
                      <span className="text-white">{formatCurrency(result.oldRegime.cess)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-zinc-700">
                      <span className="text-zinc-300 font-medium">Total Tax</span>
                      <span className="text-yellow-400 font-bold">{formatCurrency(result.oldRegime.totalTax)}</span>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border ${result.betterRegime === 'new' ? 'bg-green-900/20 border-green-500' : 'bg-zinc-800 border-zinc-700'}`}>
                  <h3 className="text-sm font-medium text-green-400 mb-3">New Regime</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Taxable Income</span>
                      <span className="text-white">{formatCurrency(result.newRegime.taxableIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Tax</span>
                      <span className="text-white">{formatCurrency(result.newRegime.tax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Cess (4%)</span>
                      <span className="text-white">{formatCurrency(result.newRegime.cess)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-zinc-700">
                      <span className="text-zinc-300 font-medium">Total Tax</span>
                      <span className="text-yellow-400 font-bold">{formatCurrency(result.newRegime.totalTax)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Tax Slabs Info */}
          <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <h3 className="text-sm font-medium text-zinc-300 mb-2">FY 2024-25 Tax Slabs</h3>
            <p className="text-xs text-zinc-500">
              New regime: 0-3L (0%), 3-7L (5%), 7-10L (10%), 10-12L (15%), 12-15L (20%), 15L+ (30%)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(IncomeTaxCalculatorIndia);
