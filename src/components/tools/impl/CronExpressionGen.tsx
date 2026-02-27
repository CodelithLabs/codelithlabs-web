'use client';
import { useState } from 'react';
import { Clock, Copy, Check } from 'lucide-react';

const PRESETS = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Every 5 minutes', value: '*/5 * * * *' },
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Every day at midnight', value: '0 0 * * *' },
  { label: 'Every day at 9 AM', value: '0 9 * * *' },
  { label: 'Every Monday 9 AM', value: '0 9 * * 1' },
  { label: 'First of every month', value: '0 0 1 * *' },
  { label: 'Every Sunday midnight', value: '0 0 * * 0' },
  { label: 'Every 15 minutes', value: '*/15 * * * *' },
  { label: 'Twice daily (9AM, 5PM)', value: '0 9,17 * * *' },
  { label: 'Weekdays 9 AM', value: '0 9 * * 1-5' },
  { label: 'Every 6 hours', value: '0 */6 * * *' },
];

export default function CronExpressionGen() {
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [day, setDay] = useState('*');
  const [month, setMonth] = useState('*');
  const [weekday, setWeekday] = useState('*');
  const [copied, setCopied] = useState(false);

  const cron = `${minute} ${hour} ${day} ${month} ${weekday}`;

  const describe = () => {
    const parts: string[] = [];
    if (minute === '*') parts.push('every minute');
    else if (minute.startsWith('*/')) parts.push(`every ${minute.slice(2)} minutes`);
    else parts.push(`at minute ${minute}`);

    if (hour === '*') { /* every hour implied */ }
    else if (hour.startsWith('*/')) parts.push(`every ${hour.slice(2)} hours`);
    else if (hour.includes(',')) parts.push(`at hours ${hour}`);
    else parts.push(`at ${parseInt(hour) > 12 ? parseInt(hour) - 12 + ' PM' : hour + ' AM'}`);

    if (day !== '*') parts.push(`on day ${day} of month`);
    if (month !== '*') {
      const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      parts.push(`in ${months[parseInt(month)] || month}`);
    }
    if (weekday !== '*') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      if (weekday.includes('-')) {
        const [s, e] = weekday.split('-');
        parts.push(`${days[parseInt(s)]} to ${days[parseInt(e)]}`);
      } else {
        parts.push(`on ${weekday.split(',').map(w => days[parseInt(w)] || w).join(', ')}`);
      }
    }
    return parts.join(', ');
  };

  const getNextRuns = () => {
    const runs: string[] = [];
    const now = new Date();
    const test = new Date(now);
    for (let i = 0; i < 1440 && runs.length < 5; i++) {
      test.setMinutes(test.getMinutes() + 1);
      const m = test.getMinutes(), h = test.getHours(), d = test.getDate(), mo = test.getMonth() + 1, w = test.getDay();
      const matchMin = minute === '*' || (minute.startsWith('*/') ? m % parseInt(minute.slice(2)) === 0 : minute.split(',').includes(String(m)));
      const matchHour = hour === '*' || (hour.startsWith('*/') ? h % parseInt(hour.slice(2)) === 0 : hour.split(',').includes(String(h)));
      const matchDay = day === '*' || day.split(',').includes(String(d));
      const matchMonth = month === '*' || month.split(',').includes(String(mo));
      const matchWeekday = weekday === '*' || (weekday.includes('-') ? (w >= parseInt(weekday.split('-')[0]) && w <= parseInt(weekday.split('-')[1])) : weekday.split(',').includes(String(w)));
      if (matchMin && matchHour && matchDay && matchMonth && matchWeekday) {
        runs.push(test.toLocaleString());
      }
    }
    return runs;
  };

  const copy = () => { navigator.clipboard.writeText(cron); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  const applyPreset = (val: string) => {
    const parts = val.split(' ');
    setMinute(parts[0]); setHour(parts[1]); setDay(parts[2]); setMonth(parts[3]); setWeekday(parts[4]);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Clock className="w-4 h-4 inline mr-2" /><strong>Cron Expression Generator:</strong> Build cron expressions visually. See human-readable descriptions and upcoming run times.
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-center justify-between">
        <code className="text-2xl font-bold font-mono text-green-400">{cron}</code>
        <button onClick={copy} className="text-gray-400 hover:text-white p-2">{copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}</button>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-gray-300">📝 {describe()}</div>
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Minute', value: minute, onChange: setMinute, hint: '0-59' },
          { label: 'Hour', value: hour, onChange: setHour, hint: '0-23' },
          { label: 'Day', value: day, onChange: setDay, hint: '1-31' },
          { label: 'Month', value: month, onChange: setMonth, hint: '1-12' },
          { label: 'Weekday', value: weekday, onChange: setWeekday, hint: '0-6 (Sun-Sat)' },
        ].map(f => (
          <div key={f.label}>
            <label className="text-xs block mb-1 text-gray-400">{f.label}</label>
            <input value={f.value} onChange={e => f.onChange(e.target.value)} className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 font-mono text-center text-sm" />
            <div className="text-[10px] text-gray-600 mt-1">{f.hint}</div>
          </div>
        ))}
      </div>
      <div><label className="text-xs text-gray-400 block mb-2">Quick Presets</label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (<button key={p.value} onClick={() => applyPreset(p.value)} className="text-xs px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-full text-gray-400">{p.label}</button>))}
        </div>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="text-sm font-semibold mb-2">Next 5 Runs</div>
        <div className="space-y-1">{getNextRuns().map((r, i) => (<div key={i} className="text-sm font-mono text-gray-400">▸ {r}</div>))}</div>
        {getNextRuns().length === 0 && <div className="text-sm text-gray-500">No runs in the next 24 hours</div>}
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-gray-500">
        <div className="font-semibold text-gray-400 mb-1">Cron Syntax Reference</div>
        <div className="grid grid-cols-2 gap-1">
          <div><code>*</code> = any value</div>
          <div><code>*/n</code> = every n units</div>
          <div><code>1,3,5</code> = specific values</div>
          <div><code>1-5</code> = range</div>
        </div>
      </div>
    </div>
  );
}
