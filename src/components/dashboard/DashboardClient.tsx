// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/dashboard/DashboardClient.tsx
// Client-side dashboard UI — profile, premium status, quick actions
// ═══════════════════════════════════════════════════════════════════════════

'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/lib/user-context';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import {
  User, Crown, CreditCard, Settings, LogOut,
  Shield, Wrench, BookOpen, Mail, ExternalLink
} from 'lucide-react';

const TOOL_ACTION_COUNT_KEY = 'cl_tool_actions_count_v1';
const DASHBOARD_PREMIUM_BANNER_DISMISS_UNTIL_KEY = 'cl_dashboard_premium_banner_dismiss_until_v1';
const DASHBOARD_PREMIUM_BANNER_DISMISS_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

export function DashboardClient() {
  const { user, isPremium, isLoading, isAuthenticated } = useUser();
  const [toolActions, setToolActions] = useState(0);
  const [showPremiumBanner, setShowPremiumBanner] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || isPremium) return;

    const actionCount = Number(window.localStorage.getItem(TOOL_ACTION_COUNT_KEY) || '0');
    setToolActions(Number.isFinite(actionCount) ? actionCount : 0);

    const dismissUntil = Number(window.localStorage.getItem(DASHBOARD_PREMIUM_BANNER_DISMISS_UNTIL_KEY) || '0');
    const now = Date.now();
    const isDismissed = Number.isFinite(dismissUntil) && dismissUntil > now;

    setShowPremiumBanner(!isDismissed);
  }, [isPremium]);

  const dismissPremiumBanner = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        DASHBOARD_PREMIUM_BANNER_DISMISS_UNTIL_KEY,
        String(Date.now() + DASHBOARD_PREMIUM_BANNER_DISMISS_COOLDOWN_MS)
      );
    }

    setShowPremiumBanner(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-400">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4">
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl text-center max-w-md">
          <User className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Sign In Required</h1>
          <p className="text-zinc-400 text-sm mb-6">
            Please sign in with your Google account to access your dashboard.
          </p>
          <Link
            href="/api/auth/signin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500
                       text-white font-semibold rounded-lg transition-colors"
          >
            Sign In with Google
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <header className="mb-8">
          <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
            <Link href="/" className="hover:text-zinc-300 transition">Home</Link>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-300">Dashboard</span>
          </nav>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-zinc-400 mt-1">Manage your CodelithLabs account</p>
        </header>

        {/* Profile Card */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-4">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || 'Profile'}
                width={64}
                height={64}
                className="rounded-full border-2 border-zinc-700"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-500/30
                              flex items-center justify-center">
                <User className="w-8 h-8 text-blue-400" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-white">{user.name || 'User'}</h2>
                {isPremium && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                                   bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
                    <Crown className="w-3 h-3" /> Premium
                  </span>
                )}
              </div>
              <p className="text-zinc-400 text-sm mt-1">{user.email}</p>
              <p className="text-zinc-600 text-xs mt-1">ID: {user.id}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <Shield className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Plan</span>
            </div>
            <p className="text-lg font-semibold text-white">
              {isPremium ? 'Premium' : 'Free'}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              {isPremium
                ? `Active until ${user?.premiumExpiresAt ? new Date(user.premiumExpiresAt).toLocaleDateString() : 'further notice'}`
                : 'Ads supported'}
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <Wrench className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Tools</span>
            </div>
            <p className="text-lg font-semibold text-white">200+</p>
            <p className="text-xs text-zinc-500 mt-1">All tools available</p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Blog</span>
            </div>
            <p className="text-lg font-semibold text-white">Active</p>
            <p className="text-xs text-zinc-500 mt-1">Developer insights</p>
          </div>
        </div>

        {/* Upgrade CTA (only for free users) */}
        {!isPremium && showPremiumBanner && (
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/25 rounded-xl p-6 mb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  Upgrade when you are ready — go Premium
                </h3>
                <p className="text-zinc-300 text-sm mt-1">
                  {toolActions >= 5
                    ? `You have already used ${toolActions} tool actions recently. Premium keeps your workflow ad-free and faster.`
                    : 'Get a cleaner, ad-free workspace with priority support whenever you need it.'}
                </p>

                <ul className="mt-3 space-y-1.5 text-xs text-zinc-400">
                  <li className="flex items-center gap-2"><span className="text-blue-400">✓</span> Zero display ads across tools</li>
                  <li className="flex items-center gap-2"><span className="text-blue-400">✓</span> Priority support for payment and account help</li>
                  <li className="flex items-center gap-2"><span className="text-blue-400">✓</span> Same trusted tools, smoother daily usage</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={dismissPremiumBanner}
                className="text-zinc-400 hover:text-zinc-200 text-xs border border-zinc-700 px-2.5 py-1 rounded-md transition-colors"
              >
                Hide
              </button>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Link
                href="/pricing"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white
                           font-semibold rounded-lg transition-colors
                           shadow-lg shadow-blue-500/20 flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                See Premium Plans
              </Link>
              <span className="text-xs text-zinc-500">Starts at ₹299/month</span>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-zinc-400" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/tools"
              className="flex items-center gap-3 p-3 rounded-lg border border-zinc-800
                         hover:border-zinc-600 hover:bg-zinc-800/50 transition-all group"
            >
              <Wrench className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-white group-hover:text-blue-400 transition">
                  Browse Tools
                </p>
                <p className="text-xs text-zinc-500">200+ free online tools</p>
              </div>
              <ExternalLink className="w-4 h-4 text-zinc-600 ml-auto" />
            </Link>

            <Link
              href="/blog"
              className="flex items-center gap-3 p-3 rounded-lg border border-zinc-800
                         hover:border-zinc-600 hover:bg-zinc-800/50 transition-all group"
            >
              <BookOpen className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm font-medium text-white group-hover:text-green-400 transition">
                  Developer Blog
                </p>
                <p className="text-xs text-zinc-500">Tutorials & guides</p>
              </div>
              <ExternalLink className="w-4 h-4 text-zinc-600 ml-auto" />
            </Link>

            <Link
              href="/contact"
              className="flex items-center gap-3 p-3 rounded-lg border border-zinc-800
                         hover:border-zinc-600 hover:bg-zinc-800/50 transition-all group"
            >
              <Mail className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm font-medium text-white group-hover:text-purple-400 transition">
                  Contact Us
                </p>
                <p className="text-xs text-zinc-500">Get in touch</p>
              </div>
              <ExternalLink className="w-4 h-4 text-zinc-600 ml-auto" />
            </Link>

            <Link
              href="/privacy"
              className="flex items-center gap-3 p-3 rounded-lg border border-zinc-800
                         hover:border-zinc-600 hover:bg-zinc-800/50 transition-all group"
            >
              <Shield className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-sm font-medium text-white group-hover:text-amber-400 transition">
                  Privacy Policy
                </p>
                <p className="text-xs text-zinc-500">Your data, your control</p>
              </div>
              <ExternalLink className="w-4 h-4 text-zinc-600 ml-auto" />
            </Link>
          </div>
        </div>

        {/* Sign Out */}
        <div className="text-center">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-red-500/20
                       text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
