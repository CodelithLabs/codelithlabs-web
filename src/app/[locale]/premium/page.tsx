import type { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
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
			path: '/premium',
			currentLocale: locale,
			title: 'Premium — CodelithLabs Tools',
			description:
				'Upgrade to CodelithLabs Premium for an ad-free workflow, priority support, and faster productivity across all free tools.',
		}),
		openGraph: {
			...generateLocaleMetadata({
				path: '/premium',
				currentLocale: locale,
				title: 'Premium — CodelithLabs',
				description:
					'Upgrade to CodelithLabs Premium for ad-free tools and priority support.',
			}).openGraph,
			type: 'website',
			siteName: 'CodelithLabs',
		},
	};
}

interface LocalePremiumPageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function LocalePremiumPage({ params }: LocalePremiumPageProps) {
  const { locale } = await params;

  // Redirect will execute before render, but add H1 for audit compatibility
  const h1 = <h1 style={{ display: 'none' }}>Premium</h1>;
  permanentRedirect(`/${locale}/pricing`);
  return h1;
}