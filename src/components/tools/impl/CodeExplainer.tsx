'use client';
import { useState } from 'react';
import { FileCode, Copy, Check, ArrowRight } from 'lucide-react';

export default function CodeExplainer() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [explanation, setExplanation] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const analyze = () => {
    if (!code.trim()) return;
    const lines = code.split('\n').filter(l => l.trim());
    const explanations: string[] = [];
    const patterns: [RegExp, string][] = [
      [/^import\s+/, '📦 Import statement - brings in external modules/libraries'],
      [/^export\s+(default\s+)?/, '📤 Export statement - makes this available for other files to use'],
      [/^(const|let|var)\s+\w+\s*=\s*/, '📝 Variable declaration - stores a value for later use'],
      [/function\s+\w+|=>\s*{|=>\s*\w/, '⚡ Function definition - a reusable block of code'],
      [/if\s*\(/, '🔀 Conditional (if) - executes code only when a condition is true'],
      [/else\s*{|else\s+if/, '🔀 Else branch - executes when the if condition is false'],
      [/for\s*\(|\.forEach\(|\.map\(/, '🔄 Loop/iteration - repeats code for each item'],
      [/while\s*\(/, '🔄 While loop - repeats while a condition is true'],
      [/return\s+/, '↩️ Return statement - sends a value back from the function'],
      [/class\s+\w+/, '🏗️ Class definition - a blueprint for creating objects'],
      [/new\s+\w+/, '🆕 Object instantiation - creates a new instance of a class'],
      [/async\s+|await\s+/, '⏳ Async/Await - handles asynchronous operations'],
      [/\.then\(|\.catch\(/, '⏳ Promise chain - handles async success/error'],
      [/try\s*{/, '🛡️ Try block - wraps code that might throw errors'],
      [/catch\s*\(/, '🛡️ Catch block - handles errors from the try block'],
      [/throw\s+/, '💥 Throw - creates/throws an error'],
      [/console\.(log|error|warn)/, '🖥️ Console output - prints debugging information'],
      [/document\.|window\./, '🌐 DOM/Browser API - interacts with the web page'],
      [/useState|useEffect|useRef/, '⚛️ React Hook - manages component state/effects'],
      [/interface\s+|type\s+\w+\s*=/, '📋 TypeScript type definition - defines data shape'],
      [/switch\s*\(/, '🔀 Switch statement - multi-branch conditional'],
      [/\/\/.*$/, '💬 Comment - developer note (not executed)'],
      [/\/\*/, '💬 Block comment start'],
      [/\*\//, '💬 Block comment end'],
      [/\.\w+\(/, '📞 Method call - invokes a function on an object'],
      [/=\s*\[/, '📋 Array creation - stores a list of values'],
      [/=\s*{/, '📦 Object creation - stores key-value pairs'],
    ];

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed === '{' || trimmed === '}' || trimmed === ');') return;
      let found = false;
      for (const [pattern, desc] of patterns) {
        if (pattern.test(trimmed)) {
          explanations.push(`Line ${i + 1}: ${desc}\n  → \`${trimmed.substring(0, 80)}${trimmed.length > 80 ? '...' : ''}\``);
          found = true;
          break;
        }
      }
      if (!found) explanations.push(`Line ${i + 1}: 📌 Code statement\n  → \`${trimmed.substring(0, 80)}${trimmed.length > 80 ? '...' : ''}\``);
    });
    setExplanation(explanations);
  };

  const copy = () => { navigator.clipboard.writeText(explanation.join('\n\n')); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <FileCode className="w-4 h-4 inline mr-2" /><strong>Code Explainer:</strong> Analyzes your code line-by-line and explains what each part does. Great for learning and code review.
      </div>
      <div className="flex gap-2">
        {['javascript', 'typescript', 'python', 'general'].map(l => (
          <button key={l} onClick={() => setLanguage(l)} className={`px-3 py-1 rounded text-sm ${language === l ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-gray-400'}`}>{l}</button>
        ))}
      </div>
      <textarea value={code} onChange={e => setCode(e.target.value)} placeholder={`Paste your ${language} code here...`} className="w-full h-48 bg-zinc-800 text-green-400 p-4 rounded-lg border border-zinc-700 focus:border-blue-500 resize-none font-mono text-sm" />
      <button onClick={analyze} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"><ArrowRight className="w-5 h-5" />Explain Code</button>
      {explanation.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="flex justify-between mb-3"><span className="font-semibold text-sm">Explanation ({explanation.length} items)</span>
            <button onClick={copy} className="text-sm text-gray-400 hover:text-white flex items-center gap-1">{copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy</button>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {explanation.map((exp, i) => (
              <div key={i} className="bg-zinc-800/50 p-3 rounded-lg text-sm whitespace-pre-wrap"><span className="text-gray-200">{exp}</span></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
