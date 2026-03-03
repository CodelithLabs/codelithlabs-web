'use client';
import { useState, useCallback, memo } from 'react';
import { Receipt, IndianRupee, Percent, ArrowLeftRight } from 'lucide-react';

const GstCalculatorIndiaComponent = function GstCalculatorIndia() {
  const [amount, setAmount] = useState('10000');
  const [gstRate, setGstRate] = useState('18');
  const [calcType, setCalcType] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [result, setResult] = useState<{
    baseAmount: number;
    cgst: number;
    sgst: number;
    igst: number;
    totalGst: number;
    totalAmount: number;
  } | null>(null);

  const gstRates = [
    { value: '0', label: '0% (Exempt)' },
    { value: '0.25', label: '0.25% (Rough precious stones)' },
    { value: '3', label: '3% (Gold, Silver)' },
    { value: '5', label: '5% (Essential items)' },
    { value: '12', label: '12% (Standard goods)' },
    { value: '18', label: '18% (Most services)' },
    { value: '28', label: '28% (Luxury items)' },
  ];

  const calculate = useCallback(() => {
    const inputAmount = parseFloat(amount) || 0;
    const rate = parseFloat(gstRate) || 0;

    let baseAmount: number;
    let totalGst: number;
    let totalAmount: number;

    if (calcType === 'exclusive') {
      // Amount is without GST, add GST
      baseAmount = inputAmount;
      totalGst = (baseAmount * rate) / 100;
      totalAmount = baseAmount + totalGst;
    } else {
      // Amount includes GST, extract GST
      totalAmount = inputAmount;
      baseAmount = (inputAmount * 100) / (100 + rate);
      totalGst = totalAmount - baseAmount;
    }

    // Split into CGST and SGST (for intra-state) or IGST (for inter-state)
    const halfGst = totalGst / 2;

    setResult({
      baseAmount: Math.round(baseAmount * 100) / 100,
      cgst: Math.round(halfGst * 100) / 100,
      sgst: Math.round(halfGst * 100) / 100,
      igst: Math.round(totalGst * 100) / 100,
      totalGst: Math.round(totalGst * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
    });
  }, [amount, gstRate, calcType]);

  const formatINR = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Receipt className="w-4 h-4 inline mr-2" />
        <strong>GST Calculator (India):</strong> Calculate GST for any amount. Supports all GST rates and shows CGST/SGST or IGST breakdown.
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Amount (₹)</label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-zinc-800 text-white p-3 pl-9 rounded-lg border border-zinc-700 focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">GST Rate</label>
          <div className="relative">
            <Percent className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
            <select
              value={gstRate}
              onChange={(e) => setGstRate(e.target.value)}
              className="w-full bg-zinc-800 text-white p-3 pl-9 rounded-lg border border-zinc-700"
            >
              {gstRates.map(rate => (
                <option key={rate.value} value={rate.value}>{rate.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">Calculation Type</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setCalcType('exclusive')}
            className={`p-3 rounded-lg border text-center transition-colors ${
              calcType === 'exclusive'
                ? 'bg-blue-900/30 border-blue-500/50 text-white'
                : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
            }`}
          >
            <div className="font-medium">Add GST</div>
            <div className="text-xs mt-1">Amount is without GST</div>
          </button>
          <button
            onClick={() => setCalcType('inclusive')}
            className={`p-3 rounded-lg border text-center transition-colors ${
              calcType === 'inclusive'
                ? 'bg-blue-900/30 border-blue-500/50 text-white'
                : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
            }`}
          >
            <div className="font-medium">Extract GST</div>
            <div className="text-xs mt-1">Amount includes GST</div>
          </button>
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
      >
        <ArrowLeftRight className="w-4 h-4" />
        Calculate GST
      </button>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded-lg p-4 text-center">
              <div className="text-xs text-zinc-400 mb-1">Base Amount</div>
              <div className="text-xl font-bold text-white">{formatINR(result.baseAmount)}</div>
            </div>
            <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-500/30 rounded-lg p-4 text-center">
              <div className="text-xs text-zinc-400 mb-1">Total Amount</div>
              <div className="text-xl font-bold text-green-400">{formatINR(result.totalAmount)}</div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              GST Breakdown
            </h4>
            
            <div className="space-y-3">
              <div className="p-3 bg-zinc-800 rounded-lg">
                <div className="text-xs text-zinc-400 mb-1">For Intra-State (Within same state)</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">CGST ({parseFloat(gstRate) / 2}%)</span>
                    <span className="text-white">{formatINR(result.cgst)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">SGST ({parseFloat(gstRate) / 2}%)</span>
                    <span className="text-white">{formatINR(result.sgst)}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-zinc-800 rounded-lg">
                <div className="text-xs text-zinc-400 mb-1">For Inter-State (Different states)</div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">IGST ({gstRate}%)</span>
                  <span className="text-white">{formatINR(result.igst)}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-700">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-300 font-medium">Total GST</span>
                  <span className="text-blue-400 font-bold">{formatINR(result.totalGst)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-400">
            <strong className="text-zinc-300">Note:</strong> CGST (Central) + SGST (State) applies for intra-state transactions. IGST applies for inter-state transactions or imports. The total GST amount remains the same.
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(GstCalculatorIndiaComponent);
