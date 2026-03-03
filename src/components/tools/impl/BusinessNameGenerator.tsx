'use client';

import { memo, useState, useCallback } from 'react';

const prefixes = ['Tech', 'Digi', 'Smart', 'Pro', 'Next', 'Neo', 'Innov', 'Cloud', 'Data', 'Cyber', 'Swift', 'Prime', 'Ultra', 'Quantum', 'Alpha'];
const suffixes = ['Hub', 'Labs', 'Works', 'Soft', 'Tech', 'Solutions', 'Systems', 'Logic', 'Verse', 'Mind', 'Core', 'Wave', 'Flow', 'Spark', 'Byte'];
const connectors = ['', 'a', 'i', 'o', 'e', 'x', 'y'];

function BusinessNameGenerator() {
  const [keyword, setKeyword] = useState('');
  const [industry, setIndustry] = useState('tech');
  const [count, setCount] = useState('10');
  const [result, setResult] = useState<string[]>([]);

  const handleGenerate = useCallback(() => {
    const num = Math.min(parseInt(count) || 10, 50);
    const names: string[] = [];
    const usedNames = new Set<string>();

    while (names.length < num && names.length < 100) {
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      const connector = connectors[Math.floor(Math.random() * connectors.length)];
      
      let name: string;
      const variant = Math.floor(Math.random() * 4);
      
      if (keyword && variant === 0) {
        name = `${keyword.charAt(0).toUpperCase() + keyword.slice(1)}${suffix}`;
      } else if (keyword && variant === 1) {
        name = `${prefix}${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`;
      } else if (variant === 2) {
        name = `${prefix}${connector}${suffix}`;
      } else {
        name = `${prefix}${suffix}`;
      }

      if (!usedNames.has(name)) {
        usedNames.add(name);
        names.push(name);
      }
    }

    setResult(names);
  }, [keyword, count]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Business Name Generator</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Keyword (optional)</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g., code, app, design"
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Industry</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="tech">Technology</option>
              <option value="finance">Finance</option>
              <option value="health">Healthcare</option>
              <option value="retail">Retail</option>
              <option value="creative">Creative</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Number of Names</label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              placeholder="e.g., 10"
              min="1"
              max="50"
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleGenerate}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Generate Names
          </button>
        </div>
      </div>

      {result.length > 0 && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Generated Business Names</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {result.map((name, idx) => (
              <div
                key={idx}
                className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 flex justify-between items-center"
              >
                <span className="text-green-400 font-medium">{name}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(name)}
                  className="text-zinc-400 hover:text-white text-sm"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(BusinessNameGenerator);
