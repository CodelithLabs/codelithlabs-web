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
			path: '/tech-stack',
			currentLocale: locale,
			title: 'Our Tech Stack — Transparency | CodelithLabs',
			description:
				'Full transparency into the technologies powering CodelithLabs: Next.js, TypeScript, Tailwind CSS, Docker, Web Workers, and client-side processing architecture.',
		}),
		keywords: ['tech stack', 'next.js', 'typescript', 'tailwind', 'docker', 'open source', 'web architecture'],
		openGraph: {
			...generateLocaleMetadata({
				path: '/tech-stack',
				currentLocale: locale,
				title: 'Our Tech Stack — CodelithLabs',
				description: 'Full transparency into how CodelithLabs is built.',
			}).openGraph,
			type: 'website',
			siteName: 'CodelithLabs',
		},
		robots: { index: true, follow: true },
	};
}

export { default } from '../../tech-stack/page';
