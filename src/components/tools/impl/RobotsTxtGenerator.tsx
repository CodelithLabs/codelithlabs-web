'use client';
import { useState } from 'react';

export default function RobotsTxtGenerator() {
  const [userAgent, setUserAgent] = useState('*');
  const [allow, setAllow] = useState('/');
  const [disallow, setDisallow] = useState('/admin\n/private');
  const [sitemap, setSitemap] = useState('');
  const [result, setResult] = useState('');

  const generate = () => {
    const allowList = allow.split('\n').filter(a => a.trim()).map(a => `Allow: ${a.trim()}`).join('\n');
    const disallowList = disallow.split('\n').filter(d => d.trim()).map(d => `Disallow: ${d.trim()}`).join('\n');

    let txt = `User-agent: ${userAgent}\n`;
    if (allowList) txt += allowList + '\n';
    if (disallowList) txt += disallowList + '\n';
    if (sitemap) txt += `\nSitemap: ${sitemap}`;

    setResult(txt);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <input
          type="text"
          value={userAgent}
          onChange={e => setUserAgent(e.target.value)}
          placeholder="User-agent (* for all)"
          className="w-full px-4 py-3 bg-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <textarea
          value={allow}
          onChange={e => setAllow(e.target.value)}
          placeholder="Allowed paths (one per line)"
          className="w-full h-24 px-4 py-3 bg-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono"
        />
        <textarea
          value={disallow}
          onChange={e => setDisallow(e.target.value)}
          placeholder="Disallowed paths (one per line)"
          className="w-full h-24 px-4 py-3 bg-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono"
        />
        <input
          type="text"
          value={sitemap}
          onChange={e => setSitemap(e.target.value)}
          placeholder="Sitemap URL (optional)"
          className="w-full px-4 py-3 bg-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <button
        onClick={generate}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
      >
        Generate robots.txt
      </button>

      {result && (
        <textarea
          readOnly
          value={result}
          className="w-full h-48 bg-zinc-900 p-4 rounded-lg text-green-400 font-mono text-sm"
        />
      )}
    </div>
  );
}
