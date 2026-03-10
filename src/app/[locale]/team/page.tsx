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
	const t = await getTranslations({ locale, namespace: 'pages.team.meta' });

	return {
		...generateLocaleMetadata({
			path: '/team',
			currentLocale: locale,
			title: t('title'),
			description: t('description'),
		}),
		openGraph: {
			...generateLocaleMetadata({
				path: '/team',
				currentLocale: locale,
				title: t('title'),
				description: t('description'),
			}).openGraph,
			type: 'website',
			siteName: 'CodelithLabs',
		},
	};
}

export { default } from '../../team/page';
