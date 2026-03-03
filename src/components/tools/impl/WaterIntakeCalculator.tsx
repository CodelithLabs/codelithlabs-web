'use client';
import { useState, useCallback, memo } from 'react';
import { Droplets, Calculator, Activity, AlertCircle } from 'lucide-react';

const WaterIntakeCalculatorComponent = function WaterIntakeCalculator() {
  const [weight, setWeight] = useState(150);
  const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('lbs');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'moderate' | 'active' | 'athlete'>('moderate');
  const [climate, setClimate] = useState<'temperate' | 'hot' | 'humid'>('temperate');
  const [pregnant, setPregnant] = useState(false);
  const [breastfeeding, setBreastfeeding] = useState(false);
  const [caffeineIntake, setCaffeineIntake] = useState(2); // cups per day
  const [exerciseMinutes, setExerciseMinutes] = useState(30);

  const calculate = useCallback(() => {
    // Convert to kg if needed
    const weightKg = weightUnit === 'kg' ? weight : weight * 0.453592;
    
    // Base calculation: 30-35ml per kg of body weight
    let baseWaterMl = weightKg * 33;

    // Activity level adjustments
    const activityMultipliers = {
      sedentary: 1.0,
      moderate: 1.15,
      active: 1.3,
      athlete: 1.5,
    };
    baseWaterMl *= activityMultipliers[activityLevel];

    // Climate adjustments
    if (climate === 'hot') baseWaterMl *= 1.2;
    if (climate === 'humid') baseWaterMl *= 1.15;

    // Exercise: add 350ml per 30 minutes
    baseWaterMl += (exerciseMinutes / 30) * 350;

    // Caffeine: add 200ml per cup (since caffeine is a diuretic)
    baseWaterMl += caffeineIntake * 200;

    // Pregnancy/breastfeeding
    if (pregnant) baseWaterMl += 300;
    if (breastfeeding) baseWaterMl += 700;

    // Convert to different units
    const waterLiters = baseWaterMl / 1000;
    const waterOz = baseWaterMl * 0.033814;
    const waterCups = waterOz / 8;
    const waterBottles = waterLiters / 0.5; // 500ml bottles

    return {
      ml: Math.round(baseWaterMl),
      liters: waterLiters.toFixed(1),
      oz: Math.round(waterOz),
      cups: waterCups.toFixed(1),
      bottles: Math.ceil(waterBottles),
    };
  }, [weight, weightUnit, activityLevel, climate, pregnant, breastfeeding, caffeineIntake, exerciseMinutes]);

  const results = calculate();

  const getHydrationSchedule = () => {
    const perHour = results.ml / 16; // Assume 16 waking hours
    const schedule = [
      { time: 'Wake up', amount: '1 glass', note: 'Rehydrate after sleep' },
      { time: 'Before breakfast', amount: '1 glass', note: 'Aids digestion' },
      { time: 'Mid-morning', amount: '1-2 glasses', note: 'Stay focused' },
      { time: 'Before lunch', amount: '1 glass', note: '30 min before eating' },
      { time: 'Afternoon', amount: '2 glasses', note: 'Combat energy dip' },
      { time: 'Before exercise', amount: '1 glass', note: 'Pre-workout prep' },
      { time: 'During/after exercise', amount: '1-2 glasses', note: 'Replace lost fluids' },
      { time: 'Evening', amount: '1 glass', note: 'Reduce before bed' },
    ];
    return schedule;
  };

  const schedule = getHydrationSchedule();

  return (
    <div className="space-y-4">
      <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4 text-sm text-cyan-200">
        <Droplets className="w-4 h-4 inline mr-2" />
        <strong>Water Intake Calculator:</strong> Calculate your daily water needs based on weight, activity, climate, and other factors.
      </div>

      {/* Main Inputs */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-4">
        <h4 className="text-sm font-medium text-zinc-300">Your Profile</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Body Weight</label>
            <div className="flex">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                min={0}
                className="flex-1 bg-zinc-800 text-white p-2 rounded-l border border-zinc-700"
              />
              <select
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value as 'lbs' | 'kg')}
                className="bg-zinc-800 text-white p-2 rounded-r border border-zinc-700 border-l-0"
              >
                <option value="lbs">lbs</option>
                <option value="kg">kg</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Activity Level</label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value as typeof activityLevel)}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            >
              <option value="sedentary">Sedentary (desk job, little exercise)</option>
              <option value="moderate">Moderate (light exercise 2-3x/week)</option>
              <option value="active">Active (exercise 4-5x/week)</option>
              <option value="athlete">Athlete (intense daily training)</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Climate</label>
            <select
              value={climate}
              onChange={(e) => setClimate(e.target.value as typeof climate)}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            >
              <option value="temperate">Temperate / Indoor AC</option>
              <option value="hot">Hot Climate</option>
              <option value="humid">Hot & Humid</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Daily Exercise (minutes)</label>
            <input
              type="number"
              value={exerciseMinutes}
              onChange={(e) => setExerciseMinutes(parseInt(e.target.value) || 0)}
              min={0}
              max={300}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Caffeinated Drinks/Day</label>
            <input
              type="number"
              value={caffeineIntake}
              onChange={(e) => setCaffeineIntake(parseInt(e.target.value) || 0)}
              min={0}
              max={10}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div className="flex items-end gap-4">
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={pregnant}
                onChange={(e) => setPregnant(e.target.checked)}
                className="rounded"
              />
              Pregnant
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={breastfeeding}
                onChange={(e) => setBreastfeeding(e.target.checked)}
                className="rounded"
              />
              Breastfeeding
            </label>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <div className="text-center mb-4">
          <div className="text-sm text-zinc-400 mb-1">Your Daily Water Intake</div>
          <div className="text-5xl font-bold text-cyan-400">{results.liters}L</div>
          <div className="text-lg text-zinc-400 mt-1">{results.oz} oz | {results.cups} cups</div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-zinc-800 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">{results.bottles}</div>
            <div className="text-xs text-zinc-500">500ml bottles</div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">{results.cups}</div>
            <div className="text-xs text-zinc-500">8 oz glasses</div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">{results.ml}</div>
            <div className="text-xs text-zinc-500">milliliters</div>
          </div>
        </div>
      </div>

      {/* Hydration Schedule */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-zinc-300 mb-3">Suggested Hydration Schedule</h4>
        <div className="space-y-2">
          {schedule.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <span className="text-zinc-300">{item.time}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-zinc-500 text-xs">{item.note}</span>
                <span className="text-cyan-400 font-medium">{item.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Signs of Dehydration */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-orange-400" />
          Signs You Need More Water
        </h4>
        <div className="grid md:grid-cols-2 gap-2 text-xs text-zinc-400">
          <div>• Dark yellow urine</div>
          <div>• Headaches or fatigue</div>
          <div>• Dry mouth or skin</div>
          <div>• Feeling dizzy</div>
          <div>• Decreased concentration</div>
          <div>• Muscle cramps</div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-400">
        <strong className="text-zinc-300">💧 Hydration Tips:</strong>
        <ul className="mt-1 space-y-1">
          <li>• Drink water before you feel thirsty</li>
          <li>• Keep a water bottle visible at your desk</li>
          <li>• Fruits and vegetables count toward intake</li>
          <li>• Clear or light yellow urine = good hydration</li>
        </ul>
      </div>
    </div>
  );
};

export default memo(WaterIntakeCalculatorComponent);
