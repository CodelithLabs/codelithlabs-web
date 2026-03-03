'use client';
import { useState, useCallback, memo } from 'react';
import { FileText, Copy, Sparkles, ArrowRight } from 'lucide-react';

const LongFormToShortComponent = function LongFormToShort() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [targetLength, setTargetLength] = useState<'tweet' | 'summary' | 'abstract'>('summary');
  const [copied, setCopied] = useState(false);

  const shortenContent = useCallback(() => {
    if (!input.trim()) return;

    const sentences = input
      .replace(/([.!?])\s+/g, '$1|')
      .split('|')
      .map(s => s.trim())
      .filter(s => s.length > 10);

    // Score sentences by importance
    const scored = sentences.map((sentence, idx) => {
      let score = 0;
      // First sentences are usually important
      if (idx === 0) score += 5;
      if (idx === 1) score += 3;
      // Contains numbers/stats
      if (/\d+%?/.test(sentence)) score += 3;
      // Contains key phrases
      if (/important|key|main|essential|critical|significant|conclusion|result|found|discovered/i.test(sentence)) score += 4;
      // Length (prefer medium-length sentences)
      if (sentence.length > 50 && sentence.length < 150) score += 2;
      // Contains quotes
      if (/".*"/.test(sentence)) score += 2;
      // Last sentence often contains conclusion
      if (idx === sentences.length - 1) score += 3;
      return { sentence, score };
    });

    // Sort by score
    const sortedByScore = [...scored].sort((a, b) => b.score - a.score);

    let result = '';
    
    switch (targetLength) {
      case 'tweet':
        // ~280 chars
        const topSentence = sortedByScore[0]?.sentence || '';
        result = topSentence.length > 270 ? topSentence.substring(0, 267) + '...' : topSentence;
        break;
        
      case 'summary':
        // ~500 chars, 3-4 sentences
        const topSentences = sortedByScore.slice(0, 4);
        // Re-order by original position
        const ordered = topSentences.sort((a, b) => 
          sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence)
        );
        result = ordered.map(s => s.sentence).join(' ');
        if (result.length > 500) {
          result = result.substring(0, 497) + '...';
        }
        break;
        
      case 'abstract':
        // ~1000 chars, 5-7 sentences
        const abstracts = sortedByScore.slice(0, 7);
        const orderedAbstract = abstracts.sort((a, b) => 
          sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence)
        );
        result = orderedAbstract.map(s => s.sentence).join(' ');
        if (result.length > 1000) {
          result = result.substring(0, 997) + '...';
        }
        break;
    }

    setOutput(result);
  }, [input, targetLength]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const lengthTargets = {
    tweet: { label: 'Tweet', chars: '~280', desc: 'Perfect for Twitter/X' },
    summary: { label: 'Summary', chars: '~500', desc: 'Quick overview' },
    abstract: { label: 'Abstract', chars: '~1000', desc: 'Detailed summary' },
  };

  const reductionPercentage = input.length > 0 && output.length > 0 
    ? Math.round((1 - output.length / input.length) * 100) 
    : 0;

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <FileText className="w-4 h-4 inline mr-2" />
        <strong>Long Form to Short:</strong> Condense long articles, emails, or documents into shorter formats while preserving key information.
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Paste your long-form content:
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your article, email, document, or any long text here..."
          className="w-full h-48 bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-white placeholder-zinc-500 resize-y focus:outline-none focus:border-blue-500"
        />
        <div className="text-xs text-zinc-500 mt-1">{input.length} characters</div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">Target length</label>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(lengthTargets) as Array<keyof typeof lengthTargets>).map(key => (
            <button
              key={key}
              onClick={() => setTargetLength(key)}
              className={`p-3 rounded-lg border text-left transition-colors ${
                targetLength === key
                  ? 'bg-blue-900/30 border-blue-500/50'
                  : 'bg-zinc-800 border-zinc-700 hover:border-zinc-600'
              }`}
            >
              <div className="font-medium text-white">{lengthTargets[key].label}</div>
              <div className="text-xs text-zinc-400">{lengthTargets[key].chars}</div>
              <div className="text-xs text-zinc-500">{lengthTargets[key].desc}</div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={shortenContent}
        disabled={!input.trim()}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        Shorten Content
      </button>

      {output && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-white">Shortened Version</h3>
              {reductionPercentage > 0 && (
                <span className="text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded">
                  {reductionPercentage}% shorter
                </span>
              )}
            </div>
            <button
              onClick={copyToClipboard}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <p className="text-zinc-200 whitespace-pre-wrap">{output}</p>
            <div className="flex items-center gap-2 text-xs text-zinc-500 mt-3 pt-3 border-t border-zinc-800">
              <span>{input.length} chars</span>
              <ArrowRight className="w-3 h-3" />
              <span>{output.length} chars</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(LongFormToShortComponent);
