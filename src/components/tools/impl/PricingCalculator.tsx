'use client';

import { memo, useState, useCallback } from 'react';

function PricingCalculator() {
  const [cost, setCost] = useState('');
  const [markup, setMarkup] = useState('');
  const [result, setResult] = useState<{ sellingPrice: number; profit: number; margin: number } | null>(null);

  const handleCalculate = useCallback(() => {
    const costValue = parseFloat(cost) || 0;
    const markupPercent = parseFloat(markup) || 0;

    if (costValue <= 0) {
      setResult(null);
      return;
    }

    const profit = costValue * (markupPercent / 100);
    const sellingPrice = costValue + profit;
    const margin = (profit / sellingPrice) * 100;

    setResult({
      sellingPrice,
      profit,
      margin,
    });
  }, [cost, markup]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Product Pricing Calculator</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Product Cost (₹)</label>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="e.g., 500"
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Markup Percentage (%)</label>
            <input
              type="number"
              value={markup}
              onChange={(e) => setMarkup(e.target.value)}
              placeholder="e.g., 50"
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleCalculate}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Calculate Price
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Pricing Results</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-zinc-700">
              <span className="text-zinc-400">Selling Price:</span>
              <span className="text-green-400 font-mono text-xl">₹{result.sellingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-zinc-700">
              <span className="text-zinc-400">Profit per Unit:</span>
              <span className="text-yellow-400 font-mono">₹{result.profit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-zinc-400">Profit Margin:</span>
              <span className="text-blue-400 font-mono">{result.margin.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(PricingCalculator);
