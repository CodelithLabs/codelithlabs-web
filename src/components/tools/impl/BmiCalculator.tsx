'use client';
import { useState } from 'react';

export default function BmiCalculator() {
  const [h, setH] = useState(170);
  const [w, setW] = useState(70);
  const bmi = (w / ((h/100)**2)).toFixed(1);
  return (
    <div className="bg-zinc-800 p-6 rounded-xl max-w-md mx-auto space-y-4">
      <div><label className="text-zinc-400">Height (cm)</label><input type="number" value={h} onChange={e => setH(Number(e.target.value))} className="w-full p-2 bg-zinc-900 text-white rounded"/></div>
      <div><label className="text-zinc-400">Weight (kg)</label><input type="number" value={w} onChange={e => setW(Number(e.target.value))} className="w-full p-2 bg-zinc-900 text-white rounded"/></div>
      <div className="text-center pt-4 border-t border-zinc-700">
        <div className="text-4xl font-bold text-blue-400">{bmi}</div>
        <div className="text-sm text-zinc-500">Body Mass Index</div>
      </div>
    </div>
  );
}
