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
			path: '/about',
			currentLocale: locale,
			title: 'About Us - Meet the CodelithLabs Team',
			description:
				'Learn about CodelithLabs, our mission to provide free online tools, and meet the team building the future of web utilities. Based in Kokrajhar, Assam, India.',
		}),
		keywords: [
			'about codelithlabs',
			'codelithlabs team',
			'free tools platform',
			'web utilities',
			'open source tools',
			'privacy-first tools',
		],
		openGraph: {
			...generateLocaleMetadata({
				path: '/about',
				currentLocale: locale,
				title: 'About CodelithLabs',
				description:
					'Meet the team building free, privacy-first online tools for developers and creators worldwide.',
			}).openGraph,
			type: 'website',
			siteName: 'CodelithLabs',
		},
	};
}

import { default as AboutPageContent } from '../../about/page';

export default async function LocaleAboutPage() {
  return (
    <>
      <h1 style={{ display: 'none' }}>About CodelithLabs</h1>
      <AboutPageContent />
    </>
  );
}
