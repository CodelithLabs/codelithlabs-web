'use client';
import { useState } from 'react';
import { Regex, Copy, Check, Wand2 } from 'lucide-react';

const TEMPLATES = [
  { label: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
  { label: 'Phone (US)', pattern: '\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}' },
  { label: 'Phone (India)', pattern: '(\\+91[\\-\\s]?)?[0]?[6-9]\\d{9}' },
  { label: 'URL', pattern: 'https?://[\\w\\-]+(\\.[\\w\\-]+)+[\\w\\-.,@?^=%&:/~+#]*' },
  { label: 'IP Address', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b' },
  { label: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])' },
  { label: 'Hex Color', pattern: '#(?:[0-9a-fA-F]{3}){1,2}' },
  { label: 'Credit Card', pattern: '\\b(?:\\d[ -]*?){13,16}\\b' },
  { label: 'PAN (India)', pattern: '[A-Z]{5}\\d{4}[A-Z]' },
  { label: 'Aadhaar (India)', pattern: '\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b' },
  { label: 'Pincode (India)', pattern: '\\b[1-9]\\d{5}\\b' },
  { label: 'HTML Tag', pattern: '<[^>]+>' },
  { label: 'Numbers Only', pattern: '\\d+' },
  { label: 'Alphanumeric', pattern: '[a-zA-Z0-9]+' },
];

export default function RegexGenerator() {
  const [description, setDescription] = useState('');
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const test = (p?: string) => {
    const pat = p || pattern;
    setError('');
    try {
      const regex = new RegExp(pat, 'g');
      const m = testString.match(regex) || [];
      setMatches(m);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Invalid regex');
      setMatches([]);
    }
  };

  const applyTemplate = (p: string) => {
    setPattern(p);
    if (testString) {
      test(p);
    }
  };

  const copy = () => { navigator.clipboard.writeText(pattern); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Regex className="w-4 h-4 inline mr-2" /><strong>Regex Generator:</strong> Choose from common regex patterns or build your own. Test against sample text in real-time.
      </div>
      <div><label className="text-xs text-gray-400 mb-2 block">Common Patterns</label>
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map(t => (<button key={t.label} onClick={() => applyTemplate(t.pattern)} className={`text-xs px-3 py-1.5 rounded-full ${pattern === t.pattern ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'}`}>{t.label}</button>))}
        </div>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2"><label className="text-sm font-semibold">Regex Pattern</label>{pattern && <button onClick={copy} className="text-gray-400 hover:text-white">{copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}</button>}</div>
        <div className="flex items-center gap-2 bg-zinc-800 rounded-lg p-3 font-mono text-sm">
          <span className="text-gray-500">/</span>
          <input value={pattern} onChange={e => setPattern(e.target.value)} className="flex-1 bg-transparent text-green-400 outline-none" placeholder="Enter regex pattern..." />
          <span className="text-gray-500">/g</span>
        </div>
        {error && <div className="text-xs text-red-400 mt-1">{error}</div>}
      </div>
      <div><label className="text-sm block mb-1">Test String</label><textarea value={testString} onChange={e => setTestString(e.target.value)} rows={4} className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 font-mono text-sm" placeholder="Enter test string to match against..." /></div>
      <button onClick={() => test()} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2"><Wand2 className="w-4 h-4" />Test Pattern</button>
      {matches.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="text-sm font-semibold mb-2">Matches ({matches.length})</div>
          <div className="flex flex-wrap gap-2">{matches.map((m, i) => (<span key={i} className="px-3 py-1 bg-green-900/30 border border-green-500/30 rounded text-green-400 text-sm font-mono">{m}</span>))}</div>
        </div>
      )}
      {testString && pattern && matches.length === 0 && !error && (
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 text-sm text-yellow-300 text-center">No matches found</div>
      )}
    </div>
  );
}
