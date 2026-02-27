'use client';
import { useState } from 'react';
import { Compass, Copy, Check } from 'lucide-react';

export default function CoordinateConverter() {
  const [input, setInput] = useState('');
  const [format, setFormat] = useState<'dd' | 'dms' | 'ddm'>('dd');
  const [copied, setCopied] = useState('');
  const [result, setResult] = useState<{ dd: string; dms: string; ddm: string; utm: string; lat: number; lon: number } | null>(null);

  const parseDMS = (s: string) => {
    const match = s.match(/(-?\d+)[°\s]+(\d+)['\s]+(\d+\.?\d*)["\s]*([NSEW]?)/i);
    if (!match) return null;
    let deg = parseInt(match[1]) + parseInt(match[2]) / 60 + parseFloat(match[3]) / 3600;
    if (match[4] && 'SW'.includes(match[4].toUpperCase())) deg = -deg;
    return deg;
  };

  const parseDDM = (s: string) => {
    const match = s.match(/(-?\d+)[°\s]+(\d+\.?\d*)['\s]*([NSEW]?)/i);
    if (!match) return null;
    let deg = parseInt(match[1]) + parseFloat(match[2]) / 60;
    if (match[3] && 'SW'.includes(match[3].toUpperCase())) deg = -deg;
    return deg;
  };

  const toDMS = (d: number, isLat: boolean) => {
    const dir = isLat ? (d >= 0 ? 'N' : 'S') : (d >= 0 ? 'E' : 'W');
    d = Math.abs(d);
    const deg = Math.floor(d);
    const minF = (d - deg) * 60;
    const min = Math.floor(minF);
    const sec = ((minF - min) * 60).toFixed(2);
    return `${deg}° ${min}' ${sec}" ${dir}`;
  };

  const toDDM = (d: number, isLat: boolean) => {
    const dir = isLat ? (d >= 0 ? 'N' : 'S') : (d >= 0 ? 'E' : 'W');
    d = Math.abs(d);
    const deg = Math.floor(d);
    const min = ((d - deg) * 60).toFixed(4);
    return `${deg}° ${min}' ${dir}`;
  };

  const toUTM = (lat: number, lon: number) => {
    const zone = Math.floor((lon + 180) / 6) + 1;
    const letter = lat >= 0 ? 'N' : 'S';
    return `${zone}${letter}`;
  };

  const convert = () => {
    let lat: number | null = null, lon: number | null = null;
    const parts = input.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);

    if (format === 'dd') {
      lat = parseFloat(parts[0]);
      lon = parseFloat(parts[1]);
    } else if (format === 'dms') {
      lat = parseDMS(parts[0]);
      lon = parseDMS(parts[1]);
    } else {
      lat = parseDDM(parts[0]);
      lon = parseDDM(parts[1]);
    }

    if (lat === null || lon === null || isNaN(lat) || isNaN(lon)) return;

    setResult({
      dd: `${lat.toFixed(6)}, ${lon.toFixed(6)}`,
      dms: `${toDMS(lat, true)}, ${toDMS(lon, false)}`,
      ddm: `${toDDM(lat, true)}, ${toDDM(lon, false)}`,
      utm: toUTM(lat, lon),
      lat, lon,
    });
  };

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Compass className="w-4 h-4 inline mr-2" /><strong>Coordinate Converter:</strong> Convert between Decimal Degrees (DD), Degrees Minutes Seconds (DMS), and Degrees Decimal Minutes (DDM).
      </div>
      <div><label className="text-sm block mb-1">Input Format</label>
        <div className="flex gap-2">
          {[{ key: 'dd', label: 'Decimal Degrees', ex: '28.6139, 77.2090' }, { key: 'dms', label: 'DMS', ex: '28° 36\' 50" N' }, { key: 'ddm', label: 'DDM', ex: '28° 36.834\' N' }].map(f => (
            <button key={f.key} onClick={() => setFormat(f.key as 'dd' | 'dms' | 'ddm')} className={`flex-1 py-2 rounded-lg text-xs font-semibold ${format === f.key ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-gray-400'}`}>{f.label}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm block mb-1">Coordinates (lat, lon)</label>
        <textarea value={input} onChange={e => setInput(e.target.value)} rows={2} placeholder={format === 'dd' ? '28.6139, 77.2090' : format === 'dms' ? '28° 36\' 50.04" N, 77° 12\' 32.40" E' : '28° 36.834\' N, 77° 12.540\' E'} className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 font-mono text-sm" />
      </div>
      <button onClick={convert} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">Convert</button>
      {result && (
        <div className="space-y-2">
          {[
            { label: 'Decimal Degrees (DD)', value: result.dd },
            { label: 'Degrees Minutes Seconds (DMS)', value: result.dms },
            { label: 'Degrees Decimal Minutes (DDM)', value: result.ddm },
            { label: 'UTM Zone', value: result.utm },
          ].map(r => (
            <div key={r.label} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex items-center justify-between">
              <div><div className="text-xs text-gray-500 mb-1">{r.label}</div><div className="font-mono text-sm">{r.value}</div></div>
              <button onClick={() => copy(r.value, r.label)} className="text-gray-400 hover:text-white p-1">{copied === r.label ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}</button>
            </div>
          ))}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
            <a href={`https://www.google.com/maps?q=${result.lat},${result.lon}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm">📍 View on Google Maps →</a>
          </div>
        </div>
      )}
    </div>
  );
}
