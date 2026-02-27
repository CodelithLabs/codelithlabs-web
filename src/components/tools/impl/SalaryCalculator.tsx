'use client';
import { useState } from 'react';
import { Briefcase, IndianRupee } from 'lucide-react';

export default function SalaryCalculator() {
  const [ctc, setCtc] = useState('1500000');
  const [bonus, setBonus] = useState('10');
  const [pf, setPf] = useState('12');
  const [result, setResult] = useState<{ basic: number; hra: number; da: number; pfEmployee: number; pfEmployer: number; gratuity: number; bonus: number; grossMonthly: number; netMonthly: number; netAnnual: number } | null>(null);

  const calculate = () => {
    const annualCtc = parseFloat(ctc) || 0;
    const bonusPct = parseFloat(bonus) || 0;
    const pfPct = parseFloat(pf) || 0;

    const bonusAmt = annualCtc * (bonusPct / 100);
    const gratuity = (annualCtc * 0.0481);
    const pfBase = (annualCtc - bonusAmt - gratuity);
    const basic = pfBase * 0.50;
    const hra = basic * 0.40;
    const da = basic * 0.10;
    const pfEmployee = Math.min(basic * (pfPct / 100), 21600);
    const pfEmployer = pfEmployee;
    const special = annualCtc - basic - hra - da - bonusAmt - pfEmployer - gratuity;
    const grossAnnual = basic + hra + da + special + bonusAmt;
    const deductions = pfEmployee * 12 + 2400; // PT approx
    const netAnnual = grossAnnual - deductions;
    const grossMonthly = grossAnnual / 12;
    const netMonthly = netAnnual / 12;

    setResult({ basic: basic / 12, hra: hra / 12, da: da / 12, pfEmployee, pfEmployer, gratuity, bonus: bonusAmt, grossMonthly, netMonthly, netAnnual });
  };

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Briefcase className="w-4 h-4 inline mr-2" /><strong>CTC to In-Hand Salary Calculator (India):</strong> Calculate your monthly in-hand salary from annual CTC including PF, HRA, gratuity, and bonus deductions.
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="text-sm block mb-1">Annual CTC (₹)</label><div className="relative"><IndianRupee className="absolute left-3 top-3 w-4 h-4 text-gray-400" /><input type="number" value={ctc} onChange={e => setCtc(e.target.value)} className="w-full bg-zinc-800 text-white p-3 pl-9 rounded-lg border border-zinc-700" /></div></div>
        <div><label className="text-sm block mb-1">Bonus (%)</label><input type="number" value={bonus} onChange={e => setBonus(e.target.value)} className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700" /></div>
        <div><label className="text-sm block mb-1">PF Contribution (%)</label><input type="number" value={pf} onChange={e => setPf(e.target.value)} className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700" /></div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">Calculate In-Hand Salary</button>
      {result && (
        <>
          <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-500/30 rounded-lg p-6 text-center">
            <div className="text-sm text-gray-300 mb-1">Monthly In-Hand Salary</div>
            <div className="text-4xl font-bold text-green-400">{fmt(result.netMonthly)}</div>
            <div className="text-sm text-gray-400 mt-2">Annual: {fmt(result.netAnnual)}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <div className="p-3 border-b border-zinc-800 font-semibold text-sm">Monthly Salary Breakdown</div>
            {[
              { label: 'Basic Salary', value: result.basic, color: 'text-blue-400' },
              { label: 'HRA', value: result.hra, color: 'text-green-400' },
              { label: 'Dearness Allowance', value: result.da, color: 'text-yellow-400' },
              { label: 'Gross Monthly', value: result.grossMonthly, color: 'text-white font-bold' },
              { label: 'PF Deduction (Employee)', value: -result.pfEmployee, color: 'text-red-400' },
              { label: 'Prof. Tax (approx)', value: -200, color: 'text-red-400' },
              { label: 'Net In-Hand', value: result.netMonthly, color: 'text-green-400 font-bold' },
            ].map((r, i) => (
              <div key={i} className="flex justify-between px-4 py-2 border-b border-zinc-800/50 text-sm">
                <span className="text-gray-300">{r.label}</span>
                <span className={`font-mono ${r.color}`}>{r.value < 0 ? '-' : ''}{fmt(Math.abs(r.value))}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="bg-zinc-800 rounded-lg p-3"><div className="text-gray-500">PF (Employer)</div><div className="text-sm font-mono">{fmt(result.pfEmployer)}/mo</div></div>
            <div className="bg-zinc-800 rounded-lg p-3"><div className="text-gray-500">Annual Bonus</div><div className="text-sm font-mono">{fmt(result.bonus)}</div></div>
            <div className="bg-zinc-800 rounded-lg p-3"><div className="text-gray-500">Gratuity</div><div className="text-sm font-mono">{fmt(result.gratuity)}/yr</div></div>
          </div>
        </>
      )}
    </div>
  );
}
