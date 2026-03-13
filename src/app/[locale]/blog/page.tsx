import type { Metadata } from 'next';
import { generateLocaleMetadata } from '@/lib/locale-meta';
import { getOgAlternateLocales, getOgLocale } from '@/lib/locale-meta';
import type { Locale } from '@/i18n/request';

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const base = generateLocaleMetadata({
		path: '/blog/',
		currentLocale: locale,
		title: 'Blog — Developer Insights & Tool Guides | CodelithLabs',
		description:
			'Technical tutorials, tool guides, and developer insights from the CodelithLabs engineering team. Learn JSON, regex, web performance, security, and more.',
	});
	const baseOg = generateLocaleMetadata({
		path: '/blog/',
		currentLocale: locale,
		title: 'Blog — CodelithLabs Developer Insights',
		description:
			'Technical tutorials, tool guides, and developer tips from the CodelithLabs engineering team.',
	}).openGraph;
	const blogOgImage = `https://codelithlabs.in/api/og?${new URLSearchParams({
		name: 'Developer Blog',
		category: 'developer',
		label: 'Blog',
		locale,
		path: `/${locale}/blog`,
		subtitle: 'Technical tutorials and developer insights',
	}).toString()}`;

	return {
		...base,
		keywords: [
			'developer blog',
			'technical tutorials',
			'tool guides',
			'json guide',
			'regex tutorial',
			'web performance',
		],
		openGraph: {
			...baseOg,
			type: 'website',
			siteName: 'CodelithLabs',
			locale: getOgLocale(locale),
			alternateLocale: getOgAlternateLocales(locale),
			images: [blogOgImage],
		},
		twitter: {
			card: 'summary_large_image',
			title: 'Blog — CodelithLabs Developer Insights',
			description:
				'Technical tutorials, tool guides, and developer tips from the CodelithLabs engineering team.',
			images: [blogOgImage],
		},
		robots: { index: true, follow: true },
	};
}

import { default as BlogPageContent } from '../../blog/page';

export default async function LocaleBlogPage({
	params,
}: {
	params: Promise<{ locale: Locale }>;
}) {
	const { locale } = await params;

  return (
    <>
      <h1 style={{ display: 'none' }}>Developer Blog</h1>
			<BlogPageContent params={Promise.resolve({ locale })} />
    </>
  );
}
