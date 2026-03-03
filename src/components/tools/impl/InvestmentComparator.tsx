'use client';
import { useState , memo } from 'react';
import { TrendingUp, BarChart3 } from 'lucide-react';

const InvestmentComparatorComponent = function InvestmentComparator() {
  const [amount, setAmount] = useState('100000');
  const [years, setYears] = useState('10');
  const [results, setResults] = useState<{ name: string; rate: number; final: number; interest: number; color: string }[]>([]);

  const investments = [
    { name: 'Fixed Deposit', rate: 7.0, color: 'bg-blue-500' },
    { name: 'PPF', rate: 7.1, color: 'bg-green-500' },
    { name: 'NPS (Equity)', rate: 10.0, color: 'bg-purple-500' },
    { name: 'Gold', rate: 8.0, color: 'bg-yellow-500' },
    { name: 'Nifty 50 Index', rate: 12.0, color: 'bg-red-500' },
    { name: 'Savings Account', rate: 3.5, color: 'bg-gray-500' },
    { name: 'Real Estate (avg)', rate: 9.0, color: 'bg-orange-500' },
    { name: 'Recurring Deposit', rate: 6.5, color: 'bg-teal-500' },
  ];

  const compare = () => {
    const p = parseFloat(amount) || 0;
    const t = parseFloat(years) || 1;
    const res = investments.map(inv => {
      const final = p * Math.pow(1 + inv.rate / 100, t);
      return { name: inv.name, rate: inv.rate, final, interest: final - p, color: inv.color };
    }).sort((a, b) => b.final - a.final);
    setResults(res);
  };

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <TrendingUp className="w-4 h-4 inline mr-2" /><strong>Investment Comparator (India):</strong> Compare returns across FD, PPF, NPS, Gold, Nifty 50, and more. Rates are approximate averages.
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="text-sm block mb-1">Lump Sum Investment (₹)</label><input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700" /></div>
        <div><label className="text-sm block mb-1">Investment Period (Years)</label><input type="number" value={years} onChange={e => setYears(e.target.value)} min="1" max="50" className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700" /></div>
      </div>
      <button onClick={compare} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2"><BarChart3 className="w-4 h-4" />Compare Investments</button>
      {results.length > 0 && (
        <div className="space-y-3">
          <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-500/30 rounded-lg p-4 text-center">
            <div className="text-xs text-gray-400 mb-1">Best Return: {results[0].name}</div>
            <div className="text-3xl font-bold text-green-400">{fmt(results[0].final)}</div>
            <div className="text-sm text-green-300/70">+{fmt(results[0].interest)} interest ({results[0].rate}% p.a.)</div>
          </div>
          <div className="space-y-2">
            {results.map((r, i) => {
              const maxFinal = results[0].final;
              return (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{i + 1}. {r.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-700 text-gray-300">{r.rate}% p.a.</span>
                    </div>
                    <span className="font-mono text-sm font-bold text-green-400">{fmt(r.final)}</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                    <div className={`${r.color} h-full rounded-full transition-all`} style={{ width: `${(r.final / maxFinal) * 100}%` }} />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Interest earned: {fmt(r.interest)}</div>
                </div>
              );
            })}
          </div>
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 text-xs text-yellow-200">
            ⚠️ Returns shown are based on historical averages and not guaranteed. Always consult a SEBI-registered financial advisor.
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(InvestmentComparatorComponent);
