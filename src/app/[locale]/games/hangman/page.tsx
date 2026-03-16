import type { Metadata } from 'next';
import type { Locale } from '@/i18n/request';
import HangmanGame from '@/components/games/hangman/HangmanGame';
import { JsonLdScript } from '@/components/security/JsonLdScript';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://codelithlabs.com';
const LOCALES = ['en', 'hi', 'de', 'es', 'fr', 'pt'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: 'Hangman Online — Free Word Guessing Game | CodelithLabs',
    description: 'Play Hangman online free in your browser. Guess hidden words, improve vocabulary, and track your local score.',
    openGraph: {
      title: 'Hangman — Free Browser Word Game',
      description: 'Classic word guessing game with instant play.',
      url: `${BASE_URL}/${locale}/games/hangman`,
      images: [{ url: '/og/games/hangman.svg', width: 1200, height: 630 }],
      type: 'website',
      siteName: 'CodelithLabs',
    },
    alternates: {
      canonical: `${BASE_URL}/en/games/hangman`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE_URL}/${l}/games/hangman`])),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <>
      <JsonLdScript
        id="hangman-schema"
        data={{
          '@context': 'https://schema.org',
          '@type': 'VideoGame',
          name: 'Hangman',
          gamePlatform: 'Web Browser',
          applicationCategory: 'GameApplication',
          url: `${BASE_URL}/${locale}/games/hangman`,
          image: `${BASE_URL}/og/games/hangman.svg`,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />
      <h1 className="sr-only">Hangman browser game</h1>
      <HangmanGame locale={locale} />
    </>
  );
}
