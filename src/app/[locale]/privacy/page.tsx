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
			path: '/privacy',
			currentLocale: locale,
			title: 'Privacy Policy - CodelithLabs Tools',
			description:
				'Privacy Policy for CodelithLabs Tools platform. Learn how we protect your data with client-side processing. All tools run client-side — your data never leaves your device.',
		}),
		openGraph: {
			...generateLocaleMetadata({
				path: '/privacy',
				currentLocale: locale,
				title: 'Privacy Policy — CodelithLabs',
				description:
					'Learn how CodelithLabs protects your data. 100% client-side processing — your data never leaves your browser.',
			}).openGraph,
			type: 'website',
			siteName: 'CodelithLabs',
		},
	};
}

import { default as PrivacyPageContent } from '../../(legal)/privacy/page';

export default async function LocalePrivacyPage() {
  return (
    <>
      <h1 style={{ display: 'none' }}>Privacy Policy</h1>
      <PrivacyPageContent />
    </>
  );
}