'use client';
import { useState, useRef, useCallback , memo } from 'react';
import { Upload, Download, Palette } from 'lucide-react';

const BackgroundRemoverComponent = function BackgroundRemover() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [threshold, setThreshold] = useState(30);
  const [bgColor, setBgColor] = useState('#ffffff');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setImage(reader.result as string); setResult(null); };
    reader.readAsDataURL(file);
  };

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  const removeBackground = useCallback(() => {
    if (!image || !canvasRef.current) return;
    setProcessing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Sample corners to detect background color
      const corners = [
        [0, 0], [canvas.width - 1, 0],
        [0, canvas.height - 1], [canvas.width - 1, canvas.height - 1],
      ];
      let bgR = 0, bgG = 0, bgB = 0;
      corners.forEach(([x, y]) => {
        const idx = (y * canvas.width + x) * 4;
        bgR += data[idx]; bgG += data[idx + 1]; bgB += data[idx + 2];
      });
      bgR /= 4; bgG /= 4; bgB /= 4;

      // Remove matching pixels
      for (let i = 0; i < data.length; i += 4) {
        const diff = Math.abs(data[i] - bgR) + Math.abs(data[i + 1] - bgG) + Math.abs(data[i + 2] - bgB);
        if (diff < threshold * 3) {
          data[i + 3] = 0; // Transparent
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setResult(canvas.toDataURL('image/png'));
      setProcessing(false);
    };
    img.src = image;
  }, [image, threshold]);

  const download = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result; a.download = 'bg-removed.png'; a.click();
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Palette className="w-4 h-4 inline mr-2" /><strong>Background Remover:</strong> Remove solid-color backgrounds from images. Works best with images that have a uniform background color. All processing is local.
      </div>
      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 text-xs text-yellow-200">⚠️ This is a basic color-matching removal tool. For complex backgrounds, try an AI-powered tool.</div>
      <div className="bg-zinc-900 border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center">
        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" id="bg-upload" />
        <label htmlFor="bg-upload" className="cursor-pointer"><Upload className="w-8 h-8 mx-auto text-gray-500 mb-2" /><div className="text-sm text-gray-400">Upload image with solid background</div></label>
      </div>
      {image && (
        <>
          <div><label className="text-xs block mb-1">Color Tolerance ({threshold})</label><input type="range" min="5" max="80" value={threshold} onChange={e => setThreshold(parseInt(e.target.value))} className="w-full" /><div className="flex justify-between text-xs text-gray-500"><span>Precise</span><span>Aggressive</span></div></div>
          <button onClick={removeBackground} disabled={processing} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:opacity-50">{processing ? 'Processing...' : 'Remove Background'}</button>
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
      <canvas ref={previewRef} className="hidden" />
      {image && result && (
        <div className="grid md:grid-cols-2 gap-4">
          <div><div className="text-xs text-gray-400 mb-1">Original</div><img src={image} alt="Original" className="max-w-full rounded-lg border border-zinc-800" /></div>
          <div><div className="text-xs text-gray-400 mb-1">Background Removed</div><div className="bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjY2NjIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNjY2MiLz48L3N2Zz4=')] rounded-lg border border-zinc-800"><img src={result} alt="Processed" className="max-w-full rounded-lg" /></div></div>
        </div>
      )}
      {result && <button onClick={download} className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2"><Download className="w-4 h-4" />Download PNG (Transparent)</button>}
    </div>
  );
}

export default memo(BackgroundRemoverComponent);
