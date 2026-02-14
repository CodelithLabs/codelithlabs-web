'use client';
import { useState } from 'react';

export default function HtmlFormatter() {
  const [html, setHtml] = useState('');
  const [formatted, setFormatted] = useState('');

  const format = () => {
    const indent = (str: string): string => {
      let level = 0;
      const lines: string[] = [];

      str.split(/>\s*</).forEach((tag, i) => {
        if (i === 0) tag = tag.substring(tag.indexOf('<'));
        if (i === str.split(/>\s*</).length - 1) tag = tag.substring(0, tag.lastIndexOf('>') + 1);

        if (tag.match(/^\/\w/)) level--;

        lines.push('  '.repeat(Math.max(0, level)) + '<' + tag + '>');

        if (tag.match(/^<?\w[^>]*[^\/]$/) && !tag.startsWith('!')) level++;
      });

      return lines.join('\n');
    };

    try {
      const minified = html.replace(/>\s+</g, '><').trim();
      setFormatted(indent(minified));
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
      setFormatted(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <textarea
        value={html}
        onChange={e => setHtml(e.target.value)}
        className="h-64 bg-zinc-800 p-4 rounded text-white font-mono text-sm"
        placeholder="<div><p>Paste your HTML here...</p></div>"
      />
      <textarea
        readOnly
        value={formatted}
        className="h-64 bg-zinc-900 p-4 rounded text-green-400 font-mono text-sm"
        placeholder="Formatted output"
      />
      <button
        onClick={format}
        className="col-span-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Format HTML
      </button>
    </div>
  );
}
