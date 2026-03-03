'use client';

import { memo, useState, useCallback } from 'react';

function QuadraticEquationSolver() {
  const [a, setA] = useState('1');
  const [b, setB] = useState('-5');
  const [c, setC] = useState('6');
  const [result, setResult] = useState<{ x1: string; x2: string; discriminant: number; vertex: { x: number; y: number }; nature: string } | null>(null);

  const handleSolve = useCallback(() => {
    const aVal = parseFloat(a) || 0;
    const bVal = parseFloat(b) || 0;
    const cVal = parseFloat(c) || 0;

    if (aVal === 0) {
      // Not a quadratic equation
      if (bVal === 0) {
        setResult(null);
        return;
      }
      const x = -cVal / bVal;
      setResult({
        x1: x.toFixed(4),
        x2: 'N/A (Linear equation)',
        discriminant: NaN,
        vertex: { x: NaN, y: NaN },
        nature: 'Linear equation (not quadratic)',
      });
      return;
    }

    const discriminant = bVal * bVal - 4 * aVal * cVal;
    const vertexX = -bVal / (2 * aVal);
    const vertexY = aVal * vertexX * vertexX + bVal * vertexX + cVal;

    let x1: string, x2: string, nature: string;

    if (discriminant > 0) {
      const sqrtD = Math.sqrt(discriminant);
      x1 = ((-bVal + sqrtD) / (2 * aVal)).toFixed(4);
      x2 = ((-bVal - sqrtD) / (2 * aVal)).toFixed(4);
      nature = 'Two distinct real roots';
    } else if (discriminant === 0) {
      x1 = (-bVal / (2 * aVal)).toFixed(4);
      x2 = x1;
      nature = 'One repeated real root';
    } else {
      const realPart = (-bVal / (2 * aVal)).toFixed(4);
      const imagPart = (Math.sqrt(-discriminant) / (2 * aVal)).toFixed(4);
      x1 = `${realPart} + ${imagPart}i`;
      x2 = `${realPart} - ${imagPart}i`;
      nature = 'Two complex conjugate roots';
    }

    setResult({
      x1,
      x2,
      discriminant,
      vertex: { x: vertexX, y: vertexY },
      nature,
    });
  }, [a, b, c]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quadratic Equation Solver</h3>
        <p className="text-zinc-400 text-sm mb-4">Solve equations of the form: ax² + bx + c = 0</p>
        
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4 text-xl">
          <input
            type="number"
            value={a}
            onChange={(e) => setA(e.target.value)}
            className="w-20 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="a"
          />
          <span className="text-white">x² +</span>
          <input
            type="number"
            value={b}
            onChange={(e) => setB(e.target.value)}
            className="w-20 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="b"
          />
          <span className="text-white">x +</span>
          <input
            type="number"
            value={c}
            onChange={(e) => setC(e.target.value)}
            className="w-20 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="c"
          />
          <span className="text-white">= 0</span>
        </div>

        <button
          onClick={handleSolve}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Solve Equation
        </button>
      </div>

      {result && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Solution</h3>
          <div className="space-y-4">
            <div className="bg-zinc-900 rounded-lg p-4">
              <div className="text-sm text-zinc-400 mb-2">Nature of Roots</div>
              <div className="text-yellow-400 font-medium">{result.nature}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900 rounded-lg p-4 text-center">
                <div className="text-sm text-zinc-400 mb-2">Root x₁</div>
                <div className="text-2xl font-bold text-green-400 font-mono">{result.x1}</div>
              </div>
              <div className="bg-zinc-900 rounded-lg p-4 text-center">
                <div className="text-sm text-zinc-400 mb-2">Root x₂</div>
                <div className="text-2xl font-bold text-green-400 font-mono">{result.x2}</div>
              </div>
            </div>

            {!isNaN(result.discriminant) && (
              <>
                <div className="bg-zinc-900 rounded-lg p-4">
                  <div className="text-sm text-zinc-400 mb-2">Discriminant (b² - 4ac)</div>
                  <div className="text-xl font-bold text-blue-400 font-mono">{result.discriminant.toFixed(4)}</div>
                </div>
                
                <div className="bg-zinc-900 rounded-lg p-4">
                  <div className="text-sm text-zinc-400 mb-2">Vertex of Parabola</div>
                  <div className="text-xl font-bold text-purple-400 font-mono">
                    ({result.vertex.x.toFixed(4)}, {result.vertex.y.toFixed(4)})
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(QuadraticEquationSolver);
