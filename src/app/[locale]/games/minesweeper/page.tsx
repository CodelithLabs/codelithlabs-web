import type { Metadata } from 'next';
import type { Locale } from '@/i18n/request';
import MinesweeperGame from '@/components/games/minesweeper/MinesweeperGame';
import { JsonLdScript } from '@/components/security/JsonLdScript';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://codelithlabs.com';
const LOCALES = ['en', 'hi', 'de', 'es', 'fr', 'pt'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Minesweeper Online | Free Browser Strategy Game | CodelithLabs',
    description: 'Reveal safe cells, mark mines, and clear the board in this classic Minesweeper browser game with touch and keyboard support.',
    openGraph: {
      title: 'Minesweeper — Free Browser Game',
      description: 'Classic logic game with modern controls.',
      url: `${BASE_URL}/${locale}/games/minesweeper`,
      images: [{ url: '/og/games/minesweeper.svg', width: 1200, height: 630 }],
      type: 'website',
      siteName: 'CodelithLabs',
    },
    alternates: {
      canonical: `${BASE_URL}/en/games/minesweeper`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE_URL}/${l}/games/minesweeper`])),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return (
    <>
      <JsonLdScript id="minesweeper-schema" data={{
        '@context': 'https://schema.org',
        '@type': 'VideoGame',
        name: 'Minesweeper',
        gamePlatform: 'Web Browser',
        applicationCategory: 'GameApplication',
        url: `${BASE_URL}/${locale}/games/minesweeper`,
        image: `${BASE_URL}/og/games/minesweeper.svg`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      }} />
      <h1 className="sr-only">Minesweeper browser game</h1>
      <MinesweeperGame locale={locale} />
    </>
  );
}
