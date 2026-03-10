// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/[locale]/page.tsx
// Home Page — V2.0 "Command Center" Landing
// ═══════════════════════════════════════════════════════════════════════════

import { Metadata } from 'next';
import Link from 'next/link';
import { lazy, Suspense } from 'react';
import {
  ArrowRight, Lock, Zap, Users, TrendingUp, Globe, Star
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { getToolCount, getCategoryStats } from '@/lib/tools-registry';
import { generateLocaleMetadata } from '@/lib/locale-meta';
import { type Locale } from '@/i18n/request';

import { HeroSection } from '@/components/landing/HeroSection';
import { StatsBar } from '@/components/landing/StatsBar';
import { HomeAdBelowHero, HomeAdMid, HomeAdBottom } from '@/components/ads/HomeAds';

// Lazy-load below-fold components to reduce initial JS bundle
const ToolHighlights = lazy(() => import('@/components/landing/ToolHighlights').then(m => ({ default: m.ToolHighlights })));
const FeaturedProjects = lazy(() => import('@/components/landing/FeaturedProjects').then(m => ({ default: m.FeaturedProjects })));

// ═══════════════════════════════════════════════════════════════════════════
// SEO METADATA
// ═══════════════════════════════════════════════════════════════════════════

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  
  const localeMetadata = generateLocaleMetadata({
    path: "/",
    currentLocale: locale,
    title: 'CodelithLabs — Open Source Innovation, System Architecture & Developer Tools',
    description: 'CodelithLabs offers 200+ free developer and fintech tools with 100% client-side processing for privacy, speed, and zero sign-up.',
    image: 'https://codelithlabs.in/og-image.png',
  });
  
  return {
    ...localeMetadata,
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
      ...localeMetadata.openGraph,
      type: 'website',
      siteName: 'CodelithLabs',
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
      description: '200+ free developer and productivity tools with client-side processing',
      images: ['https://codelithlabs.in/og-image.png'],
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const toolCount = getToolCount();
  const categoryStats = getCategoryStats();

  const withLocale = (href: string) => (href === '/' ? `/${locale}` : `/${locale}${href}`);
  const formatCategoryLabel = (category: string) =>
    category
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

  const featureCards = [
    {
      icon: Lock,
      title: t('home.features.privacyFirst.title'),
      desc: t('home.features.privacyFirst.desc'),
      iconWrapperClass: 'bg-blue-500/10',
      iconClass: 'text-blue-400',
    },
    {
      icon: Zap,
      title: t('home.features.lightningFast.title'),
      desc: t('home.features.lightningFast.desc'),
      iconWrapperClass: 'bg-green-500/10',
      iconClass: 'text-green-400',
    },
    {
      icon: Users,
      title: t('home.features.noSignup.title'),
      desc: t('home.features.noSignup.desc'),
      iconWrapperClass: 'bg-purple-500/10',
      iconClass: 'text-purple-400',
    },
    {
      icon: TrendingUp,
      title: t('home.features.alwaysGrowing.title'),
      desc: t('home.features.alwaysGrowing.desc'),
      iconWrapperClass: 'bg-orange-500/10',
      iconClass: 'text-orange-400',
    },
    {
      icon: Globe,
      title: t('home.features.worksOffline.title'),
      desc: t('home.features.worksOffline.desc'),
      iconWrapperClass: 'bg-teal-500/10',
      iconClass: 'text-teal-400',
    },
    {
      icon: Star,
      title: t('home.features.premiumOption.title'),
      desc: t('home.features.premiumOption.desc'),
      iconWrapperClass: 'bg-pink-500/10',
      iconClass: 'text-pink-400',
    },
  ];

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
            description: t('hero.subtitle'),
            url: `https://codelithlabs.in/${locale}`,
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'Any (Web-based)',
            inLanguage: locale,
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

      {/* ── TOOL HIGHLIGHTS (Bento) — Lazy-loaded ── */}
      <Suspense fallback={<div className="py-24 px-6 bg-zinc-950/50 animate-pulse" />}>
        <ToolHighlights />
      </Suspense>

      {/* ── KEY FEATURES ── */}
      <section className="py-24 px-6 border-y border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="accent-bar mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('home.features.title')}
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all`}
                >
                  <div className={`w-11 h-11 ${feature.iconWrapperClass} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 ${feature.iconClass}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECTS — Lazy-loaded ── */}
      <Suspense fallback={<div className="py-24 px-6 bg-zinc-950/30 animate-pulse" />}>
        <FeaturedProjects />
      </Suspense>

      {/* ── AD: Mid-page ── */}
      <HomeAdMid />

      {/* ── TOOL CATEGORIES ── */}
      <section className="py-24 px-6 bg-zinc-950/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="accent-bar mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {t('home.categories.title')}
            </h2>
            <p className="text-lg text-zinc-400">{t('home.categories.subtitle')}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.entries(categoryStats).map(([category, count]) => (
              <Link
                key={category}
                href={withLocale(`/tools?category=${category}`)}
                className="group p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.15] transition-all text-center"
              >
                <div className="text-2xl font-bold text-white mb-1 font-mono group-hover:text-glow-blue transition-colors">
                  {count}
                </div>
                <div className="text-xs font-medium text-zinc-400 capitalize">{formatCategoryLabel(category)}</div>
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
                {t('home.cta.title')}
              </h2>
              <p className="text-lg text-zinc-400 mb-8 max-w-2xl mx-auto">
                {t('home.cta.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href={withLocale('/tools')}
                  className="group flex items-center gap-2 px-7 py-3.5 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-700/20"
                >
                  {t('home.cta.browseAllTools')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href={withLocale('/team')}
                  className="px-7 py-3.5 border border-white/[0.12] text-white font-semibold rounded-xl hover:bg-white/[0.06] transition-all"
                >
                  {t('home.cta.meetTeam')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
