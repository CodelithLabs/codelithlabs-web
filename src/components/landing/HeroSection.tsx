"use client";

import { ArrowRight, FlaskConical, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export function HeroSection() {
  const t = useTranslations();
  const pathname = usePathname();
  
  // Extract current locale from pathname
  const currentLocale = pathname.split("/")[1] || "en";
  
  // Locale-aware link helper
  const withLocale = (href: string) => `/${currentLocale}${href}`;
  
  // Badge configuration with translations
  const badges = useMemo(() => [
    { label: t("hero.badges.freeTools"), icon: Zap, color: "text-glow-blue" },
    { label: t("hero.badges.clientSide"), icon: Shield, color: "text-glow-green" },
    { label: t("hero.badges.openSource"), icon: FlaskConical, color: "text-glow-cyan" },
  ], [t]);

  return (
    <section className="hero-critical relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated Grid Background */}
      <div className="hero-bg-grid absolute inset-0 bg-grid-pattern opacity-40" />
      <div className="hero-bg-glow absolute inset-0 bg-glow-radial opacity-60" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0a0a0a] to-transparent" />

      <div className="hero-content relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Lab Badge */}
        <div className="inline-flex items-center gap-2 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm">
            <span className="status-dot" />
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              {t("hero.labActive")}
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="hero-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.05] mb-6">
          {t("hero.title.line1")}
          <br />
          <span className="bg-gradient-to-r from-glow-blue via-glow-cyan to-glow-blue bg-clip-text text-transparent">
            {t("hero.title.line2")}
          </span>
        </h1>

        {/* Subheadline */}
        <p className="hero-subtitle text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          {t("hero.subtitle")}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link
            href={withLocale("/tools")}
            className="group flex items-center gap-2 px-7 py-3.5 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-700/20 hover:shadow-blue-600/40"
          >
            {t("hero.cta.exploreTools")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href={withLocale("/research")}
            className="flex items-center gap-2 px-7 py-3.5 border border-white/[0.12] text-white font-semibold rounded-xl hover:bg-white/[0.06] transition-all"
          >
            {t("hero.cta.viewResearch")}
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02]"
              >
                <Icon className={`w-4 h-4 ${badge.color}`} />
                <span className="text-sm text-zinc-300 font-medium">{badge.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
