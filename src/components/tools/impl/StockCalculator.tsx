'use client';
import { useState , memo } from 'react';
import { LineChart, Calculator } from 'lucide-react';

const StockCalculatorComponent = function StockCalculator() {
  const [mode, setMode] = useState<'profit' | 'average'>('profit');
  const [buyPrice, setBuyPrice] = useState('');
  const [buyQty, setBuyQty] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [brokerage, setBrokerage] = useState('0.05');
  // For averaging
  const [lots, setLots] = useState<{ price: string; qty: string }[]>([{ price: '', qty: '' }, { price: '', qty: '' }]);

  const calcProfit = () => {
    const bp = parseFloat(buyPrice) || 0;
    const bq = parseFloat(buyQty) || 0;
    const sp = parseFloat(sellPrice) || 0;
    const br = parseFloat(brokerage) || 0;
    const invested = bp * bq;
    const returns = sp * bq;
    const buyBrokerage = invested * (br / 100);
    const sellBrokerage = returns * (br / 100);
    const stt = returns * 0.001; // 0.1% delivery STT
    const grossPl = returns - invested;
    const charges = buyBrokerage + sellBrokerage + stt;
    const netPl = grossPl - charges;
    const pctReturn = invested > 0 ? (netPl / invested) * 100 : 0;
    return { invested, returns, grossPl, charges, netPl, pctReturn, buyBrokerage, sellBrokerage, stt };
  };

  const calcAverage = () => {
    let totalQty = 0, totalCost = 0;
    lots.forEach(l => { const p = parseFloat(l.price) || 0; const q = parseFloat(l.qty) || 0; totalQty += q; totalCost += p * q; });
    const avgPrice = totalQty > 0 ? totalCost / totalQty : 0;
    return { avgPrice, totalQty, totalCost };
  };

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 2 });

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <LineChart className="w-4 h-4 inline mr-2" /><strong>Stock Profit/Loss & Average Price Calculator:</strong> Calculate trading profit after brokerage and STT, or find your average buy price.
      </div>
      <div className="flex gap-2">
        <button onClick={() => setMode('profit')} className={`flex-1 py-2 rounded-lg font-semibold text-sm ${mode === 'profit' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-gray-400'}`}>Profit/Loss</button>
        <button onClick={() => setMode('average')} className={`flex-1 py-2 rounded-lg font-semibold text-sm ${mode === 'average' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-gray-400'}`}>Average Price</button>
      </div>
      {mode === 'profit' ? (
        <>
          <div className="grid md:grid-cols-2 gap-3">
            <div><label className="text-xs block mb-1">Buy Price (₹)</label><input type="number" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} placeholder="100" className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm" /></div>
            <div><label className="text-xs block mb-1">Quantity</label><input type="number" value={buyQty} onChange={e => setBuyQty(e.target.value)} placeholder="100" className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm" /></div>
            <div><label className="text-xs block mb-1">Sell Price (₹)</label><input type="number" value={sellPrice} onChange={e => setSellPrice(e.target.value)} placeholder="120" className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm" /></div>
            <div><label className="text-xs block mb-1">Brokerage (%)</label><input type="number" value={brokerage} onChange={e => setBrokerage(e.target.value)} step="0.01" className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm" /></div>
          </div>
          {buyPrice && sellPrice && buyQty && (() => {
            const r = calcProfit();
            return (
              <div className="space-y-3">
                <div className={`rounded-lg p-4 text-center border ${r.netPl >= 0 ? 'bg-green-900/30 border-green-500/30' : 'bg-red-900/30 border-red-500/30'}`}>
                  <div className="text-sm text-gray-300 mb-1">Net P&L</div>
                  <div className={`text-3xl font-bold ${r.netPl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{r.netPl >= 0 ? '+' : ''}{fmt(r.netPl)}</div>
                  <div className="text-sm text-gray-400">{r.pctReturn >= 0 ? '+' : ''}{r.pctReturn.toFixed(2)}%</div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                  {[
                    { label: 'Invested', value: fmt(r.invested), color: '' },
                    { label: 'Returns', value: fmt(r.returns), color: '' },
                    { label: 'Gross P&L', value: (r.grossPl >= 0 ? '+' : '') + fmt(r.grossPl), color: r.grossPl >= 0 ? 'text-green-400' : 'text-red-400' },
                    { label: 'Buy Brokerage', value: '-' + fmt(r.buyBrokerage), color: 'text-red-400' },
                    { label: 'Sell Brokerage', value: '-' + fmt(r.sellBrokerage), color: 'text-red-400' },
                    { label: 'STT (0.1%)', value: '-' + fmt(r.stt), color: 'text-red-400' },
                    { label: 'Net P&L', value: (r.netPl >= 0 ? '+' : '') + fmt(r.netPl), color: r.netPl >= 0 ? 'text-green-400 font-bold' : 'text-red-400 font-bold' },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between px-4 py-2 border-b border-zinc-800/50 text-sm">
                      <span className="text-gray-300">{row.label}</span>
                      <span className={`font-mono ${row.color}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </>
      ) : (
        <>
          <div className="space-y-2">
            {lots.map((l, i) => (
              <div key={i} className="grid grid-cols-5 gap-2 items-center">
                <span className="text-xs text-gray-500">Lot {i + 1}</span>
                <input type="number" placeholder="Price" value={l.price} onChange={e => { const u = [...lots]; u[i].price = e.target.value; setLots(u); }} className="col-span-2 bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm" />
                <input type="number" placeholder="Qty" value={l.qty} onChange={e => { const u = [...lots]; u[i].qty = e.target.value; setLots(u); }} className="col-span-2 bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm" />
              </div>
            ))}
            <button onClick={() => setLots([...lots, { price: '', qty: '' }])} className="text-blue-400 text-sm">+ Add Lot</button>
          </div>
          {(() => {
            const r = calcAverage();
            return r.totalQty > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-400">Avg Price</div><div className="text-xl font-bold text-blue-400">{fmt(r.avgPrice)}</div></div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-400">Total Qty</div><div className="text-xl font-bold">{r.totalQty}</div></div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-400">Total Invested</div><div className="text-xl font-bold text-yellow-400">{fmt(r.totalCost)}</div></div>
              </div>
            ) : null;
          })()}
        </>
      )}
    </div>
  );
}

export default memo(StockCalculatorComponent);
