"use client";

import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import {
  Terminal, ChevronDown, Menu, X, ArrowRight,
  Shield, Globe, Server, Code2, Image, Type, Lock,
  Calculator, Sparkles, BarChart3, Search, Brain,
  Activity, FileText, FlaskConical, Briefcase, Eye,
  LogIn, LogOut, User
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signIn, signOut } from "next-auth/react";
import { defaultLocale, locales, type Locale } from "@/i18n/request";
import { LocaleSwitcher } from "./LocaleSwitcher";
import enMessages from "../../../messages/en.json";
import esMessages from "../../../messages/es.json";
import ptMessages from "../../../messages/pt.json";
import frMessages from "../../../messages/fr.json";
import deMessages from "../../../messages/de.json";
import hiMessages from "../../../messages/hi.json";

// ═══════════════════════════════════════════════════════════════════════════
// MEMOIZED DROPDOWN ITEM COMPONENTS (performance optimization)
// ═══════════════════════════════════════════════════════════════════════════

interface DropdownItemProps {
  name: string;
  href: string;
  desc: string;
  icon: React.ElementType;
  color: string;
}

const DropdownItem = memo(function DropdownItem({ 
  name, href, desc, icon: Icon, color 
}: DropdownItemProps) {
  return (
    <Link
      href={href}
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.06] transition-colors group/item"
    >
      <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0 group-hover/item:border-white/[0.15] transition-colors">
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-white">{name}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
      </div>
    </Link>
  );
});

const MobileDropdownItem = memo(function MobileDropdownItem({ 
  name, href, desc, icon: Icon, color, onClose 
}: DropdownItemProps & { onClose: () => void }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.06] transition-colors"
      onClick={onClose}
    >
      <Icon className={`w-4 h-4 ${color}`} />
      <div className="min-w-0">
        <p className="text-sm font-medium text-white">{name}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
      </div>
    </Link>
  );
});

// ═══════════════════════════════════════════════════════════════════════════
// MEGA-MENU DATA
// ═══════════════════════════════════════════════════════════════════════════

const navSections = [
  {
    labelKey: "common.projects.title",
    labelFallback: "R&D Projects",
    href: "/projects",
    items: [
      { nameKey: "common.projects.vectordefense.name", nameFallback: "VectorDefense", descKey: "common.projects.vectordefense.desc", descFallback: "C++ Tower Defense Engine", href: "/projects/vectordefense", icon: Shield, color: "text-blue-400" },
      { nameKey: "common.projects.citkConnect.name", nameFallback: "CITK-Connect", descKey: "common.projects.citkConnect.desc", descFallback: "Campus Connectivity Platform", href: "/projects/citk-connect", icon: Globe, color: "text-purple-400" },
      { nameKey: "common.projects.coreS.name", nameFallback: "Core-S Infrastructure", descKey: "common.projects.coreS.desc", descFallback: "Self-hosted Linux Architecture", href: "/projects/core-s", icon: Server, color: "text-green-400" },
    ],
  },
  {
    labelKey: "common.tools.title",
    labelFallback: "Developer Tools",
    href: "/tools",
    items: [
      { nameKey: "common.tools.categories.developer.name", nameFallback: "Developer Utilities", descKey: "common.tools.categories.developer.desc", descFallback: "JSON, Regex, JWT & more", href: "/tools/category/developer", icon: Code2, color: "text-violet-400" },
      { nameKey: "common.tools.categories.image.name", nameFallback: "Image Processing", descKey: "common.tools.categories.image.desc", descFallback: "Compress, convert, resize", href: "/tools/category/image", icon: Image, color: "text-emerald-400" },
      { nameKey: "common.tools.categories.text.name", nameFallback: "Text & Content", descKey: "common.tools.categories.text.desc", descFallback: "Word count, case convert, diff", href: "/tools/category/text", icon: Type, color: "text-blue-400" },
      { nameKey: "common.tools.categories.security.name", nameFallback: "Security & Crypto", descKey: "common.tools.categories.security.desc", descFallback: "Hash, password, encoders", href: "/tools/category/security", icon: Lock, color: "text-orange-400" },
      { nameKey: "common.tools.categories.calculator.name", nameFallback: "Calculators", descKey: "common.tools.categories.calculator.desc", descFallback: "Finance, math, converters", href: "/tools/category/calculator", icon: Calculator, color: "text-red-400" },
      { nameKey: "common.tools.categories.generator.name", nameFallback: "Generators", descKey: "common.tools.categories.generator.desc", descFallback: "Password, QR, Lorem Ipsum", href: "/tools/category/generator", icon: Sparkles, color: "text-pink-400" },
    ],
    cta: { labelKey: "common.tools.viewAll", labelFallback: "View All 200+ Tools", href: "/tools" },
  },
  {
    labelKey: "common.transparency.title",
    labelFallback: "Transparency",
    href: "/transparency",
    items: [
      { nameKey: "common.transparency.financialDashboard.name", nameFallback: "Financial Dashboard", descKey: "common.transparency.financialDashboard.desc", descFallback: "Complete expense breakdown", href: "/transparency", icon: BarChart3, color: "text-green-400" },
      { nameKey: "common.transparency.techStack.name", nameFallback: "Tech Stack", descKey: "common.transparency.techStack.desc", descFallback: "Our infrastructure transparency", href: "/tech-stack", icon: Eye, color: "text-cyan-400" },
    ],
  },
  {
    labelKey: "common.research.title",
    labelFallback: "Research",
    href: "/research",
    items: [
      { nameKey: "common.research.logs.name", nameFallback: "Research Logs", descKey: "common.research.logs.desc", descFallback: "Technical papers & analysis", href: "/research", icon: FlaskConical, color: "text-blue-400" },
      { nameKey: "common.research.blog.name", nameFallback: "Blog", descKey: "common.research.blog.desc", descFallback: "Engineering articles", href: "/blog", icon: FileText, color: "text-zinc-400" },
    ],
  },
];

