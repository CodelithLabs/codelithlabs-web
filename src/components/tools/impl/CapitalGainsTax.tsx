'use client';
import { useState } from 'react';
import { Receipt, Calculator } from 'lucide-react';

export default function CapitalGainsTax() {
  const [assetType, setAssetType] = useState<'equity' | 'debt' | 'property'>('equity');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [holdingMonths, setHoldingMonths] = useState('18');
  const [indexedBuy, setIndexedBuy] = useState('');
  const [result, setResult] = useState<{ gain: number; taxRate: number; tax: number; cess: number; total: number; isLong: boolean; type: string } | null>(null);

  const calculate = () => {
    const bp = parseFloat(buyPrice) || 0;
    const sp = parseFloat(sellPrice) || 0;
    const months = parseFloat(holdingMonths) || 0;

    let isLong = false;
    let taxRate = 0;
    let costBasis = bp;

    if (assetType === 'equity') {
      isLong = months >= 12;
      if (isLong) {
        const gain = sp - bp;
        const taxableGain = Math.max(0, gain - 125000); // 1.25L exemption FY 2025-26
        taxRate = 12.5;
        const tax = taxableGain * 0.125;
        const cess = tax * 0.04;
        setResult({ gain, taxRate, tax, cess, total: tax + cess, isLong, type: 'LTCG (Listed Equity)' });
        return;
      } else {
        taxRate = 20; // STCG on equity
      }
    } else if (assetType === 'debt') {
      isLong = false; // Post 2023, all debt MF gains taxed at slab
      taxRate = 30; // Assuming highest slab
    } else {
      isLong = months >= 24;
      taxRate = isLong ? 12.5 : 30;
      if (isLong && indexedBuy) costBasis = parseFloat(indexedBuy) || bp;
    }

    const gain = sp - costBasis;
    const tax = Math.max(0, gain * (taxRate / 100));
    const cess = tax * 0.04;
    setResult({ gain, taxRate, tax, cess, total: tax + cess, isLong, type: `${isLong ? 'LTCG' : 'STCG'} (${assetType === 'equity' ? 'Listed Equity' : assetType === 'debt' ? 'Debt Fund' : 'Real Estate'})` });
  };

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Receipt className="w-4 h-4 inline mr-2" /><strong>Capital Gains Tax Calculator (India FY 2025-26):</strong> Calculate LTCG/STCG tax on equity, debt funds, and real estate with new 12.5% LTCG rate.
      </div>
      <div className="flex gap-2">
        {[{ key: 'equity', label: '📈 Equity/MF' }, { key: 'debt', label: '🏦 Debt Fund' }, { key: 'property', label: '🏠 Real Estate' }].map(t => (
          <button key={t.key} onClick={() => setAssetType(t.key as 'equity' | 'debt' | 'property')} className={`flex-1 py-2 rounded-lg text-sm font-semibold ${assetType === t.key ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-gray-400'}`}>{t.label}</button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div><label className="text-xs block mb-1">Purchase Price (₹)</label><input type="number" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm" /></div>
        <div><label className="text-xs block mb-1">Sale Price (₹)</label><input type="number" value={sellPrice} onChange={e => setSellPrice(e.target.value)} className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm" /></div>
        <div><label className="text-xs block mb-1">Holding Period (Months)</label><input type="number" value={holdingMonths} onChange={e => setHoldingMonths(e.target.value)} className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm" /></div>
        {assetType === 'property' && parseInt(holdingMonths) >= 24 && (
          <div><label className="text-xs block mb-1">Indexed Cost (optional)</label><input type="number" value={indexedBuy} onChange={e => setIndexedBuy(e.target.value)} placeholder="Leave empty to use buy price" className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm" /></div>
        )}
      </div>
      <button onClick={calculate} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2"><Calculator className="w-4 h-4" />Calculate Tax</button>
      {result && (
        <div className="space-y-3">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center">
            <div className="text-xs text-gray-400 mb-1">{result.type}</div>
            <span className={`text-xs px-2 py-1 rounded-full ${result.isLong ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>{result.isLong ? 'Long Term' : 'Short Term'}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-400">Capital Gain</div><div className={`text-lg font-bold ${result.gain >= 0 ? 'text-green-400' : 'text-red-400'}`}>{fmt(result.gain)}</div></div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-400">Tax Rate</div><div className="text-lg font-bold text-blue-400">{result.taxRate}%</div></div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-400">Tax + Cess</div><div className="text-lg font-bold text-red-400">{fmt(result.total)}</div></div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-400">Net Gain</div><div className="text-lg font-bold text-green-400">{fmt(result.gain - result.total)}</div></div>
          </div>
          {assetType === 'equity' && result.isLong && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 text-xs text-green-200">💡 LTCG on listed equity up to ₹1,25,000 per year is exempt under Section 112A (FY 2025-26).</div>
          )}
        </div>
      )}
    </div>
  );
}
