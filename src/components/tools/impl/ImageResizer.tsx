'use client';
import { useState, useRef } from 'react';

export default function ImageResizer() {
  const [img, setImg] = useState<string | null>(null);
  const [width, setWidth] = useState('800');
  const [height, setHeight] = useState('600');
  const [resized, setResized] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImg(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const resize = () => {
    if (!img || !canvasRef.current) return;
    const image = new Image();
    image.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = parseInt(width);
      canvas.height = parseInt(height);
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(image, 0, 0, parseInt(width), parseInt(height));
      setResized(canvas.toDataURL('image/png'));
    };
    image.src = img;
  };

  return (
    <div className="space-y-6">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-blue-600 file:text-white"
      />
      {img && (
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            value={width}
            onChange={e => setWidth(e.target.value)}
            placeholder="Width"
            className="px-4 py-2 bg-zinc-800 rounded text-white"
          />
          <input
            type="number"
            value={height}
            onChange={e => setHeight(e.target.value)}
            placeholder="Height"
            className="px-4 py-2 bg-zinc-800 rounded text-white"
          />
        </div>
      )}
      <button
        onClick={resize}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Resize Image
      </button>
      <canvas ref={canvasRef} className="hidden" />
      {resized && (
        <div className="space-y-4 bg-zinc-900 p-4 rounded-xl">
          <img src={resized} alt="Resized" className="max-w-full h-auto rounded" />
          <a
            href={resized}
            download="resized.png"
            className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500"
          >
            Download Resized Image
          </a>
        </div>
      )}
    </div>
  );
}
