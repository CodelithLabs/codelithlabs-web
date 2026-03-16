import type { Metadata } from 'next';
import type { Locale } from '@/i18n/request';
import WordScrambleGame from '@/components/games/word-scramble/WordScrambleGame';
import { JsonLdScript } from '@/components/security/JsonLdScript';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://codelithlabs.com';
const LOCALES = ['en', 'hi', 'de', 'es', 'fr', 'pt'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Word Scramble Game | Free Vocabulary Browser Game | CodelithLabs',
    description: 'Unscramble words quickly and improve vocabulary in this free browser game with mobile support and local leaderboard scoring.',
    openGraph: {
      title: 'Word Scramble — Free Browser Word Game',
      description: 'Unscramble words and climb your local leaderboard.',
      url: `${BASE_URL}/${locale}/games/word-scramble`,
      images: [{ url: '/og/games/word-scramble.svg', width: 1200, height: 630 }],
      type: 'website',
      siteName: 'CodelithLabs',
    },
    alternates: {
      canonical: `${BASE_URL}/en/games/word-scramble`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE_URL}/${l}/games/word-scramble`])),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return (
    <>
      <JsonLdScript id="word-scramble-schema" data={{
        '@context': 'https://schema.org',
        '@type': 'VideoGame',
        name: 'Word Scramble',
        gamePlatform: 'Web Browser',
        applicationCategory: 'GameApplication',
        url: `${BASE_URL}/${locale}/games/word-scramble`,
        image: `${BASE_URL}/og/games/word-scramble.svg`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      }} />
      <h1 className="sr-only">Word scramble browser game</h1>
      <WordScrambleGame locale={locale} />
    </>
  );
}
