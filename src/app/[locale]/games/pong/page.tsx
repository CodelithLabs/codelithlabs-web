import type { Metadata } from 'next';
import type { Locale } from '@/i18n/request';
import PongGame from '@/components/games/pong/PongGame';
import { JsonLdScript } from '@/components/security/JsonLdScript';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://codelithlabs.com';
const LOCALES = ['en', 'hi', 'de', 'es', 'fr', 'pt'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: 'Pong Online — Free Retro Arcade Game | CodelithLabs',
    description: 'Play retro Pong free in your browser against CPU with touch controls, local highscores, and smooth gameplay.',
    openGraph: {
      title: 'Pong — Free Browser Game',
      description: 'Classic paddle arcade game, now mobile friendly.',
      url: `${BASE_URL}/${locale}/games/pong`,
      images: [{ url: '/og/games/pong.svg', width: 1200, height: 630 }],
      type: 'website',
      siteName: 'CodelithLabs',
    },
    alternates: {
      canonical: `${BASE_URL}/en/games/pong`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE_URL}/${l}/games/pong`])),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <>
      <JsonLdScript
        id="pong-schema"
        data={{
          '@context': 'https://schema.org',
          '@type': 'VideoGame',
          name: 'Pong',
          gamePlatform: 'Web Browser',
          applicationCategory: 'GameApplication',
          url: `${BASE_URL}/${locale}/games/pong`,
          image: `${BASE_URL}/og/games/pong.svg`,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />
      <h1 className="sr-only">Pong browser game</h1>
      <PongGame locale={locale} />
    </>
  );
}
