// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/tools/page.tsx
// V2.0 — Searchable, Categorized R&D Utility Hub
// ═══════════════════════════════════════════════════════════════════════════
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { TOOLS_REGISTRY, getToolsByCategory } from '@/lib/tools-registry';
import { TOOL_CATEGORIES, ToolCategory } from '@/types/tool';
import { ToolCard } from '@/components/tools/ToolCard';
import { motion, AnimatePresence } from 'framer-motion';
import { ToolsLeaderboard } from '@/components/ads/ToolsIndexAd';

// ═══════════════════════════════════════════════════════════════════════════
// CATEGORY GROUPINGS — Display-level mapping for the mega-hub
// ═══════════════════════════════════════════════════════════════════════════

interface CategoryGroup {
  id: string;
  name: string;
  description: string;
  categories: ToolCategory[];
  color: string;
}

const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: "developer",
    name: "Developer Utilities",
    description: "JSON, Regex, JWT, code formatting & developer essentials",
    categories: ["developer", "formatter"],
    color: "#8B5CF6",
  },
  {
    id: "security",
    name: "Cryptography & Security",
    description: "Hash generators, password tools, encoders & decoders",
    categories: ["security", "encoder"],
    color: "#F97316",
  },
  {
    id: "image",
    name: "Image Processing",
    description: "Compress, convert, resize, crop & edit images",
    categories: ["image"],
    color: "#10B981",
  },
  {
    id: "text",
    name: "Text & Content",
    description: "Text manipulation, AI writing tools & content utilities",
    categories: ["text", "ai"],
    color: "#3B82F6",
  },
  {
    id: "finance",
    name: "Financial Calculators",
    description: "Mortgage, investment, tax & financial planning tools",
    categories: ["finance", "calculator"],
    color: "#EF4444",
  },
  {
    id: "fintech",
    name: "Fintech & Compliance",
    description: "GST, VAT, PPF, NPS, ROI and compliance-focused calculators",
    categories: ["fintech"],
    color: "#34D399",
  },
  {
    id: "generator",
    name: "Generators",
    description: "Password, QR code, UUID, Lorem Ipsum & more",
    categories: ["generator"],
    color: "#EC4899",
  },
  {
    id: "converter",
    name: "Converters",
    description: "File format, unit & data structure conversions",
    categories: ["converter"],
    color: "#F59E0B",
  },
  {
    id: "seo-web",
    name: "SEO & Web",
    description: "Meta tag generators, analyzers & geographic tools",
    categories: ["seo", "geo"],
    color: "#6366F1",
  },
  {
    id: "local-seo",
    name: "Local SEO Growth",
    description: "Schema, citations, reviews, NAP consistency and local ranking tools",
    categories: ["local-seo"],
    color: "#FB923C",
  },
  {
    id: "ai-repurpose",
    name: "AI Repurposing",
    description: "Turn long content into posts, threads, FAQs, and campaign assets",
    categories: ["ai-repurpose"],
    color: "#F472B6",
  },
  {
    id: "niche-calculators",
    name: "Niche Calculators",
    description: "Lifestyle, home, planning and specialized calculators",
    categories: ["niche-calculator"],
    color: "#A78BFA",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function ToolsPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  // Debounce search query (300ms)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Grouped tools for categorized view (deduplicated by slug)
  const groupedTools = useMemo(() => {
    return CATEGORY_GROUPS.map((group) => {
      const seen = new Set<string>();
      const tools = group.categories
        .flatMap((cat) => getToolsByCategory(cat))
        .filter((t) => { if (seen.has(t.slug)) return false; seen.add(t.slug); return true; });
      return { ...group, tools };
    }).filter((g) => g.tools.length > 0);
  }, []);

  // Flat filtered results for search mode (deduplicated by slug)
  const searchResults = useMemo(() => {
    if (!debouncedQuery) return [];
    const q = debouncedQuery.toLowerCase();
    const seen = new Set<string>();
    return TOOLS_REGISTRY.filter(
      (tool) =>
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.keywords.some((k) => k.toLowerCase().includes(q))
    ).filter((t) => { if (seen.has(t.slug)) return false; seen.add(t.slug); return true; });
  }, [debouncedQuery]);

  const isSearching = debouncedQuery.length > 0;

  const categoryCards = useMemo(() => {
    return Object.entries(TOOL_CATEGORIES)
      .map(([id, meta]) => ({
        id,
        name: meta.name,
        color: meta.color,
        count: getToolsByCategory(id).length,
      }))
      .filter((cat) => cat.count > 0)
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, []);

  const toggleGroup = (id: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* ── HEADER ── */}
      <section className="relative pt-28 pb-6 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute inset-0 bg-glow-radial opacity-30" />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Developer Tools Hub
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            {TOOLS_REGISTRY.length}+ fast, secure tools running entirely in your browser.
            No uploads, no server processing, no tracking.
          </p>
        </div>
      </section>

      {/* ── AD: Leaderboard ── */}
      <ToolsLeaderboard />

      {/* ── STICKY SEARCH BAR ── */}
      <div className="sticky top-16 z-30 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search tools (e.g., JSON, Image, Password, Hash)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-surface border border-white/[0.08] rounded-xl pl-12 pr-12 py-3.5
                       text-white placeholder-zinc-500 text-base
                       focus:outline-none focus:border-glow-blue/50 focus:ring-2 focus:ring-glow-blue/20
                       transition-all"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setDebouncedQuery(''); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/[0.06] rounded-full transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-zinc-500" />
              </button>
            )}
          </div>
          {isSearching && (
            <p className="text-xs text-zinc-500 mt-2 font-mono">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for &quot;{debouncedQuery}&quot;
            </p>
          )}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* ── CATEGORY QUICK NAV ── */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Browse by Category</h2>
            <Link href="/tools" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {categoryCards.map((cat) => (
              <Link
                key={cat.id}
                href={`/tools/category/${cat.id}`}
                className="p-3 rounded-lg border border-zinc-800 bg-zinc-900/40 hover:border-zinc-600 transition-all"
              >
                <div className="text-sm font-medium" style={{ color: cat.color }}>
                  {cat.name}
                </div>
                <p className="text-xs text-zinc-500 mt-1">{cat.count} tools</p>
              </Link>
            ))}
          </div>
        </section>

        {isSearching ? (
          /* ═══════════════════════════════════════
             SEARCH RESULTS MODE
          ═══════════════════════════════════════ */
          searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((tool, i) => (
                <ToolCard key={tool.slug} tool={tool} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-zinc-600" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">No Tools Found</h2>
              <p className="text-zinc-400 text-sm mb-6">
                No tools match &quot;{debouncedQuery}&quot;. Try a different keyword.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['JSON', 'Image', 'Password', 'Base64', 'Hash', 'CSV'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-zinc-300 text-xs rounded-lg font-mono transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )
        ) : (
          /* ═══════════════════════════════════════
             CATEGORIZED VIEW
          ═══════════════════════════════════════ */
          <div className="space-y-12">
            {groupedTools.map((group) => {
              const isCollapsed = collapsedGroups.has(group.id);
              return (
                <section key={group.id}>
                  {/* Category Header */}
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center justify-between mb-5 group/header"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-1 h-8 rounded-full"
                        style={{ backgroundColor: group.color }}
                      />
                      <div className="text-left">
                        <h2 className="text-xl font-bold text-white group-hover/header:text-glow-blue transition-colors">
                          {group.name}
                          <span className="ml-2 text-sm font-normal text-zinc-500">
                            ({group.tools.length})
                          </span>
                        </h2>
                        <p className="text-xs text-zinc-500 mt-0.5">{group.description}</p>
                      </div>
                    </div>
                    <div className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors text-zinc-500">
                      {isCollapsed ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronUp className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  {/* Tool Cards Grid */}
                  <AnimatePresence initial={false}>
                    {!isCollapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {group.tools.map((tool, i) => (
                            <ToolCard key={tool.slug} tool={tool} index={i} animate={false} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </section>
              );
            })}
          </div>
        )}

        {/* ── FOOTER NOTE ── */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] text-center">
          <p className="text-zinc-500 text-sm font-mono">
            All tools process data locally in your browser — zero server storage.
          </p>
        </div>
      </div>
    </div>
  );
}
