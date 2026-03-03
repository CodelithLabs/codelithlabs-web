'use client';
import { useState , memo } from 'react';
import { Umbrella, Calculator } from 'lucide-react';

const RetirementCalculatorComponent = function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState('30');
  const [retireAge, setRetireAge] = useState('60');
  const [lifeExpect, setLifeExpect] = useState('80');
  const [currentSavings, setCurrentSavings] = useState('500000');
  const [monthlyContrib, setMonthlyContrib] = useState('10000');
  const [returnRate, setReturnRate] = useState('10');
  const [inflationRate, setInflationRate] = useState('6');
  const [monthlyExpense, setMonthlyExpense] = useState('50000');
  const [result, setResult] = useState<{ corpus: number; required: number; gap: number; sufficient: boolean; monthlyIncome: number } | null>(null);

  const calculate = () => {
    const age = parseFloat(currentAge) || 30;
    const retire = parseFloat(retireAge) || 60;
    const life = parseFloat(lifeExpect) || 80;
    const savings = parseFloat(currentSavings) || 0;
    const monthly = parseFloat(monthlyContrib) || 0;
    const ret = (parseFloat(returnRate) || 10) / 100;
    const inf = (parseFloat(inflationRate) || 6) / 100;
    const expense = parseFloat(monthlyExpense) || 50000;
    const yearsToRetire = retire - age;
    const yearsInRetirement = life - retire;

    // Future value of current savings + monthly contributions
    const monthlyReturn = ret / 12;
    const months = yearsToRetire * 12;
    const fvSavings = savings * Math.pow(1 + monthlyReturn, months);
    const fvContrib = monthly * ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn);
    const corpus = fvSavings + fvContrib;

    // Required corpus (inflation-adjusted expenses)
    const futureMonthlyExpense = expense * Math.pow(1 + inf, yearsToRetire);
    const realReturn = ((1 + ret) / (1 + inf) - 1);
    const monthlyRealReturn = realReturn / 12;
    const retirementMonths = yearsInRetirement * 12;
    const requiredCorpus = futureMonthlyExpense * ((1 - Math.pow(1 + monthlyRealReturn, -retirementMonths)) / monthlyRealReturn);

    setResult({
      corpus,
      required: requiredCorpus,
      gap: requiredCorpus - corpus,
      sufficient: corpus >= requiredCorpus,
      monthlyIncome: corpus * monthlyRealReturn / (1 - Math.pow(1 + monthlyRealReturn, -retirementMonths)),
    });
  };

  const fmt = (n: number) => '₹' + Math.abs(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Umbrella className="w-4 h-4 inline mr-2" /><strong>Retirement Calculator (India):</strong> Plan your retirement corpus considering inflation, returns, and monthly expenses.
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <div><label className="text-xs block mb-1">Current Age</label><input type="number" value={currentAge} onChange={e => setCurrentAge(e.target.value)} className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm" /></div>
        <div><label className="text-xs block mb-1">Retirement Age</label><input type="number" value={retireAge} onChange={e => setRetireAge(e.target.value)} className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm" /></div>
        <div><label className="text-xs block mb-1">Life Expectancy</label><input type="number" value={lifeExpect} onChange={e => setLifeExpect(e.target.value)} className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm" /></div>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div><label className="text-xs block mb-1">Current Savings (₹)</label><input type="number" value={currentSavings} onChange={e => setCurrentSavings(e.target.value)} className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm" /></div>
        <div><label className="text-xs block mb-1">Monthly Contribution (₹)</label><input type="number" value={monthlyContrib} onChange={e => setMonthlyContrib(e.target.value)} className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm" /></div>
        <div><label className="text-xs block mb-1">Expected Return (%)</label><input type="number" value={returnRate} onChange={e => setReturnRate(e.target.value)} step="0.5" className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm" /></div>
        <div><label className="text-xs block mb-1">Inflation Rate (%)</label><input type="number" value={inflationRate} onChange={e => setInflationRate(e.target.value)} step="0.5" className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm" /></div>
        <div className="md:col-span-2"><label className="text-xs block mb-1">Current Monthly Expense (₹)</label><input type="number" value={monthlyExpense} onChange={e => setMonthlyExpense(e.target.value)} className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm" /></div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2"><Calculator className="w-4 h-4" />Calculate Retirement Plan</button>
      {result && (
        <div className="space-y-3">
          <div className={`rounded-lg p-6 text-center border ${result.sufficient ? 'bg-green-900/30 border-green-500/30' : 'bg-red-900/30 border-red-500/30'}`}>
            <div className="text-sm text-gray-300 mb-1">{result.sufficient ? '✅ You\'re on track!' : '⚠️ Shortfall Detected'}</div>
            <div className={`text-3xl font-bold ${result.sufficient ? 'text-green-400' : 'text-red-400'}`}>{result.sufficient ? 'Surplus: ' + fmt(Math.abs(result.gap)) : 'Gap: ' + fmt(result.gap)}</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-400">Projected Corpus</div><div className="text-lg font-bold text-blue-400">{fmt(result.corpus)}</div></div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center"><div className="text-xs text-gray-400">Required Corpus</div><div className="text-lg font-bold text-yellow-400">{fmt(result.required)}</div></div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center col-span-2"><div className="text-xs text-gray-400">Monthly Income at Retirement</div><div className="text-lg font-bold text-green-400">{fmt(result.monthlyIncome)}/month</div></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(RetirementCalculatorComponent);
