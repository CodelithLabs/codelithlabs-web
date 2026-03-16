import type { Metadata } from 'next';
import type { Locale } from '@/i18n/request';
import ReactionTapGame from '@/components/games/reaction-tap/ReactionTapGame';
import { JsonLdScript } from '@/components/security/JsonLdScript';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://codelithlabs.com';
const LOCALES = ['en', 'hi', 'de', 'es', 'fr', 'pt'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: 'Reaction Time Test — Free Tap Speed Game | CodelithLabs',
    description: 'Test your reaction time online with a fast tap challenge. Track average response speed and improve focus.',
    openGraph: {
      title: 'Reaction Tap — Free Browser Speed Test',
      description: 'Quick reaction speed game for mobile and desktop.',
      url: `${BASE_URL}/${locale}/games/reaction-tap`,
      images: [{ url: '/og/games/reaction-tap.svg', width: 1200, height: 630 }],
      type: 'website',
      siteName: 'CodelithLabs',
    },
    alternates: {
      canonical: `${BASE_URL}/en/games/reaction-tap`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE_URL}/${l}/games/reaction-tap`])),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <>
      <JsonLdScript
        id="reaction-tap-schema"
        data={{
          '@context': 'https://schema.org',
          '@type': 'VideoGame',
          name: 'Reaction Tap',
          gamePlatform: 'Web Browser',
          applicationCategory: 'GameApplication',
          url: `${BASE_URL}/${locale}/games/reaction-tap`,
          image: `${BASE_URL}/og/games/reaction-tap.svg`,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />
      <h1 className="sr-only">Reaction tap speed test browser game</h1>
      <ReactionTapGame locale={locale} />
    </>
  );
}
