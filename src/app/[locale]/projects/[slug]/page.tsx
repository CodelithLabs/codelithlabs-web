import type { Metadata } from 'next';
import type { Locale } from '@/i18n/request';
import { getLocaleAlternates, getOgLocale } from '@/lib/locale-meta';
import {
	generateStaticParams,
	generateMetadata as generateBaseMetadata,
} from '../../../projects/[slug]/page';

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
	const { locale, slug } = await params;
	const base = await generateBaseMetadata({ params: Promise.resolve({ slug }) });
	const alternates = getLocaleAlternates(`/projects/${slug}`, locale);

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

export { default } from '../../../projects/[slug]/page';
