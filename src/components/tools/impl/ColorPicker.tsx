'use client';
import { useState , memo } from 'react';
import { Pipette, Copy, Check } from 'lucide-react';

const ColorPickerComponent = function ColorPicker() {
  const [color, setColor] = useState('#3B82F6');
  const [copied, setCopied] = useState('');

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const rgbToCmyk = (r: number, g: number, b: number) => {
    const rN = r / 255, gN = g / 255, bN = b / 255;
    const k = 1 - Math.max(rN, gN, bN);
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
    return {
      c: Math.round(((1 - rN - k) / (1 - k)) * 100),
      m: Math.round(((1 - gN - k) / (1 - k)) * 100),
      y: Math.round(((1 - bN - k) / (1 - k)) * 100),
      k: Math.round(k * 100),
    };
  };

  const { r, g, b } = hexToRgb(color);
  const hsl = rgbToHsl(r, g, b);
  const cmyk = rgbToCmyk(r, g, b);

  const formats = [
    { label: 'HEX', value: color.toUpperCase() },
    { label: 'RGB', value: `rgb(${r}, ${g}, ${b})` },
    { label: 'RGBA', value: `rgba(${r}, ${g}, ${b}, 1)` },
    { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: 'CMYK', value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
    { label: 'CSS Variable', value: `--color: ${color};` },
    { label: 'Tailwind', value: `[${color}]` },
  ];

  const shades = Array.from({ length: 9 }, (_, i) => {
    const factor = (i + 1) / 10;
    const sr = Math.round(r * factor);
    const sg = Math.round(g * factor);
    const sb = Math.round(b * factor);
    return `#${sr.toString(16).padStart(2, '0')}${sg.toString(16).padStart(2, '0')}${sb.toString(16).padStart(2, '0')}`;
  });

  const tints = Array.from({ length: 9 }, (_, i) => {
    const factor = (i + 1) / 10;
    const tr = Math.round(r + (255 - r) * factor);
    const tg = Math.round(g + (255 - g) * factor);
    const tb = Math.round(b + (255 - b) * factor);
    return `#${tr.toString(16).padStart(2, '0')}${tg.toString(16).padStart(2, '0')}${tb.toString(16).padStart(2, '0')}`;
  });

  const copy = (text: string, label: string) => { navigator.clipboard.writeText(text); setCopied(label); setTimeout(() => setCopied(''), 1500); };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Pipette className="w-4 h-4 inline mr-2" /><strong>Color Picker & Converter:</strong> Pick a color and get it in HEX, RGB, HSL, CMYK, and more. See shades and tints instantly.
      </div>
      <div className="flex gap-4 items-center">
        <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-20 h-20 rounded-lg cursor-pointer border-2 border-zinc-700" />
        <div className="flex-1">
          <input value={color} onChange={e => setColor(e.target.value)} className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 font-mono text-lg" />
          <div className="mt-2 h-12 rounded-lg" style={{ backgroundColor: color }} />
        </div>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        {formats.map(f => (
          <div key={f.label} className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/50 text-sm">
            <span className="text-gray-400 w-24">{f.label}</span>
            <code className="font-mono text-white flex-1">{f.value}</code>
            <button onClick={() => copy(f.value, f.label)} className="text-gray-500 hover:text-white ml-2">{copied === f.label ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}</button>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><div className="text-xs text-gray-400 mb-2">Shades (darker)</div><div className="flex rounded-lg overflow-hidden">{shades.map((s, i) => (<div key={i} className="flex-1 h-8 cursor-pointer" style={{ backgroundColor: s }} onClick={() => setColor(s)} title={s} />))}</div></div>
        <div><div className="text-xs text-gray-400 mb-2">Tints (lighter)</div><div className="flex rounded-lg overflow-hidden">{tints.map((t, i) => (<div key={i} className="flex-1 h-8 cursor-pointer" style={{ backgroundColor: t }} onClick={() => setColor(t)} title={t} />))}</div></div>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="text-xs text-gray-400 mb-2">Contrast Preview</div>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded text-center text-sm font-medium" style={{ backgroundColor: color, color: '#ffffff' }}>White Text</div>
          <div className="p-3 rounded text-center text-sm font-medium" style={{ backgroundColor: color, color: '#000000' }}>Black Text</div>
          <div className="p-3 rounded text-center text-sm font-medium" style={{ backgroundColor: '#ffffff', color }}>On White</div>
          <div className="p-3 rounded text-center text-sm font-medium" style={{ backgroundColor: '#000000', color }}>On Black</div>
        </div>
      </div>
    </div>
  );
}

export default memo(ColorPickerComponent);
