import type { Metadata } from 'next';
import type { Locale } from '@/i18n/request';
import { getLocaleAlternates, getOgAlternateLocales, getOgLocale } from '@/lib/locale-meta';
import {
	generateStaticParams,
	generateMetadata as generateBaseMetadata,
} from '../../../blog/[slug]/page';

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
	const { locale, slug } = await params;
	const base = await generateBaseMetadata({ params: Promise.resolve({ slug }) });
	const alternates = getLocaleAlternates(`/blog/${slug}/`, locale);
	const baseOgImages = base.openGraph?.images;
	const ogImageList = !baseOgImages ? [] : Array.isArray(baseOgImages) ? baseOgImages : [baseOgImages];
	const localizedOgImages = ogImageList.map((image) => {
		if (typeof image === 'string' || image instanceof URL) {
			const url = new URL(image.toString());
			if (url.pathname === '/api/og') {
				url.searchParams.set('locale', locale);
				url.searchParams.set('path', `/${locale}/blog`);
			}
			return url.toString();
		}

		const rawUrl = typeof image.url === 'string' ? image.url : image.url.toString();
		const url = new URL(rawUrl);
		if (url.pathname === '/api/og') {
			url.searchParams.set('locale', locale);
			url.searchParams.set('path', `/${locale}/blog`);
		}
		return {
			...image,
			url: url.toString(),
		};
	});

	const baseTwitterImages = base.twitter?.images;
	const twitterImageList = !baseTwitterImages
		? []
		: Array.isArray(baseTwitterImages)
			? baseTwitterImages
			: [baseTwitterImages];
	const localizedTwitterImages = twitterImageList.map((image) => {
		const imageUrl = typeof image === 'string' || image instanceof URL ? image.toString() : image.url.toString();
		const url = new URL(imageUrl.toString());
		if (url.pathname === '/api/og') {
			url.searchParams.set('locale', locale);
			url.searchParams.set('path', `/${locale}/blog`);
		}
		return url.toString();
	});

	return {
		...base,
		alternates: {
			...(base.alternates ?? {}),
			...alternates,
		},
		openGraph: {
			...(base.openGraph ?? {}),
			locale: getOgLocale(locale),
			alternateLocale: getOgAlternateLocales(locale),
			url: alternates.canonical,
			images: localizedOgImages.length ? localizedOgImages : undefined,
		},
		twitter: {
			...(base.twitter ?? {}),
			images: localizedTwitterImages.length ? localizedTwitterImages : undefined,
		},
	};
}

import { default as BlogSlugPageContent } from '../../../blog/[slug]/page';

interface PageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export default async function LocaleBlogSlugPage(props: PageProps) {
  return (
    <>
      <h1 style={{ display: 'none' }}>Blog Article</h1>
      <BlogSlugPageContent {...props} />
    </>
  );
}
