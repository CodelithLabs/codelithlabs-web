'use client';
import { useState } from 'react';
import { Zap, Copy, Check } from 'lucide-react';

export default function CssGradientGenerator() {
  const [type, setType] = useState<'linear' | 'radial' | 'conic'>('linear');
  const [angle, setAngle] = useState(135);
  const [color1, setColor1] = useState('#667eea');
  const [color2, setColor2] = useState('#764ba2');
  const [color3, setColor3] = useState('');
  const [copied, setCopied] = useState(false);

  const presets = [
    { name: 'Sunset', c1: '#f093fb', c2: '#f5576c', c3: '' },
    { name: 'Ocean', c1: '#4facfe', c2: '#00f2fe', c3: '' },
    { name: 'Forest', c1: '#11998e', c2: '#38ef7d', c3: '' },
    { name: 'Fire', c1: '#f12711', c2: '#f5af19', c3: '' },
    { name: 'Purple Dream', c1: '#667eea', c2: '#764ba2', c3: '' },
    { name: 'Midnight', c1: '#232526', c2: '#414345', c3: '' },
    { name: 'Rainbow', c1: '#ff0000', c2: '#00ff00', c3: '#0000ff' },
    { name: 'Aurora', c1: '#00c6ff', c2: '#0072ff', c3: '#7c2ae8' },
  ];

  const gradientCSS = () => {
    const colors = [color1, color2, color3].filter(Boolean).join(', ');
    if (type === 'linear') return `linear-gradient(${angle}deg, ${colors})`;
    if (type === 'radial') return `radial-gradient(circle, ${colors})`;
    return `conic-gradient(from ${angle}deg, ${colors})`;
  };

  const css = `background: ${gradientCSS()};`;
  const copy = () => { navigator.clipboard.writeText(css); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Zap className="w-4 h-4 inline mr-2" /><strong>CSS Gradient Generator:</strong> Create beautiful linear, radial, and conic gradients with live preview and copy-ready CSS.
      </div>
      <div className="h-48 rounded-xl border border-zinc-700" style={{ background: gradientCSS() }} />
      <div className="flex gap-2">
        {(['linear', 'radial', 'conic'] as const).map(t => (
          <button key={t} onClick={() => setType(t)} className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize ${type === t ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-gray-400'}`}>{t}</button>
        ))}
      </div>
      {(type === 'linear' || type === 'conic') && (
        <div><label className="text-xs block mb-1">Angle ({angle}°)</label><input type="range" min="0" max="360" value={angle} onChange={e => setAngle(parseInt(e.target.value))} className="w-full" /></div>
      )}
      <div className="grid grid-cols-3 gap-3">
        <div><label className="text-xs block mb-1">Color 1</label><input type="color" value={color1} onChange={e => setColor1(e.target.value)} className="w-full h-10 rounded-lg border border-zinc-700 cursor-pointer" /><input value={color1} onChange={e => setColor1(e.target.value)} className="w-full bg-zinc-800 text-white p-1 rounded text-xs font-mono mt-1 text-center" /></div>
        <div><label className="text-xs block mb-1">Color 2</label><input type="color" value={color2} onChange={e => setColor2(e.target.value)} className="w-full h-10 rounded-lg border border-zinc-700 cursor-pointer" /><input value={color2} onChange={e => setColor2(e.target.value)} className="w-full bg-zinc-800 text-white p-1 rounded text-xs font-mono mt-1 text-center" /></div>
        <div><label className="text-xs block mb-1">Color 3 (optional)</label><input type="color" value={color3 || '#000000'} onChange={e => setColor3(e.target.value)} className="w-full h-10 rounded-lg border border-zinc-700 cursor-pointer" /><input value={color3} onChange={e => setColor3(e.target.value)} placeholder="optional" className="w-full bg-zinc-800 text-white p-1 rounded text-xs font-mono mt-1 text-center" /></div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {presets.map(p => (
          <button key={p.name} onClick={() => { setColor1(p.c1); setColor2(p.c2); setColor3(p.c3); }} className="text-xs px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-gray-400">
            <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ background: `linear-gradient(90deg, ${p.c1}, ${p.c2})` }} />{p.name}
          </button>
        ))}
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-center justify-between">
        <code className="text-sm text-green-400 font-mono">{css}</code>
        <button onClick={copy} className="text-gray-400 hover:text-white ml-4">{copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}</button>
      </div>
    </div>
  );
}
