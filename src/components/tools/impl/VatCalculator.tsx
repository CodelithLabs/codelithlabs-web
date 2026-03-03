'use client';
import { useState, useCallback, memo } from 'react';
import { Calculator, ArrowRightLeft, Percent } from 'lucide-react';

interface VatRate {
  country: string;
  code: string;
  standard: number;
  reduced?: number;
  superReduced?: number;
}

const VAT_RATES: VatRate[] = [
  { country: 'United Kingdom', code: 'GB', standard: 20, reduced: 5 },
  { country: 'Germany', code: 'DE', standard: 19, reduced: 7 },
  { country: 'France', code: 'FR', standard: 20, reduced: 10, superReduced: 5.5 },
  { country: 'Italy', code: 'IT', standard: 22, reduced: 10, superReduced: 4 },
  { country: 'Spain', code: 'ES', standard: 21, reduced: 10, superReduced: 4 },
  { country: 'Netherlands', code: 'NL', standard: 21, reduced: 9 },
  { country: 'Belgium', code: 'BE', standard: 21, reduced: 12, superReduced: 6 },
  { country: 'Austria', code: 'AT', standard: 20, reduced: 13, superReduced: 10 },
  { country: 'Poland', code: 'PL', standard: 23, reduced: 8, superReduced: 5 },
  { country: 'Sweden', code: 'SE', standard: 25, reduced: 12, superReduced: 6 },
  { country: 'Denmark', code: 'DK', standard: 25 },
  { country: 'Finland', code: 'FI', standard: 24, reduced: 14, superReduced: 10 },
  { country: 'Ireland', code: 'IE', standard: 23, reduced: 13.5, superReduced: 9 },
  { country: 'Portugal', code: 'PT', standard: 23, reduced: 13, superReduced: 6 },
  { country: 'Greece', code: 'GR', standard: 24, reduced: 13, superReduced: 6 },
  { country: 'India (GST)', code: 'IN', standard: 18, reduced: 12, superReduced: 5 },
  { country: 'Australia (GST)', code: 'AU', standard: 10 },
  { country: 'Canada (GST/HST)', code: 'CA', standard: 5, reduced: 13 },
  { country: 'New Zealand (GST)', code: 'NZ', standard: 15 },
  { country: 'Singapore (GST)', code: 'SG', standard: 9 },
];

