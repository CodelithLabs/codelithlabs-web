'use client';
import { useState , memo } from 'react';
import { Sun, Moon, Sunrise, Sunset } from 'lucide-react';

const SunriseSunsetCalcComponent = function SunriseSunsetCalc() {
  const [lat, setLat] = useState('26.4008');
  const [lon, setLon] = useState('90.2717');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<{ sunrise: string; sunset: string; dayLength: string; solarNoon: string; dawn: string; dusk: string } | null>(null);

  const calculate = () => {
    const la = parseFloat(lat) || 0;
    const lo = parseFloat(lon) || 0;
    const d = new Date(date);
    const dayOfYear = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000);

    // Solar calculation
    const radLat = la * Math.PI / 180;
    const decl = -23.45 * Math.cos(2 * Math.PI * (dayOfYear + 10) / 365) * Math.PI / 180;
    const hourAngle = Math.acos(-Math.tan(radLat) * Math.tan(decl));

    if (isNaN(hourAngle)) {
      setResult(null);
      return;
    }

    const solarNoonHours = 12 - lo / 15; // Approximate UTC solar noon
    const sunriseHours = solarNoonHours - (hourAngle * 180 / Math.PI) / 15;
    const sunsetHours = solarNoonHours + (hourAngle * 180 / Math.PI) / 15;
    const dayLengthHours = (sunsetHours - sunriseHours);

    const toTimeStr = (h: number) => {
      h = ((h % 24) + 24) % 24;
      const hrs = Math.floor(h);
      const mins = Math.round((h - hrs) * 60);
      const ampm = hrs >= 12 ? 'PM' : 'AM';
      const h12 = hrs % 12 || 12;
      return `${h12}:${mins.toString().padStart(2, '0')} ${ampm}`;
    };

    const toDuration = (h: number) => {
      const hrs = Math.floor(h);
      const mins = Math.round((h - hrs) * 60);
      return `${hrs}h ${mins}m`;
    };

    // Adjust to local standard time offset (rough)
    const tzOffset = Math.round(lo / 15);
    const localSunrise = sunriseHours + tzOffset;
    const localSunset = sunsetHours + tzOffset;
    const localNoon = solarNoonHours + tzOffset;

    setResult({
      sunrise: toTimeStr(localSunrise),
      sunset: toTimeStr(localSunset),
      dayLength: toDuration(dayLengthHours),
      solarNoon: toTimeStr(localNoon),
      dawn: toTimeStr(localSunrise - 0.5),
      dusk: toTimeStr(localSunset + 0.5),
    });
  };

  const cities: Record<string, { lat: string; lon: string }> = {
    'Kokrajhar': { lat: '26.4008', lon: '90.2717' },
    'Delhi': { lat: '28.6139', lon: '77.2090' },
    'Mumbai': { lat: '19.0760', lon: '72.8777' },
    'London': { lat: '51.5074', lon: '-0.1278' },
    'New York': { lat: '40.7128', lon: '-74.0060' },
    'Tokyo': { lat: '35.6762', lon: '139.6503' },
  };

  return (
    <div className="space-y-4">
      <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4 text-sm text-orange-200">
        <Sun className="w-4 h-4 inline mr-2" /><strong>Sunrise & Sunset Calculator:</strong> Calculate sunrise, sunset, and day length for any location and date.
      </div>
      <div className="flex gap-2 flex-wrap">
        {Object.entries(cities).map(([name, coords]) => (
          <button key={name} onClick={() => { setLat(coords.lat); setLon(coords.lon); }} className="text-xs px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-full text-gray-400">{name}</button>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <div><label className="text-xs block mb-1">Latitude</label><input type="number" value={lat} onChange={e => setLat(e.target.value)} step="0.0001" className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm" /></div>
        <div><label className="text-xs block mb-1">Longitude</label><input type="number" value={lon} onChange={e => setLon(e.target.value)} step="0.0001" className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm" /></div>
        <div><label className="text-xs block mb-1">Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm" /></div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg">Calculate</button>
      {result && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border border-orange-500/30 rounded-lg p-4 text-center"><Sunrise className="w-5 h-5 mx-auto text-orange-400 mb-1" /><div className="text-xs text-gray-400">Sunrise</div><div className="text-2xl font-bold text-orange-400">{result.sunrise}</div></div>
            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-purple-500/30 rounded-lg p-4 text-center"><Sunset className="w-5 h-5 mx-auto text-purple-400 mb-1" /><div className="text-xs text-gray-400">Sunset</div><div className="text-2xl font-bold text-purple-400">{result.sunset}</div></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-400">Day Length</div><div className="text-lg font-bold text-yellow-400">{result.dayLength}</div></div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-400">Solar Noon</div><div className="text-lg font-bold">{result.solarNoon}</div></div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-400">Civil Dawn</div><div className="text-lg font-bold text-blue-400">{result.dawn}</div></div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-400">Civil Dusk</div><div className="text-lg font-bold text-indigo-400">{result.dusk}</div></div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
            <div className="w-full h-6 bg-gradient-to-r from-indigo-900 via-orange-400 via-yellow-300 via-orange-400 to-indigo-900 rounded-full relative overflow-hidden" />
            <div className="flex justify-between text-xs text-gray-500 mt-1"><span>Midnight</span><span>6 AM</span><span>Noon</span><span>6 PM</span><span>Midnight</span></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(SunriseSunsetCalcComponent);
