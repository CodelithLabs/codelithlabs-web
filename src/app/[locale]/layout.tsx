import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Locale, locales, messagesByLocale } from '@/i18n/request';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// Generate static params for all supported locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const resolvedLocale = locale as Locale;
  setRequestLocale(resolvedLocale);

  return (
    <NextIntlClientProvider locale={resolvedLocale} messages={messagesByLocale[resolvedLocale]}>
      {children}
    </NextIntlClientProvider>
  );
}
