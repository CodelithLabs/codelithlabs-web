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

const CATEGORY_CONTENT: Record<string, { intro: string; benefits: string[]; longDescription: string }> = {
  text: {
    intro: 'CodelithLabs Text Tools help you manipulate, analyze, and transform text instantly — all in your browser. Whether you need to count words, convert text case, compare documents, or generate placeholder text, our tools handle it with zero server processing. Your text stays completely private.',
    benefits: ['Instant word, character, and sentence counting', 'Batch text case conversion', 'Side-by-side text comparison with diff highlighting', 'Generate Lorem Ipsum and slug-friendly URLs'],
    longDescription: `Text manipulation is at the heart of modern content creation, software development, and data analysis. CodelithLabs provides a comprehensive suite of free text tools that run entirely in your browser, ensuring your data never leaves your device. Our Word Counter gives writers real-time statistics including character count, sentence count, paragraph count, and estimated reading time — making it indispensable for blog posts, academic essays, and social media content that must meet specific length requirements.

Our Case Converter supports uppercase, lowercase, title case, sentence case, camelCase, snake_case, kebab-case, and PascalCase transformations, which is especially useful for developers switching between naming conventions and content editors standardizing headlines. The Text Diff tool highlights insertions, deletions, and modifications side-by-side, just like GitHub's diff view — ideal for comparing contract revisions, tracking changelog edits, or verifying code changes before commit.

For content creators who need placeholder text, our Lorem Ipsum Generator supports paragraph, sentence, and word-level generation with customizable output. The Slug Generator converts any title into URL-friendly slugs automatically. Every tool runs on Web Workers when possible, so even processing 100,000-word documents won't freeze your browser tab. CodelithLabs Text Tools are trusted by freelance writers, SEO specialists, and development teams across India and worldwide who need reliable, private, and instant text processing.`,
  },
  developer: {
    intro: 'Our Developer Tools are built by developers, for developers. Format JSON, test regex patterns, decode JWTs, compare code diffs, build cron expressions, and more — all running natively in your browser. No API calls, no data leaks, no rate limits.',
    benefits: ['JSON formatting with syntax validation', 'Real-time regex testing and generation', 'JWT decoding without server verification', 'REST API testing like Postman — in your browser'],
    longDescription: `Modern software development requires a reliable toolkit that is always within reach. CodelithLabs Developer Tools provide browser-based utilities that eliminate the need for local CLI installs, desktop apps, or cloud-hosted services that may log your data. Our JSON Formatter prettifies, validates, and minifies JSON with syntax highlighting and error pinpointing — perfect for debugging API responses or preparing configuration files.

The Regex Tester provides real-time match highlighting with capture group extraction and built-in cheat sheet, saving developers hours of trial-and-error on complex pattern matching. Our JWT Decoder lets you inspect token headers and payloads instantly — without sending them to a third-party server, which is critical when working with auth tokens containing user PII. The Cron Expression Generator converts human-readable schedules into cron syntax with a live preview of the next five execution times.

Our API Tester offers a Postman-like interface for GET, POST, PUT, and DELETE requests with custom headers, request bodies, and response inspection — entirely from a browser tab. The Code Diff tool compares two code snippets with line-by-line highlighting. JS and CSS Minifiers reduce file size for production builds. Every developer tool on CodelithLabs processes data client-side, ensuring your proprietary source code, secret tokens, and API keys never leave your machine.`,
  },
  image: {
    intro: 'CodelithLabs Image Tools let you resize, compress, crop, convert, and filter images entirely in your browser using the Canvas API and Web Workers. Your images never leave your device — perfect for sensitive or proprietary visuals.',
    benefits: ['Compress images without quality loss', 'Convert between PNG, JPG, WebP formats', 'Add watermarks and apply artistic filters', 'Resize for social media platforms automatically'],
    longDescription: `Image processing is typically associated with heavy desktop software like Photoshop or server-dependent online tools that upload your photos to remote servers. CodelithLabs Image Tools break this pattern by running every operation directly in your browser using the HTML5 Canvas API and Web Workers for non-blocking performance.

Our Image Compressor uses intelligent quality reduction algorithms to shrink JPEG and PNG files by up to 80% while maintaining visual fidelity — essential for web developers optimizing page load times and meeting Core Web Vitals thresholds. The Image Resizer supports exact pixel dimensions, percentage scaling, and preset social media dimensions (Instagram square, Twitter header, Facebook cover, LinkedIn banner). Image Cropper offers freeform and fixed-ratio cropping with real-time preview.

Format conversion tools handle JPG-to-PNG, PNG-to-JPG, and Image-to-Base64 transformations instantly — useful for embedding images in CSS, emails, or data URIs. Our Image Filters apply artistic effects using Canvas pixel manipulation: grayscale, sepia, blur, brightness, contrast, and saturation adjustments with live preview. The Privacy Blur tool lets you redact faces and sensitive regions before sharing screenshots, and the Image Watermark tool overlays custom text or logos with adjustable opacity and positioning. All processing is 100% client-side — your images never leave your device.`,
  },
  converter: {
    intro: 'Transform data between formats instantly. Our Converters handle CSV to JSON, YAML to JSON, Markdown to HTML, unit conversions, Roman numerals, binary, and more. Every conversion happens client-side for maximum speed and privacy.',
    benefits: ['CSV, JSON, YAML, and XML format interchange', 'Unit conversion across length, weight, temperature', 'Binary, hex, and number system conversions', 'Color format and coordinate system conversions'],
    longDescription: `Data conversion is a daily necessity for developers, data analysts, and content creators who work across multiple platforms and file formats. CodelithLabs Converter Tools provide instant, client-side format transformations that eliminate the need for command-line scripts or cloud services that might cache your data.

Our CSV-to-JSON and JSON-to-CSV converters handle complex nested structures, quoted fields, and multi-line values with automatic delimiter detection. The YAML-to-JSON and JSON-to-YAML tools support full YAML spec compatibility including anchors and aliases. Markdown-to-HTML conversion renders GitHub Flavored Markdown with syntax highlighting, tables, and task lists — perfect for previewing README files before pushing to repositories.

Beyond file formats, our unit converters cover length, weight, temperature, speed, area, volume, and digital storage with real-time bidirectional conversion. The Binary Converter handles binary, octal, decimal, and hexadecimal number systems. The Color Converter transforms between HEX, RGB, HSL, and CMYK with a live color preview. Coordinate Converter translates between decimal degrees (DD), degrees-minutes-seconds (DMS), and UTM formats for GIS applications. Roman Numeral conversion is available for historical research and educational use. Every conversion runs instantly in your browser with zero data transmission.`,
  },
  calculator: {
    intro: 'Precise, instant calculations for everyday and professional needs. From BMI and loan EMI to percentages and age computation — all calculators run entirely in your browser with no data transmitted anywhere.',
    benefits: ['BMI, age, and percentage calculators', 'Loan EMI with interest breakdown', 'Mobile-friendly interface', 'Instant results with no page reload'],
    longDescription: `Whether you are a student, professional, or homemaker, calculators are tools you reach for daily. CodelithLabs Calculator Tools provide accurate, instant computation for a wide range of everyday and specialized scenarios — with the added benefit of complete privacy since all math runs in your browser.

Our BMI Calculator computes Body Mass Index with WHO classification and visual indicators, helping health-conscious users track their fitness goals. The Age Calculator goes beyond simple year subtraction to compute exact years, months, and days between two dates — useful for legal documents, insurance applications, and eligibility verification. The Percentage Calculator supports percentage-of, percentage-change, and percentage-difference calculations in a single interface.

For financial planning, our Loan Calculator computes EMI, total interest, and generates a full amortization schedule for home loans, car loans, and personal loans. The Compound Interest Calculator visualizes growth over time with interactive charts. The Mortgage Calculator factors in down payment, interest rate, loan tenure, and property taxes to give you a complete picture of your monthly outflow. Break-even Calculator and Profit Margin Calculator serve small business owners and entrepreneurs who need quick financial projections. All calculators produce instant results with no page reload, work offline after initial load, and never transmit your financial data to any server.`,
  },
  generator: {
    intro: 'Generate strong passwords, unique UUIDs, QR codes, and random numbers instantly. All generation happens client-side — your generated passwords and IDs never touch a server, making CodelithLabs the safest generator platform.',
    benefits: ['Cryptographically strong password generation', 'UUID v4 generation for applications', 'QR code creation for URLs and text', 'Customizable random number ranges'],
    longDescription: `Generation tools create unique, random, and structured outputs that developers, designers, and everyday users need regularly. CodelithLabs Generator Tools use the browser\'s built-in crypto.getRandomValues() for cryptographically secure randomness — ensuring that generated passwords and UUIDs meet enterprise security standards without ever touching a server.

Our Password Generator creates passwords of any length with configurable character sets (uppercase, lowercase, digits, symbols, and custom characters) plus real-time strength scoring. The UUID Generator produces RFC 4122 compliant v4 UUIDs in bulk — essential for database seeding, testing, and distributed system development. The QR Code Generator creates scannable codes for URLs, plain text, Wi-Fi credentials, vCards, and email addresses with customizable size and error correction levels.

The Random Number Generator supports integer and floating-point ranges with optional seed reproducibility and bulk generation. Our Lorem Ipsum Generator produces realistic placeholder text at paragraph, sentence, or word granularity for mockups and wireframes. The README Generator scaffolds professional repository documentation with sections for installation, usage, API reference, contributing guidelines, and license — saving developers significant time on every new project. Every generator runs entirely in your browser: your passwords, UUIDs, and codes never leave your device.`,
  },
  formatter: {
    intro: 'Clean up messy code with our Formatters. Beautify SQL, HTML, CSS, and JavaScript — or minify them for production. All formatting runs in your browser for instant results and total code privacy.',
    benefits: ['SQL query beautification', 'HTML indentation and formatting', 'CSS and JavaScript minification', 'Copy-ready output in one click'],
    longDescription: `Code readability is fundamental to maintainability, and production optimization demands minified output. CodelithLabs Formatter Tools serve both needs — beautifying code for human readability and minifying it for deployment — all in your browser without sending your source code to any server.

Our HTML Formatter parses and re-indents messy HTML with configurable indentation (spaces or tabs), tag sorting, and attribute alignment. The CSS Minifier strips whitespace, comments, and unnecessary semicolons to reduce stylesheet payload for faster page loads. The JavaScript Minifier removes whitespace and shortens variable names while preserving functionality — critical for production builds where every kilobyte matters.

The SQL Formatter beautifies complex queries with proper keyword capitalization, clause alignment, and subquery indentation — making it easy to review and debug database queries that span dozens of lines. JSON Formatter provides prettification with collapsible sections and syntax highlighting, plus a compact minification mode. All formatters provide one-click copy with syntax-validated output, ensuring you never paste broken code. CodelithLabs Formatters are used by development teams, DevOps engineers, and database administrators who value both code quality and data privacy.`,
  },
  encoder: {
    intro: 'Encode and decode data with our Encoder/Decoder tools. Handle Base64, URL encoding, and HTML entity conversion smoothly. All processing is 100% client-side — your sensitive data stays private.',
    benefits: ['Base64 encode/decode for any text', 'URL-safe encoding for query parameters', 'HTML entity conversion for special characters', 'Instant bidirectional conversion'],
    longDescription: `Encoding and decoding operations are essential for web development, API integration, email handling, and security workflows. CodelithLabs Encoder/Decoder Tools provide instant bidirectional transformations that keep your sensitive data entirely within your browser — critical when working with authentication tokens, API keys, or personally identifiable information.

Our Base64 Encoder/Decoder handles text-to-Base64 and Base64-to-text conversions with support for UTF-8, ASCII, and binary data. This is essential for embedding images in CSS data URIs, encoding email attachments per MIME standards, and working with API payloads that require Base64 encoding. The URL Encoder properly escapes special characters for query parameters, form data, and path segments — preventing the broken links and injection vulnerabilities that come from unescaped user input.

The HTML Entity Encoder converts special characters like <, >, &, and " into their HTML entity equivalents (and back), which is crucial for preventing XSS attacks and displaying code snippets safely in web pages. The Image-to-Base64 tool converts images into Base64 data URIs for inline embedding in HTML, CSS, and JSON — useful for email templates, single-file HTML exports, and reducing HTTP requests. Every encoding operation runs entirely in your browser, making CodelithLabs the safest platform for handling sensitive data transformations.`,
  },
  security: {
    intro: 'Security-focused tools for developers and IT professionals. Generate cryptographic hashes (MD5, SHA-256, SHA-512), check password strength, and analyze website security — all without exposing your data to any server.',
    benefits: ['MD5, SHA-1, SHA-256, SHA-512 hash generation', 'Password strength scoring and analysis', 'Zero server-side data exposure', 'Instant cryptographic computations'],
    longDescription: `Cybersecurity professionals, developers, and DevOps engineers routinely need to generate hashes, verify file integrity, and audit password policies. CodelithLabs Security Tools provide these capabilities directly in your browser using the Web Crypto API — meaning your passwords, keys, and data never leave your device.

Our Hash Generator computes MD5, SHA-1, SHA-256, and SHA-512 hashes for any text input instantly. This is essential for verifying file downloads, generating content fingerprints, and creating unique identifiers for caching strategies. The Password Strength Checker evaluates passwords against entropy calculations, common pattern detection, dictionary matching, and breach database heuristics — providing actionable feedback to help users create stronger credentials.

All security tools leverage the browser\'s native cryptographic libraries (SubtleCrypto), which are FIPS-compliant and hardware-accelerated on modern processors. Unlike cloud-based hash generators that could potentially log your inputs, CodelithLabs processes everything locally. This makes our tools suitable for enterprise security audits, compliance verification, and development workflows where data sensitivity is paramount. Security researchers and penetration testers across India trust CodelithLabs for hash generation and password analysis precisely because of this zero-transmission architecture.`,
  },
  seo: {
    intro: 'Optimize your website for search engines with our SEO Tools. Generate meta tags, Open Graph markup, robots.txt files, XML sitemaps, and check website security — everything you need for technical SEO in one place.',
    benefits: ['Meta tag and Open Graph generator', 'Robots.txt and XML sitemap creation', 'Website security and HTTPS analysis', 'Responsive design checking across viewports'],
    longDescription: `Search engine optimization is the backbone of organic traffic, and technical SEO requires specialized tools for meta tag generation, structured data validation, and website auditing. CodelithLabs SEO Tools give marketers, content creators, and web developers everything they need to optimize their sites — entirely from the browser.

Our Meta Tag Generator creates complete HTML head markup including title, description, canonical URL, Open Graph tags, Twitter Card tags, and viewport settings with real-time preview. The Open Graph Generator specifically focuses on social sharing optimization, letting you preview how your pages will appear on Facebook, Twitter, LinkedIn, and WhatsApp before publishing. The Robots.txt Generator creates properly formatted directives for search engine crawlers with common presets for WordPress, Next.js, and static sites.

For content creators, our tools help ensure that every page published is fully optimized for discoverability. Proper meta tags can increase click-through rates by 20-30% in search results, and correct Open Graph implementation ensures your content looks professional when shared on social media. CodelithLabs SEO Tools are used by digital marketing agencies, freelance SEO consultants, and startup teams across India who need reliable, private, and instant SEO optimization without paying for expensive SaaS subscriptions.`,
  },
  ai: {
    intro: 'Our AI-powered tools use intelligent algorithms running in your browser to analyze sentiment, summarize text, check grammar, generate color palettes, and more. No API keys needed — all processing happens locally.',
    benefits: ['Sentiment analysis with emotion detection', 'Extractive text summarization', 'Grammar and style checking', 'AI color palette generation from keywords'],
    longDescription: `Artificial intelligence is transforming how we create, edit, and analyze content. CodelithLabs AI Tools bring intelligent processing to your browser using lightweight ML models and heuristic algorithms — no API keys, no cloud subscriptions, and no data transmission required.

Our Grammar Checker analyzes text for spelling errors, grammatical mistakes, punctuation issues, and stylistic improvements. The Paraphraser rewrites sentences while preserving meaning, helping content creators avoid plagiarism and diversify their writing style. The AI Translator provides instant translation between major world languages using browser-based models, and the Text Summarizer extracts key points from long documents using extractive summarization techniques.

The AI Color Palette Generator creates harmonious color schemes from text descriptions using color theory algorithms — type "sunset over mountains" and get a professionally curated palette. The Sentiment Analyzer breaks down text into positive, negative, and neutral scores with emotion detection (joy, anger, sadness, surprise), which is invaluable for social media monitoring, product review analysis, and customer feedback processing. The Code Explainer uses pattern recognition to break down code snippets into plain-English explanations. All AI tools run locally in your browser, ensuring your documents, code, and sensitive text remain completely private.`,
  },
  finance: {
    intro: 'Comprehensive financial calculators and tools designed for Indian and global users. Calculate EMIs, compound interest, income tax, profit margins, and investment returns — all with real-time computation and zero data collection.',
    benefits: ['Income tax calculation under Old & New regime', 'CTC to in-hand salary breakdown', 'Investment comparison across FD, PPF, NPS, Gold', 'Invoice generation and expense splitting'],
    longDescription: `Financial planning requires accurate, trustworthy tools — and privacy is non-negotiable when dealing with salary, tax, and investment data. CodelithLabs Finance Tools provide comprehensive calculators designed for Indian tax regulations, banking products, and investment instruments, while also serving global users with universal financial calculations.

Our Income Tax Calculator supports both Old and New tax regimes under Indian tax law, factoring in standard deductions, Section 80C/80D investments, HRA exemptions, and surcharge calculations. The CTC-to-In-Hand Salary Calculator breaks down your cost-to-company into basic salary, HRA, PF contribution, gratuity, and net take-home — essential during job offer negotiations. The Compound Interest Calculator visualizes exponential growth with interactive charts showing year-by-year accumulation.

For business owners, the Profit Margin Calculator computes gross margin, operating margin, and net margin from revenue and cost inputs. The Break-Even Calculator determines the sales volume needed to cover fixed and variable costs. The Invoice Generator creates professional PDF invoices with GST calculations, line items, and payment terms. The Expense Splitter handles group expense division with support for unequal splits, tip calculation, and per-person breakdowns — perfect for team dinners and group trips. All financial data is processed entirely in your browser and never stored or transmitted.`,
  },
  geo: {
    intro: 'Geographic and location tools for travelers, developers, and data analysts. Convert coordinates, calculate distances, look up IP geolocation, track world clocks, and find sunrise/sunset times — all in your browser.',
    benefits: ['Distance calculation using Haversine formula', 'Coordinate format conversion (DD, DMS, DDM)', 'IP geolocation lookup with ISP details', 'Multi-timezone world clock with live updates'],
    longDescription: `Geographic data processing, coordinate transformation, and location-based computation are essential for developers building mapping applications, analysts working with spatial data, and travelers planning international trips. CodelithLabs Geo Tools provide these capabilities in an accessible browser-based interface.

Our Distance Calculator uses the Haversine formula to compute great-circle distance between two geographic points with results in kilometers, miles, and nautical miles — essential for logistics planning, travel booking, and geographic data analysis. The Coordinate Converter transforms between decimal degrees (DD), degrees-minutes-seconds (DMS), and degrees-decimal-minutes (DDM) formats, handling both latitude/longitude pairs and UTM coordinates for GIS compatibility.

The IP Geolocation tool looks up approximate geographic location, ISP details, timezone, and autonomous system information for any IP address — useful for debugging CDN routing, analyzing web traffic origins, and verifying VPN connections. Our World Clock displays current time across multiple timezones with daylight saving time awareness, helping remote teams coordinate meetings across continents. The Lat/Long Finder provides reverse geocoding from place names to coordinates. All geo tools that perform client-side computation keep your data local, while lookup-based tools use secure HTTPS connections to trusted geolocation APIs.`,
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

  // ItemList Schema for rich results
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${categoryInfo.name} on CodelithLabs`,
    numberOfItems: tools.length,
    itemListElement: tools.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      url: `https://codelithlabs.in/tools/${t.slug}`,
      description: t.description
    }))
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
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

          {/* Extended SEO Description */}
          {content?.longDescription && (
            <section className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6 mb-10">
              <h2 className="text-xl font-semibold text-white mb-4">
                Everything You Need to Know About {categoryInfo.name}
              </h2>
              <div className="text-zinc-400 leading-relaxed text-sm space-y-4">
                {content.longDescription.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
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
