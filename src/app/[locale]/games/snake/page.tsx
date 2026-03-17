import type { Metadata } from 'next';
import type { Locale } from '@/i18n/request';
import { getTranslations } from 'next-intl/server';
import SnakeGame from '@/components/games/snake/SnakeGame';
import { JsonLdScript } from '@/components/security/JsonLdScript';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://codelithlabs.com';
const LOCALES = ['en', 'hi', 'de', 'es', 'fr', 'pt'] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Games.snake' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
    keywords: ['snake game', 'classic snake browser game', 'free snake game online', 'snake html5', 'codelithlabs'],
    openGraph: {
      title: t('meta_title'),
      description: t('meta_description'),
      url: `${BASE_URL}/${locale}/games/snake`,
      images: [{ url: '/og/games/snake.svg', width: 1200, height: 630, alt: 'Snake — Classic Arcade Game' }],
      type: 'website',
      siteName: 'CodelithLabs',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta_title'),
      description: t('meta_description'),
      images: ['/og/games/snake.svg'],
    },
    alternates: {
      canonical: `${BASE_URL}/en/games/snake`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE_URL}/${l}/games/snake`])),
    },
  };
}

function buildJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Snake',
    description: 'Classic Snake game playable in your browser. Eat apples, grow longer, avoid walls. Free, no signup.',
    url: `${BASE_URL}/${locale}/games/snake`,
    image: `${BASE_URL}/og/games/snake.svg`,
    genre: ['Arcade', 'Classic'],
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

export default async function SnakePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <>
      <JsonLdScript id="snake-game-schema" data={buildJsonLd(locale)} />
      <h1 className="sr-only">Snake — Classic Arcade Game</h1>
      <SnakeGame locale={locale} />
    </>
  );
}
