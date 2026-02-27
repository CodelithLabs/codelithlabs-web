'use client';
import { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

export default function DistanceCalculator() {
  const [lat1, setLat1] = useState('');
  const [lon1, setLon1] = useState('');
  const [lat2, setLat2] = useState('');
  const [lon2, setLon2] = useState('');
  const [city1, setCity1] = useState('');
  const [city2, setCity2] = useState('');
  const [result, setResult] = useState<{ km: number; miles: number; nautical: number; bearing: number } | null>(null);

  const cities: Record<string, { lat: number; lon: number }> = {
    'Delhi': { lat: 28.6139, lon: 77.2090 },
    'Mumbai': { lat: 19.0760, lon: 72.8777 },
    'Kolkata': { lat: 22.5726, lon: 88.3639 },
    'Chennai': { lat: 13.0827, lon: 80.2707 },
    'Bangalore': { lat: 12.9716, lon: 77.5946 },
    'Hyderabad': { lat: 17.3850, lon: 78.4867 },
    'Guwahati': { lat: 26.1445, lon: 91.7362 },
    'Kokrajhar': { lat: 26.4008, lon: 90.2717 },
    'London': { lat: 51.5074, lon: -0.1278 },
    'New York': { lat: 40.7128, lon: -74.0060 },
    'Tokyo': { lat: 35.6762, lon: 139.6503 },
    'Sydney': { lat: -33.8688, lon: 151.2093 },
    'Dubai': { lat: 25.2048, lon: 55.2708 },
    'Singapore': { lat: 1.3521, lon: 103.8198 },
  };

  const selectCity = (city: string, point: 1 | 2) => {
    const c = cities[city];
    if (!c) return;
    if (point === 1) { setLat1(String(c.lat)); setLon1(String(c.lon)); setCity1(city); }
    else { setLat2(String(c.lat)); setLon2(String(c.lon)); setCity2(city); }
  };

  const calculate = () => {
    const la1 = parseFloat(lat1) || 0;
    const lo1 = parseFloat(lon1) || 0;
    const la2 = parseFloat(lat2) || 0;
    const lo2 = parseFloat(lon2) || 0;
    const R = 6371;
    const dLat = (la2 - la1) * Math.PI / 180;
    const dLon = (lo2 - lo1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(la1 * Math.PI / 180) * Math.cos(la2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const km = R * c;
    const y = Math.sin(dLon) * Math.cos(la2 * Math.PI / 180);
    const x = Math.cos(la1 * Math.PI / 180) * Math.sin(la2 * Math.PI / 180) - Math.sin(la1 * Math.PI / 180) * Math.cos(la2 * Math.PI / 180) * Math.cos(dLon);
    const bearing = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    setResult({ km, miles: km * 0.621371, nautical: km * 0.539957, bearing });
  };

  const bearingDir = (b: number) => {
    const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return dirs[Math.round(b / 22.5) % 16];
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Navigation className="w-4 h-4 inline mr-2" /><strong>Distance Calculator:</strong> Calculate the distance between two locations using the Haversine formula. Pick cities or enter coordinates.
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-3">
          <div className="text-sm font-semibold flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-400" />Point A</div>
          <select value={city1} onChange={e => selectCity(e.target.value, 1)} className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm">
            <option value="">Pick a city...</option>
            {Object.keys(cities).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" placeholder="Latitude" value={lat1} onChange={e => setLat1(e.target.value)} step="0.0001" className="bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm" />
            <input type="number" placeholder="Longitude" value={lon1} onChange={e => setLon1(e.target.value)} step="0.0001" className="bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm" />
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-3">
          <div className="text-sm font-semibold flex items-center gap-2"><MapPin className="w-4 h-4 text-red-400" />Point B</div>
          <select value={city2} onChange={e => selectCity(e.target.value, 2)} className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm">
            <option value="">Pick a city...</option>
            {Object.keys(cities).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" placeholder="Latitude" value={lat2} onChange={e => setLat2(e.target.value)} step="0.0001" className="bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm" />
            <input type="number" placeholder="Longitude" value={lon2} onChange={e => setLon2(e.target.value)} step="0.0001" className="bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm" />
          </div>
        </div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">Calculate Distance</button>
      {result && (
        <div className="space-y-3">
          <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-500/30 rounded-lg p-6 text-center">
            <div className="text-sm text-gray-300 mb-1">{city1 || 'Point A'} → {city2 || 'Point B'}</div>
            <div className="text-4xl font-bold text-blue-400">{result.km.toFixed(1)} km</div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-400">Kilometers</div><div className="text-lg font-bold">{result.km.toFixed(2)}</div></div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-400">Miles</div><div className="text-lg font-bold">{result.miles.toFixed(2)}</div></div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-400">Nautical Miles</div><div className="text-lg font-bold">{result.nautical.toFixed(2)}</div></div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex items-center justify-between">
            <span className="text-sm text-gray-400">Bearing</span>
            <span className="font-mono">{result.bearing.toFixed(1)}° {bearingDir(result.bearing)}</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs text-center text-gray-500">
            <div>🚗 ~{(result.km / 80).toFixed(1)} hrs driving</div>
            <div>🚶 ~{(result.km / 5).toFixed(0)} hrs walking</div>
            <div>✈️ ~{(result.km / 800).toFixed(1)} hrs flying</div>
          </div>
        </div>
      )}
    </div>
  );
}
