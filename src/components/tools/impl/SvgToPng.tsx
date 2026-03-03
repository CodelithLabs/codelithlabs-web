'use client';

import { memo, useState, useCallback, useRef } from 'react';

function SvgToPng() {
  const [svgInput, setSvgInput] = useState('');
  const [scale, setScale] = useState('2');
  const [bgColor, setBgColor] = useState('transparent');
  const [result, setResult] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleConvert = useCallback(() => {
    if (!svgInput.trim()) return;

    const svgBlob = new Blob([svgInput], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const scaleValue = parseFloat(scale) || 2;
      canvas.width = img.width * scaleValue;
      canvas.height = img.height * scaleValue;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (bgColor !== 'transparent') {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngUrl = canvas.toDataURL('image/png');
      setResult(pngUrl);
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      setResult(null);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  }, [svgInput, scale, bgColor]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    const link = document.createElement('a');
    link.download = 'converted-image.png';
    link.href = result;
    link.click();
  }, [result]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">SVG to PNG Converter</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">SVG Code</label>
            <textarea
              value={svgInput}
              onChange={(e) => setSvgInput(e.target.value)}
              placeholder='<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">...</svg>'
              rows={8}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Scale</label>
              <select
                value={scale}
                onChange={(e) => setScale(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">1x</option>
                <option value="2">2x</option>
                <option value="3">3x</option>
                <option value="4">4x</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Background</label>
              <select
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="transparent">Transparent</option>
                <option value="#ffffff">White</option>
                <option value="#000000">Black</option>
                <option value="#f5f5f5">Light Gray</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleConvert}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Convert to PNG
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {result && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Result</h3>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
            >
              Download PNG
            </button>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4 flex items-center justify-center" style={{ backgroundImage: 'linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }}>
            <img src={result} alt="Converted PNG" className="max-w-full max-h-64" />
          </div>
        </div>
      )}

      {svgInput && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">SVG Preview</h3>
          <div className="bg-zinc-900 rounded-lg p-4 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: svgInput }} />
        </div>
      )}
    </div>
  );
}

export default memo(SvgToPng);
