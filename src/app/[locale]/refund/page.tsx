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
			path: '/refund',
			currentLocale: locale,
			title: 'Refund & Cancellation Policy - CodelithLabs Tools',
			description:
				'Refund and Cancellation Policy for CodelithLabs Premium subscriptions. Learn about our transparent refund process, eligibility, timeline, and how to request a refund.',
		}),
		openGraph: {
			...generateLocaleMetadata({
				path: '/refund',
				currentLocale: locale,
				title: 'Refund & Cancellation Policy — CodelithLabs',
				description:
					'Learn about refunds and cancellations for CodelithLabs Premium subscriptions.',
			}).openGraph,
			type: 'website',
			siteName: 'CodelithLabs',
		},
	};
}

import { default as RefundPageContent } from '../../(legal)/refund/page';

export default async function LocaleRefundPage() {
  return (
    <>
      <h1 style={{ display: 'none' }}>Refund & Cancellation Policy</h1>
      <RefundPageContent />
    </>
  );
}