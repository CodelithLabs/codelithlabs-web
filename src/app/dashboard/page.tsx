// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/dashboard/page.tsx
// User dashboard — profile, premium status, account settings
// ═══════════════════════════════════════════════════════════════════════════

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard — CodelithLabs',
  description: 'Manage your CodelithLabs account, premium subscription, and preferences.',
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <DashboardClient />;
}

// Separate client component import to keep metadata as server component
import { DashboardClient } from '@/components/dashboard/DashboardClient';
