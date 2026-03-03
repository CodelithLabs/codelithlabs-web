'use client';

import { memo, useState, useCallback } from 'react';

function ScientificCalculator() {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState(0);
  const [isRadian, setIsRadian] = useState(true);

  const handleNumber = useCallback((num: string) => {
    setDisplay(prev => prev === '0' || prev === 'Error' ? num : prev + num);
  }, []);

  const handleOperator = useCallback((op: string) => {
    setDisplay(prev => prev + op);
  }, []);

  const handleClear = useCallback(() => {
    setDisplay('0');
  }, []);

  const handleFunction = useCallback((func: string) => {
    try {
      const value = parseFloat(display);
      let result: number;
      
      const angle = isRadian ? value : (value * Math.PI / 180);
      
      switch (func) {
        case 'sin': result = Math.sin(angle); break;
        case 'cos': result = Math.cos(angle); break;
        case 'tan': result = Math.tan(angle); break;
        case 'asin': result = isRadian ? Math.asin(value) : (Math.asin(value) * 180 / Math.PI); break;
        case 'acos': result = isRadian ? Math.acos(value) : (Math.acos(value) * 180 / Math.PI); break;
        case 'atan': result = isRadian ? Math.atan(value) : (Math.atan(value) * 180 / Math.PI); break;
        case 'log': result = Math.log10(value); break;
        case 'ln': result = Math.log(value); break;
        case 'sqrt': result = Math.sqrt(value); break;
        case 'cbrt': result = Math.cbrt(value); break;
        case 'abs': result = Math.abs(value); break;
        case 'exp': result = Math.exp(value); break;
        case 'x2': result = Math.pow(value, 2); break;
        case 'x3': result = Math.pow(value, 3); break;
        case '1/x': result = 1 / value; break;
        case '10x': result = Math.pow(10, value); break;
        case 'ex': result = Math.exp(value); break;
        case 'fact': result = factorial(value); break;
        default: result = value;
      }
      
      setDisplay(result.toString());
    } catch {
      setDisplay('Error');
    }
  }, [display, isRadian]);

  const factorial = (n: number): number => {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  };

  const handleCalculate = useCallback(() => {
    try {
      // Replace display symbols with JS operators
      let expression = display
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, Math.PI.toString())
        .replace(/e(?![x])/g, Math.E.toString());
      
      // eslint-disable-next-line no-eval
      const result = eval(expression);
      setDisplay(result.toString());
    } catch {
      setDisplay('Error');
    }
  }, [display]);

  const handleMemory = useCallback((action: string) => {
    const value = parseFloat(display) || 0;
    switch (action) {
      case 'MC': setMemory(0); break;
      case 'MR': setDisplay(memory.toString()); break;
      case 'M+': setMemory(prev => prev + value); break;
      case 'M-': setMemory(prev => prev - value); break;
      case 'MS': setMemory(value); break;
    }
  }, [display, memory]);

  const Button = ({ value, onClick, className = '' }: { value: string; onClick: () => void; className?: string }) => (
    <button
      onClick={onClick}
      className={`p-3 rounded-lg font-mono text-sm transition-colors ${className}`}
    >
      {value}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Scientific Calculator</h3>
        
        <div className="bg-zinc-900 rounded-lg p-4 mb-4">
          <div className="text-right text-green-400 font-mono text-2xl overflow-x-auto">
            {display}
          </div>
          <div className="text-right text-zinc-500 text-sm mt-1">
            {memory !== 0 && <span className="mr-2">M: {memory}</span>}
            <span>{isRadian ? 'RAD' : 'DEG'}</span>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {/* Row 1 - Memory & Mode */}
          <Button value="MC" onClick={() => handleMemory('MC')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />
          <Button value="MR" onClick={() => handleMemory('MR')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />
          <Button value="M+" onClick={() => handleMemory('M+')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />
          <Button value="M-" onClick={() => handleMemory('M-')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />
          <Button value={isRadian ? 'RAD' : 'DEG'} onClick={() => setIsRadian(!isRadian)} className="bg-blue-600 text-white hover:bg-blue-700" />

          {/* Row 2 - Functions */}
          <Button value="sin" onClick={() => handleFunction('sin')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />
          <Button value="cos" onClick={() => handleFunction('cos')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />
          <Button value="tan" onClick={() => handleFunction('tan')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />
          <Button value="log" onClick={() => handleFunction('log')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />
          <Button value="ln" onClick={() => handleFunction('ln')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />

          {/* Row 3 - Functions */}
          <Button value="x²" onClick={() => handleFunction('x2')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />
          <Button value="x³" onClick={() => handleFunction('x3')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />
          <Button value="√" onClick={() => handleFunction('sqrt')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />
          <Button value="∛" onClick={() => handleFunction('cbrt')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />
          <Button value="n!" onClick={() => handleFunction('fact')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />

          {/* Row 4 - Numbers */}
          <Button value="7" onClick={() => handleNumber('7')} className="bg-zinc-600 text-white hover:bg-zinc-500" />
          <Button value="8" onClick={() => handleNumber('8')} className="bg-zinc-600 text-white hover:bg-zinc-500" />
          <Button value="9" onClick={() => handleNumber('9')} className="bg-zinc-600 text-white hover:bg-zinc-500" />
          <Button value="÷" onClick={() => handleOperator('/')} className="bg-yellow-600 text-white hover:bg-yellow-700" />
          <Button value="π" onClick={() => handleOperator('π')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />

          {/* Row 5 - Numbers */}
          <Button value="4" onClick={() => handleNumber('4')} className="bg-zinc-600 text-white hover:bg-zinc-500" />
          <Button value="5" onClick={() => handleNumber('5')} className="bg-zinc-600 text-white hover:bg-zinc-500" />
          <Button value="6" onClick={() => handleNumber('6')} className="bg-zinc-600 text-white hover:bg-zinc-500" />
          <Button value="×" onClick={() => handleOperator('*')} className="bg-yellow-600 text-white hover:bg-yellow-700" />
          <Button value="e" onClick={() => handleOperator('e')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />

          {/* Row 6 - Numbers */}
          <Button value="1" onClick={() => handleNumber('1')} className="bg-zinc-600 text-white hover:bg-zinc-500" />
          <Button value="2" onClick={() => handleNumber('2')} className="bg-zinc-600 text-white hover:bg-zinc-500" />
          <Button value="3" onClick={() => handleNumber('3')} className="bg-zinc-600 text-white hover:bg-zinc-500" />
          <Button value="-" onClick={() => handleOperator('-')} className="bg-yellow-600 text-white hover:bg-yellow-700" />
          <Button value="1/x" onClick={() => handleFunction('1/x')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />

          {/* Row 7 - Numbers */}
          <Button value="0" onClick={() => handleNumber('0')} className="bg-zinc-600 text-white hover:bg-zinc-500" />
          <Button value="." onClick={() => handleNumber('.')} className="bg-zinc-600 text-white hover:bg-zinc-500" />
          <Button value="C" onClick={handleClear} className="bg-red-600 text-white hover:bg-red-700" />
          <Button value="+" onClick={() => handleOperator('+')} className="bg-yellow-600 text-white hover:bg-yellow-700" />
          <Button value="=" onClick={handleCalculate} className="bg-green-600 text-white hover:bg-green-700" />
        </div>
      </div>
    </div>
  );
}

export default memo(ScientificCalculator);
