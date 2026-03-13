import { redirect } from 'next/navigation';
import type { Locale } from '@/i18n/request';

interface LocaleAdminPageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function LocaleAdminPage({ params }: LocaleAdminPageProps) {
  const { locale } = await params;
  redirect(`/${locale}/admin/analytics`);
}
