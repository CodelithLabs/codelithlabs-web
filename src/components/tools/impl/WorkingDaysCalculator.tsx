'use client';

import { memo, useState, useCallback } from 'react';

function WorkingDaysCalculator() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [excludeWeekends, setExcludeWeekends] = useState(true);
  const [holidays, setHolidays] = useState('');
  const [result, setResult] = useState<{ totalDays: number; workingDays: number; weekends: number; holidayCount: number } | null>(null);

  const handleCalculate = useCallback(() => {
    if (!startDate || !endDate) {
      setResult(null);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      setResult(null);
      return;
    }

    const holidayList = holidays
      .split('\n')
      .map(d => d.trim())
      .filter(d => d)
      .map(d => new Date(d).toDateString());

    let totalDays = 0;
    let workingDays = 0;
    let weekends = 0;
    let holidayCount = 0;

    const current = new Date(start);
    while (current <= end) {
      totalDays++;
      const dayOfWeek = current.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isHoliday = holidayList.includes(current.toDateString());

      if (isWeekend && excludeWeekends) {
        weekends++;
      } else if (isHoliday) {
        holidayCount++;
      } else {
        workingDays++;
      }

      current.setDate(current.getDate() + 1);
    }

    setResult({
      totalDays,
      workingDays,
      weekends,
      holidayCount,
    });
  }, [startDate, endDate, excludeWeekends, holidays]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Working Days Calculator</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="excludeWeekends"
              checked={excludeWeekends}
              onChange={(e) => setExcludeWeekends(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="excludeWeekends" className="text-zinc-300 text-sm">
              Exclude weekends (Saturday & Sunday)
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Holidays (one date per line, YYYY-MM-DD)
            </label>
            <textarea
              value={holidays}
              onChange={(e) => setHolidays(e.target.value)}
              placeholder="2026-01-26&#10;2026-08-15&#10;2026-10-02"
              rows={4}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleCalculate}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Calculate Working Days
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Results</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{result.totalDays}</div>
              <div className="text-sm text-zinc-400">Total Days</div>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{result.workingDays}</div>
              <div className="text-sm text-zinc-400">Working Days</div>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{result.weekends}</div>
              <div className="text-sm text-zinc-400">Weekend Days</div>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{result.holidayCount}</div>
              <div className="text-sm text-zinc-400">Holidays</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(WorkingDaysCalculator);
