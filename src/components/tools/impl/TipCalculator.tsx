'use client';
import { useState } from 'react';

export default function TipCalculator() {
  const [bill, setBill] = useState(100);
  const [tip, setTip] = useState(15);
  const [people, setPeople] = useState(1);
  const total = bill + (bill * tip / 100);

  return (
    <div className="bg-zinc-800 p-6 rounded-xl max-w-md mx-auto space-y-4">
      <div><label className="text-zinc-400">Bill Amount</label><input type="number" value={bill} onChange={e => setBill(Number(e.target.value))} className="w-full p-2 bg-zinc-900 text-white rounded"/></div>
      <div className="flex gap-4">
        <div><label className="text-zinc-400">Tip %</label><input type="number" value={tip} onChange={e => setTip(Number(e.target.value))} className="w-full p-2 bg-zinc-900 text-white rounded"/></div>
        <div><label className="text-zinc-400">People</label><input type="number" value={people} onChange={e => setPeople(Number(e.target.value))} className="w-full p-2 bg-zinc-900 text-white rounded"/></div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-zinc-900 p-3 rounded text-center"><div className="text-xs text-zinc-500">TOTAL</div><div className="text-xl font-bold text-white">{total.toFixed(2)}</div></div>
        <div className="bg-zinc-900 p-3 rounded text-center"><div className="text-xs text-zinc-500">PER PERSON</div><div className="text-xl font-bold text-blue-400">{(total/people).toFixed(2)}</div></div>
      </div>
    </div>
  );
}
