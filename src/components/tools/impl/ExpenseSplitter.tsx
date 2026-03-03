'use client';
import { useState , memo } from 'react';
import { Users, Plus, Trash2, Check } from 'lucide-react';

interface Person { name: string; paid: number; }

const ExpenseSplitterComponent = function ExpenseSplitter() {
  const [people, setPeople] = useState<Person[]>([{ name: 'You', paid: 0 }, { name: 'Friend', paid: 0 }]);
  const [totalBill, setTotalBill] = useState('');
  const [tipPct, setTipPct] = useState('0');
  const [splitType, setSplitType] = useState<'equal' | 'byPaid'>('equal');
  const [result, setResult] = useState<{ perPerson: number; settlements: { from: string; to: string; amount: number }[]; total: number }| null>(null);

  const addPerson = () => setPeople([...people, { name: `Person ${people.length + 1}`, paid: 0 }]);
  const removePerson = (i: number) => { if (people.length > 2) setPeople(people.filter((_, idx) => idx !== i)); };

  const calculate = () => {
    const bill = parseFloat(totalBill) || 0;
    const tip = bill * ((parseFloat(tipPct) || 0) / 100);
    const total = bill + tip;
    const perPerson = total / people.length;

    if (splitType === 'equal') {
      const balances = people.map(p => ({ name: p.name, balance: p.paid - perPerson }));
      const debtors = balances.filter(b => b.balance < 0).sort((a, b) => a.balance - b.balance);
      const creditors = balances.filter(b => b.balance > 0).sort((a, b) => b.balance - a.balance);
      const settlements: { from: string; to: string; amount: number }[] = [];
      let di = 0, ci = 0;
      while (di < debtors.length && ci < creditors.length) {
        const amt = Math.min(-debtors[di].balance, creditors[ci].balance);
        if (amt > 0.01) settlements.push({ from: debtors[di].name, to: creditors[ci].name, amount: amt });
        debtors[di].balance += amt;
        creditors[ci].balance -= amt;
        if (Math.abs(debtors[di].balance) < 0.01) di++;
        if (Math.abs(creditors[ci].balance) < 0.01) ci++;
      }
      setResult({ perPerson, settlements, total });
    } else {
      setResult({ perPerson, settlements: [], total });
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Users className="w-4 h-4 inline mr-2" /><strong>Expense Splitter:</strong> Split bills equally among friends and figure out who owes whom.
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="text-sm block mb-1">Total Bill ($)</label><input type="number" value={totalBill} onChange={e => setTotalBill(e.target.value)} placeholder="e.g. 150" className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700" /></div>
        <div><label className="text-sm block mb-1">Tip (%)</label>
          <div className="flex gap-2">
            {['0', '10', '15', '18', '20'].map(t => (<button key={t} onClick={() => setTipPct(t)} className={`flex-1 py-2 rounded-lg text-sm ${tipPct === t ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-gray-400'}`}>{t}%</button>))}
          </div>
        </div>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-3"><span className="text-sm font-semibold">People ({people.length})</span><button onClick={addPerson} className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"><Plus className="w-3 h-3" />Add</button></div>
        <div className="space-y-2">
          {people.map((p, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input value={p.name} onChange={e => { const u = [...people]; u[i].name = e.target.value; setPeople(u); }} placeholder="Name" className="flex-1 bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm" />
              <div className="relative"><span className="absolute left-2 top-2 text-gray-500 text-sm">$</span><input type="number" value={p.paid || ''} onChange={e => { const u = [...people]; u[i].paid = parseFloat(e.target.value) || 0; setPeople(u); }} placeholder="Paid" className="w-28 bg-zinc-800 text-white p-2 pl-6 rounded border border-zinc-700 text-sm" /></div>
              <button onClick={() => removePerson(i)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">Split Bill</button>
      {result && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center"><div className="text-xs text-gray-400">Total (with tip)</div><div className="text-2xl font-bold text-green-400">${result.total.toFixed(2)}</div></div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center"><div className="text-xs text-gray-400">Per Person</div><div className="text-2xl font-bold text-blue-400">${result.perPerson.toFixed(2)}</div></div>
          </div>
          {result.settlements.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <div className="text-sm font-semibold mb-3">Settlements</div>
              <div className="space-y-2">
                {result.settlements.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 bg-zinc-800 rounded-lg p-3">
                    <span className="text-red-400 font-medium text-sm">{s.from}</span>
                    <span className="text-gray-500">→</span>
                    <span className="text-green-400 font-medium text-sm">{s.to}</span>
                    <span className="ml-auto font-mono font-bold">${s.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {result.settlements.length === 0 && <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-center text-green-300 text-sm flex items-center justify-center gap-2"><Check className="w-4 h-4" />Enter amounts paid to see who owes whom</div>}
        </div>
      )}
    </div>
  );
}

export default memo(ExpenseSplitterComponent);
