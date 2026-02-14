'use client';
import { useState, useRef, useEffect } from 'react';

export default function ImageCropper() {
  const [src, setSrc] = useState<string | null>(null);
  const [cropping, setCropping] = useState(false);
  const [cropStart, setCropStart] = useState<{x: number; y: number} | null>(null);
  const [cropEnd, setCropEnd] = useState<{x: number; y: number} | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'free' | '1:1' | '16:9' | '4:3'>('free');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSrc(ev.target?.result as string);
        setCroppedImage(null);
        setCropStart(null);
        setCropEnd(null);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!src || !displayCanvasRef.current) return;
    const img = new Image();
    img.src = src;
    img.onload = () => {
      imgRef.current = img;
      const canvas = displayCanvasRef.current!;
      const maxWidth = 800;
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }, [src]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCropStart({x, y});
    setCropping(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!cropping || !cropStart || !imgRef.current || !displayCanvasRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    // Apply aspect ratio constraint
    if (aspectRatio !== 'free') {
      const ratios = { '1:1': 1, '16:9': 16/9, '4:3': 4/3 };
      const ratio = ratios[aspectRatio];
      const width = Math.abs(x - cropStart.x);
      const height = width / ratio;
      y = cropStart.y + (y > cropStart.y ? height : -height);
    }

    setCropEnd({x, y});

    // Redraw
    const canvas = displayCanvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const scale = canvas.width / imgRef.current.width;
    ctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);

    // Draw selection
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropStart.x, cropStart.y, x - cropStart.x, y - cropStart.y);
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.fillRect(cropStart.x, cropStart.y, x - cropStart.x, y - cropStart.y);

    // Draw corner handles
    const corners = [
      [cropStart.x, cropStart.y], [x, cropStart.y],
      [cropStart.x, y], [x, y]
    ];
    corners.forEach(([cx, cy]) => {
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(cx - 4, cy - 4, 8, 8);
    });
  };

  const handleMouseUp = () => {
    setCropping(false);
  };

  const cropImage = () => {
    if (!cropStart || !cropEnd || !imgRef.current || !canvasRef.current || !displayCanvasRef.current) return;

    const canvas = canvasRef.current;
    const displayCanvas = displayCanvasRef.current;
    const ctx = canvas.getContext('2d')!;

    // Calculate actual dimensions
    const scale = imgRef.current.width / displayCanvas.width;
    const width = Math.abs(cropEnd.x - cropStart.x) * scale;
    const height = Math.abs(cropEnd.y - cropStart.y) * scale;
    const x = Math.min(cropStart.x, cropEnd.x) * scale;
    const y = Math.min(cropStart.y, cropEnd.y) * scale;

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(imgRef.current, x, y, width, height, 0, 0, width, height);
    setCroppedImage(canvas.toDataURL('image/png'));
  };

  return (
    <div className="space-y-6">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
      />

      {src && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Aspect Ratio</label>
            <div className="grid grid-cols-4 gap-2">
              {(['free', '1:1', '16:9', '4:3'] as const).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    aspectRatio === ratio ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {ratio === 'free' ? 'Free' : ratio}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 p-4 rounded-xl">
            <p className="text-sm text-zinc-400 mb-2">Click and drag to select crop area</p>
            <div className="overflow-auto bg-zinc-950 rounded-lg">
              <canvas
                ref={displayCanvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="max-w-full h-auto cursor-crosshair"
              />
            </div>
          </div>

          <button
            onClick={cropImage}
            disabled={!cropStart || !cropEnd}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
          >
            Crop Image
          </button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {croppedImage && (
        <div className="space-y-4 bg-zinc-900 p-4 rounded-xl border border-zinc-700">
          <p className="text-sm font-medium text-zinc-300">Cropped Result:</p>
          <div className="bg-zinc-950 p-4 rounded-lg">
            <img src={croppedImage} alt="Cropped" className="max-w-full h-auto rounded mx-auto" />
          </div>
          <a
            href={croppedImage}
            download="cropped-image.png"
            className="block text-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
          >
            Download Cropped Image
          </a>
        </div>
      )}

      {!src && (
        <div className="text-center py-12 bg-zinc-900/30 border-2 border-dashed border-zinc-800 rounded-xl">
          <svg className="w-12 h-12 mx-auto text-zinc-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-zinc-500">Upload an image to start cropping</p>
        </div>
      )}
    </div>
  );
}
