"use client";

import { useState, useRef, useEffect, memo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { locales, type Locale } from "@/i18n/request";

// Locale display configuration with flags and native names
const localeConfig: Record<Locale, { flag: string; name: string; nativeName: string }> = {
  en: { flag: "🇬🇧", name: "English", nativeName: "English" },
  es: { flag: "🇪🇸", name: "Spanish", nativeName: "Español" },
  pt: { flag: "🇧🇷", name: "Portuguese", nativeName: "Português" },
  fr: { flag: "🇫🇷", name: "French", nativeName: "Français" },
  de: { flag: "🇩🇪", name: "German", nativeName: "Deutsch" },
  hi: { flag: "🇮🇳", name: "Hindi", nativeName: "हिन्दी" },
};

interface LocaleSwitcherProps {
  variant?: "desktop" | "mobile";
  onSwitch?: () => void;
}

export const LocaleSwitcher = memo(function LocaleSwitcher({
  variant = "desktop",
  onSwitch,
}: LocaleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Extract current locale from pathname
  const currentLocale = (pathname.split("/")[1] || "en") as Locale;
  const currentConfig = localeConfig[currentLocale] || localeConfig.en;

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Switch locale while preserving path
  const switchLocale = (newLocale: Locale) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "") || "/";
    
    // Construct new path with new locale
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    
    // Navigate to new locale path
    router.push(newPath);
    
    // Close dropdown and trigger callback
    setIsOpen(false);
    onSwitch?.();
  };

  if (variant === "mobile") {
    return (
      <div className="border-t border-white/[0.06] pt-4 mt-4">
        <div className="px-2 mb-2">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" />
            Language
          </div>
        </div>
        <div className="space-y-1">
          {locales.map((locale) => {
            const config = localeConfig[locale];
            const isActive = locale === currentLocale;

            return (
              <button
                key={locale}
                onClick={() => switchLocale(locale)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-white/[0.08] text-white"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <span className="text-xl">{config.flag}</span>
                <span className="text-sm font-medium flex-1 text-left">
                  {config.nativeName}
                </span>
                {isActive && <Check className="w-4 h-4 text-glow-blue" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop variant
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-colors text-zinc-300 hover:text-white"
        aria-label="Switch language"
        title="Switch language"
      >
        <Globe className="w-4 h-4" />
        <span className="text-xl leading-none">{currentConfig.flag}</span>
        <span className="text-xs font-medium uppercase">{currentLocale}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-56 rounded-xl border border-white/[0.08] bg-[#111]/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden z-50"
          >
            <div className="p-2">
              <div className="px-3 py-2 mb-1">
                <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  <Globe className="w-3.5 h-3.5" />
                  Select Language
                </div>
              </div>
              {locales.map((locale) => {
                const config = localeConfig[locale];
                const isActive = locale === currentLocale;

                return (
                  <button
                    key={locale}
                    onClick={() => switchLocale(locale)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? "bg-white/[0.08] text-white"
                        : "text-zinc-400 hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    <span className="text-xl">{config.flag}</span>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">
                        {config.nativeName}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {config.name}
                      </div>
                    </div>
                    {isActive && <Check className="w-4 h-4 text-glow-blue" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
