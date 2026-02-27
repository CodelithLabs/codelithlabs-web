'use client';
import { useState, useEffect, useRef } from 'react';
import { Clock, Plus, Trash2 } from 'lucide-react';

const TIMEZONES: Record<string, { offset: number; label: string; country: string }> = {
  'Asia/Kolkata': { offset: 5.5, label: 'India (IST)', country: '🇮🇳' },
  'America/New_York': { offset: -5, label: 'New York (EST)', country: '🇺🇸' },
  'America/Los_Angeles': { offset: -8, label: 'Los Angeles (PST)', country: '🇺🇸' },
  'America/Chicago': { offset: -6, label: 'Chicago (CST)', country: '🇺🇸' },
  'Europe/London': { offset: 0, label: 'London (GMT)', country: '🇬🇧' },
  'Europe/Berlin': { offset: 1, label: 'Berlin (CET)', country: '🇩🇪' },
  'Europe/Paris': { offset: 1, label: 'Paris (CET)', country: '🇫🇷' },
  'Asia/Tokyo': { offset: 9, label: 'Tokyo (JST)', country: '🇯🇵' },
  'Asia/Shanghai': { offset: 8, label: 'Shanghai (CST)', country: '🇨🇳' },
  'Asia/Dubai': { offset: 4, label: 'Dubai (GST)', country: '🇦🇪' },
  'Asia/Singapore': { offset: 8, label: 'Singapore (SGT)', country: '🇸🇬' },
  'Australia/Sydney': { offset: 11, label: 'Sydney (AEDT)', country: '🇦🇺' },
  'Pacific/Auckland': { offset: 13, label: 'Auckland (NZDT)', country: '🇳🇿' },
  'Asia/Dhaka': { offset: 6, label: 'Dhaka (BST)', country: '🇧🇩' },
  'Asia/Kathmandu': { offset: 5.75, label: 'Kathmandu (NPT)', country: '🇳🇵' },
  'America/Sao_Paulo': { offset: -3, label: 'São Paulo (BRT)', country: '🇧🇷' },
};

export default function WorldClock() {
  const [selected, setSelected] = useState<string[]>(['Asia/Kolkata', 'America/New_York', 'Europe/London', 'Asia/Tokyo']);
  const [time, setTime] = useState(new Date());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => setTime(new Date()), 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const getTimeForTz = (tz: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).format(time);
    } catch {
      return '--:--:--';
    }
  };

  const getDateForTz = (tz: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short', month: 'short', day: 'numeric' }).format(time);
    } catch {
      return '';
    }
  };

  const addTz = (tz: string) => { if (!selected.includes(tz)) setSelected([...selected, tz]); };
  const removeTz = (tz: string) => setSelected(selected.filter(s => s !== tz));

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Clock className="w-4 h-4 inline mr-2" /><strong>World Clock:</strong> Track current time across multiple time zones simultaneously with live updates.
      </div>
      <div className="flex gap-2">
        <select onChange={e => { if (e.target.value) addTz(e.target.value); e.target.value = ''; }} className="flex-1 bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm">
          <option value="">Add timezone...</option>
          {Object.entries(TIMEZONES).filter(([k]) => !selected.includes(k)).map(([k, v]) => <option key={k} value={k}>{v.country} {v.label}</option>)}
        </select>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {selected.map(tz => {
          const info = TIMEZONES[tz];
          if (!info) return null;
          const hour = parseInt(getTimeForTz(tz).split(':')[0]);
          const isNight = hour >= 7 && hour <= 12 ? false : (hour >= 1 && hour <= 6);
          return (
            <div key={tz} className={`border rounded-lg p-4 ${isNight ? 'bg-indigo-950/50 border-indigo-500/30' : 'bg-zinc-900 border-zinc-800'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-gray-400">{info.country} {info.label}</div>
                  <div className="text-3xl font-bold font-mono mt-1">{getTimeForTz(tz)}</div>
                  <div className="text-xs text-gray-500 mt-1">{getDateForTz(tz)} • UTC{info.offset >= 0 ? '+' : ''}{info.offset}</div>
                </div>
                <button onClick={() => removeTz(tz)} className="text-gray-600 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          );
        })}
      </div>
      {selected.length === 0 && <div className="text-center text-gray-500 py-8">Add timezones from the dropdown above</div>}
    </div>
  );
}
