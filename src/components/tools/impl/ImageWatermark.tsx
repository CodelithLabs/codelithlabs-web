'use client';
import { useState, useRef } from 'react';
import { Droplets, Upload, Download } from 'lucide-react';

export default function ImageWatermark() {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState('CodelithLabs');
  const [position, setPosition] = useState<'center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'>('bottom-right');
  const [opacity, setOpacity] = useState(50);
  const [fontSize, setFontSize] = useState(24);
  const [color, setColor] = useState('#ffffff');
  const [preview, setPreview] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const applyWatermark = () => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity / 100;

      const metrics = ctx.measureText(text);
      const padding = 20;
      let x = 0, y = 0;
      switch (position) {
        case 'center': x = (img.width - metrics.width) / 2; y = img.height / 2; break;
        case 'bottom-right': x = img.width - metrics.width - padding; y = img.height - padding; break;
        case 'bottom-left': x = padding; y = img.height - padding; break;
        case 'top-right': x = img.width - metrics.width - padding; y = fontSize + padding; break;
        case 'top-left': x = padding; y = fontSize + padding; break;
      }
      ctx.fillText(text, x, y);
      ctx.globalAlpha = 1;
      setPreview(canvas.toDataURL('image/png'));
    };
    img.src = image;
  };

  const download = () => {
    if (!preview) return;
    const a = document.createElement('a');
    a.href = preview; a.download = 'watermarked.png'; a.click();
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Droplets className="w-4 h-4 inline mr-2" /><strong>Image Watermark:</strong> Add text watermarks to images with customizable position, opacity, size, and color. All processing is local.
      </div>
      <div className="bg-zinc-900 border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center">
        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" id="wm-upload" />
        <label htmlFor="wm-upload" className="cursor-pointer"><Upload className="w-8 h-8 mx-auto text-gray-500 mb-2" /><div className="text-sm text-gray-400">Click to upload image</div></label>
      </div>
      {image && (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="text-xs block mb-1">Watermark Text</label><input value={text} onChange={e => setText(e.target.value)} className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm" /></div>
            <div><label className="text-xs block mb-1">Position</label>
              <select value={position} onChange={e => setPosition(e.target.value as typeof position)} className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm">
                <option value="center">Center</option><option value="bottom-right">Bottom Right</option><option value="bottom-left">Bottom Left</option><option value="top-right">Top Right</option><option value="top-left">Top Left</option>
              </select>
            </div>
            <div><label className="text-xs block mb-1">Opacity ({opacity}%)</label><input type="range" min="10" max="100" value={opacity} onChange={e => setOpacity(parseInt(e.target.value))} className="w-full" /></div>
            <div><label className="text-xs block mb-1">Font Size ({fontSize}px)</label><input type="range" min="12" max="120" value={fontSize} onChange={e => setFontSize(parseInt(e.target.value))} className="w-full" /></div>
            <div><label className="text-xs block mb-1">Color</label><input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-10 bg-zinc-800 rounded-lg border border-zinc-700" /></div>
          </div>
          <button onClick={applyWatermark} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">Apply Watermark</button>
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
      {preview && (
        <div className="space-y-3">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-2">
            <img src={preview} alt="Watermarked" className="max-w-full rounded" />
          </div>
          <button onClick={download} className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2"><Download className="w-4 h-4" />Download</button>
        </div>
      )}
    </div>
  );
}
