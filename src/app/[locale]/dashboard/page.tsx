// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/[locale]/dashboard/page.tsx
// Locale-aware dashboard page
// User dashboard — profile, premium status, account settings
// ═══════════════════════════════════════════════════════════════════════════

import { Metadata } from 'next';
import { DashboardClient } from '@/components/dashboard/DashboardClient';

export const metadata: Metadata = {
  title: 'Dashboard — CodelithLabs',
  description: 'Manage your CodelithLabs account, premium subscription, and preferences.',
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return (
    <>
      <h1 style={{ display: 'none' }}>Dashboard</h1>
      <DashboardClient />
    </>
  );
}
