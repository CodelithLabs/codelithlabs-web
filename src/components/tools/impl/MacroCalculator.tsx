'use client';

import { memo, useState, useCallback } from 'react';

type Gender = 'male' | 'female';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
type Goal = 'lose' | 'maintain' | 'gain';

function MacroCalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [goal, setGoal] = useState<Goal>('maintain');
  const [result, setResult] = useState<{
    calories: number;
    protein: { grams: number; calories: number; percentage: number };
    carbs: { grams: number; calories: number; percentage: number };
    fat: { grams: number; calories: number; percentage: number };
  } | null>(null);

  const activityMultipliers: { [key: string]: number } = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const handleCalculate = useCallback(() => {
    const w = parseFloat(weight) || 0;
    const h = parseFloat(height) || 0;
    const a = parseFloat(age) || 0;

    // Mifflin-St Jeor Equation for BMR
    let bmr: number;
    if (gender === 'male') {
      bmr = (10 * w) + (6.25 * h) - (5 * a) + 5;
    } else {
      bmr = (10 * w) + (6.25 * h) - (5 * a) - 161;
    }

    // Calculate TDEE
    let tdee = bmr * activityMultipliers[activity];

    // Adjust for goal
    let calories: number;
    switch (goal) {
      case 'lose':
        calories = tdee - 500; // 0.5 kg/week deficit
        break;
      case 'gain':
        calories = tdee + 300; // Lean bulk
        break;
      default:
        calories = tdee;
    }

    // Calculate macros based on goal
    let proteinRatio: number, carbRatio: number, fatRatio: number;
    
    switch (goal) {
      case 'lose':
        proteinRatio = 0.35;
        carbRatio = 0.35;
        fatRatio = 0.30;
        break;
      case 'gain':
        proteinRatio = 0.30;
        carbRatio = 0.45;
        fatRatio = 0.25;
        break;
      default:
        proteinRatio = 0.30;
        carbRatio = 0.40;
        fatRatio = 0.30;
    }

    const proteinCals = calories * proteinRatio;
    const carbCals = calories * carbRatio;
    const fatCals = calories * fatRatio;

    setResult({
      calories,
      protein: {
        grams: proteinCals / 4,
        calories: proteinCals,
        percentage: proteinRatio * 100,
      },
      carbs: {
        grams: carbCals / 4,
        calories: carbCals,
        percentage: carbRatio * 100,
      },
      fat: {
        grams: fatCals / 9,
        calories: fatCals,
        percentage: fatRatio * 100,
      },
    });
  }, [weight, height, age, gender, activity, goal]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Macronutrient Calculator</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g., 70"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g., 175"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g., 30"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Activity Level</label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value as ActivityLevel)}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sedentary">Sedentary (little exercise)</option>
                <option value="light">Light (1-3 days/week)</option>
                <option value="moderate">Moderate (3-5 days/week)</option>
                <option value="active">Active (6-7 days/week)</option>
                <option value="very_active">Very Active (2x/day)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Goal</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as Goal)}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="lose">Lose Weight</option>
                <option value="maintain">Maintain Weight</option>
                <option value="gain">Build Muscle</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Calculate Macros
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Daily Macros</h3>
          
          <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4 mb-4 text-center">
            <div className="text-sm text-zinc-400 mb-1">Daily Calories</div>
            <div className="text-3xl font-bold text-green-400">{Math.round(result.calories)} kcal</div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <div className="text-sm text-zinc-400 mb-1">Protein</div>
              <div className="text-2xl font-bold text-blue-400">{Math.round(result.protein.grams)}g</div>
              <div className="text-xs text-zinc-500">{Math.round(result.protein.percentage)}% • {Math.round(result.protein.calories)} kcal</div>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <div className="text-sm text-zinc-400 mb-1">Carbs</div>
              <div className="text-2xl font-bold text-yellow-400">{Math.round(result.carbs.grams)}g</div>
              <div className="text-xs text-zinc-500">{Math.round(result.carbs.percentage)}% • {Math.round(result.carbs.calories)} kcal</div>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <div className="text-sm text-zinc-400 mb-1">Fat</div>
              <div className="text-2xl font-bold text-purple-400">{Math.round(result.fat.grams)}g</div>
              <div className="text-xs text-zinc-500">{Math.round(result.fat.percentage)}% • {Math.round(result.fat.calories)} kcal</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(MacroCalculator);
