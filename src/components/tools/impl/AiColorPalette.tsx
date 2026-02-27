'use client';
import { useState } from 'react';
import { Palette, Copy, Check, RefreshCw } from 'lucide-react';

export default function AiColorPalette() {
  const [keyword, setKeyword] = useState('');
  const [palette, setPalette] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const colorMappings: Record<string, string[][]> = {
    ocean: [['#006994','#0077B6','#00B4D8','#90E0EF','#CAF0F8'],['#023E8A','#0096C7','#48CAE4','#ADE8F4','#E0F7FF']],
    sunset: [['#FF6B35','#F7C59F','#EFEFD0','#004E89','#1A659E'],['#FF4500','#FF6347','#FFA07A','#FFD700','#4B0082']],
    forest: [['#1B4332','#2D6A4F','#40916C','#52B788','#95D5B2'],['#344E41','#3A5A40','#588157','#A3B18A','#DAD7CD']],
    fire: [['#6A040F','#9D0208','#D00000','#DC2F02','#E85D04'],['#370617','#6A040F','#D00000','#F48C06','#FFBA08']],
    pastel: [['#FFB5E8','#FF9CEE','#B28DFF','#85E3FF','#BFFCC6'],['#FFDAC1','#FF9AA2','#FFB7B2','#E2F0CB','#B5EAD7']],
    dark: [['#0D1B2A','#1B2838','#2C3E50','#34495E','#415B76'],['#1A1A2E','#16213E','#0F3460','#533483','#E94560']],
    warm: [['#FF6B6B','#FFA07A','#FFD93D','#6BCB77','#4D96FF'],['#E63946','#F1FAEE','#A8DADC','#457B9D','#1D3557']],
    cool: [['#48BFE3','#5390D9','#6930C3','#7400B8','#80FFDB'],['#7209B7','#560BAD','#480CA8','#3A0CA3','#3F37C9']],
    minimalist: [['#FFFFFF','#F5F5F5','#E0E0E0','#333333','#000000'],['#FAFAFA','#EEEEEE','#BDBDBD','#616161','#212121']],
    nature: [['#606C38','#283618','#FEFAE0','#DDA15E','#BC6C25'],['#386641','#6A994E','#A7C957','#F2E8CF','#BC4749']],
    luxury: [['#1A1A1D','#4E4E50','#6F2232','#950740','#C3073F'],['#0D0D0D','#1A1A2E','#B8860B','#DAA520','#FFD700']],
    tech: [['#0A192F','#112240','#233554','#64FFDA','#8892B0'],['#121212','#1E1E1E','#00D4FF','#7C4DFF','#FF4081']],
  };

  const generate = () => {
    const key = keyword.toLowerCase().trim();
    let colors: string[];
    const matchedKey = Object.keys(colorMappings).find(k => key.includes(k));
    if (matchedKey) {
      const options = colorMappings[matchedKey];
      colors = options[Math.floor(Math.random() * options.length)];
    } else {
      // Generate random harmonious palette using golden ratio
      const baseHue = Math.random() * 360;
      colors = Array.from({ length: 5 }, (_, i) => {
        const hue = (baseHue + i * 137.508) % 360;
        const sat = 50 + Math.random() * 30;
        const light = 30 + i * 12;
        return hslToHex(hue, sat, light);
      });
    }
    setPalette(colors);
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => { const k = (n + h / 30) % 12; const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1); return Math.round(255 * color).toString(16).padStart(2, '0'); };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const copyColor = (color: string, idx: number) => { navigator.clipboard.writeText(color); setCopied(idx); setTimeout(() => setCopied(null), 1500); };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Palette className="w-4 h-4 inline mr-2" />
        <strong>AI Color Palette:</strong> Generate beautiful color palettes based on themes and moods. Try: ocean, sunset, forest, luxury, tech, dark, pastel.
      </div>
      <div className="flex gap-3">
        <input value={keyword} onChange={e => setKeyword(e.target.value)} onKeyDown={e => e.key === 'Enter' && generate()} placeholder="Enter a theme (e.g., ocean, sunset, luxury...)" className="flex-1 bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:border-blue-500" />
        <button onClick={generate} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"><RefreshCw className="w-4 h-4" />Generate</button>
      </div>
      {palette.length > 0 && (
        <>
          <div className="flex rounded-xl overflow-hidden h-40">
            {palette.map((color, i) => (
              <div key={i} onClick={() => copyColor(color, i)} className="flex-1 flex items-end justify-center pb-4 cursor-pointer hover:opacity-90 transition-opacity" style={{ backgroundColor: color }}>
                <span className="text-xs font-mono px-2 py-1 rounded bg-black/40 text-white flex items-center gap-1">
                  {copied === i ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {color.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-2">
            {palette.map((color, i) => (
              <div key={i} className="bg-zinc-800 rounded-lg p-3 text-center">
                <div className="w-full h-12 rounded-lg mb-2" style={{ backgroundColor: color }} />
                <div className="text-xs font-mono text-gray-300">{color.toUpperCase()}</div>
              </div>
            ))}
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="text-sm font-semibold mb-2">CSS Variables</div>
            <pre className="text-xs text-green-400 font-mono overflow-x-auto">{palette.map((c, i) => `--color-${i + 1}: ${c};`).join('\n')}</pre>
          </div>
        </>
      )}
    </div>
  );
}
