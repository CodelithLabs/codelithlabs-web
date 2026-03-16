import type { Metadata } from 'next';
import type { Locale } from '@/i18n/request';
import ChessGame from '@/components/games/chess/ChessGame';
import { JsonLdScript } from '@/components/security/JsonLdScript';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://codelithlabs.com';
const LOCALES = ['en', 'hi', 'de', 'es', 'fr', 'pt'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: 'Play Chess vs CPU Online — Free Browser Chess | CodelithLabs',
    description: 'Play a free chess game against CPU in your browser with touch support, local best score, and no account needed.',
    openGraph: {
      title: 'Chess vs CPU — Free Browser Game',
      description: 'Play chess online against CPU with instant moves and no signup.',
      url: `${BASE_URL}/${locale}/games/chess`,
      images: [{ url: '/og/games/chess.svg', width: 1200, height: 630 }],
      type: 'website',
      siteName: 'CodelithLabs',
    },
    alternates: {
      canonical: `${BASE_URL}/en/games/chess`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE_URL}/${l}/games/chess`])),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <>
      <JsonLdScript
        id="chess-schema"
        data={{
          '@context': 'https://schema.org',
          '@type': 'VideoGame',
          name: 'Chess vs CPU',
          gamePlatform: 'Web Browser',
          applicationCategory: 'GameApplication',
          url: `${BASE_URL}/${locale}/games/chess`,
          image: `${BASE_URL}/og/games/chess.svg`,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />
      <h1 className="sr-only">Chess vs CPU browser game</h1>
      <ChessGame locale={locale} />
    </>
  );
}
