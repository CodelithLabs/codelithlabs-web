'use client';
import { useState, useCallback, memo } from 'react';
import { Zap, Calculator, HelpCircle } from 'lucide-react';

interface Appliance {
  name: string;
  watts: number;
  hoursPerDay: number;
  quantity: number;
}

const COMMON_APPLIANCES = [
  { name: 'LED Bulb', watts: 10 },
  { name: 'Incandescent Bulb', watts: 60 },
  { name: 'Ceiling Fan', watts: 75 },
  { name: 'Air Conditioner (Window)', watts: 1500 },
  { name: 'Air Conditioner (Split)', watts: 2500 },
  { name: 'Refrigerator', watts: 150 },
  { name: 'Washing Machine', watts: 500 },
  { name: 'Microwave', watts: 1000 },
  { name: 'TV (LED 40")', watts: 50 },
  { name: 'Desktop Computer', watts: 200 },
  { name: 'Laptop', watts: 50 },
  { name: 'Water Heater (Electric)', watts: 3000 },
  { name: 'Iron', watts: 1000 },
  { name: 'Hair Dryer', watts: 1500 },
  { name: 'Router/Modem', watts: 10 },
];

const ElectricityBillCalculatorComponent = function ElectricityBillCalculator() {
  const [appliances, setAppliances] = useState<Appliance[]>([
    { name: 'Refrigerator', watts: 150, hoursPerDay: 24, quantity: 1 },
    { name: 'LED Bulb', watts: 10, hoursPerDay: 6, quantity: 8 },
    { name: 'Ceiling Fan', watts: 75, hoursPerDay: 10, quantity: 3 },
    { name: 'TV (LED 40")', watts: 50, hoursPerDay: 4, quantity: 1 },
  ]);
  const [ratePerKwh, setRatePerKwh] = useState(0.12); // USD default
  const [currency, setCurrency] = useState('$');
  const [billingDays, setBillingDays] = useState(30);

  const addAppliance = useCallback((preset?: typeof COMMON_APPLIANCES[0]) => {
    setAppliances(prev => [...prev, {
      name: preset?.name || 'Custom Appliance',
      watts: preset?.watts || 100,
      hoursPerDay: 1,
      quantity: 1,
    }]);
  }, []);

  const removeAppliance = useCallback((idx: number) => {
    setAppliances(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const updateAppliance = useCallback((idx: number, field: keyof Appliance, value: string | number) => {
    setAppliances(prev => prev.map((a, i) => 
      i === idx ? { ...a, [field]: typeof value === 'string' ? value : Number(value) } : a
    ));
  }, []);

  const calculateBill = useCallback(() => {
    let totalDailyKwh = 0;

    appliances.forEach(appliance => {
      const dailyKwh = (appliance.watts * appliance.hoursPerDay * appliance.quantity) / 1000;
      totalDailyKwh += dailyKwh;
    });

    const monthlyKwh = totalDailyKwh * billingDays;
    const monthlyCost = monthlyKwh * ratePerKwh;

    return {
      dailyKwh: totalDailyKwh,
      monthlyKwh,
      monthlyCost,
      yearlyKwh: monthlyKwh * 12,
      yearlyCost: monthlyCost * 12,
    };
  }, [appliances, ratePerKwh, billingDays]);

  const results = calculateBill();

  const formatMoney = (amount: number) => `${currency}${amount.toFixed(2)}`;

  const getApplianceBreakdown = () => {
    return appliances.map(a => ({
      ...a,
      dailyKwh: (a.watts * a.hoursPerDay * a.quantity) / 1000,
      monthlyCost: ((a.watts * a.hoursPerDay * a.quantity) / 1000) * billingDays * ratePerKwh,
    })).sort((a, b) => b.monthlyCost - a.monthlyCost);
  };

  const breakdown = getApplianceBreakdown();

  return (
    <div className="space-y-4">
      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 text-sm text-yellow-200">
        <Zap className="w-4 h-4 inline mr-2" />
        <strong>Electricity Bill Calculator:</strong> Estimate your electricity consumption and costs based on your appliances and usage patterns.
      </div>

      {/* Settings */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Rate per kWh</label>
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
                value={ratePerKwh}
                onChange={(e) => setRatePerKwh(parseFloat(e.target.value) || 0)}
                step="0.01"
                min="0"
                className="flex-1 bg-zinc-800 text-white p-2 rounded-r border border-zinc-700"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Billing Period</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={billingDays}
                onChange={(e) => setBillingDays(parseInt(e.target.value) || 30)}
                min="1"
                max="90"
                className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
              />
              <span className="text-zinc-400 text-sm">days</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Quick Add</label>
            <select
              onChange={(e) => {
                const preset = COMMON_APPLIANCES.find(a => a.name === e.target.value);
                if (preset) addAppliance(preset);
                e.target.value = '';
              }}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
              value=""
            >
              <option value="">Add appliance...</option>
              {COMMON_APPLIANCES.map(a => (
                <option key={a.name} value={a.name}>{a.name} ({a.watts}W)</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Appliances List */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 gap-2 p-3 bg-zinc-800 text-xs text-zinc-400 font-medium">
          <div className="col-span-4">Appliance</div>
          <div className="col-span-2 text-center">Watts</div>
          <div className="col-span-2 text-center">Hours/Day</div>
          <div className="col-span-2 text-center">Qty</div>
          <div className="col-span-2 text-right">Cost/Month</div>
        </div>
        <div className="divide-y divide-zinc-800">
          {appliances.map((appliance, idx) => {
            const monthlyCost = ((appliance.watts * appliance.hoursPerDay * appliance.quantity) / 1000) * billingDays * ratePerKwh;
            return (
              <div key={idx} className="grid grid-cols-12 gap-2 p-3 items-center">
                <div className="col-span-4 flex items-center gap-2">
                  <button
                    onClick={() => removeAppliance(idx)}
                    className="text-zinc-500 hover:text-red-400 text-sm"
                  >
                    ×
                  </button>
                  <input
                    type="text"
                    value={appliance.name}
                    onChange={(e) => updateAppliance(idx, 'name', e.target.value)}
                    className="bg-transparent text-white text-sm w-full"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    value={appliance.watts}
                    onChange={(e) => updateAppliance(idx, 'watts', parseInt(e.target.value) || 0)}
                    min={0}
                    className="w-full bg-zinc-800 text-white p-1.5 rounded border border-zinc-700 text-sm text-center"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    value={appliance.hoursPerDay}
                    onChange={(e) => updateAppliance(idx, 'hoursPerDay', parseFloat(e.target.value) || 0)}
                    min={0}
                    max={24}
                    step={0.5}
                    className="w-full bg-zinc-800 text-white p-1.5 rounded border border-zinc-700 text-sm text-center"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    value={appliance.quantity}
                    onChange={(e) => updateAppliance(idx, 'quantity', parseInt(e.target.value) || 1)}
                    min={1}
                    className="w-full bg-zinc-800 text-white p-1.5 rounded border border-zinc-700 text-sm text-center"
                  />
                </div>
                <div className="col-span-2 text-right text-sm text-zinc-300">
                  {formatMoney(monthlyCost)}
                </div>
              </div>
            );
          })}
        </div>
        <button
          onClick={() => addAppliance()}
          className="w-full py-2 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800 text-sm"
        >
          + Add Custom Appliance
        </button>
      </div>

      {/* Results */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xs text-zinc-500 mb-1">Daily Usage</div>
            <div className="text-xl font-bold text-white">{results.dailyKwh.toFixed(2)} kWh</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500 mb-1">Monthly Usage</div>
            <div className="text-xl font-bold text-white">{results.monthlyKwh.toFixed(0)} kWh</div>
          </div>
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-2">
            <div className="text-xs text-blue-400 mb-1">Monthly Bill</div>
            <div className="text-2xl font-bold text-white">{formatMoney(results.monthlyCost)}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500 mb-1">Yearly Estimate</div>
            <div className="text-xl font-bold text-white">{formatMoney(results.yearlyCost)}</div>
          </div>
        </div>
      </div>

      {/* Top Consumers */}
      {breakdown.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-zinc-300 mb-3">Top Energy Consumers</h4>
          <div className="space-y-2">
            {breakdown.slice(0, 5).map((item, idx) => {
              const percentage = results.monthlyCost > 0 ? (item.monthlyCost / results.monthlyCost) * 100 : 0;
              return (
                <div key={idx}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-zinc-300">{item.name}</span>
                    <span className="text-zinc-400">{formatMoney(item.monthlyCost)} ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-400">
        <strong className="text-zinc-300">💡 Energy Saving Tips:</strong>
        <ul className="mt-1 space-y-1">
          <li>• Switch to LED bulbs (use 75% less energy than incandescent)</li>
          <li>• Use ceiling fans instead of AC when possible</li>
          <li>• Unplug devices when not in use (standby power adds up)</li>
          <li>• Set AC thermostat 1-2 degrees higher to save 5-10%</li>
        </ul>
      </div>
    </div>
  );
};

export default memo(ElectricityBillCalculatorComponent);
