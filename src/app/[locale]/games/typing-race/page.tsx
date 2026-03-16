import type { Metadata } from 'next';
import type { Locale } from '@/i18n/request';
import TypingRaceGame from '@/components/games/typing-race/TypingRaceGame';
import { JsonLdScript } from '@/components/security/JsonLdScript';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://codelithlabs.com';
const LOCALES = ['en', 'hi', 'de', 'es', 'fr', 'pt'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Typing Race Game | Test Speed and Accuracy | CodelithLabs',
    description: 'Type real passages fast and accurately in this browser typing game with WPM scoring, local leaderboard, and mobile-friendly interface.',
    openGraph: {
      title: 'Typing Race — Free Browser Typing Game',
      description: 'Measure WPM and accuracy with instant rounds.',
      url: `${BASE_URL}/${locale}/games/typing-race`,
      images: [{ url: '/og/games/typing-race.svg', width: 1200, height: 630 }],
      type: 'website',
      siteName: 'CodelithLabs',
    },
    alternates: {
      canonical: `${BASE_URL}/en/games/typing-race`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE_URL}/${l}/games/typing-race`])),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return (
    <>
      <JsonLdScript id="typing-race-schema" data={{
        '@context': 'https://schema.org',
        '@type': 'VideoGame',
        name: 'Typing Race',
        gamePlatform: 'Web Browser',
        applicationCategory: 'GameApplication',
        url: `${BASE_URL}/${locale}/games/typing-race`,
        image: `${BASE_URL}/og/games/typing-race.svg`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      }} />
      <h1 className="sr-only">Typing race browser game</h1>
      <TypingRaceGame locale={locale} />
    </>
  );
}
