'use client';
import { useState, useCallback, memo } from 'react';
import { PaintBucket, Calculator, Plus, Trash2 } from 'lucide-react';

interface Room {
  name: string;
  length: number;
  width: number;
  height: number;
  doors: number;
  windows: number;
}

const PaintCalculatorComponent = function PaintCalculator() {
  const [rooms, setRooms] = useState<Room[]>([
    { name: 'Living Room', length: 15, width: 12, height: 9, doors: 2, windows: 2 },
  ]);
  const [unit, setUnit] = useState<'feet' | 'meters'>('feet');
  const [coats, setCoats] = useState(2);
  const [paintCoverage, setPaintCoverage] = useState(350); // sq ft per gallon
  const [pricePerGallon, setPricePerGallon] = useState(35);
  const [currency, setCurrency] = useState('$');

  // Standard deductions
  const DOOR_AREA = unit === 'feet' ? 21 : 1.95; // sq ft or sq m per door
  const WINDOW_AREA = unit === 'feet' ? 15 : 1.4; // sq ft or sq m per window

  const addRoom = useCallback(() => {
    setRooms(prev => [...prev, {
      name: `Room ${prev.length + 1}`,
      length: 10,
      width: 10,
      height: 8,
      doors: 1,
      windows: 1,
    }]);
  }, []);

  const removeRoom = useCallback((idx: number) => {
    setRooms(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const updateRoom = useCallback((idx: number, field: keyof Room, value: string | number) => {
    setRooms(prev => prev.map((r, i) => 
      i === idx ? { ...r, [field]: typeof value === 'string' ? value : Number(value) } : r
    ));
  }, []);

  const calculateRoom = (room: Room) => {
    // Calculate wall area (perimeter × height)
    const perimeter = 2 * (room.length + room.width);
    const wallArea = perimeter * room.height;
    
    // Subtract doors and windows
    const deductions = (room.doors * DOOR_AREA) + (room.windows * WINDOW_AREA);
    const paintableArea = Math.max(0, wallArea - deductions);
    
    return paintableArea;
  };

  const calculate = useCallback(() => {
    let totalArea = 0;
    const roomDetails = rooms.map(room => {
      const area = calculateRoom(room);
      totalArea += area;
      return { ...room, area };
    });

    // Account for coats
    const totalWithCoats = totalArea * coats;
    
    // Calculate gallons needed (convert if using meters)
    let coverageInUnit = paintCoverage;
    if (unit === 'meters') {
      coverageInUnit = paintCoverage * 0.0929; // sq m per gallon
    }
    
    const gallonsNeeded = totalWithCoats / coverageInUnit;
    const gallonsRounded = Math.ceil(gallonsNeeded);
    const totalCost = gallonsRounded * pricePerGallon;

    return {
      roomDetails,
      totalArea,
      totalWithCoats,
      gallonsNeeded,
      gallonsRounded,
      totalCost,
    };
  }, [rooms, coats, paintCoverage, unit, pricePerGallon]);

  const results = calculate();
  const unitLabel = unit === 'feet' ? 'sq ft' : 'sq m';
  const formatMoney = (amount: number) => `${currency}${amount.toFixed(2)}`;

  return (
    <div className="space-y-4">
      <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 text-sm text-purple-200">
        <PaintBucket className="w-4 h-4 inline mr-2" />
        <strong>Paint Calculator:</strong> Calculate how much paint you need based on room dimensions. Automatically deducts for doors and windows.
      </div>

      {/* Settings */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Unit</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as 'feet' | 'meters')}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            >
              <option value="feet">Feet</option>
              <option value="meters">Meters</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Coats</label>
            <select
              value={coats}
              onChange={(e) => setCoats(parseInt(e.target.value))}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            >
              <option value={1}>1 coat</option>
              <option value={2}>2 coats</option>
              <option value={3}>3 coats</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Coverage ({unitLabel}/gal)</label>
            <input
              type="number"
              value={paintCoverage}
              onChange={(e) => setPaintCoverage(parseInt(e.target.value) || 350)}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Price per Gallon</label>
            <div className="flex">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-zinc-800 text-white p-2 rounded-l border border-zinc-700"
              >
                <option value="$">$</option>
                <option value="€">€</option>
                <option value="£">£</option>
              </select>
              <input
                type="number"
                value={pricePerGallon}
                onChange={(e) => setPricePerGallon(parseFloat(e.target.value) || 0)}
                className="flex-1 bg-zinc-800 text-white p-2 rounded-r border border-zinc-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rooms */}
      <div className="space-y-3">
        {rooms.map((room, idx) => (
          <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <input
                type="text"
                value={room.name}
                onChange={(e) => updateRoom(idx, 'name', e.target.value)}
                className="bg-transparent text-white font-medium"
              />
              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-400">
                  {results.roomDetails[idx]?.area.toFixed(0)} {unitLabel}
                </span>
                <button
                  onClick={() => removeRoom(idx)}
                  disabled={rooms.length === 1}
                  className="text-zinc-500 hover:text-red-400 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-3">
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Length</label>
                <input
                  type="number"
                  value={room.length}
                  onChange={(e) => updateRoom(idx, 'length', parseFloat(e.target.value) || 0)}
                  min={0}
                  className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Width</label>
                <input
                  type="number"
                  value={room.width}
                  onChange={(e) => updateRoom(idx, 'width', parseFloat(e.target.value) || 0)}
                  min={0}
                  className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Height</label>
                <input
                  type="number"
                  value={room.height}
                  onChange={(e) => updateRoom(idx, 'height', parseFloat(e.target.value) || 0)}
                  min={0}
                  className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Doors</label>
                <input
                  type="number"
                  value={room.doors}
                  onChange={(e) => updateRoom(idx, 'doors', parseInt(e.target.value) || 0)}
                  min={0}
                  className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Windows</label>
                <input
                  type="number"
                  value={room.windows}
                  onChange={(e) => updateRoom(idx, 'windows', parseInt(e.target.value) || 0)}
                  min={0}
                  className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addRoom}
          className="w-full py-2 border border-dashed border-zinc-700 hover:border-zinc-600 rounded-lg text-zinc-400 hover:text-zinc-300 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Room
        </button>
      </div>

      {/* Results */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-zinc-800 rounded-lg p-3">
            <div className="text-xs text-zinc-500 mb-1">Total Wall Area</div>
            <div className="text-lg font-bold text-white">{results.totalArea.toFixed(0)} {unitLabel}</div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-3">
            <div className="text-xs text-zinc-500 mb-1">With {coats} Coat(s)</div>
            <div className="text-lg font-bold text-white">{results.totalWithCoats.toFixed(0)} {unitLabel}</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
            <div className="text-xs text-purple-400 mb-1">Paint Needed</div>
            <div className="text-xl font-bold text-white">{results.gallonsRounded} gallons</div>
            <div className="text-xs text-zinc-500">({results.gallonsNeeded.toFixed(1)} exact)</div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-3">
            <div className="text-xs text-zinc-500 mb-1">Estimated Cost</div>
            <div className="text-lg font-bold text-white">{formatMoney(results.totalCost)}</div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-400">
        <strong className="text-zinc-300">💡 Tips:</strong>
        <ul className="mt-1 space-y-1">
          <li>• Buy 10% extra for touch-ups and waste</li>
          <li>• Dark colors over light may need 3+ coats</li>
          <li>• Textured walls use 20-30% more paint</li>
          <li>• One gallon typically covers 350-400 sq ft per coat</li>
        </ul>
      </div>
    </div>
  );
};

export default memo(PaintCalculatorComponent);
