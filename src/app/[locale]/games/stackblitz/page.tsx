import type { Metadata } from 'next';
import type { Locale } from '@/i18n/request';
import StackBlitzGame from '@/components/games/stackblitz/StackBlitzGame';
import { JsonLdScript } from '@/components/security/JsonLdScript';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://codelithlabs.com';
const LOCALES = ['en', 'hi', 'de', 'es', 'fr', 'pt'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Stack Blitz — Free Reflex Stacking Game | CodelithLabs',
    description: 'Drop moving blocks at the perfect moment and build the tallest stable tower in this quick reflex game.',
    openGraph: {
      title: 'Stack Blitz — Free Browser Reflex Game',
      description: 'Time your drops and keep the tower alive.',
      url: `${BASE_URL}/${locale}/games/stackblitz`,
      images: [{ url: '/og/games/stackblitz.svg', width: 1200, height: 630 }],
      type: 'website',
      siteName: 'CodelithLabs',
    },
    alternates: {
      canonical: `${BASE_URL}/en/games/stackblitz`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE_URL}/${l}/games/stackblitz`])),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return (
    <>
      <JsonLdScript id="stackblitz-schema" data={{
        '@context': 'https://schema.org',
        '@type': 'VideoGame',
        name: 'Stack Blitz',
        gamePlatform: 'Web Browser',
        applicationCategory: 'GameApplication',
        url: `${BASE_URL}/${locale}/games/stackblitz`,
        image: `${BASE_URL}/og/games/stackblitz.svg`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      }} />
      <h1 className="sr-only">Stack blitz browser game</h1>
      <StackBlitzGame locale={locale} />
    </>
  );
}
