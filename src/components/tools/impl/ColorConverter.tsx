// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/tools/impl/ColorConverter.tsx
// HEX to RGB to HSL Color Converter with Color Picker
// ═══════════════════════════════════════════════════════════════════════════
'use client';

import { useState, useEffect } from 'react';

export default function ColorConverter() {
  const [hex, setHex] = useState('#3B82F6');
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Convert HEX to RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // Convert RGB to HEX
  const rgbToHex = (r: number, g: number, b: number): string => {
    return (
      '#' +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
    );
  };

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  };

  // Update all formats from HEX
  const updateFromHex = (newHex: string) => {
    setHex(newHex);
    const rgbResult = hexToRgb(newHex);
    if (rgbResult) {
      setRgb(rgbResult);
      setHsl(rgbToHsl(rgbResult.r, rgbResult.g, rgbResult.b));
    }
  };

  // Update all formats from RGB
  const updateFromRgb = (r: number, g: number, b: number) => {
    setRgb({ r, g, b });
    setHex(rgbToHex(r, g, b));
    setHsl(rgbToHsl(r, g, b));
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (err) {
      alert('Failed to copy color');
    }
  };

  return (
    <div className="space-y-6">

      {/* Color Picker */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Pick a Color:
        </label>
        <div className="flex gap-4 items-center">
          <input
            type="color"
            value={hex}
            onChange={(e) => updateFromHex(e.target.value)}
            className="w-24 h-24 rounded-lg cursor-pointer border-4 border-zinc-700"
          />
          <div
            className="flex-1 h-24 rounded-lg border-4 border-zinc-700 shadow-inner"
            style={{ backgroundColor: hex }}
          />
        </div>
      </div>

      {/* HEX Input */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          HEX:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={hex}
            onChange={(e) => updateFromHex(e.target.value)}
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3
                     text-white font-mono focus:outline-none focus:border-blue-500
                     focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          <button
            onClick={() => copyToClipboard(hex, 'hex')}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              copiedFormat === 'hex'
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {copiedFormat === 'hex' ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* RGB Inputs */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          RGB:
        </label>
        <div className="grid grid-cols-3 gap-2 mb-2">
          <div>
            <input
              type="number"
              min="0"
              max="255"
              value={rgb.r}
              onChange={(e) => updateFromRgb(parseInt(e.target.value) || 0, rgb.g, rgb.b)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2
                       text-white text-center focus:outline-none focus:border-red-500
                       focus:ring-2 focus:ring-red-500/20 transition-all"
              placeholder="R"
            />
            <div className="text-xs text-zinc-500 text-center mt-1">Red</div>
          </div>
          <div>
            <input
              type="number"
              min="0"
              max="255"
              value={rgb.g}
              onChange={(e) => updateFromRgb(rgb.r, parseInt(e.target.value) || 0, rgb.b)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2
                       text-white text-center focus:outline-none focus:border-green-500
                       focus:ring-2 focus:ring-green-500/20 transition-all"
              placeholder="G"
            />
            <div className="text-xs text-zinc-500 text-center mt-1">Green</div>
          </div>
          <div>
            <input
              type="number"
              min="0"
              max="255"
              value={rgb.b}
              onChange={(e) => updateFromRgb(rgb.r, rgb.g, parseInt(e.target.value) || 0)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2
                       text-white text-center focus:outline-none focus:border-blue-500
                       focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="B"
            />
            <div className="text-xs text-zinc-500 text-center mt-1">Blue</div>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
            readOnly
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3
                     text-white font-mono focus:outline-none"
          />
          <button
            onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'rgb')}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              copiedFormat === 'rgb'
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {copiedFormat === 'rgb' ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* HSL Output */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          HSL:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
            readOnly
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3
                     text-white font-mono focus:outline-none"
          />
          <button
            onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'hsl')}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              copiedFormat === 'hsl'
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {copiedFormat === 'hsl' ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-300 flex gap-3">
        <span className="text-xl">🔒</span>
        <p>
          <strong>100% Client-Side:</strong> All color conversions happen in your browser.
          No data is uploaded to our servers.
        </p>
      </div>

    </div>
  );
}
