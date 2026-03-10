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
			path: '/contact',
			currentLocale: locale,
			title: 'Contact Us — Get in Touch',
			description:
				'Have a question, idea, or partnership proposal? Reach out to the CodelithLabs team. We typically respond within 24 hours.',
		}),
		keywords: [
			'contact CodelithLabs',
			'get in touch',
			'hire developers India',
			'CodelithLabs support',
			'partnership inquiry',
			'software development contact',
		],
		openGraph: {
			...generateLocaleMetadata({
				path: '/contact',
				currentLocale: locale,
				title: 'Contact Us — CodelithLabs',
				description:
					'Reach out to the CodelithLabs engineering team for inquiries, partnerships, or support.',
			}).openGraph,
			type: 'website',
			siteName: 'CodelithLabs',
		},
	};
}

export { default } from '../../contact/page';
