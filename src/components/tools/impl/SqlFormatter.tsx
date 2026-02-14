'use client';
import { useState } from 'react';

export default function SqlFormatter() {
  const [sql, setSql] = useState('');
  const format = () => {
    setSql(sql.replace(/\s+/g, ' ').replace(/(SELECT|FROM|WHERE|AND|OR|ORDER BY|GROUP BY|LIMIT|INSERT|UPDATE|DELETE)/gi, '\n$1'));
  };
  return (
    <div className="space-y-4">
      <textarea value={sql} onChange={e => setSql(e.target.value)} className="w-full h-64 bg-zinc-800 p-4 rounded-xl text-white font-mono" placeholder="SELECT * FROM table..." />
      <button onClick={format} className="px-6 py-2 bg-blue-600 text-white rounded-lg">Format SQL</button>
    </div>
  );
}
