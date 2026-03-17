import type { Metadata } from 'next';
import type { Locale } from '@/i18n/request';
import GetawayGame from '@/components/games/getaway/GetawayGame';
import { JsonLdScript } from '@/components/security/JsonLdScript';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://codelithlabs.com';
const LOCALES = ['en', 'hi', 'de', 'es', 'fr', 'pt'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Getaway Driver — Free Browser Car Dodge Game | CodelithLabs',
    description: 'Dodge traffic and survive the chase in this arcade browser game with mobile controls and local leaderboard.',
    openGraph: {
      title: 'Getaway Driver — Free Browser Game',
      description: 'Lane-dodge chase arcade game. No signup needed.',
      url: `${BASE_URL}/${locale}/games/getaway`,
      images: [{ url: '/og/games/getaway.svg', width: 1200, height: 630 }],
      type: 'website',
      siteName: 'CodelithLabs',
    },
    alternates: {
      canonical: `${BASE_URL}/en/games/getaway`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE_URL}/${l}/games/getaway`])),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return (
    <>
      <JsonLdScript id="getaway-schema" data={{
        '@context': 'https://schema.org',
        '@type': 'VideoGame',
        name: 'Getaway Driver',
        gamePlatform: 'Web Browser',
        applicationCategory: 'GameApplication',
        url: `${BASE_URL}/${locale}/games/getaway`,
        image: `${BASE_URL}/og/games/getaway.svg`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      }} />
      <h1 className="sr-only">Getaway Driver browser game</h1>
      <GetawayGame locale={locale} />
    </>
  );
}
