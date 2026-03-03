'use client';

import { memo, useState, useCallback } from 'react';

function MeetingCostCalculator() {
  const [attendees, setAttendees] = useState('');
  const [avgSalary, setAvgSalary] = useState('');
  const [duration, setDuration] = useState('');
  const [result, setResult] = useState<{ hourlyRate: number; meetingCost: number; costPerMinute: number } | null>(null);

  const handleCalculate = useCallback(() => {
    const numAttendees = parseInt(attendees) || 0;
    const salary = parseFloat(avgSalary) || 0;
    const mins = parseFloat(duration) || 0;

    if (numAttendees <= 0 || salary <= 0 || mins <= 0) {
      setResult(null);
      return;
    }

    // Assuming annual salary, 2080 working hours per year
    const hourlyRate = salary / 2080;
    const totalHourlyRate = hourlyRate * numAttendees;
    const meetingCost = (totalHourlyRate * mins) / 60;
    const costPerMinute = meetingCost / mins;

    setResult({
      hourlyRate: totalHourlyRate,
      meetingCost,
      costPerMinute,
    });
  }, [attendees, avgSalary, duration]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Meeting Cost Calculator</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Number of Attendees</label>
            <input
              type="number"
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
              placeholder="e.g., 5"
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Average Annual Salary (₹)</label>
            <input
              type="number"
              value={avgSalary}
              onChange={(e) => setAvgSalary(e.target.value)}
              placeholder="e.g., 1000000"
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Meeting Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 60"
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleCalculate}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Calculate Meeting Cost
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Results</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-zinc-700">
              <span className="text-zinc-400">Combined Hourly Rate:</span>
              <span className="text-green-400 font-mono">₹{result.hourlyRate.toFixed(2)}/hr</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-zinc-700">
              <span className="text-zinc-400">Total Meeting Cost:</span>
              <span className="text-yellow-400 font-mono text-xl">₹{result.meetingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-zinc-400">Cost Per Minute:</span>
              <span className="text-blue-400 font-mono">₹{result.costPerMinute.toFixed(2)}/min</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(MeetingCostCalculator);
