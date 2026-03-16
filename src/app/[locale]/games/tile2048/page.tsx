import type { Metadata } from 'next';
import type { Locale } from '@/i18n/request';
import { getTranslations } from 'next-intl/server';
import TileGame from '@/components/games/tile2048/TileGame';
import { JsonLdScript } from '@/components/security/JsonLdScript';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://codelithlabs.com';
const LOCALES = ['en', 'hi', 'de', 'es', 'fr', 'pt'] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Games.tile2048' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
    keywords: ['2048 game', '2048 browser game', 'tile puzzle game online', 'free 2048 game', 'codelithlabs'],
    openGraph: {
      title: t('meta_title'),
      description: t('meta_description'),
      url: `${BASE_URL}/${locale}/games/tile2048`,
      images: [{ url: '/og/games/tile2048.jpg', width: 1200, height: 630, alt: '2048 — Tile Puzzle Game' }],
      type: 'website',
      siteName: 'CodelithLabs',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta_title'),
      description: t('meta_description'),
      images: ['/og/games/tile2048.jpg'],
    },
    alternates: {
      canonical: `${BASE_URL}/en/games/tile2048`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE_URL}/${l}/games/tile2048`])),
    },
  };
}

function buildJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: '2048',
    description: 'Slide tiles on a 4×4 grid and merge them to reach 2048. Free browser puzzle game. No signup.',
    url: `${BASE_URL}/${locale}/games/tile2048`,
    image: `${BASE_URL}/og/games/tile2048.jpg`,
    genre: ['Puzzle', 'Strategy'],
    gamePlatform: 'Web Browser',
    operatingSystem: 'Any',
    applicationCategory: 'GameApplication',
    isFamilyFriendly: true,
    numberOfPlayers: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 1 },
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
    author: { '@type': 'Organization', name: 'CodelithLabs', url: BASE_URL },
    datePublished: '2026-05-01',
    inLanguage: locale,
  };
}

export default async function Tile2048Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <>
      <JsonLdScript id="tile2048-game-schema" data={buildJsonLd(locale)} />
      <h1 className="sr-only">2048 — Tile Puzzle Game</h1>
      <TileGame locale={locale} />
    </>
  );
}
