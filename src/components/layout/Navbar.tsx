"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  Terminal,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Shield,
  Globe,
  Server,
  Code2,
  Image,
  Type,
  Lock,
  Calculator,
  Sparkles,
  BarChart3,
  Search,
  Activity,
  FileText,
  FlaskConical,
  Eye,
  LogIn,
  LogOut,
  User,
  LayoutDashboard,
  Crown,
  Command,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signIn, signOut } from "next-auth/react";
import { defaultLocale, locales, type Locale } from "@/i18n/request";
import { trackClientAnalytics } from "@/lib/analytics/client";
import { LocaleSwitcher } from "./LocaleSwitcher";
import enMessages from "../../../messages/en.json";
import esMessages from "../../../messages/es.json";
import ptMessages from "../../../messages/pt.json";
import frMessages from "../../../messages/fr.json";
import deMessages from "../../../messages/de.json";
import hiMessages from "../../../messages/hi.json";

interface DropdownItemProps {
  name: string;
  href: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  onClick?: () => void;
}

interface SearchResultItem {
  label: string;
  href: string;
  desc: string;
  section: string;
}

type FocusTarget = "first" | "last";

const DropdownItem = memo(function DropdownItem({
  name,
  href,
  desc,
  icon: Icon,
  color,
  onClick,
}: DropdownItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      role="menuitem"
      data-nav-menu-item="true"
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
  name,
  href,
  desc,
  icon: Icon,
  color,
  onClose,
  onClick,
}: DropdownItemProps & { onClose: () => void }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.06] transition-colors"
      onClick={() => {
        onClick?.();
        onClose();
      }}
    >
      <Icon className={`w-4 h-4 ${color}`} />
      <div className="min-w-0">
        <p className="text-sm font-medium text-white">{name}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
      </div>
    </Link>
  );
});

