// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/tools/ToolLayout.tsx
// Reusable layout component with AdSense-optimized placement
// ═══════════════════════════════════════════════════════════════════════════
'use client';

import { ReactNode } from 'react';
import { ToolMeta, TOOL_CATEGORIES } from '@/types/tool';
import { useUser } from '@/lib/user-context';
import { ToolContent } from '@/types/tool-content';
import { SocialProof } from './SocialProof';
import { ShareButtons } from './ShareButtons';
import { FeedbackWidget } from './FeedbackWidget';
import { AdBanner } from '@/components/ads/AdBanner';
import DOMPurify from 'dompurify';

interface ToolLayoutProps {
  tool: ToolMeta;
  children: ReactNode;
  /** Parsed markdown SEO content (optional — falls back to hardcoded defaults) */
  content?: ToolContent | null;
  /** Tool slug used for SocialProof seeding */
  slug?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// ADSENSE COMPONENTS
// AdBanner is now imported from @/components/ads/AdBanner
// ═══════════════════════════════════════════════════════════════════════════

function PremiumCTA() {
  return (
    <div className="bg-zinc-900/60 border border-blue-500/30 rounded-xl p-4 sm:p-5 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-sm text-zinc-300">
          Process faster and ad-free? <span className="text-blue-400 font-medium">Support CodelithLabs.</span>
        </p>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
        >
          Upgrade Support
        </a>
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

export function ToolLayout({ tool, children, content, slug }: ToolLayoutProps) {
  const category = TOOL_CATEGORIES[tool.category];
  const { isPremium } = useUser();

  /** Safely render HTML from markdown through DOMPurify */
  const safeHtml = (html: string) => {
    if (typeof window === 'undefined') return { __html: '' };
    return { __html: DOMPurify.sanitize(html) };
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* ═══════════════════════════════════════════════════════════════════
          PREMIUM UPSELL BAR - Revenue Conversion Bridge
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-50 border-b border-zinc-800/50 backdrop-blur-xl bg-zinc-950/80">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

            {/* Brand Message */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-zinc-400">Built with</span>
              <span className="text-red-500">❤️</span>
              <span className="text-zinc-400">by the</span>
              <a
                href="/team"
                className="font-semibold text-white hover:text-blue-400 transition-colors"
              >
                CodelithLabs Engineering Team
              </a>
            </div>

            {/* Professional CTA */}
            <a
              href="/contact"
              className="group flex items-center gap-2 px-4 py-2 rounded-lg
                       bg-gradient-to-r from-blue-600 to-purple-600
                       hover:from-blue-500 hover:to-purple-500
                       text-white text-sm font-semibold
                       shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40
                       transition-all duration-300 hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Need Custom Infrastructure?
              <span className="hidden sm:inline">Hire Us</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>

          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          TOP BANNER AD - Full width, above fold
      ═══════════════════════════════════════════════════════════════════ */}
      {!isPremium && (
      <div className="w-full max-w-7xl mx-auto px-4 pt-4">
        <AdBanner slot="leaderboard-top" format="horizontal" />
      </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          MAIN GRID: LEFT SIDEBAR | CONTENT | RIGHT SIDEBAR
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        
        {/* LEFT SIDEBAR - Desktop only */}
        {!isPremium && <SidebarAds position="left" />}

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
            {isPremium && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs font-medium text-blue-400">Premium — Ad-Free</span>
              </div>
            )}
          </header>

          {/* Social Proof Trust Signals */}
          {slug && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <SocialProof
                slug={slug}
                dateModified={content?.frontmatter.dateModified ?? null}
              />
              <ShareButtons
                url={`https://codelithlabs.in/tools/${slug}`}
                title={tool.name}
                description={tool.description}
              />
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              THE TOOL INTERFACE - Primary Focus Area
          ═══════════════════════════════════════════════════════════ */}
          <section 
            className="bg-gradient-to-b from-zinc-900/80 to-zinc-900/40 
                       border border-zinc-800 rounded-xl p-4 sm:p-6 mb-6
                       shadow-xl shadow-black/20"
            aria-label={`${tool.name} interface`}
            role="region"
          >
            {children}
          </section>

          {/* Feedback Widget — "Was this tool helpful?" */}
          {slug && <FeedbackWidget toolSlug={slug} toolName={tool.name} />}

          {/* Revenue CTA placed after primary tool interaction */}
          {!isPremium && <PremiumCTA />}

          {/* In-Content Ad 1 */}
          {!isPremium && (
          <div className="my-6">
            <AdBanner slot="in-content-1" format="rectangle" />
          </div>
          )}

          {/* How to Use Section (SEO Content) */}
          <section className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-5 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              How to Use {tool.name}
            </h2>
            {content?.howToUse ? (
              <div
                className="prose prose-invert prose-sm max-w-none text-zinc-400
                           prose-ol:list-decimal prose-ol:pl-5 prose-ul:list-disc prose-ul:pl-5
                           prose-li:my-1 prose-p:my-2"
                dangerouslySetInnerHTML={safeHtml(content.howToUse)}
              />
            ) : (
              <ol className="list-decimal list-inside space-y-2 text-zinc-400 text-sm">
                <li>Enter or paste your data in the input field above</li>
                <li>Configure any options according to your needs</li>
                <li>Click the action button to process your data</li>
                <li>Copy or download your result instantly</li>
              </ol>
            )}
          </section>

          {/* Features Section (More SEO Content) */}
          <section className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-5 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Features
            </h2>
            {content?.features ? (
              <div
                className="prose prose-invert prose-sm max-w-none text-zinc-400
                           prose-ul:list-disc prose-ul:pl-5 prose-li:my-1 prose-p:my-2"
                dangerouslySetInnerHTML={safeHtml(content.features)}
              />
            ) : (
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
            )}
          </section>

          {/* Why Choose — from markdown "## Why Choose" */}
          {content?.whyChoose && (
            <section className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-5 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Why Choose {tool.name}?
              </h2>
              <div
                className="prose prose-invert prose-sm max-w-none text-zinc-400
                           prose-ul:list-disc prose-ul:pl-5 prose-li:my-1 prose-p:my-2"
                dangerouslySetInnerHTML={safeHtml(content.whyChoose)}
              />
            </section>
          )}

          {/* Common Use Cases — from markdown */}
          {content?.commonUseCases && (
            <section className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-5 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Common Use Cases
              </h2>
              <div
                className="prose prose-invert prose-sm max-w-none text-zinc-400
                           prose-ul:list-disc prose-ul:pl-5 prose-li:my-1 prose-p:my-2"
                dangerouslySetInnerHTML={safeHtml(content.commonUseCases)}
              />
            </section>
          )}

          {/* Technical Details — from markdown */}
          {content?.technicalDetails && (
            <section className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-5 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Technical Details
              </h2>
              <div
                className="prose prose-invert prose-sm max-w-none text-zinc-400
                           prose-ul:list-disc prose-ul:pl-5 prose-li:my-1 prose-p:my-2
                           prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded"
                dangerouslySetInnerHTML={safeHtml(content.technicalDetails)}
              />
            </section>
          )}

          {/* Best Practices — from markdown */}
          {content?.bestPractices && (
            <section className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-5 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Best Practices
              </h2>
              <div
                className="prose prose-invert prose-sm max-w-none text-zinc-400
                           prose-ul:list-disc prose-ul:pl-5 prose-li:my-1 prose-p:my-2"
                dangerouslySetInnerHTML={safeHtml(content.bestPractices)}
              />
            </section>
          )}

          {/* FAQ Accordion — from markdown */}
          {content?.faq && content.faq.length > 0 && (
            <section className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-5 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {content.faq.map((entry, i) => (
                  <details
                    key={i}
                    className="group bg-zinc-800/40 border border-zinc-700/50 rounded-lg"
                  >
                    <summary className="flex items-center justify-between cursor-pointer px-4 py-3 text-sm font-medium text-zinc-200 hover:text-white transition-colors">
                      {entry.question}
                      <svg
                        className="w-4 h-4 text-zinc-500 group-open:rotate-180 transition-transform"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div
                      className="px-4 pb-3 text-sm text-zinc-400 prose prose-invert prose-sm max-w-none"
                      dangerouslySetInnerHTML={safeHtml(entry.answer)}
                    />
                  </details>
                ))}
              </div>
            </section>
          )}

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
          {!isPremium && (
          <div className="my-6">
            <AdBanner slot="in-content-2" format="rectangle" />
          </div>
          )}

        </main>

        {/* RIGHT SIDEBAR - Desktop only */}
        {!isPremium && <SidebarAds position="right" />}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BOTTOM BANNER AD - Sticky on mobile
      ═══════════════════════════════════════════════════════════════════ */}
      {!isPremium && (
      <div className="w-full max-w-7xl mx-auto px-4 pb-4">
        <AdBanner slot="leaderboard-bottom" format="horizontal" />
      </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT ADDITIONAL COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

export { AdBanner };
