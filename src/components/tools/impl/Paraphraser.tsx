'use client';
import { useState } from 'react';
import { RefreshCw, Copy, Check } from 'lucide-react';

export default function Paraphraser() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<'formal' | 'casual' | 'shorter' | 'longer'>('formal');
  const [copied, setCopied] = useState(false);

  const synonyms: Record<string, string[]> = {
    good: ['excellent', 'great', 'superb', 'fine', 'outstanding'],
    bad: ['poor', 'terrible', 'awful', 'dreadful', 'inferior'],
    big: ['large', 'enormous', 'massive', 'substantial', 'immense'],
    small: ['tiny', 'little', 'compact', 'minor', 'miniature'],
    fast: ['quick', 'rapid', 'swift', 'speedy', 'prompt'],
    slow: ['gradual', 'unhurried', 'leisurely', 'sluggish', 'delayed'],
    happy: ['joyful', 'delighted', 'pleased', 'content', 'cheerful'],
    sad: ['unhappy', 'sorrowful', 'melancholy', 'gloomy', 'dejected'],
    important: ['crucial', 'significant', 'vital', 'essential', 'critical'],
    help: ['assist', 'aid', 'support', 'facilitate', 'enable'],
    make: ['create', 'produce', 'construct', 'build', 'develop'],
    use: ['utilize', 'employ', 'apply', 'leverage', 'adopt'],
    get: ['obtain', 'acquire', 'receive', 'gain', 'secure'],
    show: ['demonstrate', 'display', 'illustrate', 'reveal', 'present'],
    think: ['believe', 'consider', 'contemplate', 'reckon', 'suppose'],
    very: ['extremely', 'remarkably', 'exceptionally', 'particularly', 'significantly'],
    nice: ['pleasant', 'agreeable', 'lovely', 'wonderful', 'delightful'],
    hard: ['difficult', 'challenging', 'demanding', 'arduous', 'complex'],
    easy: ['simple', 'straightforward', 'effortless', 'uncomplicated', 'basic'],
    start: ['begin', 'commence', 'initiate', 'launch', 'embark'],
  };

  const paraphrase = () => {
    if (!text.trim()) return;
    let words = text.split(/(\s+)/);
    words = words.map(w => {
      const lower = w.toLowerCase().replace(/[^a-z]/g, '');
      if (synonyms[lower]) {
        const syns = synonyms[lower];
        const replacement = syns[Math.floor(Math.random() * syns.length)];
        if (w[0] === w[0].toUpperCase()) return replacement.charAt(0).toUpperCase() + replacement.slice(1);
        return replacement;
      }
      return w;
    });
    let output = words.join('');
    if (mode === 'formal') output = output.replace(/don't/gi, 'do not').replace(/can't/gi, 'cannot').replace(/won't/gi, 'will not').replace(/isn't/gi, 'is not');
    if (mode === 'casual') output = output.replace(/do not/gi, "don't").replace(/cannot/gi, "can't").replace(/will not/gi, "won't");
    setResult(output);
  };

  const copy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <RefreshCw className="w-4 h-4 inline mr-2" />
        <strong>Text Paraphraser:</strong> Rewrites text using synonyms and style transformations. Runs entirely in your browser.
      </div>
      <div className="flex gap-2">
        {(['formal', 'casual', 'shorter', 'longer'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === m ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-gray-400 hover:text-white'}`}>{m.charAt(0).toUpperCase() + m.slice(1)}</button>
        ))}
      </div>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Enter text to paraphrase..." className="w-full h-40 bg-zinc-800 text-white p-4 rounded-lg border border-zinc-700 focus:border-blue-500 resize-none" />
      <button onClick={paraphrase} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">Paraphrase</button>
      {result && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="flex justify-between mb-2"><span className="text-sm font-semibold text-green-400">Result ({mode})</span>
            <button onClick={copy} className="text-sm text-gray-400 hover:text-white flex items-center gap-1">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Copied' : 'Copy'}</button>
          </div>
          <p className="text-gray-200 leading-relaxed">{result}</p>
        </div>
      )}
    </div>
  );
}
