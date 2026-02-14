'use client';
import { useState } from 'react';
export default function RandomNumberGen() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [res, setRes] = useState<number | null>(null);
  return (
    <div className="flex flex-col items-center gap-4 bg-zinc-800 p-6 rounded-xl max-w-sm mx-auto">
      <div className="flex gap-4">
        <input type="number" value={min} onChange={e => setMin(Number(e.target.value))} className="w-20 p-2 bg-zinc-900 text-white rounded text-center"/>
        <span className="text-zinc-500 pt-2">TO</span>
        <input type="number" value={max} onChange={e => setMax(Number(e.target.value))} className="w-20 p-2 bg-zinc-900 text-white rounded text-center"/>
      </div>
      <button onClick={() => setRes(Math.floor(Math.random() * (max - min + 1) + min))} className="w-full py-2 bg-blue-600 text-white rounded">Generate</button>
      {res !== null && <div className="text-6xl font-bold text-white mt-4">{res}</div>}
    </div>
  );
}