const VatCalculatorComponent = function VatCalculator() {
  const [amount, setAmount] = useState(100);
  const [vatRate, setVatRate] = useState(20);
  const [selectedCountry, setSelectedCountry] = useState('GB');
  const [mode, setMode] = useState<'add' | 'remove' | 'extract'>('add');
  const [currency, setCurrency] = useState('€');

  const calculate = useCallback(() => {
    let netAmount: number;
    let vatAmount: number;
    let grossAmount: number;

    switch (mode) {
      case 'add':
        // Add VAT to net amount
        netAmount = amount;
        vatAmount = amount * (vatRate / 100);
        grossAmount = amount + vatAmount;
        break;
      case 'remove':
        // Remove VAT from gross amount (calculate net)
        grossAmount = amount;
        netAmount = amount / (1 + vatRate / 100);
        vatAmount = grossAmount - netAmount;
        break;
      case 'extract':
        // Same as remove, but presented differently
        grossAmount = amount;
        vatAmount = amount - (amount / (1 + vatRate / 100));
        netAmount = amount - vatAmount;
        break;
      default:
        netAmount = amount;
        vatAmount = 0;
        grossAmount = amount;
    }

    return {
      netAmount,
      vatAmount,
      grossAmount,
    };
  }, [amount, vatRate, mode]);

  const results = calculate();
  const formatMoney = (value: number) => `${currency}${value.toFixed(2)}`;

  const handleCountryChange = (code: string) => {
    setSelectedCountry(code);
    const country = VAT_RATES.find(c => c.code === code);
    if (country) {
      setVatRate(country.standard);
    }
  };

  const selectedCountryData = VAT_RATES.find(c => c.code === selectedCountry);

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Percent className="w-4 h-4 inline mr-2" />
        <strong>VAT / GST Calculator:</strong> Add or remove VAT/GST from any amount. Includes standard rates for common countries.
      </div>

      {/* Mode Selection */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('add')}
          className={`flex-1 py-2 rounded-lg text-sm ${
            mode === 'add' ? 'bg-green-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          Add VAT
        </button>
        <button
          onClick={() => setMode('remove')}
          className={`flex-1 py-2 rounded-lg text-sm ${
            mode === 'remove' ? 'bg-orange-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          Remove VAT
        </button>
        <button
          onClick={() => setMode('extract')}
          className={`flex-1 py-2 rounded-lg text-sm ${
            mode === 'extract' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          Extract VAT
        </button>
      </div>

      {/* Inputs */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">
              {mode === 'add' ? 'Net Amount (excl. VAT)' : 'Gross Amount (incl. VAT)'}
            </label>
            <div className="flex">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-zinc-800 text-white p-2 rounded-l border border-zinc-700"
              >
                <option value="€">€</option>
                <option value="£">£</option>
                <option value="$">$</option>
                <option value="₹">₹</option>
              </select>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                min={0}
                step={0.01}
                className="flex-1 bg-zinc-800 text-white p-2 rounded-r border border-zinc-700"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            >
              {VAT_RATES.map(country => (
                <option key={country.code} value={country.code}>
                  {country.country} ({country.standard}%)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">VAT Rate (%)</label>
            <input
              type="number"
              value={vatRate}
              onChange={(e) => setVatRate(parseFloat(e.target.value) || 0)}
              min={0}
              max={100}
              step={0.1}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
        </div>

        {/* Rate Options for Selected Country */}
        {selectedCountryData && (
          <div className="mt-4 pt-4 border-t border-zinc-700">
            <div className="text-xs text-zinc-500 mb-2">{selectedCountryData.country} rates:</div>
            <div className="flex gap-2">
              <button
                onClick={() => setVatRate(selectedCountryData.standard)}
                className={`px-3 py-1 rounded text-xs ${
                  vatRate === selectedCountryData.standard
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                Standard ({selectedCountryData.standard}%)
              </button>
              {selectedCountryData.reduced && (
                <button
                  onClick={() => setVatRate(selectedCountryData.reduced!)}
                  className={`px-3 py-1 rounded text-xs ${
                    vatRate === selectedCountryData.reduced
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  Reduced ({selectedCountryData.reduced}%)
                </button>
              )}
              {selectedCountryData.superReduced && (
                <button
                  onClick={() => setVatRate(selectedCountryData.superReduced!)}
                  className={`px-3 py-1 rounded text-xs ${
                    vatRate === selectedCountryData.superReduced
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  Super Reduced ({selectedCountryData.superReduced}%)
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className={`rounded-lg p-4 ${
            mode === 'add' ? 'bg-zinc-800' : 'bg-green-900/30 border border-green-500/30'
          }`}>
            <div className="text-xs text-zinc-500 mb-1">Net Amount</div>
            <div className="text-xl font-bold text-white">{formatMoney(results.netAmount)}</div>
            <div className="text-xs text-zinc-500">excl. VAT</div>
          </div>
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
            <div className="text-xs text-blue-400 mb-1">VAT Amount</div>
            <div className="text-xl font-bold text-white">{formatMoney(results.vatAmount)}</div>
            <div className="text-xs text-zinc-500">{vatRate}%</div>
          </div>
          <div className={`rounded-lg p-4 ${
            mode === 'add' ? 'bg-green-900/30 border border-green-500/30' : 'bg-zinc-800'
          }`}>
            <div className="text-xs text-zinc-500 mb-1">Gross Amount</div>
            <div className="text-xl font-bold text-white">{formatMoney(results.grossAmount)}</div>
            <div className="text-xs text-zinc-500">incl. VAT</div>
          </div>
        </div>

        {/* Formula */}
        <div className="mt-4 pt-4 border-t border-zinc-700 text-center text-sm text-zinc-500">
          {mode === 'add' ? (
            <span>{formatMoney(results.netAmount)} + {vatRate}% = <span className="text-green-400 font-medium">{formatMoney(results.grossAmount)}</span></span>
          ) : (
            <span>{formatMoney(results.grossAmount)} − {vatRate}% = <span className="text-green-400 font-medium">{formatMoney(results.netAmount)}</span></span>
          )}
        </div>
      </div>

      {/* VAT Rates Reference */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-zinc-300 mb-3">EU Standard VAT Rates</h4>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2 text-xs">
          {VAT_RATES.filter(c => ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'PL', 'SE', 'DK', 'IE', 'GB'].includes(c.code)).map(country => (
            <button
              key={country.code}
              onClick={() => handleCountryChange(country.code)}
              className={`p-2 rounded text-center ${
                selectedCountry === country.code
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              <div className="font-medium">{country.code}</div>
              <div>{country.standard}%</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(VatCalculatorComponent);
