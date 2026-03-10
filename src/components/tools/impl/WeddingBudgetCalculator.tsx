'use client';
import { useState, useCallback, memo } from 'react';
import { Heart, AlertCircle } from 'lucide-react';

interface BudgetCategory {
  name: string;
  percentage: number;
  amount: number;
  icon: string;
  subcategories: string[];
}

const defaultCategories: BudgetCategory[] = [
  { name: 'Venue & Catering', percentage: 45, amount: 0, icon: '🏛️', subcategories: ['Venue rental', 'Catering', 'Bar/drinks', 'Cake', 'Rentals'] },
  { name: 'Photography & Video', percentage: 12, amount: 0, icon: '📸', subcategories: ['Photographer', 'Videographer', 'Photo booth'] },
  { name: 'Music & Entertainment', percentage: 8, amount: 0, icon: '🎵', subcategories: ['DJ/Band', 'Ceremony music', 'Other entertainment'] },
  { name: 'Flowers & Decor', percentage: 8, amount: 0, icon: '💐', subcategories: ['Centerpieces', 'Bouquets', 'Ceremony decor', 'Lighting'] },
  { name: 'Attire & Beauty', percentage: 8, amount: 0, icon: '👗', subcategories: ['Wedding dress', 'Suit/tux', 'Alterations', 'Hair/makeup'] },
  { name: 'Invitations & Stationery', percentage: 3, amount: 0, icon: '💌', subcategories: ['Save the dates', 'Invitations', 'Programs', 'Thank you cards'] },
  { name: 'Officiant & Ceremony', percentage: 2, amount: 0, icon: '💍', subcategories: ['Officiant fee', 'Marriage license', 'Ceremony items'] },
  { name: 'Favors & Gifts', percentage: 3, amount: 0, icon: '🎁', subcategories: ['Guest favors', 'Wedding party gifts', 'Parent gifts'] },
  { name: 'Transportation', percentage: 3, amount: 0, icon: '🚗', subcategories: ['Limo/car service', 'Guest shuttles', 'Parking'] },
  { name: 'Miscellaneous', percentage: 8, amount: 0, icon: '📦', subcategories: ['Tips', 'Emergency fund', 'Unexpected costs'] },
];

