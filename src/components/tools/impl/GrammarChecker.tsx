'use client';
import { useState , memo } from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface Issue { type: 'error' | 'warning' | 'suggestion'; message: string; index: number; }

const GrammarCheckerComponent = function GrammarChecker() {
  const [text, setText] = useState('');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [checked, setChecked] = useState(false);

  const rules: { pattern: RegExp; message: string; type: Issue['type'] }[] = [
    { pattern: /\bi\b(?!['''])/g, message: '"i" should be capitalized to "I"', type: 'error' },
    { pattern: /\s{2,}/g, message: 'Multiple spaces detected', type: 'warning' },
    { pattern: /[.!?]\s*[a-z]/g, message: 'Sentence should start with a capital letter', type: 'error' },
    { pattern: /\b(their|there|they're)\b/gi, message: 'Check usage of their/there/they\'re', type: 'suggestion' },
    { pattern: /\b(your|you're)\b/gi, message: 'Check usage of your/you\'re', type: 'suggestion' },
    { pattern: /\b(its|it's)\b/gi, message: 'Check usage of its/it\'s', type: 'suggestion' },
    { pattern: /\b(then|than)\b/gi, message: 'Check usage of then/than', type: 'suggestion' },
    { pattern: /\b(affect|effect)\b/gi, message: 'Check usage of affect/effect', type: 'suggestion' },
    { pattern: /\b(alot)\b/gi, message: '"alot" should be "a lot"', type: 'error' },
    { pattern: /\b(definately|definatly)\b/gi, message: 'Misspelling: should be "definitely"', type: 'error' },
    { pattern: /\b(recieve)\b/gi, message: 'Misspelling: should be "receive"', type: 'error' },
    { pattern: /\b(seperate)\b/gi, message: 'Misspelling: should be "separate"', type: 'error' },
    { pattern: /\b(occured)\b/gi, message: 'Misspelling: should be "occurred"', type: 'error' },
    { pattern: /\b(untill)\b/gi, message: 'Misspelling: should be "until"', type: 'error' },
    { pattern: /\b(goverment)\b/gi, message: 'Misspelling: should be "government"', type: 'error' },
    { pattern: /,,/g, message: 'Double comma detected', type: 'error' },
    { pattern: /\.\./g, message: 'Double period detected (use "…" for ellipsis)', type: 'warning' },
    { pattern: /\b(could of|should of|would of)\b/gi, message: 'Should be "could have/should have/would have"', type: 'error' },
  ];

  const check = () => {
    const found: Issue[] = [];
    rules.forEach(rule => {
      let match;
      const re = new RegExp(rule.pattern.source, rule.pattern.flags);
      while ((match = re.exec(text)) !== null) {
        found.push({ type: rule.type, message: rule.message, index: match.index });
      }
    });
    found.sort((a, b) => a.index - b.index);
    setIssues(found);
    setChecked(true);
  };

  const icon = (type: Issue['type']) => {
    if (type === 'error') return <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />;
    if (type === 'warning') return <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />;
    return <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />;
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <strong>Grammar & Spell Checker:</strong> Detects common grammar mistakes, misspellings, and style issues. All checks run locally in your browser.
      </div>
      <textarea value={text} onChange={e => { setText(e.target.value); setChecked(false); }} placeholder="Type or paste text to check grammar..." className="w-full h-48 bg-zinc-800 text-white p-4 rounded-lg border border-zinc-700 focus:border-blue-500 resize-none" />
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">Characters: {text.length} | Words: {text.trim().split(/\s+/).filter(Boolean).length}</span>
        <button onClick={check} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">Check Grammar</button>
      </div>
      {checked && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          {issues.length === 0 ? (
            <div className="flex items-center gap-2 text-green-400"><CheckCircle className="w-5 h-5" /> No issues found! Your text looks good.</div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-gray-400">{issues.length} issue{issues.length > 1 ? 's' : ''} found</div>
              {issues.map((issue, i) => (
                <div key={i} className="flex items-start gap-3 bg-zinc-800/50 p-3 rounded-lg">
                  {icon(issue.type)}
                  <div>
                    <div className="text-sm text-white">{issue.message}</div>
                    <div className="text-xs text-gray-500">Position: {issue.index}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(GrammarCheckerComponent);
