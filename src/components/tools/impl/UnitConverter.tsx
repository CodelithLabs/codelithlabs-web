'use client';
import { useState } from 'react';

export default function UnitConverter() {
  const [val, setVal] = useState(0);
  const [from, setFrom] = useState('m');
  const [to, setTo] = useState('ft');

  // Conversion factors for length and weight units
  const factors: Record<string, number> = { 
    m: 1, km: 1000, cm: 0.01, mm: 0.001,
    ft: 0.3048, mi: 1609.34, in: 0.0254, yd: 0.9144,
    kg: 1, g: 0.001, lb: 0.453592, oz: 0.0283495,
    c: 1, f: 1 // Temp requires special logic usually, keeping simple for build pass
  };

  const calculate = () => {
    // Temperature special case
    if (from === 'c' && to === 'f') return (val * 9/5) + 32;
    if (from === 'f' && to === 'c') return (val - 32) * 5/9;
    
    // Standard conversion
    const fromFactor = factors[from] || 1;
    const toFactor = factors[to] || 1;
    return (val * fromFactor / toFactor).toFixed(4);
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto bg-zinc-800 p-6 rounded-xl border border-zinc-700">
      <input type="number" value={val} onChange={(e) => setVal(Number(e.target.value))} className="w-full p-3 bg-zinc-900 text-white rounded text-2xl mb-4 focus:outline-none focus:border-blue-500 border border-transparent" />
      <div className="flex gap-4 items-center">
        <select value={from} onChange={(e) => setFrom(e.target.value)} className="flex-1 p-3 bg-zinc-700 text-white rounded">
          <optgroup label="Length">
            <option value="m">Meters</option><option value="km">Kilometers</option><option value="ft">Feet</option><option value="mi">Miles</option>
          </optgroup>
          <optgroup label="Weight">
            <option value="kg">Kilograms</option><option value="lb">Pounds</option>
          </optgroup>
          <optgroup label="Temperature">
            <option value="c">Celsius</option><option value="f">Fahrenheit</option>
          </optgroup>
        </select>
        <span className="text-zinc-400 font-bold">TO</span>
        <select value={to} onChange={(e) => setTo(e.target.value)} className="flex-1 p-3 bg-zinc-700 text-white rounded">
           <optgroup label="Length">
            <option value="m">Meters</option><option value="km">Kilometers</option><option value="ft">Feet</option><option value="mi">Miles</option>
          </optgroup>
          <optgroup label="Weight">
            <option value="kg">Kilograms</option><option value="lb">Pounds</option>
          </optgroup>
          <optgroup label="Temperature">
            <option value="c">Celsius</option><option value="f">Fahrenheit</option>
          </optgroup>
        </select>
      </div>
      <div className="text-center mt-6">
        <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Result</div>
        <div className="text-4xl font-bold text-green-400">{calculate()}</div>
      </div>
    </div>
  );
}
