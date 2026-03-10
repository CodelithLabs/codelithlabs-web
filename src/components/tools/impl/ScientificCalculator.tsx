'use client';

import { memo, useState, useCallback } from 'react';

function tokenizeExpression(expression: string): string[] {
  const tokens = expression.match(/\d*\.\d+|\d+|[()+\-*/]|π|e/g);
  if (!tokens) {
    throw new Error('Invalid expression');
  }
  return tokens;
}

function toRpn(tokens: string[]): string[] {
  const output: string[] = [];
  const ops: string[] = [];
  const precedence: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2, 'u-': 3 };

  let prev: string | null = null;

  for (const token of tokens) {
    const isNumber = /^\d*\.?\d+$/.test(token);
    const isConstant = token === 'π' || token === 'e';

    if (isNumber || isConstant) {
      output.push(token);
      prev = token;
      continue;
    }

    if (token === '(') {
      ops.push(token);
      prev = token;
      continue;
    }

    if (token === ')') {
      while (ops.length && ops[ops.length - 1] !== '(') {
        output.push(ops.pop()!);
      }
      if (!ops.length) throw new Error('Mismatched parentheses');
      ops.pop();
      prev = token;
      continue;
    }

    let op = token;
    if (token === '-' && (prev === null || ['+', '-', '*', '/', '('].includes(prev))) {
      op = 'u-';
    }

    while (
      ops.length
      && ops[ops.length - 1] !== '('
      && precedence[ops[ops.length - 1]] >= precedence[op]
    ) {
      output.push(ops.pop()!);
    }
    ops.push(op);
    prev = token;
  }

  while (ops.length) {
    const op = ops.pop()!;
    if (op === '(') throw new Error('Mismatched parentheses');
    output.push(op);
  }

  return output;
}

function evalRpn(rpn: string[]): number {
  const stack: number[] = [];

  for (const token of rpn) {
    if (/^\d*\.?\d+$/.test(token)) {
      stack.push(parseFloat(token));
      continue;
    }

    if (token === 'π') {
      stack.push(Math.PI);
      continue;
    }

    if (token === 'e') {
      stack.push(Math.E);
      continue;
    }

    if (token === 'u-') {
      const value = stack.pop();
      if (value === undefined) throw new Error('Invalid unary operation');
      stack.push(-value);
      continue;
    }

    const b = stack.pop();
    const a = stack.pop();
    if (a === undefined || b === undefined) throw new Error('Invalid binary operation');

    switch (token) {
      case '+': stack.push(a + b); break;
      case '-': stack.push(a - b); break;
      case '*': stack.push(a * b); break;
      case '/':
        if (b === 0) throw new Error('Division by zero');
        stack.push(a / b);
        break;
      default:
        throw new Error(`Unsupported token: ${token}`);
    }
  }

  if (stack.length !== 1) throw new Error('Invalid expression result');
  return stack[0];
}

function evaluateExpression(expression: string): number {
  const normalized = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/\s+/g, '');
  const tokens = tokenizeExpression(normalized);
  const rpn = toRpn(tokens);
  return evalRpn(rpn);
}

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

interface CalcButtonProps {
  value: string;
  onClick: () => void;
  className?: string;
}

function CalcButton({ value, onClick, className = '' }: CalcButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-lg font-mono text-sm transition-colors ${className}`}
    >
      {value}
    </button>
  );
}

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

  const handleCalculate = useCallback(() => {
    try {
      const result = evaluateExpression(display);
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
          <CalcButton value="MC" onClick={() => handleMemory('MC')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />
          <CalcButton value="MR" onClick={() => handleMemory('MR')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />
          <CalcButton value="M+" onClick={() => handleMemory('M+')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />
          <CalcButton value="M-" onClick={() => handleMemory('M-')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />
          <CalcButton value={isRadian ? 'RAD' : 'DEG'} onClick={() => setIsRadian(!isRadian)} className="bg-blue-600 text-white hover:bg-blue-700" />

          {/* Row 2 - Functions */}
          <CalcButton value="sin" onClick={() => handleFunction('sin')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />
          <CalcButton value="cos" onClick={() => handleFunction('cos')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />
          <CalcButton value="tan" onClick={() => handleFunction('tan')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />
          <CalcButton value="log" onClick={() => handleFunction('log')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />
          <CalcButton value="ln" onClick={() => handleFunction('ln')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />

          {/* Row 3 - Functions */}
          <CalcButton value="x²" onClick={() => handleFunction('x2')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />
          <CalcButton value="x³" onClick={() => handleFunction('x3')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />
          <CalcButton value="√" onClick={() => handleFunction('sqrt')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />
          <CalcButton value="∛" onClick={() => handleFunction('cbrt')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />
          <CalcButton value="n!" onClick={() => handleFunction('fact')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />

          {/* Row 4 - Numbers */}
          <CalcButton value="7" onClick={() => handleNumber('7')} className="bg-zinc-600 text-white hover:bg-zinc-500" />
          <CalcButton value="8" onClick={() => handleNumber('8')} className="bg-zinc-600 text-white hover:bg-zinc-500" />
          <CalcButton value="9" onClick={() => handleNumber('9')} className="bg-zinc-600 text-white hover:bg-zinc-500" />
          <CalcButton value="÷" onClick={() => handleOperator('/')} className="bg-yellow-600 text-white hover:bg-yellow-700" />
          <CalcButton value="π" onClick={() => handleOperator('π')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />

          {/* Row 5 - Numbers */}
          <CalcButton value="4" onClick={() => handleNumber('4')} className="bg-zinc-600 text-white hover:bg-zinc-500" />
          <CalcButton value="5" onClick={() => handleNumber('5')} className="bg-zinc-600 text-white hover:bg-zinc-500" />
          <CalcButton value="6" onClick={() => handleNumber('6')} className="bg-zinc-600 text-white hover:bg-zinc-500" />
          <CalcButton value="×" onClick={() => handleOperator('*')} className="bg-yellow-600 text-white hover:bg-yellow-700" />
          <CalcButton value="e" onClick={() => handleOperator('e')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />

          {/* Row 6 - Numbers */}
          <CalcButton value="1" onClick={() => handleNumber('1')} className="bg-zinc-600 text-white hover:bg-zinc-500" />
          <CalcButton value="2" onClick={() => handleNumber('2')} className="bg-zinc-600 text-white hover:bg-zinc-500" />
          <CalcButton value="3" onClick={() => handleNumber('3')} className="bg-zinc-600 text-white hover:bg-zinc-500" />
          <CalcButton value="-" onClick={() => handleOperator('-')} className="bg-yellow-600 text-white hover:bg-yellow-700" />
          <CalcButton value="1/x" onClick={() => handleFunction('1/x')} className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600" />

          {/* Row 7 - Numbers */}
          <CalcButton value="0" onClick={() => handleNumber('0')} className="bg-zinc-600 text-white hover:bg-zinc-500" />
          <CalcButton value="." onClick={() => handleNumber('.')} className="bg-zinc-600 text-white hover:bg-zinc-500" />
          <CalcButton value="C" onClick={handleClear} className="bg-red-600 text-white hover:bg-red-700" />
          <CalcButton value="+" onClick={() => handleOperator('+')} className="bg-yellow-600 text-white hover:bg-yellow-700" />
          <CalcButton value="=" onClick={handleCalculate} className="bg-green-600 text-white hover:bg-green-700" />
        </div>
      </div>
    </div>
  );
}

export default memo(ScientificCalculator);
