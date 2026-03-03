'use client';

import { memo, useState, useCallback } from 'react';

const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion', 'Quadrillion', 'Quintillion'];

const indianOnes = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const indianScales = ['', 'Thousand', 'Lakh', 'Crore', 'Arab', 'Kharab'];

function NumberToWords() {
  const [number, setNumber] = useState('');
  const [system, setSystem] = useState<'western' | 'indian'>('western');
  const [result, setResult] = useState<string | null>(null);

  const convertHundreds = (num: number): string => {
    if (num === 0) return '';
    if (num < 20) return ones[num];
    if (num < 100) {
      return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
    }
    return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' ' + convertHundreds(num % 100) : '');
  };

  const convertWestern = (num: number): string => {
    if (num === 0) return 'Zero';
    if (num < 0) return 'Negative ' + convertWestern(Math.abs(num));

    let result = '';
    let scaleIndex = 0;

    while (num > 0) {
      const chunk = num % 1000;
      if (chunk !== 0) {
        const chunkWords = convertHundreds(chunk);
        result = chunkWords + (scales[scaleIndex] ? ' ' + scales[scaleIndex] : '') + (result ? ' ' + result : '');
      }
      num = Math.floor(num / 1000);
      scaleIndex++;
    }

    return result.trim();
  };

  const convertIndian = (num: number): string => {
    if (num === 0) return 'Zero';
    if (num < 0) return 'Negative ' + convertIndian(Math.abs(num));

    if (num < 20) return indianOnes[num];
    if (num < 100) {
      return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + indianOnes[num % 10] : '');
    }
    if (num < 1000) {
      return indianOnes[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' ' + convertIndian(num % 100) : '');
    }
    if (num < 100000) {
      return convertIndian(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 !== 0 ? ' ' + convertIndian(num % 1000) : '');
    }
    if (num < 10000000) {
      return convertIndian(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 !== 0 ? ' ' + convertIndian(num % 100000) : '');
    }
    if (num < 1000000000) {
      return convertIndian(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 !== 0 ? ' ' + convertIndian(num % 10000000) : '');
    }
    if (num < 100000000000) {
      return convertIndian(Math.floor(num / 1000000000)) + ' Arab' + (num % 1000000000 !== 0 ? ' ' + convertIndian(num % 1000000000) : '');
    }
    return convertIndian(Math.floor(num / 100000000000)) + ' Kharab' + (num % 100000000000 !== 0 ? ' ' + convertIndian(num % 100000000000) : '');
  };

  const handleConvert = useCallback(() => {
    const num = parseInt(number.replace(/,/g, ''));
    if (isNaN(num)) {
      setResult(null);
      return;
    }

    if (Math.abs(num) > Number.MAX_SAFE_INTEGER) {
      setResult('Number too large to convert accurately');
      return;
    }

    const words = system === 'western' ? convertWestern(num) : convertIndian(num);
    setResult(words);
  }, [number, system]);

  const formatNumber = (num: string): string => {
    const cleanNum = num.replace(/,/g, '');
    if (system === 'indian') {
      const parts = cleanNum.split('.');
      let intPart = parts[0];
      const lastThree = intPart.slice(-3);
      const otherNumbers = intPart.slice(0, -3);
      if (otherNumbers !== '') {
        intPart = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
      } else {
        intPart = lastThree;
      }
      return parts.length > 1 ? intPart + '.' + parts[1] : intPart;
    }
    return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Number to Words Converter</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Number</label>
            <input
              type="text"
              value={number}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9,-]/g, '');
                setNumber(val);
              }}
              placeholder="Enter a number (e.g., 1234567)"
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-lg"
            />
            {number && (
              <div className="text-zinc-400 text-sm mt-1">
                Formatted: {formatNumber(number)}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Number System</label>
            <select
              value={system}
              onChange={(e) => setSystem(e.target.value as 'western' | 'indian')}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="western">Western (Millions, Billions)</option>
              <option value="indian">Indian (Lakhs, Crores)</option>
            </select>
          </div>
          <button
            onClick={handleConvert}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Convert to Words
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-white">Result</h3>
            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded transition-colors"
            >
              Copy
            </button>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4">
            <p className="text-green-400 text-xl leading-relaxed">{result}</p>
          </div>
          <div className="mt-4 text-sm text-zinc-400">
            {system === 'indian' ? (
              <div>Scale: Thousand → Lakh → Crore → Arab → Kharab</div>
            ) : (
              <div>Scale: Thousand → Million → Billion → Trillion</div>
            )}
          </div>
        </div>
      )}

      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Examples</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[1000, 100000, 10000000, 1000000000].map(num => (
            <button
              key={num}
              onClick={() => {
                setNumber(num.toString());
                const words = system === 'western' ? convertWestern(num) : convertIndian(num);
                setResult(words);
              }}
              className="bg-zinc-900 hover:bg-zinc-700 rounded-lg p-3 text-center transition-colors"
            >
              <div className="text-blue-400 font-mono">{formatNumber(num.toString())}</div>
              <div className="text-zinc-400 text-xs mt-1">
                {system === 'indian' 
                  ? (num === 1000 ? '1 Thousand' : num === 100000 ? '1 Lakh' : num === 10000000 ? '1 Crore' : '100 Crore')
                  : (num === 1000 ? '1 Thousand' : num === 100000 ? '100 Thousand' : num === 10000000 ? '10 Million' : '1 Billion')
                }
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(NumberToWords);
