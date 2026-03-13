// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/lib/locale-meta.ts
// Helper functions for generating locale-aware metadata (hreflang, canonical, OG locale)
// ═══════════════════════════════════════════════════════════════════════════

import { defaultLocale, locales, type Locale } from "@/i18n/request";

const SITE_URL = "https://codelithlabs.in";

/**
 * BCP 47 locale code mapping for OpenGraph and html lang attributes
 */
export const BCP47_LOCALE_MAP: Record<Locale, string> = {
  en: "en_US",
  es: "es_ES",
  pt: "pt_BR",
  fr: "fr_FR",
  de: "de_DE",
  hi: "hi_IN",
};

/**
 * Generate language alternates for hreflang tags
 * @param path - The path without locale prefix (e.g., "/tools/json-formatter")
 * @param currentLocale - The current page locale
 * @returns Object with language alternates for metadata
 */
export function getLocaleAlternates(path: string, currentLocale: Locale) {
  // Ensure path starts with /
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  // Generate alternates object for all locales
  const languages: Record<string, string> = {};
  
  locales.forEach((locale) => {
    languages[locale] = `${SITE_URL}/${locale}${cleanPath}`;
  });
  
  // Add x-default pointing to English version
  languages["x-default"] = `${SITE_URL}/en${cleanPath}`;
  
  // Canonical URL points to current locale version
  const canonical = `${SITE_URL}/${currentLocale}${cleanPath}`;
  
  return {
    canonical,
    languages,
  };
}

/**
 * Get OpenGraph locale string in BCP 47 format
 * @param locale - The locale code
 * @returns BCP 47 formatted locale string (e.g., "en_US", "pt_BR")
 */
export function getOgLocale(locale: Locale): string {
  return BCP47_LOCALE_MAP[locale] || BCP47_LOCALE_MAP.en;
}

/**
 * Get OpenGraph alternate locale tags (og:locale:alternate)
 * excluding the current locale.
 */
export function getOgAlternateLocales(currentLocale: Locale): string[] {
  return locales
    .filter((locale) => locale !== currentLocale)
    .map((locale) => getOgLocale(locale));
}

/**
 * Build canonical URL pinned to the primary locale path.
 * Useful for non-locale routes that should canonicalize to /en/...
 */
export function getPrimaryLocaleCanonical(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}/${defaultLocale}${cleanPath}`;
}

/**
 * Build an absolute URL for a specific locale route.
 */
export function getLocaleUrl(path: string, locale: Locale): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}/${locale}${cleanPath}`;
}

/**
 * Get html lang attribute value
 * @param locale - The locale code
 * @returns Language code for html lang attribute (e.g., "en", "pt", "hi")
 */
export function getHtmlLang(locale: Locale): string {
  return locale;
}

/**
 * Generate complete locale-aware metadata for a page
 * @param config - Configuration object with path, currentLocale, title, description
 * @returns Partial Metadata object with alternates, canonical, and openGraph
 */
export function generateLocaleMetadata(config: {
  path: string;
  currentLocale: Locale;
  title: string;
  description: string;
  image?: string;
}) {
  const { path, currentLocale, title, description, image } = config;
  const alternates = getLocaleAlternates(path, currentLocale);
  const ogLocale = getOgLocale(currentLocale);
  
  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      locale: ogLocale,
      images: image ? [{ url: image }] : undefined,
      url: alternates.canonical,
    },
  };
}
