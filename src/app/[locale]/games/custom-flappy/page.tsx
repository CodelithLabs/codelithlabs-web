import type { Metadata } from 'next';
import type { Locale } from '@/i18n/request';
import FlappyGame from '@/components/games/flappy/FlappyGame';
import { JsonLdScript } from '@/components/security/JsonLdScript';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://codelithlabs.com';
const LOCALES = ['en', 'hi', 'de', 'es', 'fr', 'pt'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Custom Flappy Studio — Build Your Bird Game | CodelithLabs',
    description: 'Upload your own bird image and sounds, then play high-level Flappy runs in ranked mode.',
    openGraph: {
      title: 'Custom Flappy Studio — Ranked Creator Game',
      description: 'Custom bird assets + deep levels + real leaderboard.',
      url: `${BASE_URL}/${locale}/games/custom-flappy`,
      images: [{ url: '/og/games/custom-flappy.svg', width: 1200, height: 630 }],
      type: 'website',
      siteName: 'CodelithLabs',
    },
    alternates: {
      canonical: `${BASE_URL}/en/games/custom-flappy`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE_URL}/${l}/games/custom-flappy`])),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return (
    <>
      <JsonLdScript id="custom-flappy-schema" data={{
        '@context': 'https://schema.org',
        '@type': 'VideoGame',
        name: 'Custom Flappy Studio',
        gamePlatform: 'Web Browser',
        applicationCategory: 'GameApplication',
        url: `${BASE_URL}/${locale}/games/custom-flappy`,
        image: `${BASE_URL}/og/games/custom-flappy.svg`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      }} />
      <h1 className="sr-only">Custom flappy studio browser game</h1>
      <FlappyGame locale={locale} customOnly />
    </>
  );
}
