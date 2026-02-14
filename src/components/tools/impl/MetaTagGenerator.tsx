'use client';
import { useState } from 'react';

export default function MetaTagGenerator() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [result, setResult] = useState('');

  const generate = () => {
    const tags = `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="keywords" content="${keywords}">
<meta name="author" content="${author}">
<meta name="robots" content="index, follow">`;
    setResult(tags);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Page Title"
          className="w-full px-4 py-3 bg-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Meta Description (150-160 characters)"
          className="w-full h-24 px-4 py-3 bg-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        />
        <input
          type="text"
          value={keywords}
          onChange={e => setKeywords(e.target.value)}
          placeholder="Keywords (comma separated)"
          className="w-full px-4 py-3 bg-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="text"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          placeholder="Author Name"
          className="w-full px-4 py-3 bg-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <button
        onClick={generate}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
      >
        Generate Meta Tags
      </button>

      {result && (
        <textarea
          readOnly
          value={result}
          className="w-full h-64 bg-zinc-900 p-4 rounded-lg text-green-400 font-mono text-sm"
        />
      )}
    </div>
  );
}
