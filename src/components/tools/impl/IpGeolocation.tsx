'use client';
import { useState , memo } from 'react';
import { Globe, Search, Copy, Check } from 'lucide-react';

const IpGeolocationComponent = function IpGeolocation() {
  const [ip, setIp] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState('');
  const [result, setResult] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState('');

  const lookup = async (targetIp?: string) => {
    setLoading(true);
    setError('');
    try {
      const url = targetIp ? `https://ipapi.co/${targetIp}/json/` : 'https://ipapi.co/json/';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch IP data');
      const data = await res.json();
      if (data.error) throw new Error(data.reason || 'Invalid IP address');
      setResult({
        'IP Address': data.ip || 'N/A',
        'City': data.city || 'N/A',
        'Region': data.region || 'N/A',
        'Country': `${data.country_name || 'N/A'} (${data.country_code || ''})`,
        'Continent': data.continent_code || 'N/A',
        'Postal Code': data.postal || 'N/A',
        'Latitude': String(data.latitude || 'N/A'),
        'Longitude': String(data.longitude || 'N/A'),
        'Timezone': data.timezone || 'N/A',
        'UTC Offset': data.utc_offset || 'N/A',
        'ISP': data.org || 'N/A',
        'ASN': data.asn || 'N/A',
        'Currency': `${data.currency_name || 'N/A'} (${data.currency || ''})`,
        'Languages': data.languages || 'N/A',
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
      setResult(null);
    }
    setLoading(false);
  };

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Globe className="w-4 h-4 inline mr-2" /><strong>IP Geolocation Lookup:</strong> Find the geographic location, ISP, timezone, and other details for any IP address. Leave empty to check your own IP.
      </div>
      <div className="flex gap-2">
        <input value={ip} onChange={e => setIp(e.target.value)} placeholder="Enter IP address or leave blank for your IP" className="flex-1 bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 font-mono" />
        <button onClick={() => lookup(ip || undefined)} disabled={loading} className="px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center gap-2 disabled:opacity-50"><Search className="w-4 h-4" />{loading ? 'Looking up...' : 'Lookup'}</button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {['8.8.8.8', '1.1.1.1', '208.67.222.222', ''].map(sample => (
          <button key={sample || 'my'} onClick={() => { setIp(sample); lookup(sample || undefined); }} className="text-xs px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-full text-gray-400">{sample || 'My IP'}</button>
        ))}
      </div>
      {error && <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-sm text-red-300">{error}</div>}
      {result && (
        <div className="space-y-2">
          <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-500/30 rounded-lg p-4 text-center">
            <div className="text-xs text-gray-400 mb-1">IP Address</div>
            <div className="text-2xl font-bold text-blue-400 font-mono">{result['IP Address']}</div>
            <div className="text-sm text-gray-300 mt-1">{result['City']}, {result['Region']}, {result['Country']}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            {Object.entries(result).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/50 text-sm">
                <span className="text-gray-400">{key}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-white">{val}</span>
                  <button onClick={() => copy(val, key)} className="text-gray-500 hover:text-white">{copied === key ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}</button>
                </div>
              </div>
            ))}
          </div>
          {result['Latitude'] !== 'N/A' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
              <a href={`https://www.google.com/maps?q=${result['Latitude']},${result['Longitude']}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm">📍 View on Google Maps →</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(IpGeolocationComponent);
