// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/page.tsx
// Home Page — V2.0 "Command Center" Landing
// ═══════════════════════════════════════════════════════════════════════════

import { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight, Lock, Zap, Users, TrendingUp, Globe, Star,
  Shield, Server, Code2
} from 'lucide-react';
import { TOOLS_REGISTRY, getToolCount, getCategoryStats } from '@/lib/tools-registry';

import { HeroSection } from '@/components/landing/HeroSection';
import { StatsBar } from '@/components/landing/StatsBar';
import { FeaturedProjects } from '@/components/landing/FeaturedProjects';
import { ToolHighlights } from '@/components/landing/ToolHighlights';
import { HomeAdBelowHero, HomeAdMid, HomeAdBottom } from '@/components/ads/HomeAds';

// ═══════════════════════════════════════════════════════════════════════════
// SEO METADATA
// ═══════════════════════════════════════════════════════════════════════════

export const metadata: Metadata = {
  title: 'CodelithLabs — Open Source Innovation, System Architecture & Developer Tools',
  description: 'CodelithLabs offers 100+ free developer and fintech tools with 100% client-side processing for privacy, speed, and zero sign-up.',
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
    'open source',
    'system architecture',
    'fintech',
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
    title: 'CodelithLabs — Open Source Innovation & Developer Tools',
    description: '100+ free developer and productivity tools. Privacy-first with client-side processing. Built by engineers, for engineers.',
    images: [
      {
        url: 'https://codelithlabs.in/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CodelithLabs — Advanced Software Research Lab',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodelithLabs — Open Source Innovation & Developer Tools',
    description: '100+ free developer and productivity tools with client-side processing',
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
            description: 'Free online tools platform with 100+ utilities for developers and creators',
            url: 'https://codelithlabs.in',
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'Any (Web-based)',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          }),
        }}
      />

      {/* ── HERO ── */}
      <HeroSection />

      {/* ── STATS BAR ── */}
      <StatsBar toolCount={toolCount} />

      {/* ── AD: Below Hero ── */}
      <HomeAdBelowHero />

      {/* ── TOOL HIGHLIGHTS (Bento) ── */}
      <ToolHighlights />

      {/* ── KEY FEATURES ── */}
      <section className="py-24 px-6 border-y border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="accent-bar mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why CodelithLabs?
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Built with privacy, performance, and engineering excellence in mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Lock, title: "100% Privacy First", desc: "All tools process data in your browser. Your files and data never leave your device.", color: "blue" },
              { icon: Zap, title: "Lightning Fast", desc: "Client-side processing means instant results with no server delays or uploads.", color: "green" },
              { icon: Users, title: "No Sign-Up Required", desc: "Start using any tool immediately. No registration, no email, no tracking.", color: "purple" },
              { icon: TrendingUp, title: "Always Growing", desc: "New tools added regularly based on user feedback and trending developer needs.", color: "orange" },
              { icon: Globe, title: "Works Offline", desc: "Once loaded, tools work without internet connection. Perfect for travel.", color: "teal" },
              { icon: Star, title: "Free Forever", desc: "No premium tiers, no paywalls, no limits. All tools are 100% free to use.", color: "pink" },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all`}
                >
                  <div className={`w-11 h-11 bg-${feature.color}-500/10 rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 text-${feature.color}-400`} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECTS ── */}
      <FeaturedProjects />

      {/* ── AD: Mid-page ── */}
      <HomeAdMid />

      {/* ── TOOL CATEGORIES ── */}
      <section className="py-24 px-6 bg-zinc-950/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="accent-bar mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Explore by Category
            </h2>
            <p className="text-lg text-zinc-400">Find the right tool for any task</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.entries(categoryStats).map(([category, count]) => (
              <Link
                key={category}
                href={`/tools?category=${category}`}
                className="group p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.15] transition-all text-center"
              >
                <div className="text-2xl font-bold text-white mb-1 font-mono group-hover:text-glow-blue transition-colors">
                  {count}
                </div>
                <div className="text-xs font-medium text-zinc-400 capitalize">{category}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── AD: Above CTA ── */}
      <HomeAdBottom />

      {/* ── CTA SECTION ── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-12 rounded-3xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
            <div className="absolute inset-0 bg-glow-radial opacity-40" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-zinc-400 mb-8 max-w-2xl mx-auto">
                Join thousands of developers and creators using CodelithLabs tools every day.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/tools"
                  className="group flex items-center gap-2 px-7 py-3.5 bg-glow-blue text-white font-semibold rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-glow-blue/20"
                >
                  Browse All Tools
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/team"
                  className="px-7 py-3.5 border border-white/[0.12] text-white font-semibold rounded-xl hover:bg-white/[0.06] transition-all"
                >
                  Meet the Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
