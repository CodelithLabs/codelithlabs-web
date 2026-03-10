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
	const t = await getTranslations({ locale, namespace: 'pages.projects.meta' });

	return {
		...generateLocaleMetadata({
			path: '/projects',
			currentLocale: locale,
			title: t('title'),
			description: t('description'),
		}),
		openGraph: {
			...generateLocaleMetadata({
				path: '/projects',
				currentLocale: locale,
				title: t('title'),
				description: t('description'),
			}).openGraph,
			type: 'website',
			siteName: 'CodelithLabs',
		},
	};
}

export { default } from '../../projects/page';
