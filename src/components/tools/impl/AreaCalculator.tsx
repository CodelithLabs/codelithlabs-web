'use client';

import { memo, useState, useCallback } from 'react';

type Shape = 'rectangle' | 'circle' | 'triangle' | 'trapezoid' | 'ellipse' | 'parallelogram';

function AreaCalculator() {
  const [shape, setShape] = useState<Shape>('rectangle');
  const [dimensions, setDimensions] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<{ area: number; perimeter?: number; formula: string } | null>(null);

  const handleDimensionChange = useCallback((key: string, value: string) => {
    setDimensions(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleCalculate = useCallback(() => {
    const getValue = (key: string) => parseFloat(dimensions[key]) || 0;

    switch (shape) {
      case 'rectangle': {
        const length = getValue('length');
        const width = getValue('width');
        setResult({
          area: length * width,
          perimeter: 2 * (length + width),
          formula: 'Area = length × width',
        });
        break;
      }
      case 'circle': {
        const radius = getValue('radius');
        setResult({
          area: Math.PI * radius * radius,
          perimeter: 2 * Math.PI * radius,
          formula: 'Area = π × r²',
        });
        break;
      }
      case 'triangle': {
        const base = getValue('base');
        const height = getValue('height');
        const sideA = getValue('sideA') || base;
        const sideB = getValue('sideB') || height;
        setResult({
          area: 0.5 * base * height,
          perimeter: base + sideA + sideB,
          formula: 'Area = ½ × base × height',
        });
        break;
      }
      case 'trapezoid': {
        const a = getValue('parallelSide1');
        const b = getValue('parallelSide2');
        const h = getValue('height');
        setResult({
          area: 0.5 * (a + b) * h,
          formula: 'Area = ½ × (a + b) × h',
        });
        break;
      }
      case 'ellipse': {
        const a = getValue('semiMajorAxis');
        const b = getValue('semiMinorAxis');
        setResult({
          area: Math.PI * a * b,
          perimeter: Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b))),
          formula: 'Area = π × a × b',
        });
        break;
      }
      case 'parallelogram': {
        const base = getValue('base');
        const height = getValue('height');
        const side = getValue('side') || height;
        setResult({
          area: base * height,
          perimeter: 2 * (base + side),
          formula: 'Area = base × height',
        });
        break;
      }
    }
  }, [shape, dimensions]);

  const renderInputs = () => {
    const inputs: { key: string; label: string }[] = [];
    
    switch (shape) {
      case 'rectangle':
        inputs.push({ key: 'length', label: 'Length' }, { key: 'width', label: 'Width' });
        break;
      case 'circle':
        inputs.push({ key: 'radius', label: 'Radius' });
        break;
      case 'triangle':
        inputs.push({ key: 'base', label: 'Base' }, { key: 'height', label: 'Height' });
        break;
      case 'trapezoid':
        inputs.push(
          { key: 'parallelSide1', label: 'Parallel Side 1 (a)' },
          { key: 'parallelSide2', label: 'Parallel Side 2 (b)' },
          { key: 'height', label: 'Height (h)' },
        );
        break;
      case 'ellipse':
        inputs.push(
          { key: 'semiMajorAxis', label: 'Semi-major Axis (a)' },
          { key: 'semiMinorAxis', label: 'Semi-minor Axis (b)' },
        );
        break;
      case 'parallelogram':
        inputs.push({ key: 'base', label: 'Base' }, { key: 'height', label: 'Height' }, { key: 'side', label: 'Side (optional)' });
        break;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {inputs.map(input => (
          <div key={input.key}>
            <label className="block text-sm font-medium text-zinc-300 mb-2">{input.label}</label>
            <input
              type="number"
              value={dimensions[input.key] || ''}
              onChange={(e) => handleDimensionChange(input.key, e.target.value)}
              placeholder="Enter value"
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Area Calculator</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-zinc-300 mb-2">Select Shape</label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {['rectangle', 'circle', 'triangle', 'trapezoid', 'ellipse', 'parallelogram'].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setShape(s as Shape);
                  setDimensions({});
                  setResult(null);
                }}
                className={`px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                  shape === s
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {renderInputs()}

        <button
          onClick={handleCalculate}
          className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Calculate
        </button>
      </div>

      {result && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Results</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-zinc-700">
              <span className="text-zinc-400">Area:</span>
              <span className="text-green-400 font-mono text-xl">{result.area.toFixed(4)} sq units</span>
            </div>
            {result.perimeter !== undefined && (
              <div className="flex justify-between items-center py-2 border-b border-zinc-700">
                <span className="text-zinc-400">Perimeter:</span>
                <span className="text-blue-400 font-mono">{result.perimeter.toFixed(4)} units</span>
              </div>
            )}
            <div className="bg-zinc-900 rounded-lg p-3">
              <span className="text-sm text-zinc-400">Formula: </span>
              <span className="text-yellow-400 font-mono">{result.formula}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(AreaCalculator);
