'use client';
import { useState, useRef, useEffect, useCallback, memo } from 'react';
import QRCode from 'qrcode';

type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

// ═══════════════════════════════════════════════════════════════════════════
// REACT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const QrCodeGeneratorComponent = function QrCodeGenerator() {
  const [text, setText] = useState('https://codelithlabs.in');
  const [eccLevel, setEccLevel] = useState<ErrorCorrectionLevel>('M');
  const [size, setSize] = useState(256);
  const [color, setColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQR = useCallback(async () => {
    if (!text.trim() || !canvasRef.current) return;

    await QRCode.toCanvas(canvasRef.current, text, {
      width: size,
      margin: 4,
      errorCorrectionLevel: eccLevel,
      color: {
        dark: color,
        light: bgColor,
      },
    });
  }, [text, eccLevel, size, color, bgColor]);

  useEffect(() => {
    void generateQR();
  }, [text, eccLevel, size, color, bgColor, generateQR]);

  const downloadQR = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qrcode.png';
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">Text or URL</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="https://example.com"
          className="w-full px-4 py-3 bg-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Error Correction */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">Error Correction</label>
        <div className="grid grid-cols-4 gap-2">
          {(['L', 'M', 'Q', 'H'] as ErrorCorrectionLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => setEccLevel(level)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                eccLevel === level ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {level} ({level === 'L' ? '7%' : level === 'M' ? '15%' : level === 'Q' ? '25%' : '30%'})
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">Size: {size}px</label>
        <input
          type="range"
          min="128"
          max="512"
          step="64"
          value={size}
          onChange={(e) => setSize(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Colors */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Foreground</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Background</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Preview */}
      <div className="flex flex-col items-center space-y-4">
        <canvas
          ref={canvasRef}
          className="border-4 border-zinc-700 rounded-lg shadow-xl"
          style={{ imageRendering: 'pixelated' }}
        />
        <button
          onClick={downloadQR}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
        >
          Download QR Code
        </button>
      </div>

      {/* Info */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-sm text-green-300">
        ✓ <strong>Scan-Reliable QR:</strong> Generated with standards-compliant Reed-Solomon error correction and quiet zone padding for better camera compatibility.
      </div>
    </div>
  );
}

export default memo(QrCodeGeneratorComponent);
