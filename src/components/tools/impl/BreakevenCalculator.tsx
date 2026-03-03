'use client';
import { useState , memo } from 'react';
import { BarChart3, Calculator } from 'lucide-react';

const BreakevenCalculatorComponent = function BreakevenCalculator() {
  const [fixedCosts, setFixedCosts] = useState('50000');
  const [variableCost, setVariableCost] = useState('30');
  const [sellingPrice, setSellingPrice] = useState('100');
  const [result, setResult] = useState<{ units: number; revenue: number; margin: number; contributionPerUnit: number } | null>(null);

  const calculate = () => {
    const fc = parseFloat(fixedCosts) || 0;
    const vc = parseFloat(variableCost) || 0;
    const sp = parseFloat(sellingPrice) || 0;
    if (sp <= vc) { setResult(null); return; }
    const contribution = sp - vc;
    const units = Math.ceil(fc / contribution);
    const revenue = units * sp;
    const margin = ((sp - vc) / sp) * 100;
    setResult({ units, revenue, margin, contributionPerUnit: contribution });
  };

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <BarChart3 className="w-4 h-4 inline mr-2" /><strong>Break-Even Analysis:</strong> Find out how many units you need to sell to cover your costs.
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="text-sm block mb-1">Fixed Costs (Total)</label><input type="number" value={fixedCosts} onChange={e => setFixedCosts(e.target.value)} className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700" /></div>
        <div><label className="text-sm block mb-1">Variable Cost / Unit</label><input type="number" value={variableCost} onChange={e => setVariableCost(e.target.value)} className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700" /></div>
        <div><label className="text-sm block mb-1">Selling Price / Unit</label><input type="number" value={sellingPrice} onChange={e => setSellingPrice(e.target.value)} className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700" /></div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2"><Calculator className="w-4 h-4" />Calculate Break-Even</button>
      {result ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-500/30 rounded-lg p-4 text-center"><div className="text-xs text-gray-400">Break-Even Units</div><div className="text-2xl font-bold text-green-400">{result.units.toLocaleString()}</div></div>
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-500/30 rounded-lg p-4 text-center"><div className="text-xs text-gray-400">Break-Even Revenue</div><div className="text-2xl font-bold text-blue-400">{fmt(result.revenue)}</div></div>
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-500/30 rounded-lg p-4 text-center"><div className="text-xs text-gray-400">Contribution / Unit</div><div className="text-2xl font-bold text-purple-400">{fmt(result.contributionPerUnit)}</div></div>
            <div className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border border-yellow-500/30 rounded-lg p-4 text-center"><div className="text-xs text-gray-400">Profit Margin</div><div className="text-2xl font-bold text-yellow-400">{result.margin.toFixed(1)}%</div></div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="text-sm font-semibold mb-2">Profit/Loss at Different Quantities</div>
            <div className="space-y-1">
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map(mult => {
                const qty = Math.round(result.units * mult);
                const revenue = qty * (parseFloat(sellingPrice) || 0);
                const totalCost = (parseFloat(fixedCosts) || 0) + qty * (parseFloat(variableCost) || 0);
                const pl = revenue - totalCost;
                return (
                  <div key={mult} className="flex items-center gap-3 text-sm">
                    <span className="w-20 text-gray-500">{qty.toLocaleString()} units</span>
                    <div className="flex-1 flex items-center">
                      <div className="w-1/2 flex justify-end"><div className={`h-3 ${pl < 0 ? 'bg-red-500' : 'bg-transparent'}`} style={{ width: pl < 0 ? `${Math.min(Math.abs(pl) / (parseFloat(fixedCosts) || 1) * 100, 100)}%` : '0%' }} /></div>
                      <div className="w-px h-5 bg-gray-500" />
                      <div className="w-1/2"><div className={`h-3 ${pl > 0 ? 'bg-green-500' : 'bg-transparent'}`} style={{ width: pl > 0 ? `${Math.min(pl / (parseFloat(fixedCosts) || 1) * 100, 100)}%` : '0%' }} /></div>
                    </div>
                    <span className={`w-24 text-right font-mono text-xs ${pl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{pl >= 0 ? '+' : ''}{fmt(pl)}</span>
                  </div>
                );
              })}
              <div className="flex text-xs text-gray-500 mt-1"><span className="w-20" /><span className="flex-1 text-center">← Loss | Profit →</span><span className="w-24" /></div>
            </div>
          </div>
        </div>
      ) : sellingPrice && variableCost && parseFloat(sellingPrice) <= parseFloat(variableCost) ? (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-center text-red-300 text-sm">Selling price must be greater than variable cost to break even.</div>
      ) : null}
    </div>
  );
}

export default memo(BreakevenCalculatorComponent);
