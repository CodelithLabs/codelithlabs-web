import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { generateLocaleMetadata } from '@/lib/locale-meta';
import type { Locale } from '@/i18n/request';

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: 'pages.research.meta' });

	return {
		...generateLocaleMetadata({
			path: '/research',
			currentLocale: locale,
			title: t('title'),
			description: t('description'),
		}),
		openGraph: {
			...generateLocaleMetadata({
				path: '/research',
				currentLocale: locale,
				title: t('title'),
				description: t('description'),
			}).openGraph,
			type: 'website',
			siteName: 'CodelithLabs',
		},
	};
}

import { default as ResearchPageContent } from '../../research/page';

export default async function LocaleResearchPage() {
  return (
    <>
      <h1 style={{ display: 'none' }}>Research</h1>
      <ResearchPageContent />
    </>
  );
}
