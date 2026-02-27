'use client';
import { useState } from 'react';
import { TrendingUp, DollarSign, PieChart } from 'lucide-react';

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('10000');
  const [rate, setRate] = useState('8');
  const [time, setTime] = useState('10');
  const [compound, setCompound] = useState('12');
  const [monthlyAdd, setMonthlyAdd] = useState('500');
  const [result, setResult] = useState<{ total: number; interest: number; invested: number; yearlyBreakdown: { year: number; balance: number; interest: number }[] } | null>(null);

  const calculate = () => {
    const P = parseFloat(principal) || 0;
    const r = (parseFloat(rate) || 0) / 100;
    const t = parseFloat(time) || 0;
    const n = parseFloat(compound) || 12;
    const m = parseFloat(monthlyAdd) || 0;
    
    let balance = P;
    const yearlyBreakdown: { year: number; balance: number; interest: number }[] = [];
    const totalInvested = P + m * 12 * t;

    for (let year = 1; year <= t; year++) {
      for (let month = 0; month < 12; month++) {
        balance += m;
        balance *= (1 + r / n);
      }
      yearlyBreakdown.push({ year, balance, interest: balance - P - m * 12 * year });
    }

    setResult({ total: balance, interest: balance - totalInvested, invested: totalInvested, yearlyBreakdown });
  };

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <TrendingUp className="w-4 h-4 inline mr-2" /><strong>Compound Interest Calculator:</strong> See how your investments grow over time with compound interest and monthly contributions.
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="text-sm font-medium block mb-1">Initial Investment</label><div className="relative"><DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" /><input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} className="w-full bg-zinc-800 text-white p-3 pl-9 rounded-lg border border-zinc-700 focus:border-blue-500" /></div></div>
        <div><label className="text-sm font-medium block mb-1">Monthly Contribution</label><div className="relative"><DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" /><input type="number" value={monthlyAdd} onChange={e => setMonthlyAdd(e.target.value)} className="w-full bg-zinc-800 text-white p-3 pl-9 rounded-lg border border-zinc-700 focus:border-blue-500" /></div></div>
        <div><label className="text-sm font-medium block mb-1">Annual Interest Rate (%)</label><input type="number" value={rate} onChange={e => setRate(e.target.value)} step="0.1" className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:border-blue-500" /></div>
        <div><label className="text-sm font-medium block mb-1">Time Period (Years)</label><input type="number" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:border-blue-500" /></div>
      </div>
      <div><label className="text-sm font-medium block mb-1">Compound Frequency</label>
        <select value={compound} onChange={e => setCompound(e.target.value)} className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700">
          <option value="1">Annually</option><option value="4">Quarterly</option><option value="12">Monthly</option><option value="365">Daily</option>
        </select>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">Calculate</button>
      {result && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-500/30 rounded-lg p-4 text-center"><div className="text-xs text-gray-400 mb-1">Total Value</div><div className="text-xl font-bold text-green-400">{fmt(result.total)}</div></div>
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-500/30 rounded-lg p-4 text-center"><div className="text-xs text-gray-400 mb-1">Total Invested</div><div className="text-xl font-bold text-blue-400">{fmt(result.invested)}</div></div>
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-500/30 rounded-lg p-4 text-center"><div className="text-xs text-gray-400 mb-1">Interest Earned</div><div className="text-xl font-bold text-purple-400">{fmt(result.interest)}</div></div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3"><PieChart className="w-4 h-4 text-blue-500" /><span className="font-semibold text-sm">Year-by-Year Growth</span></div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {result.yearlyBreakdown.map(y => (
                <div key={y.year} className="flex items-center gap-3 text-sm">
                  <span className="w-12 text-gray-500">Yr {y.year}</span>
                  <div className="flex-1 bg-zinc-800 rounded-full h-4 overflow-hidden"><div className="bg-blue-500 h-full" style={{ width: `${(y.balance / result.total) * 100}%` }} /></div>
                  <span className="font-mono w-28 text-right">{fmt(y.balance)}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
