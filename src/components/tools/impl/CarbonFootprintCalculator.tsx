'use client';
import { useState, useCallback, memo } from 'react';
import { Leaf, Calculator, RotateCcw, AlertCircle } from 'lucide-react';

interface CarbonCategory {
  name: string;
  icon: string;
  unit: string;
  factor: number; // kg CO2 per unit
  description: string;
}

const CARBON_CATEGORIES: CarbonCategory[] = [
  { name: 'electricity', icon: '⚡', unit: 'kWh/month', factor: 0.42, description: 'Based on US average grid' },
  { name: 'naturalGas', icon: '🔥', unit: 'therms/month', factor: 5.3, description: 'For heating/cooking' },
  { name: 'carMiles', icon: '🚗', unit: 'miles/month', factor: 0.404, description: 'Average gasoline car' },
  { name: 'shortFlights', icon: '✈️', unit: 'flights/year', factor: 255, description: 'Under 3 hours' },
  { name: 'longFlights', icon: '🛫', unit: 'flights/year', factor: 1100, description: 'Over 3 hours' },
  { name: 'beefMeals', icon: '🥩', unit: 'meals/week', factor: 7.2 * 52, description: 'Per beef meal yearly' },
  { name: 'dairyServings', icon: '🥛', unit: 'servings/day', factor: 0.8 * 365, description: 'Per daily serving yearly' },
];

const CarbonFootprintCalculatorComponent = function CarbonFootprintCalculator() {
  const [inputs, setInputs] = useState<Record<string, number>>({
    electricity: 900,
    naturalGas: 50,
    carMiles: 1000,
    shortFlights: 4,
    longFlights: 1,
    beefMeals: 3,
    dairyServings: 2,
  });
  const [showBreakdown, setShowBreakdown] = useState(true);

  const updateInput = useCallback((name: string, value: string) => {
    const num = parseFloat(value) || 0;
    setInputs(prev => ({ ...prev, [name]: num }));
  }, []);

  const calculateFootprint = useCallback(() => {
    const results: Record<string, number> = {};
    let total = 0;

    CARBON_CATEGORIES.forEach(cat => {
      const value = inputs[cat.name] || 0;
      let annualCO2: number;

      // Convert to annual kg CO2
      switch (cat.name) {
        case 'electricity':
        case 'naturalGas':
        case 'carMiles':
          annualCO2 = value * cat.factor * 12; // Monthly to yearly
          break;
        case 'beefMeals':
          annualCO2 = value * 7.2 * 52; // Weekly meals to yearly
          break;
        case 'dairyServings':
          annualCO2 = value * 0.8 * 365; // Daily to yearly
          break;
        default:
          annualCO2 = value * cat.factor; // Already yearly
      }

      results[cat.name] = annualCO2 / 1000; // Convert to tonnes
      total += annualCO2;
    });

    return { results, total: total / 1000 };
  }, [inputs]);

  const { results, total } = calculateFootprint();

  const getComparisonText = (tonnes: number) => {
    const usAvg = 16;
    const worldAvg = 4;
    const target = 2;

    if (tonnes < target) return { text: 'Excellent! Below Paris Agreement target', color: 'text-green-400' };
    if (tonnes < worldAvg) return { text: 'Good! Below world average', color: 'text-green-400' };
    if (tonnes < usAvg) return { text: 'Below US average', color: 'text-yellow-400' };
    return { text: 'Above US average', color: 'text-red-400' };
  };

  const comparison = getComparisonText(total);

  const reset = () => {
    setInputs({
      electricity: 0,
      naturalGas: 0,
      carMiles: 0,
      shortFlights: 0,
      longFlights: 0,
      beefMeals: 0,
      dairyServings: 0,
    });
  };

  const largestContributors = Object.entries(results)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-sm text-green-200">
        <Leaf className="w-4 h-4 inline mr-2" />
        <strong>Carbon Footprint Calculator:</strong> Estimate your annual carbon footprint based on lifestyle choices. Results in tonnes of CO₂.
      </div>

      {/* Input Categories */}
      <div className="grid md:grid-cols-2 gap-4">
        {CARBON_CATEGORIES.map(cat => (
          <div key={cat.name} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{cat.icon}</span>
                <span className="text-sm text-zinc-300 capitalize">
                  {cat.name.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
              <span className="text-xs text-zinc-500">{cat.unit}</span>
            </div>
            <input
              type="number"
              value={inputs[cat.name] || ''}
              onChange={(e) => updateInput(cat.name, e.target.value)}
              min={0}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-right"
              placeholder="0"
            />
            <div className="text-xs text-zinc-500 mt-1">{cat.description}</div>
          </div>
        ))}
      </div>

      {/* Total Result */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-center">
        <div className="text-sm text-zinc-400 mb-2">Your Estimated Annual Carbon Footprint</div>
        <div className="text-5xl font-bold text-white mb-2">
          {total.toFixed(1)}
          <span className="text-xl text-zinc-400 ml-2">tonnes CO₂</span>
        </div>
        <div className={`text-sm ${comparison.color}`}>{comparison.text}</div>
        <div className="mt-4 flex justify-center gap-8 text-sm text-zinc-500">
          <div>
            <div className="text-zinc-400">World Avg</div>
            <div className="text-lg font-semibold text-white">4.0t</div>
          </div>
          <div>
            <div className="text-zinc-400">US Avg</div>
            <div className="text-lg font-semibold text-white">16.0t</div>
          </div>
          <div>
            <div className="text-zinc-400">Target</div>
            <div className="text-lg font-semibold text-green-400">2.0t</div>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      {showBreakdown && total > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-zinc-300 mb-3">Breakdown by Category</h4>
          <div className="space-y-2">
            {Object.entries(results)
              .filter(([_, v]) => v > 0)
              .sort((a, b) => b[1] - a[1])
              .map(([name, value]) => {
                const percentage = (value / total) * 100;
                const cat = CARBON_CATEGORIES.find(c => c.name === name)!;
                return (
                  <div key={name}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-zinc-300">
                        {cat.icon} {name.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-zinc-400">{value.toFixed(2)}t ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Reduction Tips */}
      {largestContributors.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-zinc-300 mb-2">💡 Biggest Impact Areas</h4>
          <div className="text-sm text-zinc-400 space-y-1">
            {largestContributors.map(([name]) => {
              let tip = '';
              switch (name) {
                case 'carMiles':
                  tip = 'Consider carpooling, public transit, or an electric vehicle';
                  break;
                case 'longFlights':
                case 'shortFlights':
                  tip = 'Reduce air travel or consider carbon offsets';
                  break;
                case 'electricity':
                  tip = 'Switch to renewable energy or improve efficiency';
                  break;
                case 'beefMeals':
                  tip = 'Try plant-based meals a few days per week';
                  break;
                default:
                  tip = 'Small changes add up over time';
              }
              return <div key={name}>• {tip}</div>;
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="flex-1 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg"
        >
          {showBreakdown ? 'Hide' : 'Show'} Breakdown
        </button>
        <button
          onClick={reset}
          className="py-2 px-4 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Disclaimer */}
      <div className="text-xs text-zinc-500 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        Estimates based on average emission factors. Actual footprint may vary based on location, energy sources, and specific behaviors.
      </div>
    </div>
  );
};

export default memo(CarbonFootprintCalculatorComponent);
