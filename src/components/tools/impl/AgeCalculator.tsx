'use client';
import { useState } from 'react';

export default function AgeCalculator() {
  const [dob, setDob] = useState('');
  const [age, setAge] = useState<{y:number, m:number, d:number}|null>(null);

  const calculate = () => {
    const d1 = new Date(dob);
    const d2 = new Date();
    const diff = d2.getTime() - d1.getTime();
    const ageDate = new Date(diff); 
    setAge({ y: Math.abs(ageDate.getUTCFullYear() - 1970), m: ageDate.getUTCMonth(), d: ageDate.getUTCDate() - 1 });
  };

  return (
    <div className="bg-zinc-800 p-6 rounded-xl max-w-md mx-auto space-y-4">
      <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full p-3 bg-zinc-900 text-white rounded" />
      <button onClick={calculate} className="w-full py-2 bg-blue-600 text-white rounded">Calculate Age</button>
      {age && (
        <div className="text-center text-green-400 text-xl font-bold">
          {age.y} Years, {age.m} Months, {age.d} Days
        </div>
      )}
    </div>
  );
}
