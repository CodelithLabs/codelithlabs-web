'use client';
import { useState } from 'react';
export default function BinaryConverter() {
  const [text, setText] = useState('Hello');
  const toBinary = (str: string) => str.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
  return (
    <div className="space-y-4">
      <input type="text" value={text} onChange={e => setText(e.target.value)} className="w-full p-3 bg-zinc-800 rounded text-white" />
      <div className="bg-zinc-900 p-4 rounded-xl text-green-400 font-mono break-all">{toBinary(text)}</div>
    </div>
  );
}
