'use client';
import { useState, useRef } from 'react';

export default function JpgToPng() {
  const [img, setImg] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const image = new Image();
        image.onload = () => {
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(image, 0, 0);
            setImg(canvas.toDataURL('image/png'));
          }
        };
        image.src = ev.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <input type="file" accept="image/jpeg" onChange={handleUpload} className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"/>
      <canvas ref={canvasRef} className="hidden" />
      {img && (
        <div className="space-y-4 bg-zinc-900 p-4 rounded-xl">
          <img src={img} alt="Converted PNG" className="max-w-full h-auto rounded mx-auto" />
          <a href={img} download="converted.png" className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500">Download PNG</a>
        </div>
      )}
    </div>
  );
}
