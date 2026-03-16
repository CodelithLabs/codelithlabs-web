import type { Metadata } from 'next';
import type { Locale } from '@/i18n/request';
import SudokuGame from '@/components/games/sudoku/SudokuGame';
import { JsonLdScript } from '@/components/security/JsonLdScript';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://codelithlabs.com';
const LOCALES = ['en', 'hi', 'de', 'es', 'fr', 'pt'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: 'Sudoku Online — Free Daily Brain Puzzle | CodelithLabs',
    description: 'Play Sudoku free in your browser with keyboard and touch input, local best score, and zero signup required.',
    openGraph: {
      title: 'Sudoku Online — Free Browser Game',
      description: 'Logic puzzle with touch controls and local leaderboard.',
      url: `${BASE_URL}/${locale}/games/sudoku`,
      images: [{ url: '/og/games/sudoku.svg', width: 1200, height: 630 }],
      type: 'website',
      siteName: 'CodelithLabs',
    },
    alternates: {
      canonical: `${BASE_URL}/en/games/sudoku`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE_URL}/${l}/games/sudoku`])),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <>
      <JsonLdScript
        id="sudoku-schema"
        data={{
          '@context': 'https://schema.org',
          '@type': 'VideoGame',
          name: 'Sudoku',
          gamePlatform: 'Web Browser',
          applicationCategory: 'GameApplication',
          url: `${BASE_URL}/${locale}/games/sudoku`,
          image: `${BASE_URL}/og/games/sudoku.svg`,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />
      <h1 className="sr-only">Sudoku browser game</h1>
      <SudokuGame locale={locale} />
    </>
  );
}
