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
			path: '/transparency',
			currentLocale: locale,
			title: 'Financial Transparency — CodelithLabs',
			description:
				'CodelithLabs is 100% bootstrapped through Razorpay donations from core members. View our real financial data, infrastructure costs, and live GitHub contribution metrics.',
		}),
		keywords: [
			'codelithlabs transparency',
			'bootstrapped startup',
			'open source funding',
			'razorpay donations',
			'financial transparency',
		],
		openGraph: {
			...generateLocaleMetadata({
				path: '/transparency',
				currentLocale: locale,
				title: 'Financial Transparency — CodelithLabs',
				description:
					'Bootstrapped & Open. View our real finances, infrastructure costs, and live GitHub metrics.',
			}).openGraph,
			type: 'website',
			siteName: 'CodelithLabs',
		},
	};
}

import { default as TransparencyPageContent } from '../../transparency/page';

export default async function LocaleTransparencyPage() {
  return (
    <>
      <h1 style={{ display: 'none' }}>Transparency</h1>
      <TransparencyPageContent />
    </>
  );
}
