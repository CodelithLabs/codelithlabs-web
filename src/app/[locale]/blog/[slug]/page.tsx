import type { Metadata } from 'next';
import type { Locale } from '@/i18n/request';
import { getLocaleAlternates, getOgLocale } from '@/lib/locale-meta';
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
	const alternates = getLocaleAlternates(`/blog/${slug}`, locale);

	return {
		...base,
		alternates: {
			...(base.alternates ?? {}),
			...alternates,
		},
		openGraph: {
			...(base.openGraph ?? {}),
			locale: getOgLocale(locale),
			url: alternates.canonical,
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
