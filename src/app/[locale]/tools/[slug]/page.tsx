// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/[locale]/tools/[slug]/page.tsx
// Locale-aware wrapper: injects hreflang alternates onto each tool page.
// Page content is fully delegated to the canonical tool page.
// ═══════════════════════════════════════════════════════════════════════════

import type { Metadata } from 'next';
import { type Locale } from '@/i18n/request';
import { getLocaleAlternates, getOgLocale } from '@/lib/locale-meta';
import {
  generateMetadata as baseGenerateMetadata,
  generateStaticParams as baseGenerateStaticParams,
} from '../../../tools/[slug]/page';

interface LocalePageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export function generateStaticParams() {
  return baseGenerateStaticParams();
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  // Get the canonical (English) metadata — includes all SEO overrides, schema hints etc.
  const base = await baseGenerateMetadata({ params: Promise.resolve({ slug }) });

  // Overlay locale-aware alternates and canonical
  const { canonical, languages } = getLocaleAlternates(`/tools/${slug}/`, locale);
  const ogLocale = getOgLocale(locale);

  return {
    ...base,
    alternates: {
      ...base.alternates,
      canonical,
      languages,
    },
    openGraph: {
      ...base.openGraph,
      locale: ogLocale,
      url: canonical,
    },
  };
}

import { default as ToolsSlugPageContent } from '../../../tools/[slug]/page';

interface LocalePageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export default async function LocaleToolsSlugPage(props: LocalePageProps) {
  return (
    <>
      <h1 style={{ display: 'none' }}>Tool</h1>
      <ToolsSlugPageContent {...props} />
    </>
  );
}

