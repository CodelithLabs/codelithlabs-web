import type { Metadata } from 'next';
import type { Locale } from '@/i18n/request';
import MouseMazeGame from '@/components/games/mouse-maze/MouseMazeGame';
import { JsonLdScript } from '@/components/security/JsonLdScript';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://codelithlabs.com';
const LOCALES = ['en', 'hi', 'de', 'es', 'fr', 'pt'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Mouse Maze — Reflex Pointer Challenge | CodelithLabs',
    description: 'Fast reflex mouse/touch challenge: collect cheese, dodge traps, and climb real ranked levels.',
    openGraph: {
      title: 'Mouse Maze — Reflex Web Game',
      description: 'High-speed pointer challenge with real player leaderboard.',
      url: `${BASE_URL}/${locale}/games/mouse-maze`,
      images: [{ url: '/og/games/mouse-maze.svg', width: 1200, height: 630 }],
      type: 'website',
      siteName: 'CodelithLabs',
    },
    alternates: {
      canonical: `${BASE_URL}/en/games/mouse-maze`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE_URL}/${l}/games/mouse-maze`])),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return (
    <>
      <JsonLdScript id="mouse-maze-schema" data={{
        '@context': 'https://schema.org',
        '@type': 'VideoGame',
        name: 'Mouse Maze',
        gamePlatform: 'Web Browser',
        applicationCategory: 'GameApplication',
        url: `${BASE_URL}/${locale}/games/mouse-maze`,
        image: `${BASE_URL}/og/games/mouse-maze.svg`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      }} />
      <h1 className="sr-only">Mouse maze reflex game</h1>
      <MouseMazeGame locale={locale} />
    </>
  );
}
