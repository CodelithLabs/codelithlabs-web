'use client';

import { memo, useState, useCallback, useRef } from 'react';

function Base64ImageEncoder() {
  const [result, setResult] = useState<{ base64: string; mimeType: string; size: number; dataUrl: string } | null>(null);
  const [url, setUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1];
      setResult({
        base64,
        mimeType: file.type,
        size: file.size,
        dataUrl,
      });
    };
    reader.readAsDataURL(file);
  }, []);

  const handleUrlEncode = useCallback(async () => {
    if (!url.trim()) return;
    
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(',')[1];
        setResult({
          base64,
          mimeType: blob.type,
          size: blob.size,
          dataUrl,
        });
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      alert('Failed to fetch image. Make sure the URL is accessible and allows CORS.');
    }
  }, [url]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Base64 Image Encoder</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Upload Image</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer"
            />
          </div>
          <div className="text-center text-zinc-400">or</div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Image URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/image.png"
                className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleUrlEncode}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Encode
              </button>
            </div>
          </div>
        </div>
      </div>

      {result && (
        <>
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
            <div className="flex items-center justify-center p-4 bg-zinc-900 rounded-lg" style={{ backgroundImage: 'linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)', backgroundSize: '20px 20px' }}>
              <img src={result.dataUrl} alt="Preview" className="max-w-full max-h-64" />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-zinc-900 rounded-lg p-3 text-center">
                <div className="text-green-400 font-mono">{result.mimeType}</div>
                <div className="text-sm text-zinc-400">MIME Type</div>
              </div>
              <div className="bg-zinc-900 rounded-lg p-3 text-center">
                <div className="text-blue-400 font-mono">{formatSize(result.size)}</div>
                <div className="text-sm text-zinc-400">Original Size</div>
              </div>
              <div className="bg-zinc-900 rounded-lg p-3 text-center">
                <div className="text-yellow-400 font-mono">{formatSize(result.base64.length)}</div>
                <div className="text-sm text-zinc-400">Base64 Size</div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Base64 String</h3>
              <button
                onClick={() => navigator.clipboard.writeText(result.base64)}
                className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded transition-colors"
              >
                Copy Base64
              </button>
            </div>
            <pre className="bg-zinc-900 rounded-lg p-4 text-green-400 text-xs overflow-x-auto font-mono max-h-32 overflow-y-auto break-all">
              {result.base64}
            </pre>
          </div>

          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Data URL</h3>
              <button
                onClick={() => navigator.clipboard.writeText(result.dataUrl)}
                className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded transition-colors"
              >
                Copy Data URL
              </button>
            </div>
            <pre className="bg-zinc-900 rounded-lg p-4 text-blue-400 text-xs overflow-x-auto font-mono max-h-32 overflow-y-auto break-all">
              {result.dataUrl}
            </pre>
          </div>
        </>
      )}
    </div>
  );
}

export default memo(Base64ImageEncoder);
