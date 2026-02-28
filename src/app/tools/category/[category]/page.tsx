// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/tools/category/[category]/page.tsx
// Category landing pages for SEO keyword clustering
// ═══════════════════════════════════════════════════════════════════════════

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { TOOLS_REGISTRY, getAllCategories } from '@/lib/tools-registry';
import { TOOL_CATEGORIES, ToolCategory } from '@/types/tool';

interface PageProps {
  params: Promise<{ category: string }>;
}

// ═══════════════════════════════════════════════════════════════════════════
// STATIC PARAMS - Pre-generate all category routes at build time
// ═══════════════════════════════════════════════════════════════════════════

export async function generateStaticParams() {
  return getAllCategories().map(category => ({ category }));
}

// ═══════════════════════════════════════════════════════════════════════════
// METADATA - Dynamic SEO for each category
// ═══════════════════════════════════════════════════════════════════════════

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryInfo = TOOL_CATEGORIES[category as ToolCategory];
  if (!categoryInfo) return {};

  const tools = TOOLS_REGISTRY.filter(t => t.category === category);

  return {
    title: `Free ${categoryInfo.name} — ${tools.length}+ Online Tools | CodelithLabs`,
    description: `${categoryInfo.description}. ${tools.length}+ free online ${categoryInfo.name.toLowerCase()} with client-side processing. No sign-up required. Privacy-first.`,
    keywords: [
      categoryInfo.name.toLowerCase(),
      'free online tools',
      'client-side processing',
      'privacy-first',
      ...tools.slice(0, 5).map(t => t.name.toLowerCase()),
    ].join(', '),
    openGraph: {
      title: `Free ${categoryInfo.name} — ${tools.length}+ Online Tools`,
      description: `${categoryInfo.description}. ${tools.length}+ free tools with client-side processing.`,
      url: `https://codelithlabs.in/tools/category/${category}`,
      type: 'website',
      siteName: 'CodelithLabs',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Free ${categoryInfo.name} | CodelithLabs`,
      description: `${tools.length}+ free ${categoryInfo.name.toLowerCase()} with privacy-first client-side processing.`,
    },
    alternates: {
      canonical: `https://codelithlabs.in/tools/category/${category}`,
    },
    robots: { index: true, follow: true },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SEO CONTENT MAP - Unique copy per category for indexing
// ═══════════════════════════════════════════════════════════════════════════

const CATEGORY_CONTENT: Record<string, { intro: string; benefits: string[] }> = {
  text: {
    intro: 'CodelithLabs Text Tools help you manipulate, analyze, and transform text instantly — all in your browser. Whether you need to count words, convert text case, compare documents, or generate placeholder text, our tools handle it with zero server processing. Your text stays completely private.',
    benefits: ['Instant word, character, and sentence counting', 'Batch text case conversion', 'Side-by-side text comparison with diff highlighting', 'Generate Lorem Ipsum and slug-friendly URLs'],
  },
  developer: {
    intro: 'Our Developer Tools are built by developers, for developers. Format JSON, test regex patterns, decode JWTs, compare code diffs, build cron expressions, and more — all running natively in your browser. No API calls, no data leaks, no rate limits.',
    benefits: ['JSON formatting with syntax validation', 'Real-time regex testing and generation', 'JWT decoding without server verification', 'REST API testing like Postman — in your browser'],
  },
  image: {
    intro: 'CodelithLabs Image Tools let you resize, compress, crop, convert, and filter images entirely in your browser using the Canvas API and Web Workers. Your images never leave your device — perfect for sensitive or proprietary visuals.',
    benefits: ['Compress images without quality loss', 'Convert between PNG, JPG, WebP formats', 'Add watermarks and apply artistic filters', 'Resize for social media platforms automatically'],
  },
  converter: {
    intro: 'Transform data between formats instantly. Our Converters handle CSV to JSON, YAML to JSON, Markdown to HTML, unit conversions, Roman numerals, binary, and more. Every conversion happens client-side for maximum speed and privacy.',
    benefits: ['CSV, JSON, YAML, and XML format interchange', 'Unit conversion across length, weight, temperature', 'Binary, hex, and number system conversions', 'Color format and coordinate system conversions'],
  },
  calculator: {
    intro: 'Precise, instant calculations for everyday and professional needs. From BMI and loan EMI to percentages and age computation — all calculators run entirely in your browser with no data transmitted anywhere.',
    benefits: ['BMI, age, and percentage calculators', 'Loan EMI with interest breakdown', 'Mobile-friendly interface', 'Instant results with no page reload'],
  },
  generator: {
    intro: 'Generate strong passwords, unique UUIDs, QR codes, and random numbers instantly. All generation happens client-side — your generated passwords and IDs never touch a server, making CodelithLabs the safest generator platform.',
    benefits: ['Cryptographically strong password generation', 'UUID v4 generation for applications', 'QR code creation for URLs and text', 'Customizable random number ranges'],
  },
  formatter: {
    intro: 'Clean up messy code with our Formatters. Beautify SQL, HTML, CSS, and JavaScript — or minify them for production. All formatting runs in your browser for instant results and total code privacy.',
    benefits: ['SQL query beautification', 'HTML indentation and formatting', 'CSS and JavaScript minification', 'Copy-ready output in one click'],
  },
  encoder: {
    intro: 'Encode and decode data with our Encoder/Decoder tools. Handle Base64, URL encoding, and HTML entity conversion smoothly. All processing is 100% client-side — your sensitive data stays private.',
    benefits: ['Base64 encode/decode for any text', 'URL-safe encoding for query parameters', 'HTML entity conversion for special characters', 'Instant bidirectional conversion'],
  },
  security: {
    intro: 'Security-focused tools for developers and IT professionals. Generate cryptographic hashes (MD5, SHA-256, SHA-512), check password strength, and analyze website security — all without exposing your data to any server.',
    benefits: ['MD5, SHA-1, SHA-256, SHA-512 hash generation', 'Password strength scoring and analysis', 'Zero server-side data exposure', 'Instant cryptographic computations'],
  },
  seo: {
    intro: 'Optimize your website for search engines with our SEO Tools. Generate meta tags, Open Graph markup, robots.txt files, XML sitemaps, and check website security — everything you need for technical SEO in one place.',
    benefits: ['Meta tag and Open Graph generator', 'Robots.txt and XML sitemap creation', 'Website security and HTTPS analysis', 'Responsive design checking across viewports'],
  },
  ai: {
    intro: 'Our AI-powered tools use intelligent algorithms running in your browser to analyze sentiment, summarize text, check grammar, generate color palettes, and more. No API keys needed — all processing happens locally.',
    benefits: ['Sentiment analysis with emotion detection', 'Extractive text summarization', 'Grammar and style checking', 'AI color palette generation from keywords'],
  },
  finance: {
    intro: 'Comprehensive financial calculators and tools designed for Indian and global users. Calculate EMIs, compound interest, income tax, profit margins, and investment returns — all with real-time computation and zero data collection.',
    benefits: ['Income tax calculation under Old & New regime', 'CTC to in-hand salary breakdown', 'Investment comparison across FD, PPF, NPS, Gold', 'Invoice generation and expense splitting'],
  },
  geo: {
    intro: 'Geographic and location tools for travelers, developers, and data analysts. Convert coordinates, calculate distances, look up IP geolocation, track world clocks, and find sunrise/sunset times — all in your browser.',
    benefits: ['Distance calculation using Haversine formula', 'Coordinate format conversion (DD, DMS, DDM)', 'IP geolocation lookup with ISP details', 'Multi-timezone world clock with live updates'],
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const categoryInfo = TOOL_CATEGORIES[category as ToolCategory];
  if (!categoryInfo) notFound();

  const tools = TOOLS_REGISTRY.filter(t => t.category === category);
  const content = CATEGORY_CONTENT[category];

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://codelithlabs.in" },
      { "@type": "ListItem", position: 2, name: "Tools", item: "https://codelithlabs.in/tools" },
      { "@type": "ListItem", position: 3, name: categoryInfo.name, item: `https://codelithlabs.in/tools/category/${category}` },
    ]
  };

  // CollectionPage Schema
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Free ${categoryInfo.name}`,
    description: categoryInfo.description,
    url: `https://codelithlabs.in/tools/category/${category}`,
    numberOfItems: tools.length,
    provider: {
      "@type": "Organization",
      name: "CodelithLabs",
      url: "https://codelithlabs.in"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <div className="min-h-screen bg-[#0a0a0a] py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">

          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
            <Link href="/" className="hover:text-zinc-300 transition">Home</Link>
            <span className="text-zinc-700">/</span>
            <Link href="/tools" className="hover:text-zinc-300 transition">Tools</Link>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-300">{categoryInfo.name}</span>
          </nav>

          {/* Category Header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span
                className="px-4 py-1.5 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: `${categoryInfo.color}15`,
                  color: categoryInfo.color,
                  border: `1px solid ${categoryInfo.color}30`
                }}
              >
                {tools.length} Tools
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Free {categoryInfo.name}
            </h1>
            <p className="text-zinc-400 text-lg max-w-3xl">
              {categoryInfo.description} — {tools.length} free tools, all processing client-side
              for maximum privacy. No sign-up, no limits, no data collection.
            </p>
          </header>

          {/* SEO Content Block */}
          {content && (
            <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-10">
              <p className="text-zinc-400 leading-relaxed mb-4">{content.intro}</p>
              <ul className="grid sm:grid-cols-2 gap-2">
                {content.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 text-zinc-400 text-sm">
                    <span className="text-green-500">✓</span> {benefit}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Tools Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map(tool => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50
                           hover:border-blue-500/50 hover:bg-zinc-900 transition-all group"
              >
                <h2 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors mb-2">
                  {tool.name}
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed mb-3">{tool.description}</p>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  {tool.processingType === 'client' ? (
                    <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Client-side · Private
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                      Server · Encrypted
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Other Categories Section */}
          <section className="mt-16">
            <h2 className="text-xl font-semibold text-white mb-6">Explore Other Categories</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(TOOL_CATEGORIES)
                .filter(([key]) => key !== category)
                .slice(0, 8)
                .map(([key, cat]) => {
                  const count = TOOLS_REGISTRY.filter(t => t.category === key).length;
                  return (
                    <Link
                      key={key}
                      href={`/tools/category/${key}`}
                      className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30
                                 hover:border-zinc-600 transition-all group"
                    >
                      <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-zinc-500 text-xs mt-1">{count} tools</p>
                    </Link>
                  );
                })}
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
