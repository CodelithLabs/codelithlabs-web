import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/request';
import VoidGame from '@/components/games/void/VoidGame';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://codelithlabs.com';
const LOCALES = ['en', 'hi', 'de', 'es', 'fr', 'pt'] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Games.void' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
    keywords: [
      'void game',
      '3d browser game',
      'free horror game online',
      'tunnel runner 3d',
      'browser 3d game no download',
      'webgl horror game',
      'codelithlabs',
    ],
    openGraph: {
      title: t('meta_title'),
      description: t('meta_description'),
      url: `${BASE_URL}/${locale}/games/void`,
      images: [
        {
          url: '/og/games/void.jpg',
          width: 1200,
          height: 630,
          alt: 'VOID - 3D Horror Tunnel Game',
        },
      ],
      type: 'website',
      siteName: 'CodelithLabs',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta_title'),
      description: t('meta_description'),
      images: ['/og/games/void.jpg'],
    },
    alternates: {
      canonical: `${BASE_URL}/en/games/void`,
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `${BASE_URL}/${l}/games/void`]),
      ),
    },
  };
}

function buildJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'VOID',
    description:
      'A free 3D horror tunnel runner browser game. Survive procedurally generated obstacles in infinite darkness.',
    url: `${BASE_URL}/${locale}/games/void`,
    image: `${BASE_URL}/og/games/void.jpg`,
    genre: ['Horror', 'Arcade', 'Endless Runner'],
    gamePlatform: 'Web Browser',
    operatingSystem: 'Any',
    applicationCategory: 'GameApplication',
    isFamilyFriendly: false,
    numberOfPlayers: {
      '@type': 'QuantitativeValue',
      minValue: 1,
      maxValue: 1,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    author: {
      '@type': 'Organization',
      name: 'CodelithLabs',
      url: BASE_URL,
    },
    datePublished: '2026-04-01',
    inLanguage: locale,
  };
}

export default async function VoidGamePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(locale)) }}
      />
      <h1 className="sr-only">VOID — 3D Horror Tunnel Runner</h1>
      <main className="fixed inset-0 bg-black overflow-hidden" aria-label="VOID Game">
        <VoidGame locale={locale} />
      </main>
    </>
  );
}
