'use client';
import { useState, useCallback, memo } from 'react';
import { Grid3X3, Calculator, Plus, Trash2 } from 'lucide-react';

interface Area {
  name: string;
  length: number;
  width: number;
}

const TileCalculatorComponent = function TileCalculator() {
  const [areas, setAreas] = useState<Area[]>([
    { name: 'Bathroom Floor', length: 10, width: 8 },
  ]);
  const [unit, setUnit] = useState<'feet' | 'meters' | 'inches'>('feet');
  const [tileLength, setTileLength] = useState(12);
  const [tileWidth, setTileWidth] = useState(12);
  const [tileUnit, setTileUnit] = useState<'inches' | 'cm'>('inches');
  const [groutWidth, setGroutWidth] = useState(0.125); // 1/8 inch
  const [wastagePercent, setWastagePercent] = useState(10);
  const [pricePerTile, setPricePerTile] = useState(2.50);
  const [currency, setCurrency] = useState('$');

  const addArea = useCallback(() => {
    setAreas(prev => [...prev, {
      name: `Area ${prev.length + 1}`,
      length: 10,
      width: 10,
    }]);
  }, []);

  const removeArea = useCallback((idx: number) => {
    setAreas(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const updateArea = useCallback((idx: number, field: keyof Area, value: string | number) => {
    setAreas(prev => prev.map((a, i) => 
      i === idx ? { ...a, [field]: typeof value === 'string' ? value : Number(value) } : a
    ));
  }, []);

  const calculate = useCallback(() => {
    // Convert everything to inches for calculation
    const areaToInches = (val: number): number => {
      switch (unit) {
        case 'feet': return val * 12;
        case 'meters': return val * 39.37;
        default: return val;
      }
    };

    const tileToInches = (val: number): number => {
      return tileUnit === 'cm' ? val / 2.54 : val;
    };

    // Calculate total area in square inches
    let totalAreaInches = 0;
    const areaDetails = areas.map(area => {
      const lengthIn = areaToInches(area.length);
      const widthIn = areaToInches(area.width);
      const areaIn = lengthIn * widthIn;
      totalAreaInches += areaIn;
      return {
        ...area,
        sqFt: (areaIn / 144),
      };
    });

    // Calculate tile size including grout
    const tileLengthIn = tileToInches(tileLength) + groutWidth;
    const tileWidthIn = tileToInches(tileWidth) + groutWidth;
    const tileAreaIn = tileLengthIn * tileWidthIn;

    // Calculate tiles needed
    const tilesNeeded = totalAreaInches / tileAreaIn;
    const tilesWithWastage = tilesNeeded * (1 + wastagePercent / 100);
    const tilesRounded = Math.ceil(tilesWithWastage);

    // Calculate per box (typically 10-20 tiles per box)
    const tilesPerBox = 10;
    const boxesNeeded = Math.ceil(tilesRounded / tilesPerBox);

    // Cost
    const totalCost = tilesRounded * pricePerTile;

    // Convert total to square feet for display
    const totalSqFt = totalAreaInches / 144;

    return {
      areaDetails,
      totalSqFt,
      tilesNeeded: Math.ceil(tilesNeeded),
      tilesWithWastage: tilesRounded,
      boxesNeeded,
      totalCost,
      tilesSqFt: (tileToInches(tileLength) * tileToInches(tileWidth)) / 144,
    };
  }, [areas, unit, tileLength, tileWidth, tileUnit, groutWidth, wastagePercent, pricePerTile]);

  const results = calculate();
  const formatMoney = (amount: number) => `${currency}${amount.toFixed(2)}`;

  const commonTileSizes = [
    { name: '12×12"', length: 12, width: 12 },
    { name: '18×18"', length: 18, width: 18 },
    { name: '24×24"', length: 24, width: 24 },
    { name: '12×24"', length: 12, width: 24 },
    { name: '6×24"', length: 6, width: 24 },
    { name: '4×4"', length: 4, width: 4 },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Grid3X3 className="w-4 h-4 inline mr-2" />
        <strong>Tile Calculator:</strong> Calculate how many tiles you need for floors or walls. Includes grout spacing and wastage.
      </div>

      {/* Tile Size */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-zinc-300 mb-3">Tile Size</h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {commonTileSizes.map(size => (
            <button
              key={size.name}
              onClick={() => {
                setTileLength(size.length);
                setTileWidth(size.width);
                setTileUnit('inches');
              }}
              className={`px-3 py-1 text-xs rounded ${
                tileLength === size.length && tileWidth === size.width && tileUnit === 'inches'
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {size.name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Length</label>
            <input
              type="number"
              value={tileLength}
              onChange={(e) => setTileLength(parseFloat(e.target.value) || 0)}
              min={0}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Width</label>
            <input
              type="number"
              value={tileWidth}
              onChange={(e) => setTileWidth(parseFloat(e.target.value) || 0)}
              min={0}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Unit</label>
            <select
              value={tileUnit}
              onChange={(e) => setTileUnit(e.target.value as 'inches' | 'cm')}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            >
              <option value="inches">inches</option>
              <option value="cm">cm</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Price/Tile</label>
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
                value={pricePerTile}
                onChange={(e) => setPricePerTile(parseFloat(e.target.value) || 0)}
                min={0}
                step={0.01}
                className="flex-1 bg-zinc-800 text-white p-2 rounded-r border border-zinc-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Room Measurements In</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as 'feet' | 'meters' | 'inches')}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            >
              <option value="feet">Feet</option>
              <option value="meters">Meters</option>
              <option value="inches">Inches</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Grout Width (inches)</label>
            <input
              type="number"
              value={groutWidth}
              onChange={(e) => setGroutWidth(parseFloat(e.target.value) || 0)}
              min={0}
              step={0.0625}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Wastage %</label>
            <input
              type="number"
              value={wastagePercent}
              onChange={(e) => setWastagePercent(parseInt(e.target.value) || 0)}
              min={0}
              max={50}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
        </div>
      </div>

      {/* Areas */}
      <div className="space-y-3">
        {areas.map((area, idx) => (
          <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <input
                type="text"
                value={area.name}
                onChange={(e) => updateArea(idx, 'name', e.target.value)}
                className="bg-transparent text-white font-medium"
              />
              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-400">
                  {results.areaDetails[idx]?.sqFt.toFixed(1)} sq ft
                </span>
                <button
                  onClick={() => removeArea(idx)}
                  disabled={areas.length === 1}
                  className="text-zinc-500 hover:text-red-400 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Length ({unit})</label>
                <input
                  type="number"
                  value={area.length}
                  onChange={(e) => updateArea(idx, 'length', parseFloat(e.target.value) || 0)}
                  min={0}
                  className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Width ({unit})</label>
                <input
                  type="number"
                  value={area.width}
                  onChange={(e) => updateArea(idx, 'width', parseFloat(e.target.value) || 0)}
                  min={0}
                  className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addArea}
          className="w-full py-2 border border-dashed border-zinc-700 hover:border-zinc-600 rounded-lg text-zinc-400 hover:text-zinc-300 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Area
        </button>
      </div>

      {/* Results */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-zinc-800 rounded-lg p-3">
            <div className="text-xs text-zinc-500 mb-1">Total Area</div>
            <div className="text-lg font-bold text-white">{results.totalSqFt.toFixed(1)} sq ft</div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-3">
            <div className="text-xs text-zinc-500 mb-1">Tiles Needed</div>
            <div className="text-lg font-bold text-white">{results.tilesNeeded}</div>
            <div className="text-xs text-zinc-500">(exact)</div>
          </div>
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
            <div className="text-xs text-blue-400 mb-1">With Wastage</div>
            <div className="text-xl font-bold text-white">{results.tilesWithWastage} tiles</div>
            <div className="text-xs text-zinc-500">+{wastagePercent}% extra</div>
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
          <li>• Add 10-15% wastage for standard layouts, 15-20% for diagonal patterns</li>
          <li>• Keep extra tiles for future repairs (matching colors can be difficult)</li>
          <li>• Larger tiles minimize grout lines but require flatter subfloors</li>
          <li>• Consider tile orientation for visual appeal</li>
        </ul>
      </div>
    </div>
  );
};

export default memo(TileCalculatorComponent);
