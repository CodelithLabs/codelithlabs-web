import type { Metadata } from 'next';
import type { Locale } from '@/i18n/request';
import ConnectFourGame from '@/components/games/connect-four/ConnectFourGame';
import { JsonLdScript } from '@/components/security/JsonLdScript';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://codelithlabs.com';
const LOCALES = ['en', 'hi', 'de', 'es', 'fr', 'pt'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: 'Connect Four Online vs CPU — Free Browser Game | CodelithLabs',
    description: 'Play Connect Four online against CPU with touch controls, smart AI blocks, and instant browser gameplay.',
    openGraph: {
      title: 'Connect Four vs CPU — Free Browser Game',
      description: 'Classic 4-in-a-row strategy game with no signup.',
      url: `${BASE_URL}/${locale}/games/connect-four`,
      images: [{ url: '/og/games/connect-four.svg', width: 1200, height: 630 }],
      type: 'website',
      siteName: 'CodelithLabs',
    },
    alternates: {
      canonical: `${BASE_URL}/en/games/connect-four`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE_URL}/${l}/games/connect-four`])),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <>
      <JsonLdScript
        id="connect-four-schema"
        data={{
          '@context': 'https://schema.org',
          '@type': 'VideoGame',
          name: 'Connect Four',
          gamePlatform: 'Web Browser',
          applicationCategory: 'GameApplication',
          url: `${BASE_URL}/${locale}/games/connect-four`,
          image: `${BASE_URL}/og/games/connect-four.svg`,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />
      <h1 className="sr-only">Connect Four browser game</h1>
      <ConnectFourGame locale={locale} />
    </>
  );
}
