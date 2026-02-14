// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/tools/impl/UnitConverter.tsx
// Multi-Unit Converter - Length, Weight, Temperature
// ═══════════════════════════════════════════════════════════════════════════
'use client';

import { useState } from 'react';

type UnitCategory = 'length' | 'weight' | 'temperature';

export default function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [inputValue, setInputValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');

  const units = {
    length: {
      m: { name: 'Meters', factor: 1 },
      km: { name: 'Kilometers', factor: 0.001 },
      cm: { name: 'Centimeters', factor: 100 },
      mm: { name: 'Millimeters', factor: 1000 },
      mi: { name: 'Miles', factor: 0.000621371 },
      yd: { name: 'Yards', factor: 1.09361 },
      ft: { name: 'Feet', factor: 3.28084 },
      in: { name: 'Inches', factor: 39.3701 },
    },
    weight: {
      kg: { name: 'Kilograms', factor: 1 },
      g: { name: 'Grams', factor: 1000 },
      mg: { name: 'Milligrams', factor: 1000000 },
      lb: { name: 'Pounds', factor: 2.20462 },
      oz: { name: 'Ounces', factor: 35.274 },
      ton: { name: 'Metric Tons', factor: 0.001 },
    },
    temperature: {
      c: { name: 'Celsius', factor: 1 },
      f: { name: 'Fahrenheit', factor: 1 },
      k: { name: 'Kelvin', factor: 1 },
    },
  };

  // Convert between units
  const convert = (): string => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return '0';

    if (category === 'temperature') {
      // Special handling for temperature
      let celsius = 0;

      // Convert to Celsius first
      if (fromUnit === 'c') celsius = value;
      else if (fromUnit === 'f') celsius = (value - 32) * (5 / 9);
      else if (fromUnit === 'k') celsius = value - 273.15;

      // Convert from Celsius to target
      if (toUnit === 'c') return celsius.toFixed(2);
      else if (toUnit === 'f') return (celsius * (9 / 5) + 32).toFixed(2);
      else if (toUnit === 'k') return (celsius + 273.15).toFixed(2);
    }

    // For length and weight (linear conversion)
    const fromFactor = units[category][fromUnit as keyof typeof units[typeof category]].factor;
    const toFactor = units[category][toUnit as keyof typeof units[typeof category]].factor;
    const result = (value / fromFactor) * toFactor;
    return result.toFixed(6).replace(/\.?0+$/, '');
  };

  const result = convert();

  return (
    <div className="space-y-6">

      {/* Category Selector */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Unit Category:
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['length', 'weight', 'temperature'] as UnitCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setFromUnit(Object.keys(units[cat])[0]);
                setToUnit(Object.keys(units[cat])[1]);
              }}
              className={`px-4 py-3 rounded-lg font-medium capitalize transition-all ${
                category === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Converter */}
      <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6 space-y-4">

        {/* Input Value */}
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Value:</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3
                     text-white text-xl focus:outline-none focus:border-blue-500
                     focus:ring-2 focus:ring-blue-500/20 transition-all"
            placeholder="Enter value"
          />
        </div>

        {/* From Unit */}
        <div>
          <label className="block text-sm text-zinc-400 mb-2">From:</label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3
                     text-white focus:outline-none focus:border-blue-500
                     focus:ring-2 focus:ring-blue-500/20 transition-all"
          >
            {Object.entries(units[category]).map(([key, { name }]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              const temp = fromUnit;
              setFromUnit(toUnit);
              setToUnit(temp);
            }}
            className="p-2 bg-zinc-700 hover:bg-zinc-600 rounded-full transition-colors"
            aria-label="Swap units"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* To Unit */}
        <div>
          <label className="block text-sm text-zinc-400 mb-2">To:</label>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3
                     text-white focus:outline-none focus:border-blue-500
                     focus:ring-2 focus:ring-blue-500/20 transition-all"
          >
            {Object.entries(units[category]).map(([key, { name }]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Result */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
          <div className="text-sm text-zinc-400 mb-1">Result:</div>
          <div className="text-3xl font-bold text-green-400">{result}</div>
          <div className="text-sm text-zinc-500 mt-1">
            {units[category][toUnit as keyof typeof units[typeof category]].name}
          </div>
        </div>

      </div>

      {/* Common Conversions */}
      <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
        <h3 className="text-sm font-bold text-white mb-3">Quick Reference:</h3>
        <div className="grid md:grid-cols-2 gap-2 text-xs text-zinc-400">
          {category === 'length' && (
            <>
              <div>1 meter = 3.28 feet</div>
              <div>1 kilometer = 0.62 miles</div>
              <div>1 inch = 2.54 centimeters</div>
              <div>1 mile = 1.61 kilometers</div>
            </>
          )}
          {category === 'weight' && (
            <>
              <div>1 kilogram = 2.20 pounds</div>
              <div>1 pound = 453.59 grams</div>
              <div>1 ounce = 28.35 grams</div>
              <div>1 ton = 1000 kilograms</div>
            </>
          )}
          {category === 'temperature' && (
            <>
              <div>0°C = 32°F = 273.15K</div>
              <div>100°C = 212°F = 373.15K</div>
              <div>-40°C = -40°F = 233.15K</div>
              <div>37°C = 98.6°F = 310.15K</div>
            </>
          )}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-300 flex gap-3">
        <span className="text-xl">🔒</span>
        <p>
          <strong>100% Client-Side:</strong> All conversions happen in your browser.
          No data is sent to our servers.
        </p>
      </div>

    </div>
  );
}
