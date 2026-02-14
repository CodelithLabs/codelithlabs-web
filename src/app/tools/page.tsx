// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/tools/page.tsx
// Tools directory/listing page with category filtering and search
// ═══════════════════════════════════════════════════════════════════════════

import { Metadata } from 'next';
import Link from 'next/link';
import { TOOLS_REGISTRY, getToolsByCategory, getCategoryStats } from '@/lib/tools-registry';
import { TOOL_CATEGORIES, ToolCategory } from '@/types/tool';
import { AdBanner } from '@/components/tools/ToolLayout';

export const metadata: Metadata = {
  title: 'Free Online Tools - 199+ Web Utilities | CodelithLabs',
  description: 'Discover 199+ free online tools for developers, designers, and everyone. Text tools, image converters, calculators, encoders, and more.',
  keywords: 'online tools, free tools, web utilities, converter, calculator, generator, encoder, developer tools',
};

// ═══════════════════════════════════════════════════════════════════════════
// CATEGORY CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function CategoryCard({ category, count }: { category: ToolCategory; count: number }) {
  const info = TOOL_CATEGORIES[category];
  
  return (
    <Link
      href={`/tools?category=${category}`}
      className="group bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 
                 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all
                 flex flex-col"
    >
      <div 
        className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 
                   transition-transform group-hover:scale-110"
        style={{ backgroundColor: `${info.color}20` }}
      >
        <span className="text-2xl" style={{ color: info.color }}>
          {/* Icon placeholder - use lucide-react in actual implementation */}
          {category === 'text' && '📝'}
          {category === 'image' && '🖼️'}
          {category === 'developer' && '💻'}
          {category === 'converter' && '🔄'}
          {category === 'calculator' && '🔢'}
          {category === 'generator' && '✨'}
          {category === 'formatter' && '📐'}
          {category === 'encoder' && '🔐'}
          {category === 'security' && '🛡️'}
          {category === 'seo' && '🔍'}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">{info.name}</h3>
      <p className="text-zinc-500 text-sm mb-3 flex-1">{info.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-600">{count} tools</span>
        <span className="text-xs text-blue-400 group-hover:translate-x-1 transition-transform">
          Browse →
        </span>
      </div>
    </Link>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TOOL CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function ToolCard({ tool }: { tool: typeof TOOLS_REGISTRY[0] }) {
  const category = TOOL_CATEGORIES[tool.category];
  
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-4
                 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors">
          {tool.name}
        </h3>
        <span 
          className="text-[10px] px-2 py-0.5 rounded-full"
          style={{ backgroundColor: `${category.color}20`, color: category.color }}
        >
          {category.name}
        </span>
      </div>
      <p className="text-zinc-500 text-sm line-clamp-2">{tool.description}</p>
    </Link>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SEARCH COMPONENT (Client-side)
// ═══════════════════════════════════════════════════════════════════════════

function SearchBox() {
  return (
    <div className="relative max-w-xl mx-auto mb-8">
      <input
        type="text"
        placeholder="Search 199+ tools... (e.g., JSON, Base64, Calculator)"
        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-5 py-4 
                   text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500
                   focus:ring-2 focus:ring-blue-500/20 transition-all"
      />
      <kbd className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-600 
                      bg-zinc-800 px-2 py-1 rounded border border-zinc-700">
        ⌘K
      </kbd>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════

interface PageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function ToolsPage({ searchParams }: PageProps) {
  const { category, q } = await searchParams;
  const stats = getCategoryStats();
  const categories = Object.keys(TOOL_CATEGORIES) as ToolCategory[];
  
  // Filter tools based on query params
  let filteredTools = TOOLS_REGISTRY;
  if (category && categories.includes(category as ToolCategory)) {
    filteredTools = getToolsByCategory(category);
  }
  if (q) {
    const query = q.toLowerCase();
    filteredTools = filteredTools.filter(
      tool => 
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.keywords.some(k => k.toLowerCase().includes(query))
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Page Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            🛠️ Free Online Tools
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            199+ powerful web utilities for developers, designers, and everyone. 
            All tools run in your browser — fast, free, and private.
          </p>
          <div className="flex justify-center gap-4 mt-4 text-sm">
            <span className="text-green-400">✓ No Registration</span>
            <span className="text-green-400">✓ 100% Free</span>
            <span className="text-green-400">✓ Privacy First</span>
          </div>
        </header>

        {/* Search */}
        <SearchBox />

        {/* Top Ad Banner */}
        <div className="mb-8">
          <AdBanner slot="tools-listing-top" format="horizontal" />
        </div>

        {/* Category Grid */}
        {!category && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Browse by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map(cat => (
                <CategoryCard key={cat} category={cat} count={stats[cat] || 0} />
              ))}
            </div>
          </section>
        )}

        {/* Category Header (when filtered) */}
        {category && (
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Link href="/tools" className="text-blue-400 text-sm hover:underline mb-2 inline-block">
                ← All Categories
              </Link>
              <h2 className="text-2xl font-semibold text-white">
                {TOOL_CATEGORIES[category as ToolCategory]?.name || 'Tools'}
              </h2>
            </div>
            <span className="text-zinc-500">{filteredTools.length} tools</span>
          </div>
        )}

        {/* Tools Grid */}
        <section>
          {!category && <h2 className="text-2xl font-semibold text-white mb-6">All Tools</h2>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map(tool => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>

        {/* Bottom Ad Banner */}
        <div className="mt-8">
          <AdBanner slot="tools-listing-bottom" format="horizontal" />
        </div>

      </div>
    </div>
  );
}
