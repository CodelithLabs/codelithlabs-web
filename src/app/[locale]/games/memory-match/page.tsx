import type { Metadata } from 'next';
import type { Locale } from '@/i18n/request';
import MemoryMatchGame from '@/components/games/memory-match/MemoryMatchGame';
import { JsonLdScript } from '@/components/security/JsonLdScript';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://codelithlabs.com';
const LOCALES = ['en', 'hi', 'de', 'es', 'fr', 'pt'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Memory Match Card Game | Free Browser Puzzle | CodelithLabs',
    description: 'Flip cards, match pairs, and improve memory speed in this mobile-friendly browser game with local leaderboard and accessibility support.',
    openGraph: {
      title: 'Memory Match — Free Browser Puzzle',
      description: 'Match pairs fast. No signup needed.',
      url: `${BASE_URL}/${locale}/games/memory-match`,
      images: [{ url: '/og/games/memory-match.svg', width: 1200, height: 630 }],
      type: 'website',
      siteName: 'CodelithLabs',
    },
    alternates: {
      canonical: `${BASE_URL}/en/games/memory-match`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE_URL}/${l}/games/memory-match`])),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return (
    <>
      <JsonLdScript id="memory-match-schema" data={{
        '@context': 'https://schema.org',
        '@type': 'VideoGame',
        name: 'Memory Match',
        gamePlatform: 'Web Browser',
        applicationCategory: 'GameApplication',
        url: `${BASE_URL}/${locale}/games/memory-match`,
        image: `${BASE_URL}/og/games/memory-match.svg`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      }} />
      <h1 className="sr-only">Memory match browser game</h1>
      <MemoryMatchGame locale={locale} />
    </>
  );
}
