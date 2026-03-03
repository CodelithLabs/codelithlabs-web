'use client';
import { useState, useCallback, memo } from 'react';
import { Moon, Sun, Clock, AlertCircle } from 'lucide-react';

const SleepCycleCalculatorComponent = function SleepCycleCalculator() {
  const [mode, setMode] = useState<'wakeUp' | 'goSleep'>('wakeUp');
  const [time, setTime] = useState('07:00');
  const [fallAsleepTime, setFallAsleepTime] = useState(15); // minutes

  const CYCLE_MINUTES = 90;
  const CYCLES_FULL_REST = [6, 5, 4]; // 6 cycles = 9 hours, ideal
  const CYCLES_MINIMUM = 4; // 6 hours minimum

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const parseTime = (timeStr: string): Date => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const calculateTimes = useCallback(() => {
    const baseTime = parseTime(time);
    const results: { cycles: number; time: Date; duration: string; quality: string }[] = [];

    if (mode === 'wakeUp') {
      // Calculate bedtimes to wake up at the given time
      for (let cycles = 6; cycles >= 3; cycles--) {
        const sleepMinutes = cycles * CYCLE_MINUTES;
        const totalMinutes = sleepMinutes + fallAsleepTime;
        const bedtime = new Date(baseTime.getTime() - totalMinutes * 60 * 1000);
        
        let quality = 'Poor';
        if (cycles >= 6) quality = 'Optimal';
        else if (cycles >= 5) quality = 'Good';
        else if (cycles >= 4) quality = 'Fair';

        results.push({
          cycles,
          time: bedtime,
          duration: `${Math.floor(sleepMinutes / 60)}h ${sleepMinutes % 60}m`,
          quality,
        });
      }
    } else {
      // Calculate wake times if going to sleep at the given time
      const sleepTime = new Date(baseTime.getTime() + fallAsleepTime * 60 * 1000);
      
      for (let cycles = 4; cycles <= 6; cycles++) {
        const sleepMinutes = cycles * CYCLE_MINUTES;
        const wakeTime = new Date(sleepTime.getTime() + sleepMinutes * 60 * 1000);
        
        let quality = 'Poor';
        if (cycles >= 6) quality = 'Optimal';
        else if (cycles >= 5) quality = 'Good';
        else if (cycles >= 4) quality = 'Fair';

        results.push({
          cycles,
          time: wakeTime,
          duration: `${Math.floor(sleepMinutes / 60)}h ${sleepMinutes % 60}m`,
          quality,
        });
      }
    }

    return results;
  }, [mode, time, fallAsleepTime]);

  const results = calculateTimes();

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'Optimal': return 'text-green-400 bg-green-900/30 border-green-500/30';
      case 'Good': return 'text-blue-400 bg-blue-900/30 border-blue-500/30';
      case 'Fair': return 'text-yellow-400 bg-yellow-900/30 border-yellow-500/30';
      default: return 'text-red-400 bg-red-900/30 border-red-500/30';
    }
  };

  const quickTimes = mode === 'wakeUp' 
    ? ['05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00']
    : ['21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '00:00'];

  return (
    <div className="space-y-4">
      <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4 text-sm text-indigo-200">
        <Moon className="w-4 h-4 inline mr-2" />
        <strong>Sleep Cycle Calculator:</strong> Calculate optimal sleep and wake times based on 90-minute sleep cycles. Wake up feeling refreshed!
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('wakeUp')}
          className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 ${
            mode === 'wakeUp' 
              ? 'bg-orange-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          <Sun className="w-4 h-4" />
          I need to wake up at...
        </button>
        <button
          onClick={() => setMode('goSleep')}
          className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 ${
            mode === 'goSleep'
              ? 'bg-indigo-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          <Moon className="w-4 h-4" />
          I am going to sleep at...
        </button>
      </div>

      {/* Time Input */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center justify-center gap-4">
          <label className="text-sm text-zinc-400">
            {mode === 'wakeUp' ? 'Wake up time:' : 'Bedtime:'}
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="bg-zinc-800 text-white text-2xl p-3 rounded-lg border border-zinc-700 text-center"
          />
        </div>

        {/* Quick Time Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {quickTimes.map(t => (
            <button
              key={t}
              onClick={() => setTime(t)}
              className={`px-3 py-1 text-sm rounded ${
                time === t
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Fall Asleep Time */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <label className="text-sm text-zinc-500">Time to fall asleep:</label>
          <select
            value={fallAsleepTime}
            onChange={(e) => setFallAsleepTime(parseInt(e.target.value))}
            className="bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm"
          >
            <option value={5}>5 min</option>
            <option value={10}>10 min</option>
            <option value={15}>15 min (avg)</option>
            <option value={20}>20 min</option>
            <option value={30}>30 min</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-zinc-400 text-center">
          {mode === 'wakeUp' 
            ? 'Go to bed at one of these times:'
            : 'Wake up at one of these times:'}
        </h4>

        {results.map((result, idx) => (
          <div
            key={idx}
            className={`rounded-lg p-4 border ${
              idx === 0
                ? getQualityColor(result.quality)
                : 'bg-zinc-900 border-zinc-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`text-3xl font-bold ${
                  idx === 0 ? '' : 'text-white'
                }`}>
                  {formatTime(result.time)}
                </div>
                {idx === 0 && (
                  <span className="px-2 py-0.5 bg-white/20 rounded text-xs">
                    Recommended
                  </span>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm text-zinc-400">{result.duration}</div>
                <div className="text-xs text-zinc-500">{result.cycles} cycles</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sleep Info */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-zinc-300 mb-3">How Sleep Cycles Work</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2 text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Each sleep cycle is ~90 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>Adults need 4-6 cycles (6-9 hours)</span>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-indigo-400" />
              <span>Waking between cycles feels better</span>
            </div>
          </div>
          <div className="space-y-1 text-xs text-zinc-500">
            <div className="flex justify-between">
              <span>Light sleep (N1-N2):</span>
              <span>~50% of cycle</span>
            </div>
            <div className="flex justify-between">
              <span>Deep sleep (N3):</span>
              <span>~25% of cycle</span>
            </div>
            <div className="flex justify-between">
              <span>REM sleep:</span>
              <span>~25% of cycle</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-400">
        <strong className="text-zinc-300">💤 Better Sleep Tips:</strong>
        <ul className="mt-1 space-y-1">
          <li>• Avoid screens 30-60 minutes before bed</li>
          <li>• Keep your bedroom cool (65-68°F / 18-20°C)</li>
          <li>• Avoid caffeine 6+ hours before sleep</li>
          <li>• Maintain a consistent sleep schedule</li>
        </ul>
      </div>
    </div>
  );
};

export default memo(SleepCycleCalculatorComponent);
