import type { Metadata } from 'next';
import type { Locale } from '@/i18n/request';
import { getTranslations } from 'next-intl/server';
import HeistGame from '@/components/games/heist/HeistGame';
import { JsonLdScript } from '@/components/security/JsonLdScript';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://codelithlabs.com';
const LOCALES = ['en', 'hi', 'de', 'es', 'fr', 'pt'] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Games.heist' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
    keywords: ['heist game', 'strategy browser game', 'free heist planner game', 'turn based browser game', 'codelithlabs'],
    openGraph: {
      title: t('meta_title'),
      description: t('meta_description'),
      url: `${BASE_URL}/${locale}/games/heist`,
      images: [{ url: '/og/games/heist.jpg', width: 1200, height: 630, alt: 'Heist Planner — Strategy Game' }],
      type: 'website',
      siteName: 'CodelithLabs',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta_title'),
      description: t('meta_description'),
      images: ['/og/games/heist.jpg'],
    },
    alternates: {
      canonical: `${BASE_URL}/en/games/heist`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE_URL}/${l}/games/heist`])),
    },
  };
}

function buildJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Heist Planner',
    description: 'A turn-based strategy game. Assemble your crew, pick a heist target, plan the route, and execute. Will you make the perfect score?',
    url: `${BASE_URL}/${locale}/games/heist`,
    image: `${BASE_URL}/og/games/heist.jpg`,
    genre: ['Strategy', 'Turn-Based', 'Puzzle'],
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

export default async function HeistPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <>
      <JsonLdScript id="heist-game-schema" data={buildJsonLd(locale)} />
      <h1 className="sr-only">Heist Planner — Strategy Browser Game</h1>
      <HeistGame locale={locale} />
    </>
  );
}
