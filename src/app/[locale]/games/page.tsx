import type { Metadata } from 'next';
import { GameHub } from '@/components/games/GameHub';
import { getAllGames } from '@/lib/games-registry';
import type { Locale } from '@/i18n/request';
import { JsonLdScript } from '@/components/security/JsonLdScript';

const LOCALES = ['en', 'hi', 'de', 'es', 'fr', 'pt'] as const;
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://codelithlabs.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: 'Free Browser Games — No Signup, Privacy-First | CodelithLabs',
    description:
      'Play free browser games instantly. No account, no tracking, no download. Arcade and horror games that run entirely in your browser.',
    keywords: [
      'free browser games',
      'play online games no signup',
      'privacy games no tracking',
      'html5 games',
      'webgl browser games',
      'codelithlabs games',
    ],
    openGraph: {
      title: 'Free Browser Games | CodelithLabs',
      description: 'Play instantly. No signup. No tracking.',
      url: `${BASE_URL}/${locale}/games`,
      images: [{ url: '/og/games/hub.jpg', width: 1200, height: 630 }],
      type: 'website',
      siteName: 'CodelithLabs',
    },
    alternates: {
      canonical: `${BASE_URL}/en/games`,
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `${BASE_URL}/${l}/games`]),
      ),
    },
  };
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'CodelithLabs Free Browser Games',
  description: 'Free, privacy-first browser games collection',
  url: `${BASE_URL}/en/games`,
  publisher: { '@type': 'Organization', name: 'CodelithLabs' },
};

export default async function GamesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const games = getAllGames();

  return (
    <>
      <JsonLdScript id="games-hub-schema" data={jsonLd} />
      <h1 className="sr-only">Free Browser Games</h1>
      <GameHub games={games} locale={locale} />
    </>
  );
}
