// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/tools/impl/SocialMediaResizer.tsx
// Social Media Image Resizer - Crop presets for Instagram, Twitter, YouTube
// ═══════════════════════════════════════════════════════════════════════════
'use client';

import { useState, useRef } from 'react';

type Preset = {
  name: string;
  width: number;
  height: number;
  platform: string;
};

export default function SocialMediaResizer() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Social media presets
  const presets: Preset[] = [
    { name: 'Instagram Post', width: 1080, height: 1080, platform: 'Instagram' },
    { name: 'Instagram Story', width: 1080, height: 1920, platform: 'Instagram' },
    { name: 'Twitter Post', width: 1200, height: 675, platform: 'Twitter' },
    { name: 'Twitter Header', width: 1500, height: 500, platform: 'Twitter' },
    { name: 'Facebook Post', width: 1200, height: 630, platform: 'Facebook' },
    { name: 'Facebook Cover', width: 820, height: 312, platform: 'Facebook' },
    { name: 'YouTube Thumbnail', width: 1280, height: 720, platform: 'YouTube' },
    { name: 'LinkedIn Post', width: 1200, height: 627, platform: 'LinkedIn' },
  ];

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
      setOriginalImage(event.target?.result as string);
      setResizedImage(null);
    };
    reader.readAsDataURL(file);
  };

  // Resize image to preset dimensions
  const resizeToPreset = (preset: Preset) => {
    if (!originalImage) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.src = originalImage;
    img.onload = () => {
      canvas.width = preset.width;
      canvas.height = preset.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Fill background with white
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, preset.width, preset.height);

      // Calculate scaling to cover preset dimensions (crop to fit)
      const scale = Math.max(preset.width / img.width, preset.height / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;

      // Center the image
      const x = (preset.width - scaledWidth) / 2;
      const y = (preset.height - scaledHeight) / 2;

      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

      // Convert to data URL
      setResizedImage(canvas.toDataURL('image/jpeg', 0.9));
      setSelectedPreset(preset);
    };
  };

  // Download resized image
  const downloadImage = () => {
    if (!resizedImage || !selectedPreset) return;

    const a = document.createElement('a');
    a.href = resizedImage;
    a.download = `${selectedPreset.name.toLowerCase().replace(/\s+/g, '-')}-codelithlabs.jpg`;
    a.click();
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
            id="social-image-upload"
          />
          <label htmlFor="social-image-upload" className="cursor-pointer flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Click to Upload Image</h3>
              <p className="text-zinc-400">JPG, PNG, WebP supported. Max 10MB.</p>
            </div>
          </label>
        </div>
      )}

      {/* Editor Area */}
      {originalImage && (
        <>
          {/* Preset Selection */}
          <div>
            <h3 className="text-sm font-medium text-zinc-300 mb-3">Choose Social Media Preset:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => resizeToPreset(preset)}
                  className={`p-3 rounded-lg text-left transition-all ${
                    selectedPreset?.name === preset.name
                      ? 'bg-blue-600 text-white border-2 border-blue-500'
                      : 'bg-zinc-800 text-zinc-300 border-2 border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  <div className="text-xs text-zinc-400 mb-1">{preset.platform}</div>
                  <div className="text-sm font-bold">{preset.name}</div>
                  <div className="text-xs text-zinc-500 mt-1">
                    {preset.width}×{preset.height}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Preview Area */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* Original */}
            <div>
              <h3 className="text-sm font-medium text-zinc-400 mb-2">Original Image:</h3>
              <img src={originalImage} alt="Original" className="w-full rounded-lg border border-zinc-700" />
            </div>

            {/* Resized */}
            {resizedImage && (
              <div>
                <h3 className="text-sm font-medium text-green-400 mb-2">
                  Resized ({selectedPreset?.name}):
                </h3>
                <img src={resizedImage} alt="Resized" className="w-full rounded-lg border border-green-500/30" />
              </div>
            )}

          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {resizedImage && (
              <button
                onClick={downloadImage}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold
                         rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Resized Image
              </button>
            )}
            <button
              onClick={() => {
                setOriginalImage(null);
                setResizedImage(null);
                setSelectedPreset(null);
              }}
              className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-lg transition-colors"
            >
              Upload New
            </button>
          </div>
        </>
      )}

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Privacy Notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-300 flex gap-3">
        <span className="text-xl">🔒</span>
        <p>
          <strong>100% Client-Side Processing:</strong> Images are resized entirely in your browser using Canvas API.
          Nothing is uploaded to our servers.
        </p>
      </div>

    </div>
  );
}
