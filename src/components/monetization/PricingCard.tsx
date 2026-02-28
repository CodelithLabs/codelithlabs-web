// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/monetization/PricingCard.tsx
// Freemium pricing UI — Free vs. Premium (Ad-Free) tiers + Razorpay
// ═══════════════════════════════════════════════════════════════════════════
"use client";

import { useUser } from "@/lib/user-context";
import { useSession } from "next-auth/react";

// ─── Razorpay type shim ──────────────────────────────────────────────────

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  prefill?: { name?: string; email?: string };
  theme?: { color: string };
  handler: (response: { razorpay_payment_id: string }) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

// ─── Feature list ────────────────────────────────────────────────────────

const FREE_FEATURES = [
  "Access to all 90+ tools",
  "Client-side processing",
  "No registration required",
  "Community support",
  "Standard processing speed",
] as const;

const PREMIUM_FEATURES = [
  "Everything in Free",
  "Ad-free experience",
  "Priority processing speed",
  "Early access to new tools",
  "Premium support channel",
  "Custom tool requests",
] as const;

// ─── Razorpay checkout placeholder ──────────────────────────────────────

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

async function handleRazorpayCheckout(user?: { name?: string | null; email?: string | null }) {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    alert("Payment gateway failed to load. Please try again.");
    return;
  }

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (!keyId) {
    alert("Payment is not configured yet. Please contact support.");
    return;
  }

  const options: RazorpayOptions = {
    key: keyId,
    amount: 29900, // ₹299 in paise — monthly
    currency: "INR",
    name: "CodelithLabs Premium",
    description: "Ad-Free Membership — Monthly",
    image: "https://codelithlabs.in/icon.png",
    prefill: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
    theme: { color: "#2979FF" },
    handler: (response) => {
      // TODO: Send response.razorpay_payment_id to your API
      // to verify payment and activate premium status
      console.log("Payment successful:", response.razorpay_payment_id);
      alert("Payment successful! Your premium access will be activated shortly.");
    },
  };

  const rzp = new window.Razorpay!(options);
  rzp.open();
}

// ─── Component ───────────────────────────────────────────────────────────

export function PricingCard() {
  const { user, isPremium, isAuthenticated } = useUser();
  const { data: session } = useSession();

  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {/* ── Free Tier ── */}
      <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 flex flex-col">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-1">Free</h3>
          <p className="text-zinc-400 text-sm">Everything you need to get started</p>
        </div>

        <div className="mb-6">
          <span className="text-4xl font-bold text-white">₹0</span>
          <span className="text-zinc-500 text-sm ml-2">/ forever</span>
        </div>

        <ul className="space-y-3 mb-8 flex-1">
          {FREE_FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm text-zinc-300">
              <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        <button
          disabled
          className="w-full py-3 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-semibold cursor-default"
        >
          Current Plan
        </button>
      </div>

      {/* ── Premium Tier ── */}
      <div className="relative rounded-2xl border border-blue-500/40 bg-gradient-to-b from-blue-500/10 to-zinc-900/50 p-8 flex flex-col shadow-lg shadow-blue-500/5">
        {/* Badge */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg shadow-blue-500/20">
            RECOMMENDED
          </span>
        </div>

        <div className="mb-6 mt-2">
          <h3 className="text-lg font-semibold text-white mb-1">Premium</h3>
          <p className="text-zinc-400 text-sm">Ad-free experience with priority access</p>
        </div>

        <div className="mb-6">
          <span className="text-4xl font-bold text-white">₹299</span>
          <span className="text-zinc-500 text-sm ml-2">/ month</span>
        </div>

        <ul className="space-y-3 mb-8 flex-1">
          {PREMIUM_FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm text-zinc-300">
              <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        {isPremium ? (
          <button
            disabled
            className="w-full py-3 rounded-xl bg-green-600/20 border border-green-500/40 text-green-400 text-sm font-semibold cursor-default"
          >
            ✓ Active Member
          </button>
        ) : (
          <button
            onClick={() => {
              if (!isAuthenticated) {
                // Redirect to sign-in first
                window.location.href = "/api/auth/signin?callbackUrl=/pricing";
                return;
              }
              handleRazorpayCheckout(session?.user);
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 
                       hover:from-blue-500 hover:to-purple-500 
                       text-white text-sm font-bold transition-all duration-300
                       shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02]"
          >
            {isAuthenticated ? "Upgrade Now" : "Sign In & Upgrade"}
          </button>
        )}
      </div>
    </div>
  );
}
