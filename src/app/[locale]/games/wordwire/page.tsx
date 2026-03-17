import type { Metadata } from 'next';
import type { Locale } from '@/i18n/request';
import WordWireGame from '@/components/games/wordwire/WordWireGame';
import { JsonLdScript } from '@/components/security/JsonLdScript';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://codelithlabs.com';
const LOCALES = ['en', 'hi', 'de', 'es', 'fr', 'pt'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Word Wire — Free Word Chain Puzzle | CodelithLabs',
    description: 'Connect words through one-letter changes and complete the circuit in this brainy vocabulary puzzle game.',
    openGraph: {
      title: 'Word Wire — Free Browser Word Puzzle',
      description: 'Build word chains from start to target.',
      url: `${BASE_URL}/${locale}/games/wordwire`,
      images: [{ url: '/og/games/wordwire.svg', width: 1200, height: 630 }],
      type: 'website',
      siteName: 'CodelithLabs',
    },
    alternates: {
      canonical: `${BASE_URL}/en/games/wordwire`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE_URL}/${l}/games/wordwire`])),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return (
    <>
      <JsonLdScript id="wordwire-schema" data={{
        '@context': 'https://schema.org',
        '@type': 'VideoGame',
        name: 'Word Wire',
        gamePlatform: 'Web Browser',
        applicationCategory: 'GameApplication',
        url: `${BASE_URL}/${locale}/games/wordwire`,
        image: `${BASE_URL}/og/games/wordwire.svg`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      }} />
      <h1 className="sr-only">Word wire browser game</h1>
      <WordWireGame locale={locale} />
    </>
  );
}
