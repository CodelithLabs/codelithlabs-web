import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { canAccessPremiumAudit } from '@/lib/admin-access';
import type { Locale } from '@/i18n/request';
import { AnalyticsDashboardClient } from '@/components/admin/AnalyticsDashboardClient';

export const metadata: Metadata = {
  title: 'Admin Analytics — CodelithLabs',
  description: 'Internal analytics dashboard for top pages/tools/games and 24-hour trend monitoring.',
  robots: { index: false, follow: false },
};

interface AdminAnalyticsPageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function AdminAnalyticsPage({ params }: AdminAnalyticsPageProps) {
  const { locale } = await params;
  const session = await auth();
  const userEmail = session?.user?.email;

  if (!session?.user || !canAccessPremiumAudit(userEmail)) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-center sm:p-8">
          <h1 className="text-2xl font-bold text-white">Admin access required</h1>
          <p className="mt-3 text-sm text-zinc-400">
            You are signed in, but your account does not have access to the analytics admin dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 style={{ display: 'none' }}>Admin Analytics</h1>
      <AnalyticsDashboardClient locale={locale} />
    </>
  );
}
