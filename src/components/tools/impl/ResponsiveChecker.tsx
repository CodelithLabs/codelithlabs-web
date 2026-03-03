'use client';
import { useState , memo } from 'react';
import { Smartphone, Copy, Check, Monitor, Tablet } from 'lucide-react';

const ResponsiveCheckerComponent = function ResponsiveChecker() {
  const [url, setUrl] = useState('https://example.com');
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [customW, setCustomW] = useState('375');
  const [customH, setCustomH] = useState('667');

  const devices = {
    mobile: [
      { name: 'iPhone SE', w: 375, h: 667 },
      { name: 'iPhone 14', w: 390, h: 844 },
      { name: 'iPhone 14 Pro Max', w: 430, h: 932 },
      { name: 'Samsung Galaxy S21', w: 360, h: 800 },
      { name: 'Pixel 7', w: 412, h: 915 },
    ],
    tablet: [
      { name: 'iPad Mini', w: 768, h: 1024 },
      { name: 'iPad Air', w: 820, h: 1180 },
      { name: 'iPad Pro 12.9"', w: 1024, h: 1366 },
      { name: 'Samsung Galaxy Tab S8', w: 800, h: 1280 },
    ],
    desktop: [
      { name: 'Laptop (1366x768)', w: 1366, h: 768 },
      { name: 'Desktop (1920x1080)', w: 1920, h: 1080 },
      { name: 'Ultrawide (2560x1080)', w: 2560, h: 1080 },
      { name: '4K (3840x2160)', w: 3840, h: 2160 },
    ],
  };

  const [selectedDevice, setSelectedDevice] = useState(devices.mobile[0]);

  const selectDevice = (d: { name: string; w: number; h: number }) => {
    setSelectedDevice(d);
    setCustomW(String(d.w));
    setCustomH(String(d.h));
  };

  const scale = Math.min(1, 800 / parseInt(customW || '375'));

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Smartphone className="w-4 h-4 inline mr-2" /><strong>Responsive Design Checker:</strong> Preview any URL at different device sizes. Test mobile, tablet, and desktop viewports.
      </div>
      <div className="flex gap-2">
        <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" className="flex-1 bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 font-mono text-sm" />
      </div>
      <div className="flex gap-2">
        {([
          { key: 'mobile', icon: Smartphone, label: 'Mobile' },
          { key: 'tablet', icon: Tablet, label: 'Tablet' },
          { key: 'desktop', icon: Monitor, label: 'Desktop' },
        ] as const).map(d => (
          <button key={d.key} onClick={() => { setDevice(d.key); selectDevice(devices[d.key][0]); }} className={`flex-1 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 ${device === d.key ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-gray-400'}`}>
            <d.icon className="w-4 h-4" />{d.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap">
        {devices[device].map(d => (
          <button key={d.name} onClick={() => selectDevice(d)} className={`text-xs px-3 py-1.5 rounded-full ${selectedDevice.name === d.name ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-gray-400'}`}>{d.name} ({d.w}×{d.h})</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs block mb-1">Width (px)</label><input type="number" value={customW} onChange={e => setCustomW(e.target.value)} className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm" /></div>
        <div><label className="text-xs block mb-1">Height (px)</label><input type="number" value={customH} onChange={e => setCustomH(e.target.value)} className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm" /></div>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="text-xs text-gray-400 mb-2 text-center">{selectedDevice.name} — {customW}×{customH}px (Scale: {(scale * 100).toFixed(0)}%)</div>
        <div className="flex justify-center">
          <div style={{ width: `${parseInt(customW) * scale}px`, height: `${parseInt(customH) * scale}px` }} className="border-2 border-zinc-600 rounded-lg overflow-hidden bg-white">
            <iframe src={url} width={customW} height={customH} style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }} className="border-0" sandbox="allow-scripts allow-same-origin" title="Preview" />
          </div>
        </div>
      </div>
      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 text-xs text-yellow-200">⚠️ Some websites block iframe embedding (X-Frame-Options). If the preview is blank, the site does not allow embedding.</div>
    </div>
  );
}

export default memo(ResponsiveCheckerComponent);
