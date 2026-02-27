'use client';
import { useState } from 'react';
import { Send, Loader2, Copy, Check } from 'lucide-react';

interface ApiResponse { status: number; statusText: string; headers: Record<string, string>; body: string; time: number; size: number; }

export default function ApiTester() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  const [headers, setHeaders] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const send = async () => {
    setLoading(true); setError(''); setResult(null);
    try {
      const hdrs: Record<string, string> = {};
      if (headers.trim()) {
        headers.split('\n').forEach(line => {
          const [key, ...vals] = line.split(':');
          if (key && vals.length) hdrs[key.trim()] = vals.join(':').trim();
        });
      }
      if (body && !hdrs['Content-Type']) hdrs['Content-Type'] = 'application/json';

      const start = performance.now();
      const res = await fetch(url, {
        method,
        headers: hdrs,
        body: ['POST', 'PUT', 'PATCH'].includes(method) ? body : undefined,
      });
      const time = performance.now() - start;
      const text = await res.text();
      const respHeaders: Record<string, string> = {};
      res.headers.forEach((v, k) => { respHeaders[k] = v; });

      setResult({ status: res.status, statusText: res.statusText, headers: respHeaders, body: text, time, size: new Blob([text]).size });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    }
    setLoading(false);
  };

  const statusColor = (s: number) => s < 300 ? 'text-green-400' : s < 400 ? 'text-yellow-400' : 'text-red-400';
  const copyBody = () => { if (result) { navigator.clipboard.writeText(result.body); setCopied(true); setTimeout(() => setCopied(false), 1500); } };

  const formatJson = (s: string) => { try { return JSON.stringify(JSON.parse(s), null, 2); } catch { return s; } };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Send className="w-4 h-4 inline mr-2" /><strong>API Tester:</strong> Test REST API endpoints with custom methods, headers, and body. Similar to Postman, right in your browser.
      </div>
      <div className="flex gap-2">
        <select value={method} onChange={e => setMethod(e.target.value)} className="bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 font-mono font-bold">
          {['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].map(m => <option key={m}>{m}</option>)}
        </select>
        <input value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="https://api.example.com/endpoint" className="flex-1 bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 font-mono text-sm" />
        <button onClick={send} disabled={loading} className="px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center gap-2 disabled:opacity-50">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}Send</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="text-xs block mb-1">Headers (one per line: Key: Value)</label><textarea value={headers} onChange={e => setHeaders(e.target.value)} rows={3} placeholder="Authorization: Bearer token\nContent-Type: application/json" className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 font-mono text-xs" /></div>
        {['POST', 'PUT', 'PATCH'].includes(method) && (
          <div><label className="text-xs block mb-1">Request Body (JSON)</label><textarea value={body} onChange={e => setBody(e.target.value)} rows={3} placeholder='{"key": "value"}' className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 font-mono text-xs" /></div>
        )}
      </div>
      <div className="flex gap-2 flex-wrap">
        {[
          { label: 'JSONPlaceholder', url: 'https://jsonplaceholder.typicode.com/posts/1' },
          { label: 'Cat Fact', url: 'https://catfact.ninja/fact' },
          { label: 'Random User', url: 'https://randomuser.me/api/' },
        ].map(s => (
          <button key={s.label} onClick={() => { setUrl(s.url); setMethod('GET'); }} className="text-xs px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-full text-gray-400">{s.label}</button>
        ))}
      </div>
      {error && <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-sm text-red-300">{error}</div>}
      {result && (
        <div className="space-y-3">
          <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-lg p-3">
            <span className={`text-2xl font-bold font-mono ${statusColor(result.status)}`}>{result.status}</span>
            <span className="text-sm text-gray-400">{result.statusText}</span>
            <span className="ml-auto text-xs text-gray-500">{result.time.toFixed(0)}ms • {(result.size / 1024).toFixed(1)}KB</span>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg">
            <div className="flex justify-between items-center px-4 py-2 border-b border-zinc-800"><span className="text-xs font-semibold text-gray-400">Response Body</span><button onClick={copyBody} className="text-gray-500 hover:text-white">{copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}</button></div>
            <pre className="p-4 text-xs font-mono text-green-400 overflow-auto max-h-96 whitespace-pre-wrap">{formatJson(result.body)}</pre>
          </div>
          <details className="bg-zinc-900 border border-zinc-800 rounded-lg">
            <summary className="px-4 py-2 text-xs font-semibold text-gray-400 cursor-pointer">Response Headers ({Object.keys(result.headers).length})</summary>
            <div className="px-4 pb-3">{Object.entries(result.headers).map(([k, v]) => (<div key={k} className="flex gap-2 text-xs py-1 border-b border-zinc-800/50"><span className="text-blue-400 font-mono">{k}:</span><span className="text-gray-300 break-all">{v}</span></div>))}</div>
          </details>
        </div>
      )}
    </div>
  );
}
