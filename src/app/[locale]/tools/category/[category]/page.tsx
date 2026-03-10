// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/[locale]/tools/category/[category]/page.tsx
// Locale-aware wrapper: injects hreflang alternates onto each category page.
// Page content is fully delegated to the canonical category page.
// ═══════════════════════════════════════════════════════════════════════════

import type { Metadata } from 'next';
import { type Locale } from '@/i18n/request';
import { getLocaleAlternates, getOgLocale } from '@/lib/locale-meta';
import {
  generateMetadata as baseGenerateMetadata,
  generateStaticParams as baseGenerateStaticParams,
} from '../../../../tools/category/[category]/page';

interface LocalePageProps {
  params: Promise<{ locale: Locale; category: string }>;
}

export function generateStaticParams() {
  return baseGenerateStaticParams();
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale, category } = await params;

  // Get the canonical (English) metadata
  const base = await baseGenerateMetadata({ params: Promise.resolve({ category }) });

  // Overlay locale-aware alternates and canonical
  const { canonical, languages } = getLocaleAlternates(`/tools/category/${category}/`, locale);
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

import { default as ToolsCategoryPageContent } from '../../../../tools/category/[category]/page';

interface ToolsCategoryPageProps {
  params: Promise<{ locale: Locale; category: string }>;
}

export default async function LocaleToolsCategoryPage(props: ToolsCategoryPageProps) {
  return (
    <>
      <h1 style={{ display: 'none' }}>Tools Category</h1>
      <ToolsCategoryPageContent {...props} />
    </>
  );
}

