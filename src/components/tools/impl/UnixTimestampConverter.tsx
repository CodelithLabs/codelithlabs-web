// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/tools/impl/UnixTimestampConverter.tsx
// Unix Timestamp Converter - Human Date <-> Unix Timestamp
// ═══════════════════════════════════════════════════════════════════════════
'use client';

import { useState, useEffect } from 'react';

export default function UnixTimestampConverter() {
  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [inputTimestamp, setInputTimestamp] = useState('');
  const [inputDate, setInputDate] = useState('');
  const [copiedTimestamp, setCopiedTimestamp] = useState(false);
  const [copiedDate, setCopiedDate] = useState(false);

  // Update current timestamp every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Convert timestamp to date
  const timestampToDate = (timestamp: string): string => {
    const ts = parseInt(timestamp);
    if (isNaN(ts)) return 'Invalid timestamp';
    const date = new Date(ts * 1000);
    return date.toISOString();
  };

  // Convert date to timestamp
  const dateToTimestamp = (dateStr: string): string => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Invalid date';
    return Math.floor(date.getTime() / 1000).toString();
  };

  // Format date for display
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    });
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string, type: 'timestamp' | 'date') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'timestamp') {
        setCopiedTimestamp(true);
        setTimeout(() => setCopiedTimestamp(false), 2000);
      } else {
        setCopiedDate(true);
        setTimeout(() => setCopiedDate(false), 2000);
      }
    } catch (err) {
      alert('Failed to copy');
    }
  };

  // Get current datetime for input
  const getCurrentDatetime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="space-y-6">

      {/* Current Timestamp */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-6">
        <div className="text-center space-y-3">
          <div className="text-sm text-zinc-400">Current Unix Timestamp:</div>
          <div className="text-4xl font-bold text-blue-400 font-mono">{currentTimestamp}</div>
          <div className="text-xs text-zinc-500">{formatDate(currentTimestamp)}</div>
          <button
            onClick={() => copyToClipboard(currentTimestamp.toString(), 'timestamp')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              copiedTimestamp
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {copiedTimestamp ? 'Copied!' : 'Copy Current Timestamp'}
          </button>
        </div>
      </div>

      {/* Timestamp to Date */}
      <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-bold text-white">Timestamp to Date</h3>
        <div>
          <label className="block text-sm text-zinc-400 mb-2">
            Enter Unix Timestamp:
          </label>
          <input
            type="text"
            value={inputTimestamp}
            onChange={(e) => setInputTimestamp(e.target.value)}
            placeholder="1707916800"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3
                     text-white font-mono focus:outline-none focus:border-blue-500
                     focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
        {inputTimestamp && (
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4">
            <div className="text-sm text-zinc-400 mb-1">Converted Date:</div>
            <div className="text-lg text-green-400 font-mono break-all">
              {timestampToDate(inputTimestamp)}
            </div>
            {!timestampToDate(inputTimestamp).includes('Invalid') && (
              <div className="text-xs text-zinc-500 mt-2">
                {formatDate(parseInt(inputTimestamp))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Date to Timestamp */}
      <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-bold text-white">Date to Timestamp</h3>
        <div>
          <label className="block text-sm text-zinc-400 mb-2">
            Enter Date & Time:
          </label>
          <div className="flex gap-2">
            <input
              type="datetime-local"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3
                       text-white focus:outline-none focus:border-blue-500
                       focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            <button
              onClick={() => setInputDate(getCurrentDatetime())}
              className="px-4 py-3 bg-zinc-700 hover:bg-zinc-600 text-white text-sm
                       rounded-lg transition-colors whitespace-nowrap"
            >
              Now
            </button>
          </div>
        </div>
        {inputDate && (
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4">
            <div className="text-sm text-zinc-400 mb-1">Converted Timestamp:</div>
            <div className="text-lg text-blue-400 font-mono">
              {dateToTimestamp(inputDate)}
            </div>
          </div>
        )}
      </div>

      {/* Quick Timestamps */}
      <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
        <h3 className="text-sm font-bold text-white mb-3">Quick Timestamps:</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { label: '1 hour ago', offset: -3600 },
            { label: '1 day ago', offset: -86400 },
            { label: '1 week ago', offset: -604800 },
            { label: '1 month ago', offset: -2592000 },
            { label: '1 hour from now', offset: 3600 },
            { label: '1 day from now', offset: 86400 },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setInputTimestamp((currentTimestamp + item.offset).toString())}
              className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded
                       transition-colors text-left"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Info Notice */}
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-sm text-purple-300 flex gap-3">
        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>
          <strong>Unix Timestamp:</strong> Number of seconds elapsed since January 1, 1970, 00:00:00 UTC.
          Widely used in programming and databases.
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-300 flex gap-3">
        <span className="text-xl">🔒</span>
        <p>
          <strong>100% Client-Side:</strong> All conversions happen in your browser.
          No data is sent to our servers.
        </p>
      </div>

    </div>
  );
}
