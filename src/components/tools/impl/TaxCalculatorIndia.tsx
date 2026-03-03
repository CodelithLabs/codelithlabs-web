'use client';
import { useState , memo } from 'react';
import { Receipt, IndianRupee } from 'lucide-react';

const TaxCalculatorIndiaComponent = function TaxCalculatorIndia() {
  const [income, setIncome] = useState('1200000');
  const [regime, setRegime] = useState<'old' | 'new'>('new');
  const [deductions80c, setDeductions80c] = useState('150000');
  const [hra, setHra] = useState('0');
  const [result, setResult] = useState<{ tax: number; cess: number; total: number; effective: number; slabs: { slab: string; amount: number; tax: number }[] } | null>(null);

  const calculate = () => {
    const gross = parseFloat(income) || 0;
    let taxableIncome = gross;
    const slabs: { slab: string; amount: number; tax: number }[] = [];

    if (regime === 'old') {
      const d80c = Math.min(parseFloat(deductions80c) || 0, 150000);
      const hraD = parseFloat(hra) || 0;
      taxableIncome = Math.max(0, gross - d80c - hraD - 50000); // 50k std deduction
    } else {
      taxableIncome = Math.max(0, gross - 75000); // New regime std deduction
    }

    let tax = 0;
    if (regime === 'new') {
      const brackets = [
        { limit: 400000, rate: 0, label: '₹0 - ₹4L' },
        { limit: 400000, rate: 0.05, label: '₹4L - ₹8L' },
        { limit: 400000, rate: 0.10, label: '₹8L - ₹12L' },
        { limit: 400000, rate: 0.15, label: '₹12L - ₹16L' },
        { limit: 400000, rate: 0.20, label: '₹16L - ₹20L' },
        { limit: 400000, rate: 0.25, label: '₹20L - ₹24L' },
        { limit: Infinity, rate: 0.30, label: '₹24L+' },
      ];
      let remaining = taxableIncome;
      brackets.forEach(b => {
        const amount = Math.min(remaining, b.limit);
        if (amount > 0) {
          const t = amount * b.rate;
          tax += t;
          slabs.push({ slab: b.label, amount, tax: t });
        }
        remaining = Math.max(0, remaining - b.limit);
      });
      // Rebate u/s 87A for new regime (income up to 12L)
      if (taxableIncome <= 1200000) tax = 0;
    } else {
      const brackets = [
        { limit: 250000, rate: 0, label: '₹0 - ₹2.5L' },
        { limit: 250000, rate: 0.05, label: '₹2.5L - ₹5L' },
        { limit: 500000, rate: 0.20, label: '₹5L - ₹10L' },
        { limit: Infinity, rate: 0.30, label: '₹10L+' },
      ];
      let remaining = taxableIncome;
      brackets.forEach(b => {
        const amount = Math.min(remaining, b.limit);
        if (amount > 0) {
          const t = amount * b.rate;
          tax += t;
          slabs.push({ slab: b.label, amount, tax: t });
        }
        remaining = Math.max(0, remaining - b.limit);
      });
      if (taxableIncome <= 500000) tax = 0;
    }

    const cess = tax * 0.04;
    const total = tax + cess;
    const effective = gross > 0 ? (total / gross) * 100 : 0;
    setResult({ tax, cess, total, effective, slabs });
  };

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Receipt className="w-4 h-4 inline mr-2" /><strong>India Income Tax Calculator (FY 2025-26):</strong> Calculate tax under both Old and New regime with Section 87A rebate.
      </div>
      <div className="flex gap-2">
        <button onClick={() => setRegime('new')} className={`flex-1 py-3 rounded-lg font-semibold ${regime === 'new' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-gray-400'}`}>New Regime</button>
        <button onClick={() => setRegime('old')} className={`flex-1 py-3 rounded-lg font-semibold ${regime === 'old' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-gray-400'}`}>Old Regime</button>
      </div>
      <div><label className="text-sm font-medium block mb-1">Annual Gross Income</label><div className="relative"><IndianRupee className="absolute left-3 top-3 w-4 h-4 text-gray-400" /><input type="number" value={income} onChange={e => setIncome(e.target.value)} className="w-full bg-zinc-800 text-white p-3 pl-9 rounded-lg border border-zinc-700 focus:border-blue-500" /></div></div>
      {regime === 'old' && (
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-sm block mb-1">Section 80C Deductions</label><input type="number" value={deductions80c} onChange={e => setDeductions80c(e.target.value)} max="150000" className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700" /></div>
          <div><label className="text-sm block mb-1">HRA Exemption</label><input type="number" value={hra} onChange={e => setHra(e.target.value)} className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700" /></div>
        </div>
      )}
      <button onClick={calculate} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">Calculate Tax</button>
      {result && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-400">Income Tax</div><div className="text-lg font-bold text-red-400">{fmt(result.tax)}</div></div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-400">Health Cess (4%)</div><div className="text-lg font-bold text-yellow-400">{fmt(result.cess)}</div></div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-400">Total Tax</div><div className="text-lg font-bold text-red-500">{fmt(result.total)}</div></div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-400">Effective Rate</div><div className="text-lg font-bold text-blue-400">{result.effective.toFixed(1)}%</div></div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <div className="p-3 border-b border-zinc-800 font-semibold text-sm">Tax Slab Breakdown ({regime === 'new' ? 'New' : 'Old'} Regime)</div>
            {result.slabs.map((s, i) => (
              <div key={i} className="flex justify-between px-4 py-2 border-b border-zinc-800/50 text-sm">
                <span className="text-gray-300">{s.slab}</span>
                <span className="text-gray-400">{fmt(s.amount)}</span>
                <span className="font-mono text-red-400">{fmt(s.tax)}</span>
              </div>
            ))}
          </div>
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 text-center"><span className="text-green-400 font-semibold">In-Hand (Monthly): {fmt((parseFloat(income) - result.total) / 12)}</span></div>
        </>
      )}
    </div>
  );
}

export default memo(TaxCalculatorIndiaComponent);