const navSections = [
  {
    labelKey: "common.games.title",
    labelFallback: "Games",
    href: "/games",
    items: [
      { nameKey: "common.games.hub.name", nameFallback: "Games Hub", descKey: "common.games.hub.desc", descFallback: "Free browser games with zero signup", href: "/games", icon: Activity, color: "text-red-400" },
      { nameKey: "common.games.void.name", nameFallback: "VOID", descKey: "common.games.void.desc", descFallback: "3D horror tunnel runner", href: "/games/void", icon: Eye, color: "text-cyan-400" },
    ],
    cta: { labelKey: "common.games.viewAll", labelFallback: "Open Games Hub", href: "/games" },
  },
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

export function Navbar() {
  const router = useRouter();
  const authEnabled = process.env.NEXT_PUBLIC_AUTH_ENABLED === "true";
  const ctaVariant = process.env.NEXT_PUBLIC_NAV_CTA_VARIANT ?? "control";

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [desktopSearchActiveIndex, setDesktopSearchActiveIndex] = useState(-1);
  const [mobileSearchActiveIndex, setMobileSearchActiveIndex] = useState(-1);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionTriggerRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const dropdownPanelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const accountTriggerRef = useRef<HTMLButtonElement>(null);
  const lastSearchFocusRef = useRef<HTMLElement | null>(null);
  const savedScrollTopRef = useRef(0);
  const { data: session, status } = useSession();

  const currentLocale = useMemo<Locale>(() => {
    const firstSegment = pathname?.split("/")[1] as Locale | undefined;
    return locales.includes(firstSegment as Locale) ? (firstSegment as Locale) : defaultLocale;
  }, [pathname]);

  const withLocale = useCallback(
    (href: string) => {
      if (!href.startsWith("/")) return href;
      if (/^\/(en|es|pt|fr|de|hi)(\/|$)/.test(href)) return href;
      return href === "/" ? `/${currentLocale}` : `/${currentLocale}${href}`;
    },
    [currentLocale]
  );

  const t = useCallback(
    (path: string, fallback: string) => {
      const value = path
        .split(".")
        .reduce<any>((acc, key) => (acc && typeof acc === "object" ? acc[key] : undefined), i18nMessages[currentLocale]);
      return typeof value === "string" ? value : fallback;
    },
    [currentLocale]
  );

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

  const searchIndex = useMemo<SearchResultItem[]>(() => {
    const quickLinks: SearchResultItem[] = [
      {
        label: t("common.tools.viewAll", "View All Tools"),
        href: withLocale("/tools"),
        desc: "Explore the full tools catalog",
        section: "Quick Actions",
      },
      {
        label: t("common.navbar.goPremium", "Go Premium"),
        href: withLocale("/pricing"),
        desc: "Unlock premium features",
        section: "Quick Actions",
      },
      {
        label: t("common.research.blog.name", "Blog"),
        href: withLocale("/blog"),
        desc: "Engineering articles and updates",
        section: t("common.research.title", "Research"),
      },
    ];

    const sectionEntries: SearchResultItem[] = localizedNavSections.flatMap((section) => [
      {
        label: section.label,
        href: section.href,
        desc: `${section.label} hub`,
        section: "Sections",
      },
      ...section.items.map((item) => ({
        label: item.name,
        href: item.href,
        desc: item.desc,
        section: section.label,
      })),
    ]);

    const combinedEntries = [...quickLinks, ...sectionEntries];
    const uniqueEntries = new Map<string, SearchResultItem>();

    for (const entry of combinedEntries) {
      const key = `${entry.href}::${entry.label}`;
      if (!uniqueEntries.has(key)) {
        uniqueEntries.set(key, entry);
      }
    }

    return Array.from(uniqueEntries.values());
  }, [localizedNavSections, t, withLocale]);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return searchIndex
      .filter((entry) => `${entry.label} ${entry.desc} ${entry.section}`.toLowerCase().includes(query))
      .slice(0, 8);
  }, [searchIndex, searchQuery]);

  const mobileSearchResults = useMemo(() => {
    const query = mobileSearchQuery.trim().toLowerCase();

    if (!query) {
      return searchIndex.slice(0, 6);
    }

    return searchIndex
      .filter((entry) => `${entry.label} ${entry.desc} ${entry.section}`.toLowerCase().includes(query))
      .slice(0, 10);
  }, [mobileSearchQuery, searchIndex]);

  const trackEvent = useCallback(
    (eventName: string, data: Record<string, string> = {}) => {
      if (typeof window === "undefined") return;

      const analyticsWindow = window as Window & {
        gtag?: (command: string, action: string, params?: Record<string, string>) => void;
      };

      if (typeof analyticsWindow.gtag === "function") {
        analyticsWindow.gtag("event", eventName, {
          nav_variant: ctaVariant,
          ...data,
        });
      }

      void trackClientAnalytics({
        eventName,
        eventType: "NAV_INTERACTION",
        path: window.location.pathname,
        source: "navbar",
        locale: currentLocale,
        metadata: {
          nav_variant: ctaVariant,
          ...data,
        },
      });
    },
    [ctaVariant, currentLocale]
  );

  const closeMobileDrawer = useCallback(() => {
    setMobileOpen(false);
    setMobileSearchQuery("");
    setMobileSearchActiveIndex(-1);
  }, []);

  const navigateToSearchResult = useCallback(
    (result: SearchResultItem, source: "desktop" | "mobile") => {
      trackEvent(source === "desktop" ? "nav_search_select" : "nav_mobile_search_select", {
        label: result.label,
        section: result.section,
      });

      if (source === "desktop") {
        setIsSearchOpen(false);
        setSearchQuery("");
        setDesktopSearchActiveIndex(-1);
      } else {
        closeMobileDrawer();
      }

      router.push(result.href);
    },
    [closeMobileDrawer, router, trackEvent]
  );

  const getWrappedIndex = useCallback((nextIndex: number, length: number) => {
    if (length <= 0) return -1;
    return (nextIndex + length) % length;
  }, []);

  const getPreferredScrollBehavior = useCallback((): ScrollBehavior => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return "auto";
    }

    return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  }, []);

  const focusSectionTrigger = useCallback(
    (sectionLabel: string) => {
      const sectionIndex = localizedNavSections.findIndex((section) => section.label === sectionLabel);
      if (sectionIndex < 0) return;

      requestAnimationFrame(() => {
        sectionTriggerRefs.current[sectionIndex]?.focus();
      });
    },
    [localizedNavSections]
  );

  const focusDropdownItem = useCallback((sectionLabel: string, target: FocusTarget) => {
    requestAnimationFrame(() => {
      const panel = dropdownPanelRefs.current[sectionLabel];
      if (!panel) return;

      const focusables = panel.querySelectorAll<HTMLElement>('[data-nav-menu-item="true"]');
      if (!focusables.length) return;

      if (target === "first") {
        focusables[0]?.focus();
      } else {
        focusables[focusables.length - 1]?.focus();
      }
    });
  }, []);

  const closeDropdownWithFocus = useCallback(
    (sectionLabel: string | null) => {
      if (sectionLabel) {
        focusSectionTrigger(sectionLabel);
      }
      setActiveDropdown(null);
    },
    [focusSectionTrigger]
  );

  const closeAccountMenuWithFocus = useCallback(() => {
    setAccountMenuOpen(false);
    requestAnimationFrame(() => {
      accountTriggerRef.current?.focus();
    });
  }, []);

  const closeSearchWithFocus = useCallback(() => {
    setIsSearchOpen(false);
    const previousFocusedElement = lastSearchFocusRef.current;
    requestAnimationFrame(() => {
      previousFocusedElement?.focus();
    });
  }, []);

  useEffect(() => {
    if (!isSearchOpen || desktopSearchActiveIndex < 0) return;

    const activeOption = document.getElementById(
      `desktop-nav-search-option-${desktopSearchActiveIndex}`
    );

    activeOption?.scrollIntoView({
      block: "nearest",
      behavior: getPreferredScrollBehavior(),
    });
  }, [desktopSearchActiveIndex, getPreferredScrollBehavior, isSearchOpen]);

  useEffect(() => {
    if (!mobileOpen || mobileSearchActiveIndex < 0) return;

    const activeOption = document.getElementById(
      `mobile-nav-search-option-${mobileSearchActiveIndex}`
    );

    activeOption?.scrollIntoView({
      block: "nearest",
      behavior: getPreferredScrollBehavior(),
    });
  }, [getPreferredScrollBehavior, mobileOpen, mobileSearchActiveIndex]);

  useEffect(() => {
    if (!mobileOpen) return;

    savedScrollTopRef.current = window.scrollY;
    const original = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
    };

    document.body.style.position = "fixed";
    document.body.style.top = `-${savedScrollTopRef.current}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.position = original.position;
      document.body.style.top = original.top;
      document.body.style.width = original.width;
      document.body.style.overflow = original.overflow;
      window.scrollTo(0, savedScrollTopRef.current);
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (activeDropdown) {
          event.preventDefault();
          closeDropdownWithFocus(activeDropdown);
          return;
        }

        if (accountMenuOpen) {
          event.preventDefault();
          closeAccountMenuWithFocus();
          return;
        }

        if (isSearchOpen) {
          event.preventDefault();
          closeSearchWithFocus();
        }
      }

      const isTypingElement =
        event.target instanceof HTMLElement && ["INPUT", "TEXTAREA"].includes(event.target.tagName);

      if (!isTypingElement && (event.key === "/" || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k"))) {
        event.preventDefault();
        lastSearchFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        setIsSearchOpen(true);
        requestAnimationFrame(() => searchInputRef.current?.focus());
      }
    };

    const onClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }

      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onClickOutside);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onClickOutside);
    };
  }, [accountMenuOpen, activeDropdown, closeAccountMenuWithFocus, closeDropdownWithFocus, closeSearchWithFocus, isSearchOpen]);

  const handleMouseEnter = useCallback((label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveDropdown(label);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 200);
  }, []);

  const handleSectionKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLAnchorElement>, sectionLabel: string, sectionIndex: number) => {
      const totalSections = localizedNavSections.length;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        const nextIndex = (sectionIndex + 1) % totalSections;
        sectionTriggerRefs.current[nextIndex]?.focus();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        const previousIndex = (sectionIndex - 1 + totalSections) % totalSections;
        sectionTriggerRefs.current[previousIndex]?.focus();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveDropdown(sectionLabel);
        focusDropdownItem(sectionLabel, "first");
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveDropdown(sectionLabel);
        focusDropdownItem(sectionLabel, "last");
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        closeDropdownWithFocus(sectionLabel);
      }
    },
    [closeDropdownWithFocus, focusDropdownItem, localizedNavSections.length]
  );

  const handleDropdownKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>, sectionLabel: string, sectionIndex: number) => {
      const panel = dropdownPanelRefs.current[sectionLabel];
      if (!panel) return;

      const focusables = Array.from(panel.querySelectorAll<HTMLElement>('[data-nav-menu-item="true"]'));
      if (!focusables.length) return;

      const currentIndex = focusables.findIndex((element) => element === document.activeElement);

      if (event.key === "ArrowDown") {
        event.preventDefault();
        const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % focusables.length;
        focusables[nextIndex]?.focus();
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        const previousIndex = currentIndex < 0 ? focusables.length - 1 : (currentIndex - 1 + focusables.length) % focusables.length;
        focusables[previousIndex]?.focus();
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        focusables[0]?.focus();
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        focusables[focusables.length - 1]?.focus();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        const nextIndex = (sectionIndex + 1) % localizedNavSections.length;
        const nextSection = localizedNavSections[nextIndex];
        setActiveDropdown(nextSection.label);
        sectionTriggerRefs.current[nextIndex]?.focus();
        focusDropdownItem(nextSection.label, "first");
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        const previousIndex = (sectionIndex - 1 + localizedNavSections.length) % localizedNavSections.length;
        const previousSection = localizedNavSections[previousIndex];
        setActiveDropdown(previousSection.label);
        sectionTriggerRefs.current[previousIndex]?.focus();
        focusDropdownItem(previousSection.label, "first");
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        closeDropdownWithFocus(sectionLabel);
      }
    },
    [closeDropdownWithFocus, focusDropdownItem, localizedNavSections]
  );

  return (
    <>
      <motion.nav
        initial={false}
        animate={{ y: 0 }}
        transition={{ duration: 0 }}
        className={`fixed top-0 w-full z-50 border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl transition-all duration-200 ${
          isScrolled ? "h-14" : "h-16"
        }`}
      >
        <div
          className={`max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4 transition-all duration-200 ${
            isScrolled ? "h-14" : "h-16"
          }`}
        >
          <Link
            href={withLocale("/")}
            aria-label="CodelithLabs home"
            className="text-xl font-bold tracking-tighter text-white flex items-center gap-2.5 group shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-glow-blue/10 border border-glow-blue/20 flex items-center justify-center group-hover:border-glow-blue/40 transition-colors">
              <Terminal className="w-4 h-4 text-glow-blue" />
            </div>
            <span className="hidden sm:inline">
              Codelith<span className="text-glow-blue">Labs</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5 shrink-0">
            {localizedNavSections.map((section, sectionIndex) => (
              <div
                key={section.label}
                className="relative"
                onMouseEnter={() => handleMouseEnter(section.label)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  ref={(element) => {
                    sectionTriggerRefs.current[sectionIndex] = element;
                  }}
                  href={section.href}
                  onFocus={() => handleMouseEnter(section.label)}
                  onClick={() => trackEvent("nav_section_click", { section: section.label })}
                  onKeyDown={(event) => handleSectionKeyDown(event, section.label, sectionIndex)}
                  aria-haspopup="menu"
                  aria-expanded={activeDropdown === section.label}
                  className={`flex items-center gap-1 px-2.5 py-2 text-[13px] font-medium rounded-lg transition-colors ${
                    activeDropdown === section.label || pathname.startsWith(section.href)
                      ? "text-white bg-white/[0.06]"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {section.label}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === section.label ? "rotate-180" : ""
                    }`}
                  />
                </Link>

                <AnimatePresence>
                  {activeDropdown === section.label && (
                    <motion.div
                      ref={(element) => {
                        dropdownPanelRefs.current[section.label] = element;
                      }}
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      role="menu"
                      aria-label={section.label}
                      onKeyDown={(event) => handleDropdownKeyDown(event, section.label, sectionIndex)}
                      className="absolute top-full left-0 mt-1 w-[320px] rounded-xl border border-white/[0.08] bg-[#111]/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden"
                      onMouseEnter={() => handleMouseEnter(section.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="p-2">
                        {section.items.map((item) => (
                          <DropdownItem
                            key={item.name}
                            {...item}
                            onClick={() => trackEvent("nav_dropdown_click", { section: section.label, item: item.name })}
                          />
                        ))}
                      </div>
                      {section.cta && (
                        <div className="border-t border-white/[0.06] p-2">
                          <Link
                            href={section.cta.href}
                            data-nav-menu-item="true"
                            onClick={() =>
                              trackEvent("nav_section_cta_click", {
                                section: section.label,
                                label: section.cta?.label ?? "",
                              })
                            }
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

          <div className="hidden lg:block flex-1 min-w-[280px] max-w-[460px] ml-2 mr-1" ref={searchContainerRef}>
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={isSearchOpen && searchResults.length > 0}
                aria-controls="desktop-nav-search-listbox"
                aria-activedescendant={
                  desktopSearchActiveIndex >= 0
                    ? `desktop-nav-search-option-${desktopSearchActiveIndex}`
                    : undefined
                }
                onFocus={() => {
                  setIsSearchOpen(true);
                  if (searchResults.length > 0 && desktopSearchActiveIndex < 0) {
                    setDesktopSearchActiveIndex(0);
                  }
                }}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setIsSearchOpen(true);
                  setDesktopSearchActiveIndex(0);
                }}
                onKeyDown={(event) => {
                  if (!searchResults.length) return;

                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setIsSearchOpen(true);
                    setDesktopSearchActiveIndex((prev) => getWrappedIndex(prev + 1, searchResults.length));
                    return;
                  }

                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setIsSearchOpen(true);
                    setDesktopSearchActiveIndex((prev) =>
                      getWrappedIndex((prev < 0 ? 0 : prev) - 1, searchResults.length)
                    );
                    return;
                  }

                  if (event.key === "Home") {
                    event.preventDefault();
                    setDesktopSearchActiveIndex(0);
                    return;
                  }

                  if (event.key === "End") {
                    event.preventDefault();
                    setDesktopSearchActiveIndex(searchResults.length - 1);
                    return;
                  }

                  if (event.key === "Enter") {
                    if (desktopSearchActiveIndex >= 0 && searchResults[desktopSearchActiveIndex]) {
                      event.preventDefault();
                      navigateToSearchResult(searchResults[desktopSearchActiveIndex], "desktop");
                    }
                  }
                }}
                placeholder={t("common.navbar.searchPlaceholder", "Search tools, projects, pages...")}
                className="w-full h-10 rounded-xl border border-white/[0.10] bg-white/[0.04] pl-10 pr-20 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-glow-blue/50 focus:bg-white/[0.06] transition-colors"
                aria-label={t("common.navbar.searchLabel", "Search navigation")}
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 border border-white/[0.10] bg-white/[0.04] rounded-md px-1.5 py-0.5 flex items-center gap-1">
                <Command className="w-3 h-3" />K
              </span>

              <AnimatePresence>
                {isSearchOpen && searchQuery.trim().length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.14 }}
                    role="listbox"
                    id="desktop-nav-search-listbox"
                    className="absolute mt-2 w-full rounded-xl border border-white/[0.10] bg-[#101010]/95 backdrop-blur-xl shadow-2xl shadow-black/40 p-2 z-50"
                  >
                    {searchResults.length > 0 ? (
                      <div className="space-y-1">
                        {searchResults.map((result, index) => (
                          <Link
                            key={`${result.href}-${result.label}`}
                            href={result.href}
                            id={`desktop-nav-search-option-${index}`}
                            role="option"
                            aria-selected={desktopSearchActiveIndex === index}
                            tabIndex={desktopSearchActiveIndex === index ? 0 : -1}
                            onMouseEnter={() => setDesktopSearchActiveIndex(index)}
                            onFocus={() => setDesktopSearchActiveIndex(index)}
                            onKeyDown={(event) => {
                              if (event.key === "ArrowDown") {
                                event.preventDefault();
                                setDesktopSearchActiveIndex((prev) =>
                                  getWrappedIndex(prev + 1, searchResults.length)
                                );
                                return;
                              }

                              if (event.key === "ArrowUp") {
                                event.preventDefault();
                                setDesktopSearchActiveIndex((prev) =>
                                  getWrappedIndex((prev < 0 ? 0 : prev) - 1, searchResults.length)
                                );
                                return;
                              }

                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                navigateToSearchResult(result, "desktop");
                              }
                            }}
                            onClick={() => {
                              navigateToSearchResult(result, "desktop");
                            }}
                            className={`block p-2 rounded-lg transition-colors ${
                              desktopSearchActiveIndex === index
                                ? "bg-white/[0.08]"
                                : "hover:bg-white/[0.06]"
                            }`}
                          >
                            <p className="text-sm text-white font-medium">{result.label}</p>
                            <p className="text-xs text-zinc-500">
                              {result.desc} · {result.section}
                            </p>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-500 px-2 py-3">No matches found.</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden 2xl:flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/5">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/45 animate-ping" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[11px] font-medium text-emerald-300">{t("common.status.operational", "Systems Healthy")}</span>
            </div>

            <Link
              href={withLocale("/pricing")}
              onClick={() => trackEvent("nav_primary_cta_click", { label: "go_premium", variant: ctaVariant })}
              className="hidden sm:flex px-4 py-2 bg-white text-black rounded-lg font-semibold text-sm hover:bg-zinc-200 transition-colors"
            >
              {t("common.navbar.goPremium", "Go Premium")}
            </Link>

            <div className="hidden sm:block">
              <LocaleSwitcher variant="desktop" />
            </div>

            {authEnabled && status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />
            ) : authEnabled && session?.user ? (
              <div className="hidden sm:flex relative" ref={accountMenuRef}>
                <button
                  ref={accountTriggerRef}
                  onClick={() => setAccountMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2 py-1.5 hover:bg-white/[0.06] transition-colors"
                  aria-haspopup="menu"
                  aria-expanded={accountMenuOpen}
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name ?? "User"}
                      width={28}
                      height={28}
                      className="w-7 h-7 rounded-full border border-zinc-700"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-400" />
                    </div>
                  )}
                  <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${accountMenuOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {accountMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.14 }}
                      role="menu"
                      className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-white/[0.08] bg-[#111]/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden"
                    >
                      <div className="p-3 border-b border-white/[0.06]">
                        <p className="text-sm text-white font-medium truncate">{session.user.name ?? "User"}</p>
                        <p className="text-xs text-zinc-500 truncate">{session.user.email ?? ""}</p>
                      </div>

                      <div className="p-2 space-y-1">
                        <Link
                          href={withLocale("/dashboard")}
                          onClick={() => {
                            trackEvent("nav_account_click", { action: "dashboard" });
                            setAccountMenuOpen(false);
                          }}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.06] text-sm text-zinc-300 hover:text-white"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>

                        <Link
                          href={withLocale("/pricing")}
                          onClick={() => {
                            trackEvent("nav_account_click", { action: "premium" });
                            setAccountMenuOpen(false);
                          }}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.06] text-sm text-zinc-300 hover:text-white"
                        >
                          <Crown className="w-4 h-4 text-amber-400" />
                          Premium
                        </Link>

                        <button
                          onClick={() => {
                            trackEvent("nav_account_click", { action: "sign_out" });
                            closeAccountMenuWithFocus();
                            signOut();
                          }}
                          className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.06] text-sm text-zinc-300 hover:text-white"
                        >
                          <LogOut className="w-4 h-4" />
                          {t("common.navbar.signOut", "Sign Out")}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : authEnabled ? (
              <button
                onClick={() => {
                  trackEvent("nav_auth_click", { action: "sign_in" });
                  signIn("google");
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-700 hover:border-zinc-600 text-sm text-zinc-300 hover:text-white transition-colors"
              >
                <LogIn className="w-4 h-4" />
                {t("common.navbar.signIn", "Sign In")}
              </button>
            ) : null}

            <button
              onClick={() => {
                if (mobileOpen) {
                  closeMobileDrawer();
                  return;
                }
                setMobileOpen(true);
              }}
              className="lg:hidden p-2 rounded-lg hover:bg-white/[0.06] transition-colors text-white"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={closeMobileDrawer}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
              role="dialog"
              aria-modal="true"
              className="fixed top-0 right-0 bottom-0 z-50 w-[85%] max-w-sm bg-[#0d0d0d] border-l border-white/[0.08] overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                <Link
                  href={withLocale("/")}
                  aria-label="CodelithLabs home"
                  className="flex items-center gap-2 text-white font-bold"
                  onClick={closeMobileDrawer}
                >
                  <Terminal className="w-4 h-4 text-glow-blue" />
                  CodelithLabs
                </Link>
                <button onClick={closeMobileDrawer} className="p-2 rounded-lg hover:bg-white/[0.06] text-zinc-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mx-6 mt-4 rounded-xl border border-white/[0.08] bg-[#111]/90 p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                    <Command className="w-3.5 h-3.5" />
                    Command Search
                  </div>
                  <span className="text-[10px] text-zinc-500">{mobileSearchResults.length} results</span>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={mobileSearchQuery}
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={mobileSearchResults.length > 0}
                    aria-controls="mobile-nav-search-listbox"
                    aria-activedescendant={
                      mobileSearchActiveIndex >= 0
                        ? `mobile-nav-search-option-${mobileSearchActiveIndex}`
                        : undefined
                    }
                    onChange={(event) => {
                      setMobileSearchQuery(event.target.value);
                      setMobileSearchActiveIndex(0);
                    }}
                    onFocus={() => {
                      if (mobileSearchResults.length > 0 && mobileSearchActiveIndex < 0) {
                        setMobileSearchActiveIndex(0);
                      }
                    }}
                    onKeyDown={(event) => {
                      if (!mobileSearchResults.length) return;

                      if (event.key === "ArrowDown") {
                        event.preventDefault();
                        setMobileSearchActiveIndex((prev) =>
                          getWrappedIndex(prev + 1, mobileSearchResults.length)
                        );
                        return;
                      }

                      if (event.key === "ArrowUp") {
                        event.preventDefault();
                        setMobileSearchActiveIndex((prev) =>
                          getWrappedIndex((prev < 0 ? 0 : prev) - 1, mobileSearchResults.length)
                        );
                        return;
                      }

                      if (event.key === "Home") {
                        event.preventDefault();
                        setMobileSearchActiveIndex(0);
                        return;
                      }

                      if (event.key === "End") {
                        event.preventDefault();
                        setMobileSearchActiveIndex(mobileSearchResults.length - 1);
                        return;
                      }

                      if (event.key === "Enter") {
                        if (mobileSearchActiveIndex >= 0 && mobileSearchResults[mobileSearchActiveIndex]) {
                          event.preventDefault();
                          navigateToSearchResult(mobileSearchResults[mobileSearchActiveIndex], "mobile");
                        }
                      }
                    }}
                    placeholder={t("common.navbar.searchPlaceholder", "Search tools, projects, pages...")}
                    className="w-full h-10 rounded-xl border border-white/[0.10] bg-white/[0.04] pl-9 pr-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-glow-blue/50 focus:bg-white/[0.06] transition-colors"
                    aria-label={t("common.navbar.searchLabel", "Search navigation")}
                  />
                </div>
                <div className="space-y-1 max-h-52 overflow-y-auto pr-1" role="listbox" id="mobile-nav-search-listbox">
                  {mobileSearchResults.map((result, index) => (
                    <Link
                      key={`mobile-${result.href}-${result.label}`}
                      href={result.href}
                      id={`mobile-nav-search-option-${index}`}
                      role="option"
                      aria-selected={mobileSearchActiveIndex === index}
                      tabIndex={mobileSearchActiveIndex === index ? 0 : -1}
                      onMouseEnter={() => setMobileSearchActiveIndex(index)}
                      onFocus={() => setMobileSearchActiveIndex(index)}
                      onKeyDown={(event) => {
                        if (event.key === "ArrowDown") {
                          event.preventDefault();
                          setMobileSearchActiveIndex((prev) =>
                            getWrappedIndex(prev + 1, mobileSearchResults.length)
                          );
                          return;
                        }

                        if (event.key === "ArrowUp") {
                          event.preventDefault();
                          setMobileSearchActiveIndex((prev) =>
                            getWrappedIndex((prev < 0 ? 0 : prev) - 1, mobileSearchResults.length)
                          );
                          return;
                        }

                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          navigateToSearchResult(result, "mobile");
                        }
                      }}
                      onClick={() => {
                        navigateToSearchResult(result, "mobile");
                      }}
                      className={`block rounded-lg px-2.5 py-2 transition-colors ${
                        mobileSearchActiveIndex === index
                          ? "bg-white/[0.08]"
                          : "hover:bg-white/[0.06]"
                      }`}
                    >
                      <p className="text-sm text-white font-medium">{result.label}</p>
                      <p className="text-xs text-zinc-500">{result.desc} · {result.section}</p>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mx-6 mt-4 flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-400/20 bg-emerald-500/5">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/45 animate-ping" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                <span className="text-xs font-medium text-emerald-300">{t("common.status.allSystemsOperational", "All Systems Operational")}</span>
              </div>

              <div className="p-6 space-y-6">
                {localizedNavSections.map((section) => (
                  <div key={section.label}>
                    <Link
                      href={section.href}
                      className={`text-xs font-mono uppercase tracking-widest mb-3 block ${pathname.startsWith(section.href) ? "text-glow-blue" : "text-zinc-500"}`}
                      onClick={closeMobileDrawer}
                    >
                      {section.label}
                    </Link>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <MobileDropdownItem
                          key={item.name}
                          {...item}
                          onClick={() => trackEvent("nav_mobile_item_click", { section: section.label, item: item.name })}
                          onClose={closeMobileDrawer}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-white/[0.06] space-y-3">
                {authEnabled && session?.user ? (
                  <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
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
                      onClick={() => {
                        trackEvent("nav_mobile_auth_click", { action: "sign_out" });
                        signOut();
                        closeMobileDrawer();
                      }}
                      className="text-xs text-zinc-400 hover:text-white px-2 py-1"
                    >
                      {t("common.navbar.signOut", "Sign Out")}
                    </button>
                  </div>
                ) : authEnabled ? (
                  <button
                    onClick={() => {
                      trackEvent("nav_mobile_auth_click", { action: "sign_in" });
                      signIn("google");
                      closeMobileDrawer();
                    }}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-zinc-700 text-zinc-300 text-sm font-medium hover:bg-white/[0.04] transition-colors mb-3"
                  >
                    <LogIn className="w-4 h-4" />
                    {t("common.navbar.signInWithGoogle", "Sign In with Google")}
                  </button>
                ) : null}

                <Link
                  href={withLocale("/tools")}
                  onClick={() => {
                    trackEvent("nav_mobile_cta_click", { label: "view_all_tools" });
                    closeMobileDrawer();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-glow-blue/30 text-glow-blue text-sm font-medium hover:bg-glow-blue/10 transition-colors"
                >
                  {t("common.tools.viewAll", "View All Tools")}
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href={withLocale("/pricing")}
                  onClick={() => {
                    trackEvent("nav_mobile_cta_click", { label: "go_premium", variant: ctaVariant });
                    closeMobileDrawer();
                  }}
                  className="flex items-center justify-center w-full py-3 rounded-lg bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-colors"
                >
                  {t("common.navbar.goPremium", "Go Premium")}
                </Link>

                <LocaleSwitcher variant="mobile" onSwitch={closeMobileDrawer} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
