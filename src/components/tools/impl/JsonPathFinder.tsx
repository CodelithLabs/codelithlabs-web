'use client';
import { useState , memo } from 'react';
import { Database, Copy, Check } from 'lucide-react';

const JsonPathFinderComponent = function JsonPathFinder() {
  const [input, setInput] = useState('{\n  "name": "John",\n  "age": 30,\n  "address": {\n    "city": "Mumbai",\n    "state": "Maharashtra"\n  },\n  "skills": ["JavaScript", "Python", "Go"]\n}');
  const [path, setPath] = useState('');
  const [result, setResult] = useState<string>('');
  const [paths, setPaths] = useState<string[]>([]);
  const [copied, setCopied] = useState('');
  const [error, setError] = useState('');

  const getAllPaths = (obj: unknown, prefix = '$'): string[] => {
    const results: string[] = [];
    if (obj && typeof obj === 'object') {
      if (Array.isArray(obj)) {
        results.push(prefix);
        obj.forEach((item, i) => {
          results.push(...getAllPaths(item, `${prefix}[${i}]`));
        });
      } else {
        results.push(prefix);
        Object.entries(obj as Record<string, unknown>).forEach(([key, val]) => {
          const newPath = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? `${prefix}.${key}` : `${prefix}["${key}"]`;
          results.push(...getAllPaths(val, newPath));
        });
      }
    } else {
      results.push(prefix);
    }
    return results;
  };

  const resolveJsonPath = (obj: unknown, jsonPath: string): unknown => {
    const parts = jsonPath.replace(/^\$\.?/, '').split(/\.|\[|\]/).filter(Boolean).map(p => p.replace(/^"|"$/g, ''));
    let current: unknown = obj;
    for (const part of parts) {
      if (current === null || current === undefined) return undefined;
      if (typeof current === 'object') {
        if (Array.isArray(current)) {
          const idx = parseInt(part);
          current = current[idx];
        } else {
          current = (current as Record<string, unknown>)[part];
        }
      } else {
        return undefined;
      }
    }
    return current;
  };

  const analyze = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      const allPaths = getAllPaths(parsed);
      setPaths(allPaths);
      if (path) {
        const val = resolveJsonPath(parsed, path);
        setResult(JSON.stringify(val, null, 2));
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
    }
  };

  const queryPath = (p: string) => {
    setPath(p);
    try {
      const parsed = JSON.parse(input);
      const val = resolveJsonPath(parsed, p);
      setResult(JSON.stringify(val, null, 2));
    } catch { /* */ }
  };

  const copy = (text: string) => { navigator.clipboard.writeText(text); setCopied(text); setTimeout(() => setCopied(''), 1500); };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Database className="w-4 h-4 inline mr-2" /><strong>JSON Path Finder:</strong> Explore JSON data, discover all paths, and query values using JSONPath-like syntax.
      </div>
      <div><label className="text-sm block mb-1">JSON Input</label><textarea value={input} onChange={e => setInput(e.target.value)} rows={8} className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 font-mono text-xs" /></div>
      <div className="flex gap-2">
        <input value={path} onChange={e => setPath(e.target.value)} placeholder="$.address.city" className="flex-1 bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 font-mono text-sm" />
        <button onClick={analyze} className="px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">Query</button>
      </div>
      {error && <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-sm text-red-300">{error}</div>}
      {result && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg">
          <div className="flex justify-between items-center px-4 py-2 border-b border-zinc-800"><span className="text-xs text-gray-400">Result for: {path}</span><button onClick={() => copy(result)} className="text-gray-500 hover:text-white">{copied === result ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}</button></div>
          <pre className="p-4 text-sm font-mono text-green-400 overflow-auto max-h-48">{result}</pre>
        </div>
      )}
      {paths.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg">
          <div className="px-4 py-2 border-b border-zinc-800 text-xs font-semibold text-gray-400">All Paths ({paths.length})</div>
          <div className="max-h-64 overflow-y-auto">
            {paths.map((p, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-1.5 border-b border-zinc-800/50 text-xs hover:bg-zinc-800/50 cursor-pointer" onClick={() => queryPath(p)}>
                <code className="text-blue-400 font-mono">{p}</code>
                <button onClick={e => { e.stopPropagation(); copy(p); }} className="text-gray-600 hover:text-white">{copied === p ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(JsonPathFinderComponent);
