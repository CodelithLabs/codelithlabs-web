import type { Metadata } from 'next';
import type { Locale } from '@/i18n/request';
import FlappyGame from '@/components/games/flappy/FlappyGame';
import { JsonLdScript } from '@/components/security/JsonLdScript';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://codelithlabs.com';
const LOCALES = ['en', 'hi', 'de', 'es', 'fr', 'pt'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Flappy Bird Style Runner | Free Browser Game | CodelithLabs',
    description: 'Tap to flap through pipes in this fast arcade browser game with mobile gestures, keyboard controls, and local leaderboard.',
    openGraph: {
      title: 'Flappy Bird Style Runner — Free Browser Game',
      description: 'One-tap mobile arcade challenge.',
      url: `${BASE_URL}/${locale}/games/flappy-bird`,
      images: [{ url: '/og/games/flappy-bird.svg', width: 1200, height: 630 }],
      type: 'website',
      siteName: 'CodelithLabs',
    },
    alternates: {
      canonical: `${BASE_URL}/en/games/flappy-bird`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE_URL}/${l}/games/flappy-bird`])),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return (
    <>
      <JsonLdScript id="flappy-schema" data={{
        '@context': 'https://schema.org',
        '@type': 'VideoGame',
        name: 'Flappy Bird Style Runner',
        gamePlatform: 'Web Browser',
        applicationCategory: 'GameApplication',
        url: `${BASE_URL}/${locale}/games/flappy-bird`,
        image: `${BASE_URL}/og/games/flappy-bird.svg`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      }} />
      <h1 className="sr-only">Flappy bird style browser game</h1>
      <FlappyGame locale={locale} />
    </>
  );
}
