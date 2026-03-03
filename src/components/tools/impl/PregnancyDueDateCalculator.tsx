'use client';

import { memo, useState, useCallback } from 'react';

function PregnancyDueDateCalculator() {
  const [method, setMethod] = useState<'lmp' | 'conception' | 'ivf'>('lmp');
  const [date, setDate] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [result, setResult] = useState<{
    dueDate: Date;
    currentWeek: number;
    currentDay: number;
    trimester: number;
    daysRemaining: number;
    milestones: { week: number; description: string }[];
  } | null>(null);

  const handleCalculate = useCallback(() => {
    if (!date) {
      setResult(null);
      return;
    }

    const inputDate = new Date(date);
    let conceptionDate: Date;
    let dueDate: Date;

    switch (method) {
      case 'lmp': {
        // Naegele's Rule: Due date = LMP + 280 days (adjusted for cycle length)
        const cycleAdjustment = (parseInt(cycleLength) || 28) - 28;
        conceptionDate = new Date(inputDate);
        conceptionDate.setDate(conceptionDate.getDate() + 14 + cycleAdjustment);
        dueDate = new Date(inputDate);
        dueDate.setDate(dueDate.getDate() + 280 + cycleAdjustment);
        break;
      }
      case 'conception': {
        conceptionDate = new Date(inputDate);
        dueDate = new Date(inputDate);
        dueDate.setDate(dueDate.getDate() + 266);
        break;
      }
      case 'ivf': {
        // IVF: Transfer date + 266 days (minus days of embryo development)
        conceptionDate = new Date(inputDate);
        conceptionDate.setDate(conceptionDate.getDate() - 3); // Assuming 3-day embryo
        dueDate = new Date(inputDate);
        dueDate.setDate(dueDate.getDate() + 263);
        break;
      }
    }

    const today = new Date();
    const lmpDate = method === 'lmp' ? inputDate : new Date(conceptionDate.getTime() - 14 * 24 * 60 * 60 * 1000);
    const daysSinceLMP = Math.floor((today.getTime() - lmpDate.getTime()) / (1000 * 60 * 60 * 24));
    const currentWeek = Math.floor(daysSinceLMP / 7);
    const currentDay = daysSinceLMP % 7;
    const daysRemaining = Math.max(0, Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

    let trimester = 1;
    if (currentWeek >= 13 && currentWeek < 27) trimester = 2;
    else if (currentWeek >= 27) trimester = 3;

    const milestones = [
      { week: 4, description: 'Implantation complete, pregnancy test positive' },
      { week: 6, description: 'Heartbeat detectable on ultrasound' },
      { week: 8, description: 'All major organs begin forming' },
      { week: 12, description: 'End of first trimester, risk of miscarriage decreases' },
      { week: 16, description: 'Gender may be visible on ultrasound' },
      { week: 20, description: 'Anatomy scan, halfway point' },
      { week: 24, description: 'Viability milestone' },
      { week: 28, description: 'Third trimester begins' },
      { week: 32, description: 'Baby gains weight rapidly' },
      { week: 37, description: 'Full term pregnancy' },
      { week: 40, description: 'Due date' },
    ];

    setResult({
      dueDate,
      currentWeek,
      currentDay,
      trimester,
      daysRemaining,
      milestones,
    });
  }, [method, date, cycleLength]);

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Pregnancy Due Date Calculator</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Calculation Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as 'lmp' | 'conception' | 'ivf')}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="lmp">Last Menstrual Period (LMP)</option>
              <option value="conception">Conception Date</option>
              <option value="ivf">IVF Transfer Date</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                {method === 'lmp' ? 'First Day of Last Period' : method === 'conception' ? 'Conception Date' : 'IVF Transfer Date'}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {method === 'lmp' && (
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Average Cycle Length (days)</label>
                <input
                  type="number"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(e.target.value)}
                  placeholder="28"
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
          <button
            onClick={handleCalculate}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Calculate Due Date
          </button>
        </div>
      </div>

      {result && (
        <>
          <div className="bg-pink-900/20 border border-pink-700/50 rounded-lg p-6">
            <div className="text-center">
              <div className="text-sm text-zinc-400 mb-2">Estimated Due Date</div>
              <div className="text-2xl font-bold text-pink-400">{formatDate(result.dueDate)}</div>
            </div>
          </div>

          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Current Progress</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-zinc-900 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{result.currentWeek}w {result.currentDay}d</div>
                <div className="text-sm text-zinc-400">Current Week</div>
              </div>
              <div className="bg-zinc-900 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">Trimester {result.trimester}</div>
                <div className="text-sm text-zinc-400">Current Stage</div>
              </div>
              <div className="bg-zinc-900 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">{result.daysRemaining}</div>
                <div className="text-sm text-zinc-400">Days Remaining</div>
              </div>
              <div className="bg-zinc-900 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{Math.round((280 - result.daysRemaining) / 280 * 100)}%</div>
                <div className="text-sm text-zinc-400">Complete</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="h-4 bg-zinc-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all"
                  style={{ width: `${Math.min(100, (280 - result.daysRemaining) / 280 * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Pregnancy Milestones</h3>
            <div className="space-y-2">
              {result.milestones.map((milestone, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    result.currentWeek >= milestone.week 
                      ? 'bg-green-900/20 border border-green-700/50' 
                      : 'bg-zinc-900'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    result.currentWeek >= milestone.week ? 'bg-green-600' : 'bg-zinc-700'
                  }`}>
                    {milestone.week}
                  </div>
                  <span className={result.currentWeek >= milestone.week ? 'text-green-400' : 'text-zinc-400'}>
                    {milestone.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default memo(PregnancyDueDateCalculator);
