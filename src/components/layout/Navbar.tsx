"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

// ═══════════════════════════════════════════════════════════════════════════
// MEGA-MENU DATA
// ═══════════════════════════════════════════════════════════════════════════

const navSections = [
  {
    label: "R&D Projects",
    href: "/projects",
    items: [
      { name: "VectorDefense", desc: "C++ Tower Defense Engine", href: "/projects/vectordefense", icon: Shield, color: "text-blue-400" },
      { name: "CITK-Connect", desc: "Campus Connectivity Platform", href: "/projects/citk-connect", icon: Globe, color: "text-purple-400" },
      { name: "Core-S Infrastructure", desc: "Self-hosted Linux Architecture", href: "/projects/core-s", icon: Server, color: "text-green-400" },
    ],
  },
  {
    label: "Developer Tools",
    href: "/tools",
    items: [
      { name: "Developer Utilities", desc: "JSON, Regex, JWT & more", href: "/tools/category/developer", icon: Code2, color: "text-violet-400" },
      { name: "Image Processing", desc: "Compress, convert, resize", href: "/tools/category/image", icon: Image, color: "text-emerald-400" },
      { name: "Text & Content", desc: "Word count, case convert, diff", href: "/tools/category/text", icon: Type, color: "text-blue-400" },
      { name: "Security & Crypto", desc: "Hash, password, encoders", href: "/tools/category/security", icon: Lock, color: "text-orange-400" },
      { name: "Calculators", desc: "Finance, math, converters", href: "/tools/category/calculator", icon: Calculator, color: "text-red-400" },
      { name: "Generators", desc: "Password, QR, Lorem Ipsum", href: "/tools/category/generator", icon: Sparkles, color: "text-pink-400" },
    ],
    cta: { label: "View All 90+ Tools", href: "/tools" },
  },
  {
    label: "Transparency",
    href: "/transparency",
    items: [
      { name: "Financial Dashboard", desc: "Complete expense breakdown", href: "/transparency", icon: BarChart3, color: "text-green-400" },
      { name: "Tech Stack", desc: "Our infrastructure transparency", href: "/tech-stack", icon: Eye, color: "text-cyan-400" },
    ],
  },
  {
    label: "Research",
    href: "/research",
    items: [
      { name: "Research Logs", desc: "Technical papers & analysis", href: "/research", icon: FlaskConical, color: "text-blue-400" },
      { name: "Blog", desc: "Engineering articles", href: "/blog", icon: FileText, color: "text-zinc-400" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const { data: session, status } = useSession();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
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
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
        className="fixed top-0 w-full z-50 border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* ── Logo ── */}
          <Link href="/" className="text-xl font-bold tracking-tighter text-white flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-glow-blue/10 border border-glow-blue/20 flex items-center justify-center group-hover:border-glow-blue/40 transition-colors">
              <Terminal className="w-4 h-4 text-glow-blue" />
            </div>
            <span className="hidden sm:inline">
              Codelith<span className="text-glow-blue">Labs</span>
            </span>
          </Link>

          {/* ── Desktop Nav Items ── */}
          <div className="hidden lg:flex items-center gap-1">
            {navSections.map((section) => (
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
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.06] transition-colors group/item"
                            >
                              <div className={`w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0 group-hover/item:border-white/[0.15] transition-colors`}>
                                <Icon className={`w-4 h-4 ${item.color}`} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-white">{item.name}</p>
                                <p className="text-xs text-zinc-500 mt-0.5">{item.desc}</p>
                              </div>
                            </Link>
                          );
                        })}
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
              <span className="text-xs font-mono text-zinc-400">Operational</span>
            </div>

            {/* Hire Us CTA */}
            <Link
              href="/contact"
              className="hidden sm:flex px-4 py-2 bg-white text-black rounded-lg font-bold text-sm hover:bg-zinc-200 transition-colors"
            >
              Hire Us
            </Link>

            {/* Auth Button */}
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />
            ) : session?.user ? (
              <div className="hidden sm:flex items-center gap-2">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? "User"}
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
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-700 hover:border-zinc-600 text-sm text-zinc-300 hover:text-white transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}

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
                <Link href="/" className="flex items-center gap-2 text-white font-bold" onClick={() => setMobileOpen(false)}>
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
                <span className="text-xs font-mono text-zinc-400">All Systems Operational</span>
              </div>

              {/* Nav Sections */}
              <div className="p-6 space-y-6">
                {navSections.map((section) => (
                  <div key={section.label}>
                    <Link
                      href={section.href}
                      className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3 block"
                      onClick={() => setMobileOpen(false)}
                    >
                      {section.label}
                    </Link>
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.06] transition-colors"
                            onClick={() => setMobileOpen(false)}
                          >
                            <Icon className={`w-4 h-4 ${item.color}`} />
                            <div>
                              <p className="text-sm text-white font-medium">{item.name}</p>
                              <p className="text-xs text-zinc-500">{item.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom CTAs */}
              <div className="p-6 border-t border-white/[0.06] space-y-3">
                {/* Auth in Mobile */}
                {session?.user ? (
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
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { signIn("google"); setMobileOpen(false); }}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-zinc-700 text-zinc-300 text-sm font-medium hover:bg-white/[0.04] transition-colors mb-3"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In with Google
                  </button>
                )}

                <Link
                  href="/tools"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-glow-blue/30 text-glow-blue text-sm font-medium hover:bg-glow-blue/10 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  View All Tools
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center justify-center w-full py-3 rounded-lg bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Hire Us
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}