const i18nMessages: Record<Locale, any> = {
  en: enMessages,
  es: esMessages,
  pt: ptMessages,
  fr: frMessages,
  de: deMessages,
  hi: hiMessages,
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function Navbar() {
  const authEnabled = process.env.NEXT_PUBLIC_AUTH_ENABLED === "true";
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const { data: session, status } = useSession();

  const currentLocale = useMemo<Locale>(() => {
    const firstSegment = pathname?.split("/")[1] as Locale | undefined;
    return locales.includes(firstSegment as Locale) ? (firstSegment as Locale) : defaultLocale;
  }, [pathname]);

  const withLocale = useCallback((href: string) => {
    if (!href.startsWith("/")) return href;
    if (/^\/(en|es|pt|fr|de|hi)(\/|$)/.test(href)) return href;
    return href === "/" ? `/${currentLocale}` : `/${currentLocale}${href}`;
  }, [currentLocale]);

  const t = useCallback((path: string, fallback: string) => {
    const value = path
      .split(".")
      .reduce<any>((acc, key) => (acc && typeof acc === "object" ? acc[key] : undefined), i18nMessages[currentLocale]);
    return typeof value === "string" ? value : fallback;
  }, [currentLocale]);

  const localizedNavSections = useMemo(
    () =>
      navSections.map((section) => ({
        ...section,
        label: t(section.labelKey, section.labelFallback),
        href: withLocale(section.href),
        items: section.items.map((item) => ({
          ...item,
          name: t(item.nameKey, item.nameFallback),
          desc: t(item.descKey, item.descFallback),
          href: withLocale(item.href),
        })),
        cta: section.cta
          ? {
              ...section.cta,
              label: t(section.cta.labelKey, section.cta.labelFallback),
              href: withLocale(section.cta.href),
            }
          : undefined,
      })),
    [t, withLocale]
  );

  // Close mobile drawer on route change
  useEffect(() => {
    const closeMobileMenu = () => {
      setMobileOpen(false);
      setActiveDropdown(null);
    };
    closeMobileMenu();
  }, [pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleMouseEnter = useCallback((label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveDropdown(label);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 200);
  }, []);

  return (
    <>
      <motion.nav
        ref={navRef}
        initial={false}
        animate={{ y: 0 }}
        transition={{ duration: 0 }}
        className="fixed top-0 w-full z-50 border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* ── Logo ── */}
          <Link href={withLocale("/")} aria-label="CodelithLabs home" className="text-xl font-bold tracking-tighter text-white flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-glow-blue/10 border border-glow-blue/20 flex items-center justify-center group-hover:border-glow-blue/40 transition-colors">
              <Terminal className="w-4 h-4 text-glow-blue" />
            </div>
            <span className="hidden sm:inline">
              Codelith<span className="text-glow-blue">Labs</span>
            </span>
          </Link>

          {/* ── Desktop Nav Items ── */}
          <div className="hidden lg:flex items-center gap-1">
            {localizedNavSections.map((section) => (
              <div
                key={section.label}
                className="relative"
                onMouseEnter={() => handleMouseEnter(section.label)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={section.href}
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeDropdown === section.label || pathname.startsWith(section.href)
                      ? "text-white bg-white/[0.06]"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {section.label}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === section.label ? "rotate-180" : ""
                  }`} />
                </Link>

                {/* ── Dropdown Panel ── */}
                <AnimatePresence>
                  {activeDropdown === section.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-[320px] rounded-xl border border-white/[0.08] bg-[#111]/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden"
                      onMouseEnter={() => handleMouseEnter(section.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="p-2">
                        {section.items.map((item) => (
                          <DropdownItem key={item.name} {...item} />
                        ))}
                      </div>
                      {section.cta && (
                        <div className="border-t border-white/[0.06] p-2">
                          <Link
                            href={section.cta.href}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.06] transition-colors text-sm text-glow-blue font-medium"
                          >
                            {section.cta.label}
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* ── Right: Status + CTA + Mobile Toggle ── */}
          <div className="flex items-center gap-3">
            {/* Status indicator (desktop) */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02]">
              <span className="status-dot shrink-0" />
              <span className="text-xs font-mono text-zinc-400">{t("common.status.operational", "Operational")}</span>
            </div>

            {/* Premium CTA */}
            <Link
              href={withLocale("/pricing")}
              className="hidden sm:flex px-4 py-2 bg-white text-black rounded-lg font-bold text-sm hover:bg-zinc-200 transition-colors"
            >
              {t("common.navbar.goPremium", "Go Premium")}
            </Link>

            {/* Locale Switcher */}
            <div className="hidden sm:block">
              <LocaleSwitcher variant="desktop" />
            </div>

            {/* Auth Button */}
            {authEnabled && status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />
            ) : authEnabled && session?.user ? (
              <div className="hidden sm:flex items-center gap-2">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? "User"}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full border border-zinc-700"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-400" />
                  </div>
                )}
                <button
                  onClick={() => signOut()}
                  className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors text-zinc-400 hover:text-white"
                  title={t("common.navbar.signOut", "Sign Out")}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : authEnabled ? (
              <button
                onClick={() => signIn("google")}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-700 hover:border-zinc-600 text-sm text-zinc-300 hover:text-white transition-colors"
              >
                <LogIn className="w-4 h-4" />
                {t("common.navbar.signIn", "Sign In")}
              </button>
            ) : null}

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/[0.06] transition-colors text-white"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ═══════════════════════════════════════════════════════════════
          MOBILE DRAWER
      ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[85%] max-w-sm bg-[#0d0d0d] border-l border-white/[0.08] overflow-y-auto lg:hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                <Link href={withLocale("/")} aria-label="CodelithLabs home" className="flex items-center gap-2 text-white font-bold" onClick={() => setMobileOpen(false)}>
                  <Terminal className="w-4 h-4 text-glow-blue" />
                  CodelithLabs
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/[0.06] text-zinc-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status */}
              <div className="mx-6 mt-4 flex items-center gap-2 px-3 py-2 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                <span className="status-dot shrink-0" />
                <span className="text-xs font-mono text-zinc-400">{t("common.status.allSystemsOperational", "All Systems Operational")}</span>
              </div>

              {/* Nav Sections */}
              <div className="p-6 space-y-6">
                {localizedNavSections.map((section) => (
                  <div key={section.label}>
                    <Link
                      href={section.href}
                      className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3 block"
                      onClick={() => setMobileOpen(false)}
                    >
                      {section.label}
                    </Link>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <MobileDropdownItem
                          key={item.name}
                          {...item}
                          onClose={() => setMobileOpen(false)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom CTAs */}
              <div className="p-6 border-t border-white/[0.06] space-y-3">
                {/* Auth in Mobile */}
                {authEnabled && session?.user ? (
                  <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 mb-3">
                    <div className="flex items-center gap-3">
                      {session.user.image ? (
                        <img src={session.user.image} alt="" className="w-8 h-8 rounded-full border border-zinc-700" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-400" />
                        </div>
                      )}
                      <span className="text-sm text-white truncate max-w-[140px]">{session.user.name}</span>
                    </div>
                    <button
                      onClick={() => { signOut(); setMobileOpen(false); }}
                      className="text-xs text-zinc-400 hover:text-white px-2 py-1"
                    >
                      {t("common.navbar.signOut", "Sign Out")}
                    </button>
                  </div>
                ) : authEnabled ? (
                  <button
                    onClick={() => { signIn("google"); setMobileOpen(false); }}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-zinc-700 text-zinc-300 text-sm font-medium hover:bg-white/[0.04] transition-colors mb-3"
                  >
                    <LogIn className="w-4 h-4" />
                    {t("common.navbar.signInWithGoogle", "Sign In with Google")}
                  </button>
                ) : null}

                <Link
                  href={withLocale("/tools")}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-glow-blue/30 text-glow-blue text-sm font-medium hover:bg-glow-blue/10 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {t("common.tools.viewAll", "View All Tools")}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={withLocale("/pricing")}
                  className="flex items-center justify-center w-full py-3 rounded-lg bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {t("common.navbar.goPremium", "Go Premium")}
                </Link>

                {/* Locale Switcher Mobile */}
                <LocaleSwitcher variant="mobile" onSwitch={() => setMobileOpen(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}