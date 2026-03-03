'use client';
import { useState, useCallback, memo } from 'react';
import { Fuel, Calculator, MapPin, ArrowRight } from 'lucide-react';

const FuelCostCalculatorComponent = function FuelCostCalculator() {
  const [distance, setDistance] = useState(500);
  const [distanceUnit, setDistanceUnit] = useState<'miles' | 'km'>('miles');
  const [fuelEfficiency, setFuelEfficiency] = useState(30);
  const [efficiencyUnit, setEfficiencyUnit] = useState<'mpg' | 'kmpl' | 'l100km'>('mpg');
  const [fuelPrice, setFuelPrice] = useState(3.50);
  const [priceUnit, setPriceUnit] = useState<'gallon' | 'liter'>('gallon');
  const [currency, setCurrency] = useState('$');
  const [passengers, setPassengers] = useState(1);
  const [roundTrip, setRoundTrip] = useState(false);

  const calculate = useCallback(() => {
    // Convert everything to gallons and miles for calculation
    let distanceMiles = distance;
    if (distanceUnit === 'km') {
      distanceMiles = distance * 0.621371;
    }
    if (roundTrip) {
      distanceMiles *= 2;
    }

    // Convert fuel efficiency to MPG
    let mpg = fuelEfficiency;
    if (efficiencyUnit === 'kmpl') {
      mpg = fuelEfficiency * 2.35215;
    } else if (efficiencyUnit === 'l100km') {
      mpg = 235.215 / fuelEfficiency;
    }

    // Convert fuel price to per gallon
    let pricePerGallon = fuelPrice;
    if (priceUnit === 'liter') {
      pricePerGallon = fuelPrice * 3.78541;
    }

    // Calculate
    const gallonsNeeded = distanceMiles / mpg;
    const totalCost = gallonsNeeded * pricePerGallon;
    const costPerPerson = totalCost / passengers;
    const costPerMile = totalCost / distanceMiles;

    // CO2 estimation (average ~8.89 kg per gallon of gasoline)
    const co2Kg = gallonsNeeded * 8.89;

    return {
      distanceMiles,
      gallonsNeeded,
      totalCost,
      costPerPerson,
      costPerMile,
      co2Kg,
      litersNeeded: gallonsNeeded * 3.78541,
    };
  }, [distance, distanceUnit, fuelEfficiency, efficiencyUnit, fuelPrice, priceUnit, passengers, roundTrip]);

  const results = calculate();

  const formatMoney = (amount: number) => `${currency}${amount.toFixed(2)}`;

  const presetTrips = [
    { name: 'NYC to DC', distance: 225, unit: 'miles' as const },
    { name: 'LA to Vegas', distance: 270, unit: 'miles' as const },
    { name: 'London to Paris', distance: 456, unit: 'km' as const },
    { name: 'Daily Commute (20mi)', distance: 20, unit: 'miles' as const },
  ];

  const vehiclePresets = [
    { name: 'Economy Car', mpg: 35 },
    { name: 'Sedan', mpg: 28 },
    { name: 'SUV', mpg: 22 },
    { name: 'Truck', mpg: 18 },
    { name: 'Hybrid', mpg: 50 },
    { name: 'EV Equivalent', mpg: 100 },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4 text-sm text-orange-200">
        <Fuel className="w-4 h-4 inline mr-2" />
        <strong>Fuel Cost Calculator:</strong> Calculate the cost of fuel for any trip. Supports miles/km, MPG/L per 100km, and cost splitting.
      </div>

      {/* Quick Trip Presets */}
      <div className="flex flex-wrap gap-2">
        {presetTrips.map(trip => (
          <button
            key={trip.name}
            onClick={() => {
              setDistance(trip.distance);
              setDistanceUnit(trip.unit);
            }}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg"
          >
            {trip.name}
          </button>
        ))}
      </div>

      {/* Trip Details */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-4">
        <h4 className="text-sm font-medium text-zinc-300">Trip Details</h4>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Distance</label>
            <div className="flex">
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(parseFloat(e.target.value) || 0)}
                min={0}
                className="flex-1 bg-zinc-800 text-white p-2 rounded-l border border-zinc-700"
              />
              <select
                value={distanceUnit}
                onChange={(e) => setDistanceUnit(e.target.value as 'miles' | 'km')}
                className="bg-zinc-800 text-white p-2 rounded-r border border-zinc-700 border-l-0"
              >
                <option value="miles">miles</option>
                <option value="km">km</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Passengers</label>
            <input
              type="number"
              value={passengers}
              onChange={(e) => setPassengers(Math.max(1, parseInt(e.target.value) || 1))}
              min={1}
              max={20}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={roundTrip}
                onChange={(e) => setRoundTrip(e.target.checked)}
                className="rounded"
              />
              Round Trip
            </label>
          </div>
        </div>
      </div>

      {/* Vehicle & Fuel */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-zinc-300">Vehicle & Fuel</h4>
          <div className="flex gap-1">
            {vehiclePresets.slice(0, 4).map(preset => (
              <button
                key={preset.name}
                onClick={() => {
                  setFuelEfficiency(preset.mpg);
                  setEfficiencyUnit('mpg');
                }}
                className={`px-2 py-1 text-xs rounded ${
                  fuelEfficiency === preset.mpg && efficiencyUnit === 'mpg'
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Fuel Efficiency</label>
            <div className="flex">
              <input
                type="number"
                value={fuelEfficiency}
                onChange={(e) => setFuelEfficiency(parseFloat(e.target.value) || 0)}
                min={0}
                step={0.1}
                className="flex-1 bg-zinc-800 text-white p-2 rounded-l border border-zinc-700"
              />
              <select
                value={efficiencyUnit}
                onChange={(e) => setEfficiencyUnit(e.target.value as typeof efficiencyUnit)}
                className="bg-zinc-800 text-white p-2 rounded-r border border-zinc-700 border-l-0"
              >
                <option value="mpg">MPG</option>
                <option value="kmpl">km/L</option>
                <option value="l100km">L/100km</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Fuel Price</label>
            <div className="flex">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-zinc-800 text-white p-2 rounded-l border border-zinc-700"
              >
                <option value="$">$</option>
                <option value="€">€</option>
                <option value="£">£</option>
                <option value="₹">₹</option>
              </select>
              <input
                type="number"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(parseFloat(e.target.value) || 0)}
                min={0}
                step={0.01}
                className="flex-1 bg-zinc-800 text-white p-2 border border-zinc-700"
              />
              <select
                value={priceUnit}
                onChange={(e) => setPriceUnit(e.target.value as 'gallon' | 'liter')}
                className="bg-zinc-800 text-white p-2 rounded-r border border-zinc-700 border-l-0"
              >
                <option value="gallon">/gal</option>
                <option value="liter">/L</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-orange-900/30 border border-orange-500/30 rounded-lg p-4">
            <div className="text-xs text-orange-400 mb-1">Total Cost</div>
            <div className="text-2xl font-bold text-white">{formatMoney(results.totalCost)}</div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="text-xs text-zinc-500 mb-1">Per Person</div>
            <div className="text-xl font-bold text-white">{formatMoney(results.costPerPerson)}</div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="text-xs text-zinc-500 mb-1">Fuel Needed</div>
            <div className="text-xl font-bold text-white">
              {results.gallonsNeeded.toFixed(1)} <span className="text-sm text-zinc-400">gal</span>
            </div>
            <div className="text-xs text-zinc-500">{results.litersNeeded.toFixed(1)} L</div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="text-xs text-zinc-500 mb-1">Cost per Mile</div>
            <div className="text-xl font-bold text-white">{formatMoney(results.costPerMile)}</div>
          </div>
        </div>

        {/* Trip Summary */}
        <div className="mt-4 pt-4 border-t border-zinc-700 flex items-center justify-center gap-2 text-sm text-zinc-400">
          <MapPin className="w-4 h-4" />
          <span>{results.distanceMiles.toFixed(0)} miles</span>
          {roundTrip && (
            <>
              <ArrowRight className="w-4 h-4" />
              <span>Round Trip</span>
            </>
          )}
          <span className="mx-2">•</span>
          <span className="text-green-400">~{results.co2Kg.toFixed(0)} kg CO₂</span>
        </div>
      </div>

      {/* Comparison */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-zinc-300 mb-3">Compare Vehicle Types</h4>
        <div className="space-y-2">
          {vehiclePresets.map(preset => {
            const cost = (results.distanceMiles / preset.mpg) * (priceUnit === 'gallon' ? fuelPrice : fuelPrice * 3.78541);
            return (
              <div key={preset.name} className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">{preset.name} ({preset.mpg} MPG)</span>
                <span className="text-white">{formatMoney(cost)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default memo(FuelCostCalculatorComponent);
