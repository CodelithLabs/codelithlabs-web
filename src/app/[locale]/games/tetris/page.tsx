import type { Metadata } from 'next';
import type { Locale } from '@/i18n/request';
import TetrisGame from '@/components/games/tetris/TetrisGame';
import { JsonLdScript } from '@/components/security/JsonLdScript';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://codelithlabs.com';
const LOCALES = ['en', 'hi', 'de', 'es', 'fr', 'pt'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Tetris — Classic Block Puzzle | Free Browser Game | CodelithLabs',
    description: 'Play Tetris free in your browser with touch controls, keyboard support, local leaderboard, and no signup required.',
    openGraph: {
      title: 'Tetris — Free Browser Game',
      description: 'Classic block puzzle, modern mobile controls.',
      url: `${BASE_URL}/${locale}/games/tetris`,
      images: [{ url: '/og/games/tetris.svg', width: 1200, height: 630 }],
      type: 'website',
      siteName: 'CodelithLabs',
    },
    alternates: {
      canonical: `${BASE_URL}/en/games/tetris`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE_URL}/${l}/games/tetris`])),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return (
    <>
      <JsonLdScript id="tetris-schema" data={{
        '@context': 'https://schema.org',
        '@type': 'VideoGame',
        name: 'Tetris',
        gamePlatform: 'Web Browser',
        applicationCategory: 'GameApplication',
        url: `${BASE_URL}/${locale}/games/tetris`,
        image: `${BASE_URL}/og/games/tetris.svg`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      }} />
      <h1 className="sr-only">Tetris browser game</h1>
      <TetrisGame locale={locale} />
    </>
  );
}
