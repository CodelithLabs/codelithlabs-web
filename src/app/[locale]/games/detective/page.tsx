import type { Metadata } from 'next';
import type { Locale } from '@/i18n/request';
import DetectiveGame from '@/components/games/detective/DetectiveGame';
import { JsonLdScript } from '@/components/security/JsonLdScript';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://codelithlabs.com';
const LOCALES = ['en', 'hi', 'de', 'es', 'fr', 'pt'] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Detective Mind — Free Deduction Puzzle Game | CodelithLabs',
    description: 'Solve short mystery cases by reading clues and identifying the right suspect in this detective puzzle game.',
    openGraph: {
      title: 'Detective Mind — Free Browser Puzzle',
      description: 'Read clues, deduce culprit, solve mystery rounds.',
      url: `${BASE_URL}/${locale}/games/detective`,
      images: [{ url: '/og/games/detective.svg', width: 1200, height: 630 }],
      type: 'website',
      siteName: 'CodelithLabs',
    },
    alternates: {
      canonical: `${BASE_URL}/en/games/detective`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE_URL}/${l}/games/detective`])),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return (
    <>
      <JsonLdScript id="detective-schema" data={{
        '@context': 'https://schema.org',
        '@type': 'VideoGame',
        name: 'Detective Mind',
        gamePlatform: 'Web Browser',
        applicationCategory: 'GameApplication',
        url: `${BASE_URL}/${locale}/games/detective`,
        image: `${BASE_URL}/og/games/detective.svg`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      }} />
      <h1 className="sr-only">Detective mind browser game</h1>
      <DetectiveGame locale={locale} />
    </>
  );
}
