'use client';
import { useState, useCallback, memo } from 'react';
import { DollarSign, Calculator, RotateCcw, Info } from 'lucide-react';

const FreelanceRateCalculatorComponent = function FreelanceRateCalculator() {
  const [annualSalaryGoal, setAnnualSalaryGoal] = useState(80000);
  const [workingWeeks, setWorkingWeeks] = useState(48);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [billablePercentage, setBillablePercentage] = useState(60);
  const [taxRate, setTaxRate] = useState(30);
  const [expenses, setExpenses] = useState({
    healthInsurance: 500,
    retirement: 500,
    software: 200,
    equipment: 100,
    marketing: 200,
    other: 200,
  });
  const [currency, setCurrency] = useState('$');

  const calculate = useCallback(() => {
    // Calculate total annual expenses
    const monthlyExpenses = Object.values(expenses).reduce((sum, val) => sum + val, 0);
    const annualExpenses = monthlyExpenses * 12;

    // Calculate gross needed to achieve net salary goal
    const grossNeeded = (annualSalaryGoal + annualExpenses) / (1 - taxRate / 100);

    // Calculate billable hours
    const totalWorkHours = workingWeeks * hoursPerWeek;
    const billableHours = totalWorkHours * (billablePercentage / 100);

    // Calculate rates
    const hourlyRate = grossNeeded / billableHours;
    const dailyRate = hourlyRate * 8;
    const weeklyRate = hourlyRate * 40;
    const monthlyRate = grossNeeded / 12;

    // Project rates at different margins
    const projectMultipliers = {
      low: 1.2,
      medium: 1.5,
      high: 2.0,
    };

    return {
      grossNeeded,
      billableHours,
      hourlyRate,
      dailyRate,
      weeklyRate,
      monthlyRate,
      annualExpenses,
      taxAmount: grossNeeded * (taxRate / 100),
      projectRates: {
        low: hourlyRate * projectMultipliers.low,
        medium: hourlyRate * projectMultipliers.medium,
        high: hourlyRate * projectMultipliers.high,
      },
    };
  }, [annualSalaryGoal, workingWeeks, hoursPerWeek, billablePercentage, taxRate, expenses]);

  const results = calculate();

  const formatMoney = (amount: number) => `${currency}${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

  const updateExpense = (key: keyof typeof expenses, value: number) => {
    setExpenses(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <DollarSign className="w-4 h-4 inline mr-2" />
        <strong>Freelance Rate Calculator:</strong> Calculate your ideal hourly, daily, and project rates based on income goals, expenses, and taxes.
      </div>

      {/* Income Goal */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-zinc-300 mb-3">Income Goal</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Desired Annual Net Income</label>
            <div className="flex">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-zinc-800 text-white p-2 rounded-l border border-zinc-700 border-r-0"
              >
                <option value="$">$</option>
                <option value="€">€</option>
                <option value="£">£</option>
                <option value="₹">₹</option>
              </select>
              <input
                type="number"
                value={annualSalaryGoal}
                onChange={(e) => setAnnualSalaryGoal(parseInt(e.target.value) || 0)}
                className="flex-1 bg-zinc-800 text-white p-2 rounded-r border border-zinc-700"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Estimated Tax Rate (%)</label>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(parseInt(e.target.value) || 0)}
              min={0}
              max={60}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
        </div>
      </div>

      {/* Work Schedule */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-zinc-300 mb-3">Work Schedule</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Working Weeks/Year</label>
            <input
              type="number"
              value={workingWeeks}
              onChange={(e) => setWorkingWeeks(parseInt(e.target.value) || 0)}
              min={1}
              max={52}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
            <div className="text-xs text-zinc-500 mt-1">{52 - workingWeeks} weeks off</div>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Hours per Week</label>
            <input
              type="number"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(parseInt(e.target.value) || 0)}
              min={1}
              max={80}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Billable % of Time</label>
            <input
              type="number"
              value={billablePercentage}
              onChange={(e) => setBillablePercentage(parseInt(e.target.value) || 0)}
              min={10}
              max={100}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
            <div className="text-xs text-zinc-500 mt-1">{100 - billablePercentage}% overhead</div>
          </div>
        </div>
      </div>

      {/* Monthly Expenses */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-zinc-300 mb-3">Monthly Business Expenses</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(expenses).map(([key, value]) => (
            <div key={key}>
              <label className="text-xs text-zinc-500 block mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => updateExpense(key as keyof typeof expenses, parseInt(e.target.value) || 0)}
                min={0}
                className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm"
              />
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-zinc-700 flex justify-between text-sm">
          <span className="text-zinc-400">Annual Business Expenses:</span>
          <span className="text-white font-medium">{formatMoney(results.annualExpenses)}</span>
        </div>
      </div>

      {/* Results */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-white mb-4 text-center">Your Rates</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
            <div className="text-xs text-blue-400 mb-1">Hourly Rate</div>
            <div className="text-2xl font-bold text-white">{formatMoney(results.hourlyRate)}</div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="text-xs text-zinc-500 mb-1">Daily Rate</div>
            <div className="text-xl font-bold text-white">{formatMoney(results.dailyRate)}</div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="text-xs text-zinc-500 mb-1">Weekly Rate</div>
            <div className="text-xl font-bold text-white">{formatMoney(results.weeklyRate)}</div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="text-xs text-zinc-500 mb-1">Monthly Avg</div>
            <div className="text-xl font-bold text-white">{formatMoney(results.monthlyRate)}</div>
          </div>
        </div>
      </div>

      {/* Project Rates */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <h4 className="text-sm font-medium text-zinc-300">Suggested Project Rates</h4>
          <div className="group relative">
            <Info className="w-4 h-4 text-zinc-500" />
            <div className="absolute bottom-full left-0 hidden group-hover:block w-48 p-2 bg-zinc-800 rounded text-xs text-zinc-400 mb-1">
              Project rates include buffer for scope creep, revisions, and project management overhead.
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-zinc-800 rounded-lg">
            <div className="text-xs text-zinc-500 mb-1">Budget (1.2x)</div>
            <div className="text-lg font-semibold text-white">{formatMoney(results.projectRates.low)}/hr</div>
          </div>
          <div className="text-center p-3 bg-green-900/30 border border-green-500/30 rounded-lg">
            <div className="text-xs text-green-400 mb-1">Standard (1.5x)</div>
            <div className="text-lg font-semibold text-white">{formatMoney(results.projectRates.medium)}/hr</div>
          </div>
          <div className="text-center p-3 bg-zinc-800 rounded-lg">
            <div className="text-xs text-zinc-500 mb-1">Premium (2x)</div>
            <div className="text-lg font-semibold text-white">{formatMoney(results.projectRates.high)}/hr</div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-sm">
        <h4 className="font-medium text-zinc-300 mb-2">Annual Breakdown</h4>
        <div className="space-y-2 text-zinc-400">
          <div className="flex justify-between">
            <span>Gross Revenue Needed:</span>
            <span className="text-white">{formatMoney(results.grossNeeded)}</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Taxes ({taxRate}%):</span>
            <span className="text-red-400">-{formatMoney(results.taxAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Business Expenses:</span>
            <span className="text-red-400">-{formatMoney(results.annualExpenses)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-zinc-700 font-medium">
            <span>Net Income:</span>
            <span className="text-green-400">{formatMoney(annualSalaryGoal)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Billable Hours:</span>
            <span>{results.billableHours.toFixed(0)} hrs/year</span>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-400">
        <strong className="text-zinc-300">💡 Pricing Tips:</strong>
        <ul className="mt-1 space-y-1">
          <li>• Most freelancers only bill 50-70% of their work time</li>
          <li>• Include a buffer for sick days, slow periods, and scope creep</li>
          <li>• Consider value-based pricing for experienced freelancers</li>
          <li>• Review and adjust your rates annually</li>
        </ul>
      </div>
    </div>
  );
};

export default memo(FreelanceRateCalculatorComponent);
