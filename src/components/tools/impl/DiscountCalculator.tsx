'use client';
import { useState } from 'react';

export default function DiscountCalculator() {
  const [price, setPrice] = useState(1000);
  const [disc, setDisc] = useState(20);
  return (
    <div className="bg-zinc-800 p-6 rounded-xl max-w-md mx-auto space-y-4">
      <div className="flex gap-4">
        <div><label className="text-zinc-400">Price</label><input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full p-2 bg-zinc-900 text-white rounded"/></div>
        <div><label className="text-zinc-400">Discount %</label><input type="number" value={disc} onChange={e => setDisc(Number(e.target.value))} className="w-full p-2 bg-zinc-900 text-white rounded"/></div>
      </div>
      <div className="text-center bg-zinc-900 p-4 rounded-lg">
        <div className="text-xs text-zinc-500">FINAL PRICE</div>
        <div className="text-3xl font-bold text-green-400">{(price - (price * disc / 100)).toFixed(2)}</div>
        <div className="text-xs text-zinc-500 mt-1">You save: {(price * disc / 100).toFixed(2)}</div>
      </div>
    </div>
  );
}
