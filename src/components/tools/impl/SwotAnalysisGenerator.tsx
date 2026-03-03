'use client';

import { memo, useState, useCallback } from 'react';

interface SwotData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

function SwotAnalysisGenerator() {
  const [businessName, setBusinessName] = useState('');
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [opportunities, setOpportunities] = useState('');
  const [threats, setThreats] = useState('');
  const [result, setResult] = useState<SwotData | null>(null);

  const handleGenerate = useCallback(() => {
    const parseList = (text: string) => 
      text.split('\n').map(s => s.trim()).filter(s => s.length > 0);

    setResult({
      strengths: parseList(strengths),
      weaknesses: parseList(weaknesses),
      opportunities: parseList(opportunities),
      threats: parseList(threats),
    });
  }, [strengths, weaknesses, opportunities, threats]);

  const handleExport = useCallback(() => {
    if (!result) return;
    const text = `SWOT Analysis for ${businessName || 'Business'}
${'='.repeat(50)}

STRENGTHS
${'-'.repeat(20)}
${result.strengths.map(s => `• ${s}`).join('\n')}

WEAKNESSES
${'-'.repeat(20)}
${result.weaknesses.map(s => `• ${s}`).join('\n')}

OPPORTUNITIES
${'-'.repeat(20)}
${result.opportunities.map(s => `• ${s}`).join('\n')}

THREATS
${'-'.repeat(20)}
${result.threats.map(s => `• ${s}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
  }, [result, businessName]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">SWOT Analysis Generator</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Business/Project Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g., My Startup"
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-green-400 mb-2">Strengths (one per line)</label>
              <textarea
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                placeholder="Strong brand&#10;Skilled team&#10;Unique product"
                rows={4}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-red-400 mb-2">Weaknesses (one per line)</label>
              <textarea
                value={weaknesses}
                onChange={(e) => setWeaknesses(e.target.value)}
                placeholder="Limited funding&#10;Small team&#10;New to market"
                rows={4}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-400 mb-2">Opportunities (one per line)</label>
              <textarea
                value={opportunities}
                onChange={(e) => setOpportunities(e.target.value)}
                placeholder="Growing market&#10;New partnerships&#10;Tech advances"
                rows={4}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-400 mb-2">Threats (one per line)</label>
              <textarea
                value={threats}
                onChange={(e) => setThreats(e.target.value)}
                placeholder="Competitors&#10;Economic downturn&#10;Regulations"
                rows={4}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>
          <button
            onClick={handleGenerate}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Generate SWOT Analysis
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">SWOT Analysis: {businessName || 'Business'}</h3>
            <button
              onClick={handleExport}
              className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded transition-colors"
            >
              Copy to Clipboard
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4">
              <h4 className="text-green-400 font-semibold mb-2">Strengths</h4>
              <ul className="space-y-1">
                {result.strengths.map((s, i) => (
                  <li key={i} className="text-zinc-300 text-sm">• {s}</li>
                ))}
              </ul>
            </div>
            <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
              <h4 className="text-red-400 font-semibold mb-2">Weaknesses</h4>
              <ul className="space-y-1">
                {result.weaknesses.map((s, i) => (
                  <li key={i} className="text-zinc-300 text-sm">• {s}</li>
                ))}
              </ul>
            </div>
            <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
              <h4 className="text-blue-400 font-semibold mb-2">Opportunities</h4>
              <ul className="space-y-1">
                {result.opportunities.map((s, i) => (
                  <li key={i} className="text-zinc-300 text-sm">• {s}</li>
                ))}
              </ul>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
              <h4 className="text-yellow-400 font-semibold mb-2">Threats</h4>
              <ul className="space-y-1">
                {result.threats.map((s, i) => (
                  <li key={i} className="text-zinc-300 text-sm">• {s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(SwotAnalysisGenerator);
