'use client';

import { memo, useState, useCallback } from 'react';

type MatrixOperation = 'add' | 'subtract' | 'multiply' | 'determinant' | 'transpose';

function determinant(matrix: number[][]): number {
  const n = matrix.length;
  if (n === 1) return matrix[0][0];
  if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

  let det = 0;
  for (let j = 0; j < n; j++) {
    const minor: number[][] = [];
    for (let i = 1; i < n; i++) {
      minor.push([...matrix[i].slice(0, j), ...matrix[i].slice(j + 1)]);
    }
    det += Math.pow(-1, j) * matrix[0][j] * determinant(minor);
  }
  return det;
}

function MatrixCalculator() {
  const [matrixA, setMatrixA] = useState([
    [1, 2],
    [3, 4],
  ]);
  const [matrixB, setMatrixB] = useState([
    [5, 6],
    [7, 8],
  ]);
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [operation, setOperation] = useState<MatrixOperation>('add');
  const [result, setResult] = useState<number[][] | number | null>(null);

  const updateMatrixA = useCallback((r: number, c: number, value: string) => {
    const newMatrix = [...matrixA];
    newMatrix[r][c] = parseFloat(value) || 0;
    setMatrixA(newMatrix);
  }, [matrixA]);

  const updateMatrixB = useCallback((r: number, c: number, value: string) => {
    const newMatrix = [...matrixB];
    newMatrix[r][c] = parseFloat(value) || 0;
    setMatrixB(newMatrix);
  }, [matrixB]);

  const resizeMatrices = useCallback((newRows: number, newCols: number) => {
    const createMatrix = (oldMatrix: number[][]) => {
      const newMatrix: number[][] = [];
      for (let i = 0; i < newRows; i++) {
        newMatrix[i] = [];
        for (let j = 0; j < newCols; j++) {
          newMatrix[i][j] = oldMatrix[i]?.[j] ?? 0;
        }
      }
      return newMatrix;
    };
    setMatrixA(createMatrix(matrixA));
    setMatrixB(createMatrix(matrixB));
    setRows(newRows);
    setCols(newCols);
  }, [matrixA, matrixB]);

  const handleCalculate = useCallback(() => {
    const a = matrixA.slice(0, rows).map(r => r.slice(0, cols));
    const b = matrixB.slice(0, rows).map(r => r.slice(0, cols));

    switch (operation) {
      case 'add': {
        const res = a.map((row, i) => row.map((val, j) => val + b[i][j]));
        setResult(res);
        break;
      }
      case 'subtract': {
        const res = a.map((row, i) => row.map((val, j) => val - b[i][j]));
        setResult(res);
        break;
      }
      case 'multiply': {
        const res: number[][] = [];
        for (let i = 0; i < rows; i++) {
          res[i] = [];
          for (let j = 0; j < cols; j++) {
            let sum = 0;
            for (let k = 0; k < cols; k++) {
              sum += a[i][k] * b[k][j];
            }
            res[i][j] = sum;
          }
        }
        setResult(res);
        break;
      }
      case 'determinant': {
        if (rows !== cols) {
          setResult(null);
          return;
        }
        setResult(determinant(a));
        break;
      }
      case 'transpose': {
        const res: number[][] = [];
        for (let j = 0; j < cols; j++) {
          res[j] = [];
          for (let i = 0; i < rows; i++) {
            res[j][i] = a[i][j];
          }
        }
        setResult(res);
        break;
      }
    }
  }, [matrixA, matrixB, rows, cols, operation]);

  const renderMatrix = (matrix: number[][], onChange?: (r: number, c: number, v: string) => void) => (
    <div className="inline-block">
      <div className="flex items-center">
        <span className="text-2xl text-zinc-400 mr-1">[</span>
        <div>
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex gap-1 mb-1">
              {Array.from({ length: cols }).map((_, j) => (
                <input
                  key={j}
                  type="number"
                  value={matrix[i]?.[j] ?? 0}
                  onChange={(e) => onChange?.(i, j, e.target.value)}
                  disabled={!onChange}
                  className="w-16 px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-white text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-75"
                />
              ))}
            </div>
          ))}
        </div>
        <span className="text-2xl text-zinc-400 ml-1">]</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Matrix Calculator</h3>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Rows</label>
            <select
              value={rows}
              onChange={(e) => resizeMatrices(parseInt(e.target.value), cols)}
              className="px-3 py-1 bg-zinc-900 border border-zinc-700 rounded text-white"
            >
              {[2, 3, 4].map(n => <option key={`row-${n}`} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Columns</label>
            <select
              value={cols}
              onChange={(e) => resizeMatrices(rows, parseInt(e.target.value))}
              className="px-3 py-1 bg-zinc-900 border border-zinc-700 rounded text-white"
            >
              {[2, 3, 4].map(n => <option key={`col-${n}`} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Operation</label>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value as MatrixOperation)}
              className="px-3 py-1 bg-zinc-900 border border-zinc-700 rounded text-white"
            >
              <option value="add">A + B</option>
              <option value="subtract">A - B</option>
              <option value="multiply">A × B</option>
              <option value="determinant">det(A)</option>
              <option value="transpose">Aᵀ</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-8 justify-center mb-4">
          <div>
            <div className="text-sm text-zinc-400 mb-2 text-center">Matrix A</div>
            {renderMatrix(matrixA, updateMatrixA)}
          </div>
          {!['determinant', 'transpose'].includes(operation) && (
            <div>
              <div className="text-sm text-zinc-400 mb-2 text-center">Matrix B</div>
              {renderMatrix(matrixB, updateMatrixB)}
            </div>
          )}
        </div>

        <button
          onClick={handleCalculate}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Calculate
        </button>
      </div>

      {result !== null && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Result</h3>
          <div className="flex justify-center">
            {typeof result === 'number' ? (
              <div className="text-3xl font-bold text-green-400 font-mono">
                {result.toFixed(4)}
              </div>
            ) : (
              renderMatrix(result)
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(MatrixCalculator);
