'use client';
import { useState } from 'react';

export default function OpenGraphGenerator() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('website');
  const [result, setResult] = useState('');

  const generate = () => {
    const tags = `<!-- Open Graph / Facebook -->
<meta property="og:type" content="${type}">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${image}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${url}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">
<meta property="twitter:image" content="${image}">`;
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
          placeholder="Description"
          className="w-full h-24 px-4 py-3 bg-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        />
        <input
          type="text"
          value={image}
          onChange={e => setImage(e.target.value)}
          placeholder="Image URL (https://...)"
          className="w-full px-4 py-3 bg-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="Page URL (https://...)"
          className="w-full px-4 py-3 bg-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="w-full px-4 py-3 bg-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="website">Website</option>
          <option value="article">Article</option>
          <option value="product">Product</option>
        </select>
      </div>

      <button
        onClick={generate}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
      >
        Generate OG Tags
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
