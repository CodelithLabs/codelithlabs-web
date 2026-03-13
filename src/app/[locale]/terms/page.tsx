import type { Metadata } from 'next';
import { generateLocaleMetadata } from '@/lib/locale-meta';
import type { Locale } from '@/i18n/request';

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
	const { locale } = await params;

	return {
		...generateLocaleMetadata({
			path: '/terms',
			currentLocale: locale,
			title: 'Terms of Service - CodelithLabs Tools',
			description:
				'Terms of Service for CodelithLabs Tools platform. Read our usage terms and conditions for 200+ free online tools.',
		}),
		openGraph: {
			...generateLocaleMetadata({
				path: '/terms',
				currentLocale: locale,
				title: 'Terms of Service — CodelithLabs',
				description:
					'Terms of Service for CodelithLabs — 200+ free online tools for developers and creators.',
			}).openGraph,
			type: 'website',
			siteName: 'CodelithLabs',
		},
	};
}

import { default as TermsPageContent } from '../../(legal)/terms/page';

export default async function LocaleTermsPage() {
  return (
    <>
      <h1 style={{ display: 'none' }}>Terms of Service</h1>
      <TermsPageContent />
    </>
  );
}