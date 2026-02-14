'use client';
import { useState } from 'react';

export default function SitemapGenerator() {
  const [urls, setUrls] = useState('');
  const [sitemap, setSitemap] = useState('');

  const generate = () => {
    const urlList = urls.split('\n').filter(u => u.trim());
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlList.map(url => `  <url>
    <loc>${url.trim()}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;
    setSitemap(xml);
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <textarea
        value={urls}
        onChange={e => setUrls(e.target.value)}
        className="h-64 bg-zinc-800 p-4 rounded text-white font-mono"
        placeholder="https://example.com/&#10;https://example.com/about&#10;https://example.com/contact"
      />
      <textarea
        readOnly
        value={sitemap}
        className="h-64 bg-zinc-900 p-4 rounded text-green-400 font-mono text-xs"
        placeholder="Sitemap XML Output"
      />
      <button
        onClick={generate}
        className="col-span-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Generate Sitemap
      </button>
    </div>
  );
}
