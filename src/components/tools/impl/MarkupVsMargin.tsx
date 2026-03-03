'use client';
import { useState, useCallback, memo } from 'react';
import { Percent, ArrowRightLeft, HelpCircle } from 'lucide-react';

const MarkupVsMarginComponent = function MarkupVsMargin() {
  const [cost, setCost] = useState(50);
  const [sellingPrice, setSellingPrice] = useState(100);
  const [markup, setMarkup] = useState(100);
  const [margin, setMargin] = useState(50);
  const [mode, setMode] = useState<'costPrice' | 'costMarkup' | 'costMargin'>('costPrice');
  const [currency, setCurrency] = useState('$');

  const calculate = useCallback(() => {
    let calculatedCost = cost;
    let calculatedPrice = sellingPrice;
    let calculatedMarkup = markup;
    let calculatedMargin = margin;
    let profit = 0;

    switch (mode) {
      case 'costPrice':
        // Given cost and selling price
        profit = calculatedPrice - calculatedCost;
        calculatedMarkup = calculatedCost > 0 ? (profit / calculatedCost) * 100 : 0;
        calculatedMargin = calculatedPrice > 0 ? (profit / calculatedPrice) * 100 : 0;
        break;
      case 'costMarkup':
        // Given cost and markup %
        profit = calculatedCost * (calculatedMarkup / 100);
        calculatedPrice = calculatedCost + profit;
        calculatedMargin = calculatedPrice > 0 ? (profit / calculatedPrice) * 100 : 0;
        break;
      case 'costMargin':
        // Given cost and margin %
        calculatedPrice = calculatedMargin < 100 ? calculatedCost / (1 - calculatedMargin / 100) : 0;
        profit = calculatedPrice - calculatedCost;
        calculatedMarkup = calculatedCost > 0 ? (profit / calculatedCost) * 100 : 0;
        break;
    }

    return {
      cost: calculatedCost,
      sellingPrice: calculatedPrice,
      markup: calculatedMarkup,
      margin: calculatedMargin,
      profit,
    };
  }, [cost, sellingPrice, markup, margin, mode]);

  const results = calculate();

  const formatMoney = (amount: number) => `${currency}${amount.toFixed(2)}`;

  const commonMarkups = [
    { name: 'Retail (50%)', markup: 50 },
    { name: 'Keystone (100%)', markup: 100 },
    { name: 'Services (150%)', markup: 150 },
    { name: 'Tech (200%)', markup: 200 },
  ];

  const conversionTable = [
    { markup: 10, margin: 9.09 },
    { markup: 20, margin: 16.67 },
    { markup: 25, margin: 20.00 },
    { markup: 33.33, margin: 25.00 },
    { markup: 50, margin: 33.33 },
    { markup: 75, margin: 42.86 },
    { markup: 100, margin: 50.00 },
    { markup: 150, margin: 60.00 },
    { markup: 200, margin: 66.67 },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Percent className="w-4 h-4 inline mr-2" />
        <strong>Markup vs Margin Calculator:</strong> Convert between markup and margin percentages. Understand the difference and calculate profit.
      </div>

      {/* Explanation */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex items-center gap-2 text-zinc-300 font-medium mb-1">
              <HelpCircle className="w-4 h-4" />
              Markup
            </div>
            <div className="text-zinc-400">
              Percentage added to <strong>cost</strong> to get price.
              <div className="font-mono text-xs mt-1 text-zinc-500">
                Markup = (Profit ÷ Cost) × 100
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-zinc-300 font-medium mb-1">
              <HelpCircle className="w-4 h-4" />
              Margin
            </div>
            <div className="text-zinc-400">
              Percentage of <strong>selling price</strong> that is profit.
              <div className="font-mono text-xs mt-1 text-zinc-500">
                Margin = (Profit ÷ Price) × 100
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calculation Mode */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('costPrice')}
          className={`flex-1 py-2 rounded-lg text-sm ${
            mode === 'costPrice' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          Cost + Price
        </button>
        <button
          onClick={() => setMode('costMarkup')}
          className={`flex-1 py-2 rounded-lg text-sm ${
            mode === 'costMarkup' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          Cost + Markup%
        </button>
        <button
          onClick={() => setMode('costMargin')}
          className={`flex-1 py-2 rounded-lg text-sm ${
            mode === 'costMargin' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          Cost + Margin%
        </button>
      </div>

      {/* Inputs */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Cost</label>
            <div className="flex">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-zinc-800 text-white p-2 rounded-l border border-zinc-700"
              >
                <option value="$">$</option>
                <option value="€">€</option>
                <option value="£">£</option>
                <option value="₹">₹</option>
              </select>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
                min={0}
                step={0.01}
                className="flex-1 bg-zinc-800 text-white p-2 rounded-r border border-zinc-700"
              />
            </div>
          </div>

          {mode === 'costPrice' && (
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Selling Price</label>
              <div className="flex">
                <span className="bg-zinc-800 text-zinc-400 p-2 rounded-l border border-zinc-700">{currency}</span>
                <input
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                  min={0}
                  step={0.01}
                  className="flex-1 bg-zinc-800 text-white p-2 rounded-r border border-zinc-700"
                />
              </div>
            </div>
          )}

          {mode === 'costMarkup' && (
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Markup %</label>
              <div className="flex">
                <input
                  type="number"
                  value={markup}
                  onChange={(e) => setMarkup(parseFloat(e.target.value) || 0)}
                  min={0}
                  className="flex-1 bg-zinc-800 text-white p-2 rounded-l border border-zinc-700"
                />
                <span className="bg-zinc-800 text-zinc-400 p-2 rounded-r border border-zinc-700 border-l-0">%</span>
              </div>
            </div>
          )}

          {mode === 'costMargin' && (
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Margin %</label>
              <div className="flex">
                <input
                  type="number"
                  value={margin}
                  onChange={(e) => setMargin(parseFloat(e.target.value) || 0)}
                  min={0}
                  max={99.99}
                  className="flex-1 bg-zinc-800 text-white p-2 rounded-l border border-zinc-700"
                />
                <span className="bg-zinc-800 text-zinc-400 p-2 rounded-r border border-zinc-700 border-l-0">%</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Presets */}
        {mode === 'costMarkup' && (
          <div className="mt-3 pt-3 border-t border-zinc-700">
            <div className="text-xs text-zinc-500 mb-2">Common Markups:</div>
            <div className="flex gap-2">
              {commonMarkups.map(preset => (
                <button
                  key={preset.name}
                  onClick={() => setMarkup(preset.markup)}
                  className={`px-3 py-1 text-xs rounded ${
                    markup === preset.markup
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div className="bg-zinc-800 rounded-lg p-3">
            <div className="text-xs text-zinc-500 mb-1">Cost</div>
            <div className="text-lg font-bold text-white">{formatMoney(results.cost)}</div>
          </div>
          <div className="flex items-center justify-center text-zinc-600">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
            <div className="text-xs text-blue-400 mb-1">Selling Price</div>
            <div className="text-xl font-bold text-white">{formatMoney(results.sellingPrice)}</div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-3">
            <div className="text-xs text-zinc-500 mb-1">Profit</div>
            <div className="text-lg font-bold text-green-400">{formatMoney(results.profit)}</div>
          </div>
          <div></div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-zinc-800 rounded-lg">
            <div className="text-xs text-zinc-500 mb-1">Markup</div>
            <div className="text-3xl font-bold text-white">{results.markup.toFixed(2)}%</div>
            <div className="text-xs text-zinc-500 mt-1">of cost</div>
          </div>
          <div className="text-center p-4 bg-zinc-800 rounded-lg">
            <div className="text-xs text-zinc-500 mb-1">Margin</div>
            <div className="text-3xl font-bold text-white">{results.margin.toFixed(2)}%</div>
            <div className="text-xs text-zinc-500 mt-1">of price</div>
          </div>
        </div>
      </div>

      {/* Conversion Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-zinc-300 mb-3">Quick Reference Table</h4>
        <div className="grid grid-cols-5 md:grid-cols-9 gap-2 text-center text-xs">
          {conversionTable.map(row => (
            <div
              key={row.markup}
              className={`p-2 rounded ${
                Math.abs(results.markup - row.markup) < 1
                  ? 'bg-blue-900/30 border border-blue-500/30'
                  : 'bg-zinc-800'
              }`}
            >
              <div className="font-medium text-white">{row.markup}%</div>
              <div className="text-zinc-500">{row.margin.toFixed(1)}%</div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-xs text-zinc-500 text-center">
          Top: Markup | Bottom: Margin
        </div>
      </div>
    </div>
  );
};

export default memo(MarkupVsMarginComponent);
