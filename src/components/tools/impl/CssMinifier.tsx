'use client';
import { useState } from 'react';

export default function CssMinifier() {
  const [css, setCss] = useState('');
  const minify = () => {
    setCss(css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s?([:;{}])\s?/g, '$1').trim());
  };
  return (
    <div className="space-y-4">
      <textarea value={css} onChange={e => setCss(e.target.value)} className="w-full h-64 bg-zinc-800 p-4 rounded-xl text-white font-mono" placeholder=".class { color: red; }" />
      <button onClick={minify} className="px-6 py-2 bg-blue-600 text-white rounded-lg">Minify CSS</button>
    </div>
  );
}
