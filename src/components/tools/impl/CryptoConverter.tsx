// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/tools/impl/CryptoConverter.tsx
// Cryptocurrency Converter - Real-time crypto price conversion
// Uses CoinGecko API for live prices
// ═══════════════════════════════════════════════════════════════════════════
'use client';

import { useState, useEffect } from 'react';
import { Bitcoin, RefreshCw, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export default function CryptoConverter() {
  const [amount, setAmount] = useState('1');
  const [fromCrypto, setFromCrypto] = useState('bitcoin');
  const [toCurrency, setToCurrency] = useState('usd');
  const [result, setResult] = useState<number | null>(null);
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const currencies = [
    { code: 'usd', name: 'US Dollar', symbol: '$' },
    { code: 'eur', name: 'Euro', symbol: '€' },
    { code: 'gbp', name: 'British Pound', symbol: '£' },
    { code: 'inr', name: 'Indian Rupee', symbol: '₹' },
    { code: 'jpy', name: 'Japanese Yen', symbol: '¥' },
  ];

  const fetchCryptoPrices = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${toCurrency}&order=market_cap_desc&per_page=10&page=1&sparkline=false`
      );
      const data = await response.json();
      setCryptoPrices(data);
      setLastUpdated(new Date());
      
      // Auto-calculate if amount is set
      const selectedCrypto = data.find((c: CryptoPrice) => c.id === fromCrypto);
      if (selectedCrypto && amount) {
        setResult(parseFloat(amount) * selectedCrypto.current_price);
      }
    } catch (error: unknown) {
      console.error('Error fetching crypto prices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoPrices();
  }, [toCurrency]);

  const convert = () => {
    const selectedCrypto = cryptoPrices.find(c => c.id === fromCrypto);
    if (selectedCrypto && amount) {
      setResult(parseFloat(amount) * selectedCrypto.current_price);
    }
  };

  const selectedCrypto = cryptoPrices.find(c => c.id === fromCrypto);
  const selectedCurrency = currencies.find(c => c.code === toCurrency);

  return (
    <div className="space-y-6">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Bitcoin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-200">
            <strong>Live Crypto Prices:</strong> Convert cryptocurrency to fiat currency using
            real-time market data from CoinGecko API. Prices update automatically.
          </div>
        </div>
      </div>

      {/* Amount Input */}
      <div>
        <label className="block text-sm font-medium mb-2">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          step="0.00000001"
          min="0"
        />
      </div>

      {/* Crypto Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">From Cryptocurrency</label>
        <select
          value={fromCrypto}
          onChange={(e) => setFromCrypto(e.target.value)}
          className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          {cryptoPrices.map((crypto) => (
            <option key={crypto.id} value={crypto.id}>
              {crypto.name} ({crypto.symbol.toUpperCase()}) - {selectedCurrency?.symbol}
              {crypto.current_price.toLocaleString()}
            </option>
          ))}
        </select>
      </div>

      {/* Currency Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">To Currency</label>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          {currencies.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.name} ({currency.symbol})
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3">
        <button
          onClick={convert}
          disabled={loading}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <DollarSign className="w-5 h-5" />
          Convert
        </button>
        <button
          onClick={fetchCryptoPrices}
          disabled={loading}
          className="px-4 py-3 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 text-white rounded-lg transition-colors"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {result !== null && selectedCrypto && selectedCurrency && (
        <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-blue-500/30 rounded-lg p-6">
          <div className="text-center mb-4">
            <div className="text-gray-400 mb-2">
              {amount} {selectedCrypto.symbol.toUpperCase()} =
            </div>
            <div className="text-4xl font-bold text-white">
              {selectedCurrency.symbol}{result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-gray-400 mt-2">
              {selectedCurrency.name}
            </div>
          </div>

          {selectedCrypto && (
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-gray-400">24h Change:</span>
              {selectedCrypto.price_change_percentage_24h >= 0 ? (
                <span className="flex items-center gap-1 text-green-500">
                  <TrendingUp className="w-4 h-4" />
                  +{selectedCrypto.price_change_percentage_24h.toFixed(2)}%
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-500">
                  <TrendingDown className="w-4 h-4" />
                  {selectedCrypto.price_change_percentage_24h.toFixed(2)}%
                </span>
              )}
            </div>
          )}

          {lastUpdated && (
            <div className="text-xs text-gray-500 text-center mt-4">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>
      )}

      {/* Price Table */}
      {cryptoPrices.length > 0 && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-zinc-800">
            <h3 className="font-semibold">Top Cryptocurrencies</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-800/50">
                <tr className="text-left text-sm text-gray-400">
                  <th className="p-3">Coin</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">24h %</th>
                </tr>
              </thead>
              <tbody>
                {cryptoPrices.slice(0, 5).map((crypto) => (
                  <tr key={crypto.id} className="border-t border-zinc-800/50 hover:bg-zinc-800/30">
                    <td className="p-3">
                      <div className="font-medium">{crypto.name}</div>
                      <div className="text-sm text-gray-500">{crypto.symbol.toUpperCase()}</div>
                    </td>
                    <td className="p-3 text-right font-mono">
                      {selectedCurrency?.symbol}{crypto.current_price.toLocaleString()}
                    </td>
                    <td className="p-3 text-right">
                      <span className={crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                        {crypto.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
