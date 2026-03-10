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
			path: '/blog',
			currentLocale: locale,
			title: 'Blog — Developer Insights & Tool Guides | CodelithLabs',
			description:
				'Technical tutorials, tool guides, and developer insights from the CodelithLabs engineering team. Learn JSON, regex, web performance, security, and more.',
		}),
		keywords: [
			'developer blog',
			'technical tutorials',
			'tool guides',
			'json guide',
			'regex tutorial',
			'web performance',
		],
		openGraph: {
			...generateLocaleMetadata({
				path: '/blog',
				currentLocale: locale,
				title: 'Blog — CodelithLabs Developer Insights',
				description:
					'Technical tutorials, tool guides, and developer tips from the CodelithLabs engineering team.',
			}).openGraph,
			type: 'website',
			siteName: 'CodelithLabs',
		},
		robots: { index: true, follow: true },
	};
}

export { default } from '../../blog/page';
