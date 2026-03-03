'use client';

import { memo, useState, useCallback } from 'react';

function InvoiceNumberGenerator() {
  const [prefix, setPrefix] = useState('INV');
  const [startNumber, setStartNumber] = useState('1');
  const [count, setCount] = useState('10');
  const [padLength, setPadLength] = useState('6');
  const [result, setResult] = useState<string[]>([]);

  const handleGenerate = useCallback(() => {
    const start = parseInt(startNumber) || 1;
    const num = parseInt(count) || 10;
    const pad = parseInt(padLength) || 6;
    const invoices: string[] = [];

    for (let i = 0; i < Math.min(num, 100); i++) {
      const number = (start + i).toString().padStart(pad, '0');
      invoices.push(`${prefix}-${number}`);
    }

    setResult(invoices);
  }, [prefix, startNumber, count, padLength]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(result.join('\n'));
  }, [result]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Invoice Number Generator</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Prefix</label>
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder="e.g., INV"
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Starting Number</label>
            <input
              type="number"
              value={startNumber}
              onChange={(e) => setStartNumber(e.target.value)}
              placeholder="e.g., 1"
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Count</label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              placeholder="e.g., 10"
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Pad Length</label>
            <input
              type="number"
              value={padLength}
              onChange={(e) => setPadLength(e.target.value)}
              placeholder="e.g., 6"
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          onClick={handleGenerate}
          className="mt-4 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Generate Invoice Numbers
        </button>
      </div>

      {result.length > 0 && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Generated Invoices</h3>
            <button
              onClick={handleCopy}
              className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded transition-colors"
            >
              Copy All
            </button>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4 max-h-64 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {result.map((invoice, idx) => (
                <span key={idx} className="text-green-400 font-mono text-sm">{invoice}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(InvoiceNumberGenerator);
