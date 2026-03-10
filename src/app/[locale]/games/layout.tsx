import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/request';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Games.layout' });

  return {
    title: {
      template: t('meta_title_template'),
      default: t('meta_title_default'),
    },
    description: t('meta_description'),
    openGraph: {
      siteName: 'CodelithLabs',
      type: 'website',
    },
  };
}

export default function GamesLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-black">{children}</div>;
}
