'use client';
import { useState } from 'react';
import { Percent, Calculator } from 'lucide-react';

export default function ProfitMarginCalculator() {
  const [cost, setCost] = useState('');
  const [revenue, setRevenue] = useState('');
  const [result, setResult] = useState<{ grossProfit: number; grossMargin: number; markup: number; costRatio: number } | null>(null);

  const calculate = () => {
    const c = parseFloat(cost) || 0;
    const r = parseFloat(revenue) || 0;
    if (r === 0) return;
    const grossProfit = r - c;
    const grossMargin = (grossProfit / r) * 100;
    const markup = c > 0 ? (grossProfit / c) * 100 : 0;
    const costRatio = (c / r) * 100;
    setResult({ grossProfit, grossMargin, markup, costRatio });
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Percent className="w-4 h-4 inline mr-2" /><strong>Profit Margin Calculator:</strong> Calculate gross profit, margin percentage, and markup from cost and revenue.
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="text-sm block mb-1">Cost / COGS ($)</label><input type="number" value={cost} onChange={e => setCost(e.target.value)} placeholder="e.g. 60" className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700" /></div>
        <div><label className="text-sm block mb-1">Revenue / Selling Price ($)</label><input type="number" value={revenue} onChange={e => setRevenue(e.target.value)} placeholder="e.g. 100" className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700" /></div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2"><Calculator className="w-4 h-4" />Calculate Margins</button>
      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center"><div className="text-xs text-gray-400">Gross Profit</div><div className={`text-2xl font-bold ${result.grossProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>${result.grossProfit.toFixed(2)}</div></div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center"><div className="text-xs text-gray-400">Profit Margin</div><div className={`text-2xl font-bold ${result.grossMargin >= 0 ? 'text-green-400' : 'text-red-400'}`}>{result.grossMargin.toFixed(1)}%</div></div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center"><div className="text-xs text-gray-400">Markup</div><div className="text-2xl font-bold text-blue-400">{result.markup.toFixed(1)}%</div></div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center"><div className="text-xs text-gray-400">Cost Ratio</div><div className="text-2xl font-bold text-yellow-400">{result.costRatio.toFixed(1)}%</div></div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="text-sm font-semibold mb-3">Revenue Breakdown</div>
            <div className="w-full h-8 rounded-full overflow-hidden flex">
              {result.grossProfit >= 0 ? (<><div className="bg-red-500/70 h-full flex items-center justify-center text-xs text-white font-medium" style={{ width: `${result.costRatio}%` }}>Cost {result.costRatio.toFixed(0)}%</div><div className="bg-green-500/70 h-full flex items-center justify-center text-xs text-white font-medium" style={{ width: `${result.grossMargin}%` }}>Profit {result.grossMargin.toFixed(0)}%</div></>) : (
                <div className="bg-red-500 h-full w-full flex items-center justify-center text-xs text-white font-medium">Loss: ${Math.abs(result.grossProfit).toFixed(2)}</div>
              )}
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-sm">
            <div className="font-semibold mb-2">Quick Reference</div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              <div><strong className="text-white">Margin</strong> = (Profit ÷ Revenue) × 100</div>
              <div><strong className="text-white">Markup</strong> = (Profit ÷ Cost) × 100</div>
              <div><strong className="text-white">20% margin</strong> = 25% markup</div>
              <div><strong className="text-white">50% margin</strong> = 100% markup</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
