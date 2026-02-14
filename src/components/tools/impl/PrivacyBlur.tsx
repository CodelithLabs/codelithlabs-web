// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/tools/impl/PrivacyBlur.tsx
// Privacy Blur Tool - Blur Sensitive Content in Images using Canvas API
// ═══════════════════════════════════════════════════════════════════════════
'use client';

import { useState, useRef, useEffect } from 'react';

export default function PrivacyBlur() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [blurAmount, setBlurAmount] = useState(20);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(30);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        setOriginalImage(event.target?.result as string);
        initializeCanvas(img);
      };
    };
    reader.readAsDataURL(file);
  };

  // Initialize canvas with image
  const initializeCanvas = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    if (!canvas || !overlayCanvas) return;

    // Set canvas size to match image
    canvas.width = img.width;
    canvas.height = img.height;
    overlayCanvas.width = img.width;
    overlayCanvas.height = img.height;

    // Draw original image
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0);
    }
  };

  // Apply blur to area
  const applyBlurAtPoint = (x: number, y: number) => {
    const canvas = canvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    if (!canvas || !overlayCanvas) return;

    const ctx = canvas.getContext('2d');
    const overlayCtx = overlayCanvas.getContext('2d');
    if (!ctx || !overlayCtx) return;

    // Save current state
    ctx.save();

    // Create circular clipping path
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.clip();

    // Apply blur filter
    ctx.filter = `blur(${blurAmount}px)`;

    // Get image data and redraw blurred
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0);

    ctx.restore();

    // Draw indicator on overlay
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    overlayCtx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
    overlayCtx.lineWidth = 2;
    overlayCtx.beginPath();
    overlayCtx.arc(x, y, brushSize, 0, Math.PI * 2);
    overlayCtx.stroke();
  };

  // Mouse/Touch event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * (canvasRef.current?.width || 0);
    const y = ((e.clientY - rect.top) / rect.height) * (canvasRef.current?.height || 0);
    applyBlurAtPoint(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * (canvasRef.current?.width || 0);
    const y = ((e.clientY - rect.top) / rect.height) * (canvasRef.current?.height || 0);
    applyBlurAtPoint(x, y);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    // Clear overlay
    const overlayCanvas = overlayCanvasRef.current;
    if (overlayCanvas) {
      const ctx = overlayCanvas.getContext('2d');
      ctx?.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    }
  };

  // Download blurred image
  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'privacy-blur-codelithlabs.png';
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  // Reset canvas
  const reset = () => {
    if (originalImage) {
      const img = new Image();
      img.src = originalImage;
      img.onload = () => initializeCanvas(img);
    }
  };

  return (
    <div className="space-y-6">

      {/* Upload Area */}
      {!originalImage && (
        <div className="border-2 border-dashed border-zinc-700 rounded-xl p-12 text-center hover:bg-zinc-800/50 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="blur-image-upload"
          />
          <label htmlFor="blur-image-upload" className="cursor-pointer flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Click to Upload Image</h3>
              <p className="text-zinc-400">Upload an image to blur sensitive areas</p>
            </div>
          </label>
        </div>
      )}

      {/* Editor Area */}
      {originalImage && (
        <>
          {/* Controls */}
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6 space-y-4">

            {/* Blur Amount */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-zinc-300">Blur Strength:</label>
                <span className="text-sm font-bold text-white bg-zinc-900 px-3 py-1 rounded-lg">
                  {blurAmount}px
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={blurAmount}
                onChange={(e) => setBlurAmount(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Brush Size */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-zinc-300">Brush Size:</label>
                <span className="text-sm font-bold text-white bg-zinc-900 px-3 py-1 rounded-lg">
                  {brushSize}px
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

          </div>

          {/* Instructions */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-300">
            <p className="font-medium mb-1">How to use:</p>
            <p className="text-xs">Click and drag on the image below to blur sensitive areas (faces, text, etc.)</p>
          </div>

          {/* Canvas Area */}
          <div className="relative inline-block max-w-full">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="max-w-full h-auto border-2 border-zinc-700 rounded-lg cursor-crosshair"
            />
            <canvas
              ref={overlayCanvasRef}
              className="absolute top-0 left-0 max-w-full h-auto pointer-events-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={downloadImage}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold
                       rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Blurred Image
            </button>
            <button
              onClick={reset}
              className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-lg transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() => {
                setOriginalImage(null);
              }}
              className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-lg transition-colors"
            >
              Upload New
            </button>
          </div>
        </>
      )}

      {/* Privacy Notice */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-sm text-green-300 flex gap-3">
        <span className="text-xl">🔒</span>
        <p>
          <strong>100% Privacy Protection:</strong> All image processing happens entirely in your browser.
          Your images never leave your device and are not uploaded to our servers.
        </p>
      </div>

    </div>
  );
}
