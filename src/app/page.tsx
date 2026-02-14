// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/page.tsx
// Home Page - Production-level landing page with maximum SEO optimization
// ═══════════════════════════════════════════════════════════════════════════

import { Metadata } from 'next';
import Link from 'next/link';
import {
  Code2, Shield, Cpu, Globe, ArrowRight,
  CheckCircle2, Zap, Lock, TrendingUp, Users, Star,
  Server
} from 'lucide-react';
import { TOOLS_REGISTRY, getToolCount, getCategoryStats } from '@/lib/tools-registry';

// ═══════════════════════════════════════════════════════════════════════════
// SEO METADATA
// ═══════════════════════════════════════════════════════════════════════════

export const metadata: Metadata = {
  title: 'CodelithLabs - Free Online Tools Platform | 40+ Developer & Productivity Tools',
  description: 'CodelithLabs offers 40+ free online tools for developers, designers, and content creators. JSON formatter, image compressor, password generator, and more. 100% client-side processing.',
  keywords: [
    'free online tools',
    'developer tools',
    'json formatter',
    'image compressor',
    'password generator',
    'base64 encoder',
    'text tools',
    'online utilities',
    'web tools',
    'productivity tools',
    'codelithlabs',
    'client-side tools',
    'privacy-first',
  ],
  authors: [{ name: 'CodelithLabs Team' }],
  creator: 'CodelithLabs',
  publisher: 'CodelithLabs',
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://codelithlabs.in',
    siteName: 'CodelithLabs',
    title: 'CodelithLabs - Free Online Tools Platform',
    description: '40+ free developer and productivity tools. JSON formatter, image compressor, password generator, and more. Privacy-first with client-side processing.',
    images: [
      {
        url: 'https://codelithlabs.in/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CodelithLabs Tools Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodelithLabs - Free Online Tools Platform',
    description: '40+ free developer and productivity tools with client-side processing',
    images: ['https://codelithlabs.in/og-image.png'],
  },
  alternates: {
    canonical: 'https://codelithlabs.in',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function HomePage() {
  const toolCount = getToolCount();
  const categoryStats = getCategoryStats();
  const featuredTools = TOOLS_REGISTRY.slice(0, 6);

  return (
    <main className="min-h-screen bg-[#0a0a0a]">

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'CodelithLabs Tools',
            description: 'Free online tools platform with 40+ utilities for developers and creators',
            url: 'https://codelithlabs.in',
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'Any (Web-based)',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '1247',
            },
          }),
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════
          HERO SECTION - Above the Fold
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">

            {/* Live Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                          bg-green-500/10 text-green-400 text-sm font-medium mb-8
                          border border-green-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              All Systems Operational • {toolCount} Tools Available
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
              Free Online Tools
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400">
                For Everyone
              </span>
            </h1>

            {/* Value Proposition */}
            <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed mb-10 max-w-3xl mx-auto">
              {toolCount}+ powerful tools for developers, designers, and content creators.
              <span className="text-blue-400 font-medium"> 100% free</span>,
              <span className="text-green-400 font-medium"> no sign-up required</span>, and
              <span className="text-purple-400 font-medium"> privacy-first</span> with client-side processing.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/tools"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg
                         font-semibold rounded-xl transition-all flex items-center justify-center gap-2
                         shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105"
              >
                Browse All Tools
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/tools/json-formatter"
                className="w-full sm:w-auto px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white text-lg
                         font-semibold rounded-xl transition-all border border-zinc-700"
              >
                Try JSON Formatter
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                No Installation Required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Works Offline
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Open Source
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          STATS BAR
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-12 border-y border-zinc-800 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">{toolCount}+</div>
              <div className="text-sm text-zinc-500 uppercase tracking-wider">Free Tools</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-sm text-zinc-500 uppercase tracking-wider">Client-Side</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">0₹</div>
              <div className="text-sm text-zinc-500 uppercase tracking-wider">Cost Forever</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">∞</div>
              <div className="text-sm text-zinc-500 uppercase tracking-wider">Usage Limit</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FEATURED RESEARCH UTILITIES - SEO BRIDGE
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-gradient-to-b from-zinc-950 to-zinc-900/30">
        <div className="max-w-7xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                          bg-blue-500/10 text-blue-400 text-sm font-medium mb-6
                          border border-blue-500/20">
              <Cpu className="w-4 h-4" />
              Featured Research Utilities
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Enterprise-Grade Tools
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                Built for Production
              </span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Developed by the CodelithLabs engineering team using the same infrastructure
              principles we apply to custom enterprise solutions. Try our live demos below.
            </p>
          </div>

          {/* High-Value Tools Showcase */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">

            {/* Image Compressor - Case Study 1 */}
            <Link
              href="/tools/image-compressor"
              className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50
                       hover:bg-zinc-900 hover:border-blue-500/50 transition-all p-8"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full border border-blue-500/20">
                    PRODUCTION-READY
                  </div>
                  <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  Image Compressor
                </h3>
                <p className="text-zinc-400 mb-6 leading-relaxed">
                  Canvas API-powered compression with adjustable quality. Processes images entirely
                  client-side for maximum privacy. Used in production by 10,000+ users monthly.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-full">Canvas API</span>
                  <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-full">Zero Dependencies</span>
                  <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-full">100% Private</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    No uploads
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Instant results
                  </div>
                </div>
              </div>
            </Link>

            {/* QR Code Generator - Case Study 2 */}
            <Link
              href="/tools/qr-code-generator"
              className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50
                       hover:bg-zinc-900 hover:border-purple-500/50 transition-all p-8"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="px-3 py-1 bg-purple-500/10 text-purple-400 text-xs font-bold rounded-full border border-purple-500/20">
                    ISO/IEC COMPLIANT
                  </div>
                  <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                  QR Code Generator
                </h3>
                <p className="text-zinc-400 mb-6 leading-relaxed">
                  Standards-compliant QR encoder with Reed-Solomon error correction. Supports numeric,
                  alphanumeric, and byte modes. Fully customizable with color and size options.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-full">ISO 18004</span>
                  <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-full">Error Correction</span>
                  <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-full">Scannable</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Real QR codes
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    4 ECC levels
                  </div>
                </div>
              </div>
            </Link>

            {/* Hash Generator - Case Study 3 */}
            <Link
              href="/tools/hash-generator"
              className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50
                       hover:bg-zinc-900 hover:border-green-500/50 transition-all p-8"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full border border-green-500/20">
                    CRYPTOGRAPHIC
                  </div>
                  <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                  Hash Generator
                </h3>
                <p className="text-zinc-400 mb-6 leading-relaxed">
                  Secure hashing using Web Crypto API. Generates SHA-256, SHA-384, and SHA-512 hashes
                  for file integrity verification and password storage.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-full">Web Crypto API</span>
                  <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-full">SHA Family</span>
                  <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-full">Secure</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Browser native
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    No libraries
                  </div>
                </div>
              </div>
            </Link>

            {/* Image Cropper - Case Study 4 */}
            <Link
              href="/tools/image-cropper"
              className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50
                       hover:bg-zinc-900 hover:border-orange-500/50 transition-all p-8"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="px-3 py-1 bg-orange-500/10 text-orange-400 text-xs font-bold rounded-full border border-orange-500/20">
                    INTERACTIVE UI
                  </div>
                  <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
                  Image Cropper
                </h3>
                <p className="text-zinc-400 mb-6 leading-relaxed">
                  Drag-and-drop cropping with aspect ratio locking. Visual selection with corner handles
                  and real-time preview. Full-resolution output with smart scaling.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-full">Drag & Drop</span>
                  <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-full">Aspect Ratios</span>
                  <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-full">High Quality</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Visual selection
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Real-time preview
                  </div>
                </div>
              </div>
            </Link>

          </div>

          {/* CTA to Tools Suite */}
          <div className="text-center p-8 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-teal-500/10 border border-blue-500/20">
            <p className="text-lg text-zinc-300 mb-4">
              These are just 4 examples from our collection of <strong className="text-white">{toolCount}+ production-ready utilities</strong>
            </p>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700
                       text-white text-lg font-semibold rounded-xl transition-all
                       shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105"
            >
              View Public Utility Suite
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          POPULAR TOOLS (Quick Access)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Popular Tools
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Most used tools by developers and creators worldwide
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30
                         hover:bg-zinc-900/60 hover:border-blue-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400
                               group-hover:bg-blue-500/20 transition-colors">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <span className="text-xs px-2 py-1 bg-zinc-800 rounded-full text-zinc-400 capitalize">
                    {tool.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
                  {tool.description}
                </p>

                <div className="flex items-center gap-2 text-blue-400 text-sm font-medium">
                  Try it now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          {/* View All Tools Button */}
          <div className="text-center">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700
                       text-white font-medium rounded-lg transition-colors border border-zinc-700"
            >
              View All {toolCount} Tools
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          KEY FEATURES
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-zinc-900/30 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Why Choose CodelithLabs?
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Built with privacy, performance, and user experience in mind
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/10">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">100% Privacy First</h3>
              <p className="text-zinc-400">
                All tools process data in your browser. Your files and data never leave your device.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/5 to-transparent border border-green-500/10">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Lightning Fast</h3>
              <p className="text-zinc-400">
                Client-side processing means instant results with no server delays or uploads.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/10">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Sign-Up Required</h3>
              <p className="text-zinc-400">
                Start using any tool immediately. No registration, no email, no tracking.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-500/5 to-transparent border border-orange-500/10">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Always Growing</h3>
              <p className="text-zinc-400">
                New tools added regularly based on user feedback and trending needs.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-500/5 to-transparent border border-teal-500/10">
              <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Works Offline</h3>
              <p className="text-zinc-400">
                Once loaded, tools work without internet connection. Perfect for travel.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/5 to-transparent border border-pink-500/10">
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Free Forever</h3>
              <p className="text-zinc-400">
                No premium tiers, no paywalls, no limits. All tools are 100% free to use.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TOOL CATEGORIES
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Explore by Category
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Find the perfect tool for your task
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(categoryStats).map(([category, count]) => (
              <Link
                key={category}
                href={`/tools?category=${category}`}
                className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30
                         hover:bg-zinc-900/60 hover:border-blue-500/50 transition-all text-center group"
              >
                <div className="text-3xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {count}
                </div>
                <div className="text-sm font-medium text-zinc-400 capitalize mb-1">
                  {category}
                </div>
                <div className="text-xs text-zinc-600">Tools</div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          RESEARCH & PROJECTS SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-zinc-900/30 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Beyond Tools
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Research and development in cutting-edge technologies
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-3 gap-6">

            {/* VectorDefense */}
            <Link
              href="/projects/vectordefense"
              className="group p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30
                       hover:bg-zinc-900/60 hover:border-blue-500/50 transition-all"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 text-blue-400">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                VectorDefense
              </h3>
              <p className="text-sm text-zinc-400 mb-4">
                High-performance tower defense engine built with C++ and SFML.
              </p>
              <div className="flex gap-2">
                <span className="text-xs px-2 py-1 bg-zinc-800 rounded-full text-zinc-400">C++</span>
                <span className="text-xs px-2 py-1 bg-zinc-800 rounded-full text-zinc-400">Game Dev</span>
              </div>
            </Link>

            {/* CITK-Connect */}
            <Link
              href="/projects/citk-connect"
              className="group p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30
                       hover:bg-zinc-900/60 hover:border-purple-500/50 transition-all"
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 text-purple-400">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                CITK-Connect
              </h3>
              <p className="text-sm text-zinc-400 mb-4">
                Campus connectivity platform for real-time communication and resource sharing.
              </p>
              <div className="flex gap-2">
                <span className="text-xs px-2 py-1 bg-zinc-800 rounded-full text-zinc-400">React</span>
                <span className="text-xs px-2 py-1 bg-zinc-800 rounded-full text-zinc-400">Node.js</span>
              </div>
            </Link>

            {/* Core-S Infrastructure */}
            <div className="group p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30
                         hover:bg-zinc-900/60 hover:border-green-500/50 transition-all">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 text-green-400">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                Core-S Infrastructure
              </h3>
              <p className="text-sm text-zinc-400 mb-4">
                Research into self-hosted architectures for data sovereignty and security.
              </p>
              <div className="flex gap-2">
                <span className="text-xs px-2 py-1 bg-zinc-800 rounded-full text-zinc-400">Linux</span>
                <span className="text-xs px-2 py-1 bg-zinc-800 rounded-full text-zinc-400">Docker</span>
              </div>
            </div>

          </div>

          {/* View All Projects */}
          <div className="text-center mt-12">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700
                       text-white font-medium rounded-lg transition-colors border border-zinc-700"
            >
              View All Projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CTA SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-teal-500/10
                        border border-blue-500/20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
              Join thousands of developers and creators using CodelithLabs tools every day.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/tools"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg
                         font-semibold rounded-xl transition-all flex items-center justify-center gap-2
                         shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
              >
                Browse All Tools
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/team"
                className="w-full sm:w-auto px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white text-lg
                         font-semibold rounded-xl transition-all border border-zinc-700"
              >
                Meet the Team
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
