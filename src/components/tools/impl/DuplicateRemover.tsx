'use client';
import { useState } from 'react';
export default function DuplicateRemover() {
  const [text, setText] = useState('');
  const process = () => setText([...new Set(text.split('\n'))].join('\n'));
  return (
    <div className="space-y-4">
      <textarea value={text} onChange={e => setText(e.target.value)} className="w-full h-64 bg-zinc-800 p-4 rounded text-white" placeholder="Paste list..." />
      <button onClick={process} className="px-6 py-2 bg-blue-600 text-white rounded">Remove Duplicates</button>
    </div>
  );
}
