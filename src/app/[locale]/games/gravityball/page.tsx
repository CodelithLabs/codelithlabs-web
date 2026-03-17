import type { Metadata } from 'next';
import type { Locale } from '@/i18n/request';
import GravityBallGame from '@/components/games/gravityball/GravityBallGame';
import { JsonLdScript } from '@/components/security/JsonLdScript';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://codelithlabs.com';
const LOCALES = ['en', 'hi', 'de', 'es', 'fr', 'pt'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Gravity Ball — Free Physics Arcade Browser Game | CodelithLabs',
    description: 'Flip gravity at the right moment and navigate through obstacle gaps in this reflex-based physics arcade challenge.',
    openGraph: {
      title: 'Gravity Ball — Free Browser Arcade Game',
      description: 'Flip gravity and survive obstacle fields.',
      url: `${BASE_URL}/${locale}/games/gravityball`,
      images: [{ url: '/og/games/gravityball.svg', width: 1200, height: 630 }],
      type: 'website',
      siteName: 'CodelithLabs',
    },
    alternates: {
      canonical: `${BASE_URL}/en/games/gravityball`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE_URL}/${l}/games/gravityball`])),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return (
    <>
      <JsonLdScript id="gravityball-schema" data={{
        '@context': 'https://schema.org',
        '@type': 'VideoGame',
        name: 'Gravity Ball',
        gamePlatform: 'Web Browser',
        applicationCategory: 'GameApplication',
        url: `${BASE_URL}/${locale}/games/gravityball`,
        image: `${BASE_URL}/og/games/gravityball.svg`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      }} />
      <h1 className="sr-only">Gravity ball browser game</h1>
      <GravityBallGame locale={locale} />
    </>
  );
}
