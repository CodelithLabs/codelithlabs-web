import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Static imports for all translation files
import enMessages from '../../messages/en.json';
import esMessages from '../../messages/es.json';
import ptMessages from '../../messages/pt.json';
import frMessages from '../../messages/fr.json';
import deMessages from '../../messages/de.json';
import hiMessages from '../../messages/hi.json';

// List of supported locales
export const locales = ['en', 'es', 'pt', 'fr', 'de', 'hi'] as const;
export type Locale = (typeof locales)[number];

// Default locale
export const defaultLocale: Locale = 'en';

// Locale metadata for display
export const localeMetadata: Record<Locale, { name: string; flag: string; dir: 'ltr' | 'rtl' }> = {
  en: { name: 'English', flag: '🇺🇸', dir: 'ltr' },
  es: { name: 'Español', flag: '🇪🇸', dir: 'ltr' },
  pt: { name: 'Português', flag: '🇧🇷', dir: 'ltr' },
  fr: { name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  de: { name: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  hi: { name: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
};

export const messagesByLocale: Record<Locale, typeof enMessages> = {
  en: enMessages,
  es: esMessages,
  pt: ptMessages,
  fr: frMessages,
  de: deMessages,
  hi: hiMessages,
};

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const locale = requestedLocale && locales.includes(requestedLocale as Locale)
    ? (requestedLocale as Locale)
    : defaultLocale;

  if (requestedLocale && !locales.includes(requestedLocale as Locale)) {
    notFound();
  }

  return {
    locale,
    messages: messagesByLocale[locale],
  };
});
