'use client';
import { useState, useRef, useEffect } from 'react';

export default function ImageFilters() {
  const [src, setSrc] = useState<string | null>(null);
  const [filter, setFilter] = useState('none');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setSrc(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!src || !canvasRef.current) return;
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.filter = filter;
      ctx.drawImage(img, 0, 0);
    };
  }, [src, filter]);

  return (
    <div className="space-y-6">
      <input type="file" accept="image/*" onChange={handleUpload} className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-blue-600 file:text-white"/>
      <div className="flex gap-2 flex-wrap">
        {['none', 'grayscale(100%)', 'sepia(100%)', 'invert(100%)', 'blur(5px)', 'brightness(150%)'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className="px-3 py-1 bg-zinc-800 rounded text-xs text-white capitalize border border-zinc-700 hover:border-blue-500">{f}</button>
        ))}
      </div>
      <div className="bg-zinc-900 p-4 rounded-xl overflow-hidden">
        <canvas ref={canvasRef} className="max-w-full h-auto mx-auto rounded" />
      </div>
    </div>
  );
}
