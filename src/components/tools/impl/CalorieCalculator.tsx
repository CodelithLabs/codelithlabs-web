'use client';
import { useState } from 'react';

export default function CalorieCalculator() {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activity, setActivity] = useState('1.2');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [result, setResult] = useState<{ bmr: number; tdee: number } | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    const activityLevel = parseFloat(activity);

    if (!w || !h || !a) {
      alert('Please fill all fields');
      return;
    }

    // Convert imperial to metric
    const weightKg = unit === 'imperial' ? w * 0.453592 : w;
    const heightCm = unit === 'imperial' ? h * 2.54 : h;

    // Mifflin-St Jeor Equation
    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * a + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * a - 161;
    }

    const tdee = bmr * activityLevel;
    setResult({ bmr: Math.round(bmr), tdee: Math.round(tdee) });
  };

  return (
    <div className="space-y-6">
      {/* Unit Toggle */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setUnit('metric')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            unit === 'metric' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'
          }`}
        >
          Metric (kg/cm)
        </button>
        <button
          onClick={() => setUnit('imperial')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            unit === 'imperial' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'
          }`}
        >
          Imperial (lb/in)
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Age (years)</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="25"
            className="w-full px-4 py-3 bg-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as 'male' | 'female')}
            className="w-full px-4 py-3 bg-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Weight ({unit === 'metric' ? 'kg' : 'lb'})
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={unit === 'metric' ? '70' : '154'}
            className="w-full px-4 py-3 bg-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Height */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Height ({unit === 'metric' ? 'cm' : 'inches'})
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder={unit === 'metric' ? '175' : '69'}
            className="w-full px-4 py-3 bg-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Activity Level */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-zinc-300 mb-2">Activity Level</label>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="1.2">Sedentary (little/no exercise)</option>
            <option value="1.375">Lightly Active (1-3 days/week)</option>
            <option value="1.55">Moderately Active (3-5 days/week)</option>
            <option value="1.725">Very Active (6-7 days/week)</option>
            <option value="1.9">Extremely Active (athlete/physical job)</option>
          </select>
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
      >
        Calculate Calories
      </button>

      {result && (
        <div className="bg-zinc-800 rounded-xl p-6 space-y-4">
          <div>
            <p className="text-zinc-400 text-sm mb-1">Basal Metabolic Rate (BMR)</p>
            <p className="text-3xl font-bold text-white">{result.bmr} cal/day</p>
            <p className="text-xs text-zinc-500 mt-1">Calories needed at rest</p>
          </div>
          <div className="border-t border-zinc-700 pt-4">
            <p className="text-zinc-400 text-sm mb-1">Total Daily Energy Expenditure (TDEE)</p>
            <p className="text-3xl font-bold text-green-400">{result.tdee} cal/day</p>
            <p className="text-xs text-zinc-500 mt-1">Calories needed with activity</p>
          </div>
          <div className="border-t border-zinc-700 pt-4 grid grid-cols-3 gap-2 text-center text-sm">
            <div>
              <p className="text-zinc-400">Weight Loss</p>
              <p className="font-semibold text-orange-400">{result.tdee - 500}</p>
            </div>
            <div>
              <p className="text-zinc-400">Maintain</p>
              <p className="font-semibold text-blue-400">{result.tdee}</p>
            </div>
            <div>
              <p className="text-zinc-400">Weight Gain</p>
              <p className="font-semibold text-green-400">{result.tdee + 500}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
