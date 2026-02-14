'use client';
import { useState } from 'react';
export default function TextToSlug() {
  const [input, setInput] = useState('');
  return (
    <div className="space-y-4">
      <input type="text" value={input} onChange={e => setInput(e.target.value)} className="w-full p-3 bg-zinc-800 rounded text-white" placeholder="Hello World!" />
      <div className="bg-zinc-900 p-4 rounded-xl text-green-400 font-mono">{input.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')}</div>
    </div>
  );
}