function WeddingBudgetCalculator() {
  const [totalBudget, setTotalBudget] = useState(30000);
  const [guestCount, setGuestCount] = useState(100);
  const [currency, setCurrency] = useState('$');
  const [customAllocations, setCustomAllocations] = useState<Record<string, number>>({});

  const calculateBudget = useCallback(() => {
    const categories = defaultCategories.map(cat => {
      const customPercent = customAllocations[cat.name];
      const percentage = customPercent !== undefined ? customPercent : cat.percentage;
      return {
        ...cat,
        percentage,
        amount: (totalBudget * percentage) / 100,
      };
    });

    const totalAllocated = categories.reduce((sum, cat) => sum + cat.percentage, 0);
    const perGuestCost = totalBudget / guestCount;

    return {
      categories,
      totalAllocated,
      perGuestCost,
      remaining: totalBudget * (100 - totalAllocated) / 100,
    };
  }, [totalBudget, guestCount, customAllocations]);

  const results = calculateBudget();
  const formatMoney = (amount: number) => `${currency}${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

  const updateAllocation = (name: string, value: number) => {
    setCustomAllocations(prev => ({ ...prev, [name]: value }));
  };

  const resetAllocations = () => {
    setCustomAllocations({});
  };

  const budgetPresets = [
    { name: 'Budget', amount: 10000 },
    { name: 'Moderate', amount: 25000 },
    { name: 'Mid-Range', amount: 35000 },
    { name: 'Premium', amount: 50000 },
    { name: 'Luxury', amount: 75000 },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-pink-900/20 border border-pink-500/30 rounded-lg p-4 text-sm text-pink-200">
        <Heart className="w-4 h-4 inline mr-2" />
        <strong>Wedding Budget Calculator:</strong> Plan your wedding expenses with recommended allocations. Customize percentages based on your priorities.
      </div>

      {/* Budget Input */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Total Budget</label>
            <div className="flex">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-zinc-800 text-white p-2 rounded-l border border-zinc-700"
              >
                <option value="$">$</option>
                <option value="€">€</option>
                <option value="£">£</option>
                <option value="₹">₹</option>
              </select>
              <input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(parseInt(e.target.value) || 0)}
                className="flex-1 bg-zinc-800 text-white p-2 rounded-r border border-zinc-700"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Guest Count</label>
            <input
              type="number"
              value={guestCount}
              onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
              min={1}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Quick Presets</label>
            <select
              onChange={(e) => setTotalBudget(parseInt(e.target.value))}
              value={totalBudget}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            >
              {budgetPresets.map(preset => (
                <option key={preset.name} value={preset.amount}>
                  {preset.name} ({currency}{preset.amount.toLocaleString()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-4 pt-4 border-t border-zinc-700 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-zinc-500">Per Guest</div>
            <div className="text-lg font-semibold text-white">{formatMoney(results.perGuestCost)}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500">Allocated</div>
            <div className={`text-lg font-semibold ${
              results.totalAllocated === 100 ? 'text-green-400' : 'text-orange-400'
            }`}>
              {results.totalAllocated}%
            </div>
          </div>
          <div>
            <button
              onClick={resetAllocations}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Reset to Default
            </button>
          </div>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="space-y-2">
        {results.categories.map((category, idx) => (
          <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{category.icon}</span>
                <span className="text-zinc-300 font-medium">{category.name}</span>
              </div>
              <div className="text-xl font-bold text-white">{formatMoney(category.amount)}</div>
            </div>
            
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={0}
                max={60}
                value={category.percentage}
                onChange={(e) => updateAllocation(category.name, parseInt(e.target.value))}
                className="flex-1 accent-pink-500"
              />
              <div className="w-16 text-right">
                <input
                  type="number"
                  value={category.percentage}
                  onChange={(e) => updateAllocation(category.name, parseInt(e.target.value) || 0)}
                  min={0}
                  max={100}
                  className="w-12 bg-zinc-800 text-white p-1 rounded border border-zinc-700 text-sm text-center"
                />
                <span className="text-zinc-500 ml-1">%</span>
              </div>
            </div>
            
            <div className="mt-2 text-xs text-zinc-500">
              {category.subcategories.join(' • ')}
            </div>
          </div>
        ))}
      </div>

      {/* Allocation Warning */}
      {results.totalAllocated !== 100 && (
        <div className={`rounded-lg p-4 flex items-start gap-2 ${
          results.totalAllocated > 100
            ? 'bg-red-900/20 border border-red-500/30'
            : 'bg-yellow-900/20 border border-yellow-500/30'
        }`}>
          <AlertCircle className={`w-4 h-4 mt-0.5 ${
            results.totalAllocated > 100 ? 'text-red-400' : 'text-yellow-400'
          }`} />
          <div className="text-sm">
            {results.totalAllocated > 100 ? (
              <span className="text-red-200">You&apos;ve allocated {results.totalAllocated}% - that&apos;s {results.totalAllocated - 100}% over budget!</span>
            ) : (
              <span className="text-yellow-200">You have {100 - results.totalAllocated}% ({formatMoney(results.remaining)}) unallocated</span>
            )}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-400">
        <strong className="text-zinc-300">💡 Budget Tips:</strong>
        <ul className="mt-1 space-y-1">
          <li>• Keep 5-10% as a buffer for unexpected costs</li>
          <li>• Venue + catering is typically the largest expense</li>
          <li>• Off-season and weekday weddings can save 20-40%</li>
          <li>• Prioritize what matters most to you as a couple</li>
          <li>• Get at least 3 quotes for each vendor</li>
        </ul>
      </div>
    </div>
  );
}

export default memo(WeddingBudgetCalculator);
