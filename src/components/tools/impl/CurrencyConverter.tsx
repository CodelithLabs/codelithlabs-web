// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/tools/impl/CurrencyConverter.tsx
// Currency Converter - Real-time exchange rates for global currencies
// Supports 150+ currencies with live rates
// ═══════════════════════════════════════════════════════════════════════════
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { DollarSign, RefreshCw, TrendingUp, ArrowRightLeft, AlertCircle } from 'lucide-react';

interface ExchangeRates {
  [key: string]: number;
}

// In-memory cache for exchange rates (5-minute TTL)
const ratesCache = new Map<string, { rates: ExchangeRates; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState<number | null>(null);
  const [rates, setRates] = useState<ExchangeRates>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const popularCurrencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  ];

  const fetchRates = useCallback(async (signal?: AbortSignal) => {
    // Check cache first
    const cached = ratesCache.get(fromCurrency);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setRates(cached.rates);
      setLastUpdated(new Date(cached.timestamp));
      if (amount) {
        const convertedAmount = parseFloat(amount) * cached.rates[toCurrency];
        setResult(convertedAmount);
      }
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`,
        { signal }
      );
      if (!response.ok) throw new Error(`API returned ${response.status}`);
      const data = await response.json();
      // Update cache
      ratesCache.set(fromCurrency, { rates: data.rates, timestamp: Date.now() });
      setRates(data.rates);
      setLastUpdated(new Date());
      
      // Auto-convert
      if (amount) {
        const convertedAmount = parseFloat(amount) * data.rates[toCurrency];
        setResult(convertedAmount);
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      const msg = err instanceof Error ? err.message : 'Failed to fetch exchange rates';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [fromCurrency, toCurrency, amount]);

  useEffect(() => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    fetchRates(controller.signal);
    return () => { controller.abort(); };
  }, [fetchRates]);

  const convert = () => {
    if (rates[toCurrency] && amount) {
      const convertedAmount = parseFloat(amount) * rates[toCurrency];
      setResult(convertedAmount);
    }
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    if (result) {
      setAmount(result.toString());
      setResult(parseFloat(amount));
    }
  };

  const fromCurrencyInfo = popularCurrencies.find(c => c.code === fromCurrency);
  const toCurrencyInfo = popularCurrencies.find(c => c.code === toCurrency);
  const exchangeRate = rates[toCurrency];

  return (
    <div className="space-y-6">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <DollarSign className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-200">
            <strong>Real-time currency conversion:</strong> Convert between 150+ world currencies
            using live exchange rates updated daily.
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-200">
            <strong>Error:</strong> {error}. Please try again or check your connection.
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
        {/* From Currency */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="100"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">From</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {popularCurrencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.flag} {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <button
          onClick={swapCurrencies}
          className="mb-3 p-3 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
          title="Swap currencies"
        >
          <ArrowRightLeft className="w-5 h-5" />
        </button>

        {/* To Currency */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-2">Result</label>
            <div className="bg-zinc-900 text-white p-3 rounded-lg border border-zinc-700 h-[52px] flex items-center font-mono text-lg">
              {result !== null ? result.toFixed(2) : '0.00'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">To</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {popularCurrencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.flag} {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={convert}
          disabled={loading}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <TrendingUp className="w-5 h-5" />
          Convert
        </button>
        <button
          onClick={() => {
            ratesCache.delete(fromCurrency);
            fetchRates();
          }}
          disabled={loading}
          className="px-4 py-3 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 text-white rounded-lg transition-colors"
          title="Refresh rates"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {exchangeRate && (
        <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-blue-500/30 rounded-lg p-6">
          <div className="text-center">
            <div className="text-sm text-gray-300 mb-2">Exchange Rate</div>
            <div className="text-3xl font-bold text-white mb-2">
              1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
            </div>
            {fromCurrencyInfo && toCurrencyInfo && (
              <div className="text-sm text-gray-400">
                {fromCurrencyInfo.symbol}1 {fromCurrencyInfo.name} = {toCurrencyInfo.symbol}
                {exchangeRate.toFixed(2)} {toCurrencyInfo.name}
              </div>
            )}
          </div>
          {lastUpdated && (
            <div className="text-xs text-gray-500 text-center mt-4">
              Last updated: {lastUpdated.toLocaleString()}
            </div>
          )}
        </div>
      )}

      {/* Popular Conversions */}
      {Object.keys(rates).length > 0 && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
          <h3 className="font-semibold mb-3">Quick Conversions (1 {fromCurrency})</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {popularCurrencies.filter(c => c.code !== fromCurrency).slice(0, 6).map((currency) => (
              <div
                key={currency.code}
                className="bg-zinc-800/50 rounded-lg p-3 hover:bg-zinc-800 transition-colors cursor-pointer"
                onClick={() => setToCurrency(currency.code)}
              >
                <div className="text-sm text-gray-400">{currency.flag} {currency.code}</div>
                <div className="text-lg font-mono">
                  {currency.symbol}{rates[currency.code]?.toFixed(2) || 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
