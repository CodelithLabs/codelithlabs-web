// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/tools/ToolLayout.tsx
// Reusable layout component with AdSense-optimized placement
// ═══════════════════════════════════════════════════════════════════════════
'use client';

import { ReactNode } from 'react';
import { ToolMeta, TOOL_CATEGORIES } from '@/types/tool';

interface ToolLayoutProps {
  tool: ToolMeta;
  children: ReactNode;
}

// ═══════════════════════════════════════════════════════════════════════════
// ADSENSE COMPONENTS
// Replace data-ad-client and data-ad-slot with your real AdSense values
// ═══════════════════════════════════════════════════════════════════════════

interface AdBannerProps {
  slot: string;
  format?: 'horizontal' | 'vertical' | 'rectangle' | 'auto';
  className?: string;
}

function AdBanner({ slot, format = 'auto', className = '' }: AdBannerProps) {
  const formatStyles = {
    horizontal: 'min-h-[90px] w-full',
    vertical: 'min-h-[600px] w-[160px]',
    rectangle: 'min-h-[250px] w-full max-w-[300px] mx-auto',
    auto: 'min-h-[90px] w-full'
  };

  return (
    <div 
      className={`ad-container bg-zinc-900/30 border border-zinc-800/50 rounded-lg 
                  flex items-center justify-center overflow-hidden ${formatStyles[format]} ${className}`}
    >
      {/* 
        PRODUCTION: Replace this div with real AdSense code:
        
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={slot}
          data-ad-format={format === 'auto' ? 'auto' : undefined}
          data-full-width-responsive="true"
        />
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      */}
      <div className="text-zinc-700 text-xs text-center p-4">
        <div className="border border-dashed border-zinc-700 rounded p-3">
          Ad Space<br />
          <span className="text-zinc-600">{slot}</span>
        </div>
      </div>
    </div>
  );
}

// Sticky sidebar ads for desktop
function SidebarAds({ position }: { position: 'left' | 'right' }) {
  return (
    <aside 
      className="hidden xl:flex flex-col gap-4 w-[160px] flex-shrink-0"
      style={{ position: 'sticky', top: '5rem', height: 'fit-content' }}
    >
      <AdBanner slot={`sidebar-${position}-top`} format="vertical" />
      <AdBanner slot={`sidebar-${position}-bottom`} format="vertical" />
    </aside>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN TOOL LAYOUT
// ═══════════════════════════════════════════════════════════════════════════

export function ToolLayout({ tool, children }: ToolLayoutProps) {
  const category = TOOL_CATEGORIES[tool.category];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* ═══════════════════════════════════════════════════════════════════
          TOP BANNER AD - Full width, above fold
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="w-full max-w-7xl mx-auto px-4 pt-4">
        <AdBanner slot="leaderboard-top" format="horizontal" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          MAIN GRID: LEFT SIDEBAR | CONTENT | RIGHT SIDEBAR
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        
        {/* LEFT SIDEBAR - Desktop only */}
        <SidebarAds position="left" />

        {/* ═══════════════════════════════════════════════════════════════
            MAIN CONTENT AREA
        ═══════════════════════════════════════════════════════════════ */}
        <main className="flex-1 min-w-0 max-w-4xl">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-4 overflow-x-auto">
            <a href="/" className="hover:text-zinc-300 transition whitespace-nowrap">Home</a>
            <span className="text-zinc-700">/</span>
            <a href="/tools" className="hover:text-zinc-300 transition whitespace-nowrap">Tools</a>
            <span className="text-zinc-700">/</span>
            <a 
              href={`/tools?category=${tool.category}`} 
              className="hover:text-zinc-300 transition whitespace-nowrap"
              style={{ color: category.color }}
            >
              {category.name}
            </a>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-300 truncate">{tool.name}</span>
          </nav>

          {/* Tool Header */}
          <header className="mb-6">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span 
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: `${category.color}15`, 
                  color: category.color,
                  border: `1px solid ${category.color}30`
                }}
              >
                {category.name}
              </span>
              <span className="flex items-center gap-1 text-xs text-zinc-500">
                {tool.processingType === 'client' ? (
                  <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Runs in Browser (Private)
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                    Server Processed
                  </>
                )}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{tool.name}</h1>
            <p className="text-zinc-400 text-base sm:text-lg">{tool.description}</p>
          </header>

          {/* ═══════════════════════════════════════════════════════════
              THE TOOL INTERFACE - Primary Focus Area
          ═══════════════════════════════════════════════════════════ */}
          <section 
            className="bg-gradient-to-b from-zinc-900/80 to-zinc-900/40 
                       border border-zinc-800 rounded-xl p-4 sm:p-6 mb-6
                       shadow-xl shadow-black/20"
          >
            {children}
          </section>

          {/* In-Content Ad 1 */}
          <div className="my-6">
            <AdBanner slot="in-content-1" format="rectangle" />
          </div>

          {/* How to Use Section (SEO Content) */}
          <section className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-5 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              How to Use {tool.name}
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-zinc-400 text-sm">
              <li>Enter or paste your data in the input field above</li>
              <li>Configure any options according to your needs</li>
              <li>Click the action button to process your data</li>
              <li>Copy or download your result instantly</li>
            </ol>
          </section>

          {/* Features Section (More SEO Content) */}
          <section className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-5 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Features
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-400 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> 100% Free to Use
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> No Registration Required
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> 
                {tool.processingType === 'client' ? 'Works Offline' : 'Fast Server Processing'}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> 
                {tool.processingType === 'client' ? 'Data Never Leaves Browser' : 'Secure & Encrypted'}
              </li>
            </ul>
          </section>

          {/* Related Keywords/Tags (SEO) */}
          <section className="mb-6">
            <h3 className="text-sm font-medium text-zinc-500 mb-3">Related Topics</h3>
            <div className="flex flex-wrap gap-2">
              {tool.keywords.map(keyword => (
                <span 
                  key={keyword}
                  className="px-3 py-1.5 bg-zinc-800/50 hover:bg-zinc-800 
                           text-zinc-400 text-xs rounded-full cursor-pointer
                           transition-colors border border-zinc-700/50"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </section>

          {/* In-Content Ad 2 */}
          <div className="my-6">
            <AdBanner slot="in-content-2" format="rectangle" />
          </div>

        </main>

        {/* RIGHT SIDEBAR - Desktop only */}
        <SidebarAds position="right" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BOTTOM BANNER AD - Sticky on mobile
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="w-full max-w-7xl mx-auto px-4 pb-4">
        <AdBanner slot="leaderboard-bottom" format="horizontal" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT ADDITIONAL COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

export { AdBanner };
