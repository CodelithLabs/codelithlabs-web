'use client';

import { memo, useState, useCallback } from 'react';

function ColorShadesGenerator() {
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [shadeCount, setShadeCount] = useState(10);
  const [result, setResult] = useState<{ shade: number; hex: string; rgb: string; hsl: string }[]>([]);

  const hexToHSL = (hex: string): { h: number; s: number; l: number } => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
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

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const hexToRGB = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const handleGenerate = useCallback(() => {
    const { h, s } = hexToHSL(baseColor);
    const shades: { shade: number; hex: string; rgb: string; hsl: string }[] = [];

    for (let i = 0; i < shadeCount; i++) {
      const lightness = 100 - (i * (100 / (shadeCount - 1)));
      const hex = hslToHex(h, s, Math.max(5, Math.min(95, lightness)));
      shades.push({
        shade: (i + 1) * (1000 / shadeCount),
        hex,
        rgb: hexToRGB(hex),
        hsl: `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(lightness)}%)`,
      });
    }

    setResult(shades);
  }, [baseColor, shadeCount]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Color Shades Generator</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Base Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Number of Shades</label>
              <select
                value={shadeCount}
                onChange={(e) => setShadeCount(parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5 shades</option>
                <option value={10}>10 shades</option>
                <option value={11}>11 shades</option>
                <option value={15}>15 shades</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleGenerate}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Generate Shades
          </button>
        </div>
      </div>

      {result.length > 0 && (
        <>
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Color Palette</h3>
            <div className="flex rounded-lg overflow-hidden">
              {result.map((shade) => (
                <div
                  key={shade.shade}
                  className="flex-1 h-20 cursor-pointer"
                  style={{ backgroundColor: shade.hex }}
                  onClick={() => navigator.clipboard.writeText(shade.hex)}
                  title={`Click to copy ${shade.hex}`}
                />
              ))}
            </div>
          </div>

          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Shade Values</h3>
            <div className="space-y-2">
              {result.map((shade) => (
                <div
                  key={shade.shade}
                  className="flex items-center gap-4 bg-zinc-900 rounded-lg p-3"
                >
                  <div
                    className="w-10 h-10 rounded-lg"
                    style={{ backgroundColor: shade.hex }}
                  />
                  <div className="flex-1 grid grid-cols-4 gap-4 text-sm">
                    <span className="text-zinc-400">{shade.shade}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(shade.hex)}
                      className="text-green-400 font-mono hover:underline text-left"
                    >
                      {shade.hex}
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(shade.rgb)}
                      className="text-blue-400 font-mono hover:underline text-left hidden md:block"
                    >
                      {shade.rgb}
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(shade.hsl)}
                      className="text-yellow-400 font-mono hover:underline text-left hidden lg:block"
                    >
                      {shade.hsl}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">CSS Variables</h3>
              <button
                onClick={() => {
                  const css = result.map(s => `  --color-${s.shade}: ${s.hex};`).join('\n');
                  navigator.clipboard.writeText(`:root {\n${css}\n}`);
                }}
                className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded transition-colors"
              >
                Copy CSS
              </button>
            </div>
            <pre className="bg-zinc-900 rounded-lg p-4 text-green-400 text-sm overflow-x-auto font-mono">
{`:root {
${result.map(s => `  --color-${s.shade}: ${s.hex};`).join('\n')}
}`}
            </pre>
          </div>
        </>
      )}
    </div>
  );
}

export default memo(ColorShadesGenerator);
