import type { Metadata } from 'next';
import type { Locale } from '@/i18n/request';
import FifteenPuzzleGame from '@/components/games/fifteen-puzzle/FifteenPuzzleGame';
import { JsonLdScript } from '@/components/security/JsonLdScript';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://codelithlabs.com';
const LOCALES = ['en', 'hi', 'de', 'es', 'fr', 'pt'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: '15 Puzzle Game Online — Free Sliding Puzzle | CodelithLabs',
    description: 'Play the classic 15 puzzle online with touch-friendly controls, move tracking, and local best score.',
    openGraph: {
      title: '15 Puzzle — Free Browser Game',
      description: 'Classic sliding-number puzzle with instant play.',
      url: `${BASE_URL}/${locale}/games/fifteen-puzzle`,
      images: [{ url: '/og/games/fifteen-puzzle.svg', width: 1200, height: 630 }],
      type: 'website',
      siteName: 'CodelithLabs',
    },
    alternates: {
      canonical: `${BASE_URL}/en/games/fifteen-puzzle`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE_URL}/${l}/games/fifteen-puzzle`])),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <>
      <JsonLdScript
        id="fifteen-puzzle-schema"
        data={{
          '@context': 'https://schema.org',
          '@type': 'VideoGame',
          name: '15 Puzzle',
          gamePlatform: 'Web Browser',
          applicationCategory: 'GameApplication',
          url: `${BASE_URL}/${locale}/games/fifteen-puzzle`,
          image: `${BASE_URL}/og/games/fifteen-puzzle.svg`,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />
      <h1 className="sr-only">15 puzzle browser game</h1>
      <FifteenPuzzleGame locale={locale} />
    </>
  );
}
