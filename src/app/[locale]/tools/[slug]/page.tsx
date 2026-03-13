// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/[locale]/tools/[slug]/page.tsx
// Locale-aware wrapper: injects hreflang alternates onto each tool page.
// Page content is fully delegated to the canonical tool page.
// ═══════════════════════════════════════════════════════════════════════════

import type { Metadata } from 'next';
import { type Locale } from '@/i18n/request';
import { getLocaleAlternates, getOgAlternateLocales, getOgLocale } from '@/lib/locale-meta';
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
  const baseOgImages = base.openGraph?.images;
  const ogImageList = !baseOgImages ? [] : Array.isArray(baseOgImages) ? baseOgImages : [baseOgImages];
  const localizedOgImages = ogImageList.map((image) => {
    if (typeof image === 'string' || image instanceof URL) {
      const url = new URL(image.toString());
      if (url.pathname === '/api/og') {
        url.searchParams.set('locale', locale);
        url.searchParams.set('path', `/${locale}/tools`);
      }
      return url.toString();
    }

    const rawUrl = typeof image.url === 'string' ? image.url : image.url.toString();
    const url = new URL(rawUrl);
    if (url.pathname === '/api/og') {
      url.searchParams.set('locale', locale);
      url.searchParams.set('path', `/${locale}/tools`);
    }
    return {
      ...image,
      url: url.toString(),
    };
  });

  const baseTwitterImages = base.twitter?.images;
  const twitterImageList = !baseTwitterImages
    ? []
    : Array.isArray(baseTwitterImages)
      ? baseTwitterImages
      : [baseTwitterImages];
  const localizedTwitterImages = twitterImageList.map((image) => {
    const imageUrl = typeof image === 'string' || image instanceof URL ? image.toString() : image.url.toString();
    const url = new URL(imageUrl.toString());
    if (url.pathname === '/api/og') {
      url.searchParams.set('locale', locale);
      url.searchParams.set('path', `/${locale}/tools`);
    }
    return url.toString();
  });

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
      alternateLocale: getOgAlternateLocales(locale),
      url: canonical,
      images: localizedOgImages.length ? localizedOgImages : undefined,
    },
    twitter: {
      ...base.twitter,
      images: localizedTwitterImages.length ? localizedTwitterImages : undefined,
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

