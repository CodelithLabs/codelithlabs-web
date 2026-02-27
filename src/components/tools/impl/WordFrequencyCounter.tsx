'use client';
import { useState } from 'react';
import { BookOpen, Copy, Check, Hash } from 'lucide-react';

export default function WordFrequencyCounter() {
  const [text, setText] = useState('');
  const [results, setResults] = useState<{ word: string; count: number; percentage: number }[]>([]);
  const [copied, setCopied] = useState(false);
  const [minCount, setMinCount] = useState(1);
  const [excludeStop, setExcludeStop] = useState(true);

  const stopWords = new Set(['the','a','an','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','should','could','can','may','might','shall','to','of','in','for','on','with','at','by','from','as','into','through','during','before','after','above','below','between','out','off','over','under','again','further','then','once','here','there','when','where','why','how','all','each','every','both','few','more','most','other','some','such','no','not','only','own','same','so','than','too','very','just','because','but','and','or','if','while','that','this','it','its','i','me','my','we','our','you','your','he','him','his','she','her','they','them','their','what','which','who','whom']);

  const analyze = () => {
    const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
    const freq: Record<string, number> = {};
    words.forEach(w => { if (!excludeStop || !stopWords.has(w)) freq[w] = (freq[w] || 0) + 1; });
    const total = Object.values(freq).reduce((a, b) => a + b, 0);
    const sorted = Object.entries(freq).filter(([, c]) => c >= minCount).sort(([, a], [, b]) => b - a).map(([word, count]) => ({ word, count, percentage: (count / total) * 100 }));
    setResults(sorted);
  };

  const exportCsv = () => {
    const csv = 'Word,Count,Percentage\n' + results.map(r => `${r.word},${r.count},${r.percentage.toFixed(2)}%`).join('\n');
    navigator.clipboard.writeText(csv); setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Hash className="w-4 h-4 inline mr-2" /><strong>Word Frequency Counter:</strong> Analyze word frequency distribution in your text. Useful for SEO keyword analysis and content optimization.
      </div>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste text to analyze word frequency..." className="w-full h-40 bg-zinc-800 text-white p-4 rounded-lg border border-zinc-700 focus:border-blue-500 resize-none" />
      <div className="flex items-center gap-4 flex-wrap">
        <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={excludeStop} onChange={e => setExcludeStop(e.target.checked)} className="accent-blue-500" /> Exclude stop words</label>
        <label className="text-sm">Min count: <input type="number" value={minCount} onChange={e => setMinCount(Number(e.target.value))} min={1} className="w-16 bg-zinc-800 text-white p-1 rounded border border-zinc-700 ml-1" /></label>
        <button onClick={analyze} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">Analyze</button>
      </div>
      {results.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="p-3 border-b border-zinc-800 flex justify-between items-center">
            <span className="text-sm font-semibold">{results.length} unique words</span>
            <button onClick={exportCsv} className="text-sm text-gray-400 hover:text-white flex items-center gap-1">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} CSV</button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {results.slice(0, 50).map((r, i) => (
              <div key={r.word} className="flex items-center gap-3 px-4 py-2 border-b border-zinc-800/50 hover:bg-zinc-800/30">
                <span className="text-xs text-gray-500 w-6">{i + 1}</span>
                <span className="flex-1 font-mono text-sm">{r.word}</span>
                <div className="w-32 bg-zinc-800 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(r.percentage * 3, 100)}%` }} /></div>
                <span className="text-sm font-mono w-12 text-right">{r.count}</span>
                <span className="text-xs text-gray-500 w-16 text-right">{r.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
