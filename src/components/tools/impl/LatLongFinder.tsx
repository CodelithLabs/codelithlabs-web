'use client';
import { useState , memo } from 'react';
import { MapPin, Navigation } from 'lucide-react';

const LatLongFinderComponent = function LatLongFinder() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ lat: number; lon: number; display: string } | null>(null);
  const [error, setError] = useState('');
  const [browserCoords, setBrowserCoords] = useState<{ lat: number; lon: number } | null>(null);

  const geocode = async () => {
    if (!address.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`, {
        headers: { 'User-Agent': 'CodelithLabs-LatLongFinder/1.0' },
      });
      const data = await res.json();
      if (data.length === 0) throw new Error('Location not found');
      setResult({ lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), display: data[0].display_name });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    }
    setLoading(false);
  };

  const getMyLocation = () => {
    if (!navigator.geolocation) { setError('Geolocation not supported'); return; }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        setBrowserCoords({ lat: latitude, lon: longitude });
        setResult({ lat: latitude, lon: longitude, display: 'Your current location' });
      },
      err => setError(err.message)
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <MapPin className="w-4 h-4 inline mr-2" /><strong>Latitude & Longitude Finder:</strong> Find coordinates for any address, or get your current location&apos;s coordinates using browser geolocation.
      </div>
      <div className="flex gap-2">
        <input value={address} onChange={e => setAddress(e.target.value)} onKeyDown={e => e.key === 'Enter' && geocode()} placeholder="Enter address or place name..." className="flex-1 bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700" />
        <button onClick={geocode} disabled={loading} className="px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:opacity-50">{loading ? '...' : 'Find'}</button>
      </div>
      <button onClick={getMyLocation} className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-gray-300 rounded-lg text-sm flex items-center justify-center gap-2"><Navigation className="w-4 h-4" />Use My Current Location</button>
      {error && <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-sm text-red-300">{error}</div>}
      {result && (
        <div className="space-y-3">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center">
            <div className="text-xs text-gray-400 mb-2">{result.display}</div>
            <div className="grid grid-cols-2 gap-4">
              <div><div className="text-xs text-gray-500">Latitude</div><div className="text-2xl font-bold font-mono text-blue-400">{result.lat.toFixed(6)}</div></div>
              <div><div className="text-xs text-gray-500">Longitude</div><div className="text-2xl font-bold font-mono text-green-400">{result.lon.toFixed(6)}</div></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => navigator.clipboard.writeText(`${result.lat}, ${result.lon}`)} className="py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-gray-300">Copy Coordinates</button>
            <a href={`https://www.google.com/maps?q=${result.lat},${result.lon}`} target="_blank" rel="noopener noreferrer" className="py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-center text-blue-400">Open in Maps</a>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(LatLongFinderComponent);
