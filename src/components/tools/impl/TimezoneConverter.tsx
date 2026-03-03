// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/tools/impl/TimezoneConverter.tsx
// Timezone Converter - Convert times between different timezones
// Comprehensive timezone support with DST handling
// ═══════════════════════════════════════════════════════════════════════════
'use client';

import { useState, useEffect, useCallback , memo } from 'react';
import { Clock, Globe, Calendar, ArrowRight } from 'lucide-react';

const TimezoneConverterComponent = function TimezoneConverter() {
  const now = new Date();
  const [sourceDate, setSourceDate] = useState(() => now.toISOString().split('T')[0]);
  const [sourceTime, setSourceTime] = useState(() => now.toTimeString().split(' ')[0].substring(0, 5));
  const [sourceTimezone, setSourceTimezone] = useState('America/New_York');
  const [targetTimezones, setTargetTimezones] = useState(['Europe/London', 'Asia/Tokyo', 'Asia/Kolkata']);
  const [convertedTimes, setConvertedTimes] = useState<{ timezone: string; time: string; date: string }[]>([]);

  const popularTimezones = [
    { value: 'America/New_York', label: 'New York (EST/EDT)' },
    { value: 'America/Chicago', label: 'Chicago (CST/CDT)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
    { value: 'Europe/London', label: 'London (GMT/BST)' },
    { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
    { value: 'Asia/Dubai', label: 'Dubai (GST)' },
    { value: 'Asia/Kolkata', label: 'India (IST)' },
    { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEDT/AEST)' },
    { value: 'Pacific/Auckland', label: 'Auckland (NZDT/NZST)' },
    { value: 'UTC', label: 'UTC' },
  ];

  useEffect(() => {
    if (!sourceDate || !sourceTime) return;
    
    try {
      // Create date in source timezone
      const sourceDateTime = new Date(`${sourceDate}T${sourceTime}:00`);
      
      // Convert to each target timezone
      const results = targetTimezones.map(tz => {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: tz,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });

        const parts = formatter.formatToParts(sourceDateTime);
        const dateParts: Record<string, string> = {};
        parts.forEach(part => {
          if (part.type !== 'literal') {
            dateParts[part.type] = part.value;
          }
        });

        return {
          timezone: tz,
          time: `${dateParts.hour}:${dateParts.minute}:${dateParts.second}`,
          date: `${dateParts.year}-${dateParts.month}-${dateParts.day}`,
        };
      });

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConvertedTimes(results);
    } catch (error: unknown) {
      console.error('Timezone conversion error:', error);
    }
  }, [sourceDate, sourceTime, targetTimezones]);

  const addTimezone = (tz: string) => {
    if (!targetTimezones.includes(tz)) {
      setTargetTimezones([...targetTimezones, tz]);
    }
  };

  const removeTimezone = (tz: string) => {
    setTargetTimezones(targetTimezones.filter(t => t !== tz));
  };

  const useCurrentTime = () => {
    const now = new Date();
    setSourceDate(now.toISOString().split('T')[0]);
    setSourceTime(now.toTimeString().split(' ')[0].substring(0, 5));
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-200">
            <strong>Convert times across timezones:</strong> Handles daylight saving time (DST)
            automatically. Perfect for scheduling meetings across different regions.
          </div>
        </div>
      </div>

      {/* Source Time Settings */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Source Time
          </h3>
          <button
            onClick={useCurrentTime}
            className="text-sm px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
          >
            Use Now
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={sourceDate}
              onChange={(e) => setSourceDate(e.target.value)}
              className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Time</label>
            <input
              type="time"
              value={sourceTime}
              onChange={(e) => setSourceTime(e.target.value)}
              className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Timezone</label>
          <select
            value={sourceTimezone}
            onChange={(e) => setSourceTimezone(e.target.value)}
            className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {popularTimezones.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Converted Times */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Globe className="w-5 h-5 text-green-500" />
            Converted Times
          </h3>
          <select
            onChange={(e) => {
              if (e.target.value) {
                addTimezone(e.target.value);
                e.target.value = '';
              }
            }}
            className="text-sm bg-zinc-800 text-white px-3 py-1 rounded border border-zinc-700"
          >
            <option value="">+ Add Timezone</option>
            {popularTimezones.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          {convertedTimes.map((result, index) => {
            const tzInfo = popularTimezones.find(tz => tz.value === result.timezone);
            return (
              <div
                key={result.timezone}
                className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 flex items-center justify-between group hover:border-blue-500/50 transition-all"
              >
                <div className="flex-1">
                  <div className="font-semibold text-lg flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    {result.date}
                  </div>
                  <div className="text-2xl font-mono text-blue-400 my-1">
                    {result.time}
                  </div>
                  <div className="text-sm text-gray-400">{tzInfo?.label || result.timezone}</div>
                </div>
                <button
                  onClick={() => removeTimezone(result.timezone)}
                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 transition-all px-3 py-1 text-sm"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>

        {convertedTimes.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Add timezones to see converted times
          </div>
        )}
      </div>

      {/* Quick Reference */}
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-4">
        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <ArrowRight className="w-4 h-4" />
          Quick Reference
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div>
            <div className="text-gray-500">EST/EDT</div>
            <div className="text-gray-300">New York</div>
          </div>
          <div>
            <div className="text-gray-500">PST/PDT</div>
            <div className="text-gray-300">Los Angeles</div>
          </div>
          <div>
            <div className="text-gray-500">IST</div>
            <div className="text-gray-300">India +5:30</div>
          </div>
          <div>
            <div className="text-gray-500">JST</div>
            <div className="text-gray-300">Japan +9:00</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(TimezoneConverterComponent);
