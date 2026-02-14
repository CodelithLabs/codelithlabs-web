// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/tools/page.tsx
// Production-Grade Tools Directory with Advanced Search & Filtering
// ═══════════════════════════════════════════════════════════════════════════
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, X, Zap } from 'lucide-react';
import { TOOLS_REGISTRY, getCategoryStats } from '@/lib/tools-registry';
import { AdBanner } from '@/components/tools/ToolLayout';

export default function ToolsPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Debounce search query (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Get category stats
  const categoryStats = useMemo(() => getCategoryStats(), []);

  // Quick filters - top categories
  const quickCategories = [
    { id: 'all', name: 'All Tools', count: TOOLS_REGISTRY.length },
    { id: 'text', name: 'Text', count: categoryStats['text'] || 0 },
    { id: 'image', name: 'Image', count: categoryStats['image'] || 0 },
    { id: 'developer', name: 'Developer', count: categoryStats['developer'] || 0 },
    { id: 'generator', name: 'Generator', count: categoryStats['generator'] || 0 },
    { id: 'converter', name: 'Converter', count: categoryStats['converter'] || 0 },
  ];

  // Filter logic with memoization
  const filteredTools = useMemo(() => {
    return TOOLS_REGISTRY.filter((tool) => {
      // Category filter
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;

      // Search filter (name, description, keywords)
      const lowercaseQuery = debouncedQuery.toLowerCase();
      const matchesSearch =
        debouncedQuery === '' ||
        tool.name.toLowerCase().includes(lowercaseQuery) ||
        tool.description.toLowerCase().includes(lowercaseQuery) ||
        tool.keywords.some(k => k.toLowerCase().includes(lowercaseQuery));

      return matchesCategory && matchesSearch;
    });
  }, [debouncedQuery, selectedCategory]);

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setDebouncedQuery('');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* ═══════════════════════════════════════════════════════════
            HEADER
        ═══════════════════════════════════════════════════════════ */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Free Online Tools Directory
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            {TOOLS_REGISTRY.length}+ fast, secure tools running entirely in your browser.
            No upload, no server processing.
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            SEARCH BAR
        ═══════════════════════════════════════════════════════════ */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search tools (e.g., JSON, Image, Password)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-12 pr-12 py-4
                       text-white placeholder-zinc-500
                       focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                       transition-all text-lg"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-800
                         rounded-full transition-colors"
                aria-label="Clear search"
              >
                <X className="w-5 h-5 text-zinc-500 hover:text-white" />
              </button>
            )}
          </div>

          {/* Search Results Count */}
          {debouncedQuery && (
            <p className="text-sm text-zinc-500 mt-2 text-center">
              Found {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} matching "{debouncedQuery}"
            </p>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════
            CATEGORY FILTER PILLS
        ═══════════════════════════════════════════════════════════ */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {quickCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize
                       transition-all flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
              }`}
            >
              {cat.name}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                selectedCategory === cat.id
                  ? 'bg-blue-500'
                  : 'bg-zinc-700'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════
            TOP AD BANNER
        ═══════════════════════════════════════════════════════════ */}
        <AdBanner slot="tools-directory-top" className="mb-12" />

        {/* ═══════════════════════════════════════════════════════════
            TOOLS GRID
        ═══════════════════════════════════════════════════════════ */}
        {filteredTools.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredTools.map((tool, index) => (
                <div key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="group block bg-zinc-900/50 border border-zinc-800 rounded-xl p-6
                             hover:bg-zinc-900 hover:border-blue-500/50 transition-all h-full"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400
                                     text-xs font-medium uppercase tracking-wider">
                        {tool.category}
                      </span>
                      {tool.processingType === 'client' && (
                        <span className="flex items-center gap-1 text-green-400 text-xs">
                          <Zap className="w-3 h-3" />
                          Client-Side
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400
                                 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-zinc-400 text-sm line-clamp-2 leading-relaxed">
                      {tool.description}
                    </p>
                  </Link>

                  {/* Strategic Ad Placement - Every 6th tool */}
                  {(index + 1) % 6 === 0 && index !== filteredTools.length - 1 && (
                    <div className="mt-6">
                      <AdBanner
                        slot={`tools-grid-${Math.floor((index + 1) / 6)}`}
                        format="rectangle"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Ad Banner */}
            <AdBanner slot="tools-directory-bottom" className="mt-12" />
          </>
        ) : (
          // ═══════════════════════════════════════════════════════════
          // NO RESULTS STATE
          // ═══════════════════════════════════════════════════════════
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              {/* Empty State Icon */}
              <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center
                            mx-auto mb-6">
                <Search className="w-10 h-10 text-zinc-600" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-3">
                No Tools Found
              </h2>

              <p className="text-zinc-400 mb-6">
                We couldn't find any tools matching{' '}
                <span className="text-blue-400 font-medium">"{debouncedQuery}"</span>
                {selectedCategory !== 'all' && (
                  <>
                    {' '}in the <span className="text-blue-400 font-medium capitalize">{selectedCategory}</span> category
                  </>
                )}
                .
              </p>

              {/* Suggestions */}
              <div className="space-y-3">
                <p className="text-sm text-zinc-500">Try:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {selectedCategory !== 'all' && (
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm
                               font-medium rounded-lg transition-colors"
                    >
                      Show All Categories
                    </button>
                  )}
                  {query && (
                    <button
                      onClick={clearSearch}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm
                               font-medium rounded-lg transition-colors"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              </div>

              {/* Popular Searches */}
              <div className="mt-8 pt-8 border-t border-zinc-800">
                <p className="text-sm text-zinc-500 mb-3">Popular Searches:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['JSON', 'Image', 'Password', 'Base64', 'Hash'].map(term => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300
                               text-xs rounded-full transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            FOOTER INFO
        ═══════════════════════════════════════════════════════════ */}
        <div className="mt-16 pt-8 border-t border-zinc-800 text-center">
          <p className="text-zinc-500 text-sm">
            All tools process data locally in your browser for maximum privacy and security.
          </p>
        </div>

      </div>
    </div>
  );
}
