import type { Metadata } from 'next';
import type { Locale } from '@/i18n/request';
import MemFlipGame from '@/components/games/memflip/MemFlipGame';
import { JsonLdScript } from '@/components/security/JsonLdScript';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://codelithlabs.com';
const LOCALES = ['en', 'hi', 'de', 'es', 'fr', 'pt'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Mem Flip — Free Sequence Memory Game | CodelithLabs',
    description: 'Train memory by watching and repeating symbol sequences in this fast browser puzzle game with local highscores.',
    openGraph: {
      title: 'Mem Flip — Free Browser Memory Game',
      description: 'Repeat symbol patterns and level up memory rounds.',
      url: `${BASE_URL}/${locale}/games/memflip`,
      images: [{ url: '/og/games/memflip.svg', width: 1200, height: 630 }],
      type: 'website',
      siteName: 'CodelithLabs',
    },
    alternates: {
      canonical: `${BASE_URL}/en/games/memflip`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE_URL}/${l}/games/memflip`])),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return (
    <>
      <JsonLdScript id="memflip-schema" data={{
        '@context': 'https://schema.org',
        '@type': 'VideoGame',
        name: 'Mem Flip',
        gamePlatform: 'Web Browser',
        applicationCategory: 'GameApplication',
        url: `${BASE_URL}/${locale}/games/memflip`,
        image: `${BASE_URL}/og/games/memflip.svg`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      }} />
      <h1 className="sr-only">Mem flip browser game</h1>
      <MemFlipGame locale={locale} />
    </>
  );
}
