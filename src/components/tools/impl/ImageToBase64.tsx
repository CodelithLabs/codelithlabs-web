'use client';
import { useState } from 'react';

export default function ImageToBase64() {
  const [base64, setBase64] = useState('');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setBase64(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-blue-600 file:text-white"
      />
      {base64 && (
        <div className="space-y-4">
          <textarea
            readOnly
            value={base64}
            className="w-full h-64 bg-zinc-900 p-4 rounded text-green-400 font-mono text-xs"
            placeholder="Base64 Output"
          />
          <button
            onClick={() => navigator.clipboard.writeText(base64)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}
