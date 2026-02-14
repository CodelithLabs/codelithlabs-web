'use client';
import { useState } from 'react';

export default function JwtDecoder() {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState('');

  const decode = () => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Invalid JWT format');
      const payload = JSON.parse(atob(parts[1]));
      setDecoded(JSON.stringify(payload, null, 2));
    } catch (e) { setDecoded('Invalid Token'); }
  };

  return (
    <div className="space-y-4">
      <input type="text" value={token} onChange={e => setToken(e.target.value)} className="w-full p-3 bg-zinc-800 rounded text-white" placeholder="Paste JWT Token..." />
      <button onClick={decode} className="px-6 py-2 bg-blue-600 text-white rounded-lg">Decode</button>
      <pre className="bg-zinc-900 p-4 rounded-xl text-green-400 overflow-auto">{decoded}</pre>
    </div>
  );
}
