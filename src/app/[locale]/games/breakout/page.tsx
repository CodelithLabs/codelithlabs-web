import type { Metadata } from 'next';
import type { Locale } from '@/i18n/request';
import BreakoutGame from '@/components/games/breakout/BreakoutGame';
import { JsonLdScript } from '@/components/security/JsonLdScript';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://codelithlabs.com';
const LOCALES = ['en', 'hi', 'de', 'es', 'fr', 'pt'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: 'Breakout Game Online — Free Brick Breaker | CodelithLabs',
    description: 'Play Breakout free in your browser with smooth controls, touch-friendly paddle movement, and local highscores.',
    openGraph: {
      title: 'Breakout — Free Browser Game',
      description: 'Classic brick breaker arcade game in your browser.',
      url: `${BASE_URL}/${locale}/games/breakout`,
      images: [{ url: '/og/games/breakout.svg', width: 1200, height: 630 }],
      type: 'website',
      siteName: 'CodelithLabs',
    },
    alternates: {
      canonical: `${BASE_URL}/en/games/breakout`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE_URL}/${l}/games/breakout`])),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <>
      <JsonLdScript
        id="breakout-schema"
        data={{
          '@context': 'https://schema.org',
          '@type': 'VideoGame',
          name: 'Breakout',
          gamePlatform: 'Web Browser',
          applicationCategory: 'GameApplication',
          url: `${BASE_URL}/${locale}/games/breakout`,
          image: `${BASE_URL}/og/games/breakout.svg`,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />
      <h1 className="sr-only">Breakout browser game</h1>
      <BreakoutGame locale={locale} />
    </>
  );
}
