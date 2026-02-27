'use client';
import { useState } from 'react';
import { FileText, Copy, Check } from 'lucide-react';

export default function TextSummarizer() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [sentences, setSentences] = useState(3);
  const [copied, setCopied] = useState(false);

  const summarize = () => {
    if (!text.trim()) return;
    const sents = text.match(/[^.!?]+[.!?]+/g) || [text];
    // Score sentences by word frequency
    const wordFreq: Record<string, number> = {};
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    words.forEach(w => { wordFreq[w] = (wordFreq[w] || 0) + 1; });
    const stopWords = new Set(['the','a','an','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','shall','can','to','of','in','for','on','with','at','by','from','as','into','through','during','before','after','above','below','between','out','off','over','under','again','further','then','once','here','there','when','where','why','how','all','each','every','both','few','more','most','other','some','such','no','not','only','own','same','so','than','too','very','just','because','but','and','or','if','while','that','this','it','its','i','me','my','we','our','you','your','he','him','his','she','her','they','them','their']);
    const scored = sents.map((s, i) => {
      const sWords = s.toLowerCase().match(/\b\w+\b/g) || [];
      const score = sWords.reduce((acc, w) => acc + (stopWords.has(w) ? 0 : (wordFreq[w] || 0)), 0) / Math.max(sWords.length, 1);
      return { text: s.trim(), score, index: i };
    });
    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, sentences).sort((a, b) => a.index - b.index);
    setSummary(top.map(s => s.text).join(' '));
  };

  const copy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <FileText className="w-4 h-4 inline mr-2" />
        <strong>Extractive Summary:</strong> Picks the most important sentences from your text using word frequency analysis. 100% client-side.
      </div>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste your article or long text here..." className="w-full h-48 bg-zinc-800 text-white p-4 rounded-lg border border-zinc-700 focus:border-blue-500 resize-none" />
      <div className="flex items-center gap-4">
        <label className="text-sm">Sentences: <input type="number" value={sentences} onChange={e => setSentences(Number(e.target.value))} min={1} max={10} className="w-16 bg-zinc-800 text-white p-1 rounded border border-zinc-700 ml-2" /></label>
        <span className="text-sm text-gray-400">Words: {text.trim().split(/\s+/).filter(Boolean).length}</span>
      </div>
      <button onClick={summarize} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">Summarize</button>
      {summary && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-green-400">Summary</span>
            <button onClick={copy} className="text-sm text-gray-400 hover:text-white flex items-center gap-1">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Copied' : 'Copy'}</button>
          </div>
          <p className="text-gray-200 leading-relaxed">{summary}</p>
          <p className="text-xs text-gray-500 mt-2">Reduced from {text.trim().split(/\s+/).length} to {summary.trim().split(/\s+/).length} words</p>
        </div>
      )}
    </div>
  );
}
