'use client';
import { useState } from 'react';

export default function JsMinifier() {
  const [js, setJs] = useState('');
  const [minified, setMinified] = useState('');

  const minify = () => {
    try {
      // Basic minification: remove comments, extra whitespace, newlines
      let result = js
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
        .replace(/\/\/.*/g, '') // Remove single-line comments
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/\s*([{}()\[\];,:<>=+\-*/%!&|?])\s*/g, '$1') // Remove spaces around operators
        .trim();

      setMinified(result);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
      setMinified(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <textarea
        value={js}
        onChange={e => setJs(e.target.value)}
        className="h-64 bg-zinc-800 p-4 rounded text-white font-mono text-sm"
        placeholder="function hello() {&#10;  console.log('Hello');&#10;}"
      />
      <textarea
        readOnly
        value={minified}
        className="h-64 bg-zinc-900 p-4 rounded text-green-400 font-mono text-sm"
        placeholder="Minified output"
      />
      <button
        onClick={minify}
        className="col-span-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Minify JavaScript
      </button>
    </div>
  );
}
