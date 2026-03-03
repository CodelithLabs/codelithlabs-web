'use client';
import { useState, useMemo , memo } from 'react';
import { Gem, RefreshCw } from 'lucide-react';

const GoldSilverCalculatorComponent = function GoldSilverCalculator() {
  const [goldPrice, setGoldPrice] = useState('7200');
  const [silverPrice, setSilverPrice] = useState('92');
  const [metal, setMetal] = useState<'gold' | 'silver'>('gold');
  const [weight, setWeight] = useState('10');
  const [unit, setUnit] = useState<'grams' | 'tola' | 'oz'>('grams');
  const [purity, setPurity] = useState('24');
  const [making, setMaking] = useState('8');
  const [gst, setGst] = useState(true);

  const result = useMemo(() => {
    const price = metal === 'gold' ? parseFloat(goldPrice) : parseFloat(silverPrice);
    let weightInGrams = parseFloat(weight) || 0;
    if (unit === 'tola') weightInGrams *= 11.664;
    if (unit === 'oz') weightInGrams *= 31.1035;

    const purityMultiplier = metal === 'gold' ? parseFloat(purity) / 24 : 1;
    const metalCost = price * weightInGrams * purityMultiplier;
    const makingCharge = metalCost * ((parseFloat(making) || 0) / 100);
    const subtotal = metalCost + makingCharge;
    const gstAmount = gst ? subtotal * 0.03 : 0;
    const totalCost = subtotal + gstAmount;

    return { metalCost, makingCharge, gstAmount, totalCost };
  }, [metal, weight, unit, purity, making, gst, goldPrice, silverPrice]);

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });

  return (
    <div className="space-y-4">
      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 text-sm text-yellow-200">
        <Gem className="w-4 h-4 inline mr-2" /><strong>Gold & Silver Price Calculator:</strong> Calculate jewelry cost with making charges, GST (3%), and purity. Update prices to today&apos;s rate.
      </div>
      <div className="flex gap-2">
        <button onClick={() => setMetal('gold')} className={`flex-1 py-3 rounded-lg font-semibold ${metal === 'gold' ? 'bg-yellow-600 text-white' : 'bg-zinc-800 text-gray-400'}`}>🥇 Gold</button>
        <button onClick={() => setMetal('silver')} className={`flex-1 py-3 rounded-lg font-semibold ${metal === 'silver' ? 'bg-gray-500 text-white' : 'bg-zinc-800 text-gray-400'}`}>🥈 Silver</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="text-sm block mb-1">{metal === 'gold' ? 'Gold' : 'Silver'} Price per Gram (₹)</label><input type="number" value={metal === 'gold' ? goldPrice : silverPrice} onChange={e => metal === 'gold' ? setGoldPrice(e.target.value) : setSilverPrice(e.target.value)} className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700" /></div>
        <div><label className="text-sm block mb-1">Weight</label>
          <div className="flex gap-2">
            <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="flex-1 bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700" />
            <select value={unit} onChange={e => setUnit(e.target.value as 'grams' | 'tola' | 'oz')} className="bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700">
              <option value="grams">Grams</option><option value="tola">Tola</option><option value="oz">Troy Oz</option>
            </select>
          </div>
        </div>
        {metal === 'gold' && (
          <div><label className="text-sm block mb-1">Purity (Karat)</label>
            <select value={purity} onChange={e => setPurity(e.target.value)} className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700">
              <option value="24">24K (99.9%)</option><option value="22">22K (91.6%)</option><option value="18">18K (75.0%)</option><option value="14">14K (58.3%)</option>
            </select>
          </div>
        )}
        <div><label className="text-sm block mb-1">Making Charges (%)</label><input type="number" value={making} onChange={e => setMaking(e.target.value)} className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700" /></div>
      </div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={gst} onChange={e => setGst(e.target.checked)} className="rounded" /> Include GST (3%)</label>
      {result && (
        <div className="space-y-3">
          <div className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border border-yellow-500/30 rounded-lg p-6 text-center">
            <div className="text-sm text-gray-300 mb-1">Total Cost</div>
            <div className="text-4xl font-bold text-yellow-400">{fmt(result.totalCost)}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            {[
              { label: `${metal === 'gold' ? 'Gold' : 'Silver'} Value`, value: result.metalCost, color: 'text-yellow-400' },
              { label: 'Making Charges', value: result.makingCharge, color: 'text-blue-400' },
              { label: 'GST (3%)', value: result.gstAmount, color: 'text-red-400' },
              { label: 'Grand Total', value: result.totalCost, color: 'text-green-400 font-bold' },
            ].map((r, i) => (
              <div key={i} className="flex justify-between px-4 py-2 border-b border-zinc-800/50 text-sm">
                <span className="text-gray-300">{r.label}</span>
                <span className={`font-mono ${r.color}`}>{fmt(r.value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(GoldSilverCalculatorComponent);
