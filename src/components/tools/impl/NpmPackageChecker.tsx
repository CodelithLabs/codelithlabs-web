'use client';

import { memo, useState, useCallback } from 'react';

interface PackageInfo {
  name: string;
  version: string;
  description: string;
  homepage: string;
  repository: string;
  license: string;
  downloads: number;
  dependencies: number;
}

function NpmPackageChecker() {
  const [packageName, setPackageName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PackageInfo | null>(null);
  const [error, setError] = useState('');

  const handleCheck = useCallback(async () => {
    if (!packageName.trim()) return;
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`https://registry.npmjs.org/${encodeURIComponent(packageName.trim())}`);
      if (!response.ok) {
        throw new Error('Package not found');
      }

      const data = await response.json();
      const latestVersion = data['dist-tags']?.latest || Object.keys(data.versions || {}).pop() || '';
      const latestData = data.versions?.[latestVersion] || {};

      // Get download stats
      let downloads = 0;
      try {
        const statsResponse = await fetch(`https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(packageName.trim())}`);
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          downloads = statsData.downloads || 0;
        }
      } catch {
        // Ignore stats errors
      }

      setResult({
        name: data.name,
        version: latestVersion,
        description: data.description || 'No description',
        homepage: data.homepage || '',
        repository: typeof data.repository === 'string' ? data.repository : data.repository?.url || '',
        license: latestData.license || data.license || 'Unknown',
        downloads,
        dependencies: Object.keys(latestData.dependencies || {}).length,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch package info');
    } finally {
      setLoading(false);
    }
  }, [packageName]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">NPM Package Checker</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Package Name</label>
            <input
              type="text"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
              placeholder="e.g., react, lodash, axios"
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleCheck}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
          >
            {loading ? 'Checking...' : 'Check Package'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-white">{result.name}</h3>
              <span className="text-green-400 text-sm">v{result.version}</span>
            </div>
            <a
              href={`https://www.npmjs.com/package/${result.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
            >
              View on NPM
            </a>
          </div>
          
          <p className="text-zinc-300 mb-4">{result.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-zinc-900 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-blue-400">{formatNumber(result.downloads)}</div>
              <div className="text-sm text-zinc-400">Weekly Downloads</div>
            </div>
            <div className="bg-zinc-900 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-green-400">{result.dependencies}</div>
              <div className="text-sm text-zinc-400">Dependencies</div>
            </div>
            <div className="bg-zinc-900 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-yellow-400">{result.license}</div>
              <div className="text-sm text-zinc-400">License</div>
            </div>
            <div className="bg-zinc-900 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-purple-400">{result.version}</div>
              <div className="text-sm text-zinc-400">Latest Version</div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg p-4">
            <h4 className="text-sm font-medium text-zinc-400 mb-2">Install Command</h4>
            <div className="flex items-center justify-between bg-zinc-800 rounded-lg p-3">
              <code className="text-green-400 font-mono">npm install {result.name}</code>
              <button
                onClick={() => navigator.clipboard.writeText(`npm install ${result.name}`)}
                className="px-2 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-xs rounded transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(NpmPackageChecker);
