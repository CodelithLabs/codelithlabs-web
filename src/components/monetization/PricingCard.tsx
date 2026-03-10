// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/monetization/PricingCard.tsx
// Freemium pricing UI — Free vs. Premium (Ad-Free) tiers + Razorpay
// ═══════════════════════════════════════════════════════════════════════════
"use client";

import { useUser } from "@/lib/user-context";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

// ─── Razorpay type shim ──────────────────────────────────────────────────

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  image?: string;
  prefill?: { name?: string; email?: string };
  theme?: { color: string };
  handler: (response: RazorpayResponse) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

// ─── Razorpay checkout ───────────────────────────────────────────────────

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

  // 1. Create order via server-side API
  let orderId: string;
  let keyId: string;
  try {
    const res = await fetch("/api/razorpay/create-order", { method: "POST" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Unknown error" }));
      alert(err.error ?? "Failed to create payment order. Please try again.");
      return;
    }
    const data = await res.json();
    orderId = data.orderId;
    keyId = data.keyId;
  } catch {
    alert("Network error. Please check your connection and try again.");
    return;
  }

  // 2. Open Razorpay checkout with the server-created order
  const options: RazorpayOptions = {
    key: keyId,
    amount: 29900, // ₹299 in paise — monthly
    currency: "INR",
    name: "CodelithLabs Premium",
    description: "Ad-Free Membership — Monthly",
    order_id: orderId,
    image: "https://codelithlabs.in/icon.png",
    prefill: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
    theme: { color: "#2979FF" },
    handler: async (response) => {
      // 3. Verify payment signature server-side
      try {
        const verifyRes = await fetch("/api/razorpay/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });
        const result = await verifyRes.json();
        if (result.success) {
          alert("Payment successful! Your premium access is now active. Please refresh the page.");
          window.location.reload();
        } else {
          alert("Payment verification failed. Please contact support with your payment ID.");
        }
      } catch {
        alert("Payment received but verification failed. Please contact support.");
      }
    },
  };

  const rzp = new window.Razorpay!(options);
  rzp.open();
}

// ─── Component ───────────────────────────────────────────────────────────

export function PricingCard() {
  const { user, isPremium, isAuthenticated } = useUser();
  const { data: session } = useSession();
  const t = useTranslations();
  const pathname = usePathname();
  
  // Extract current locale from pathname
  const currentLocale = pathname.split("/")[1] || "en";
  
  // Feature lists with translations
  const freeFeatures = [
    t("pricing.free.features.accessTools"),
    t("pricing.free.features.clientSide"),
    t("pricing.free.features.noRegistration"),
    t("pricing.free.features.communitySupport"),
    t("pricing.free.features.standardSpeed"),
  ];
  
  const premiumFeatures = [
    t("pricing.premium.features.everythingFree"),
    t("pricing.premium.features.adFree"),
    t("pricing.premium.features.priorityQueue"),
    t("pricing.premium.features.prioritySupport"),
    t("pricing.premium.features.earlyAccess"),
    t("pricing.premium.features.customRequest"),
    t("pricing.premium.features.voting"),
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {/* ── Free Tier ── */}
      <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 flex flex-col">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-1">{t("pricing.free.title")}</h3>
          <p className="text-zinc-400 text-sm">{t("pricing.free.subtitle")}</p>
        </div>

        <div className="mb-6">
          <span className="text-4xl font-bold text-white">{t("pricing.free.price")}</span>
          <span className="text-zinc-500 text-sm ml-2">{t("pricing.free.period")}</span>
        </div>

        <ul className="space-y-3 mb-8 flex-1">
          {freeFeatures.map((feature) => (
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
          {t("pricing.free.currentPlan")}
        </button>
      </div>

      {/* ── Premium Tier ── */}
      <div className="relative rounded-2xl border border-blue-500/40 bg-gradient-to-b from-blue-500/10 to-zinc-900/50 p-8 flex flex-col shadow-lg shadow-blue-500/5">
        {/* Badge */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg shadow-blue-500/20">
            {t("pricing.premium.badge")}
          </span>
        </div>

        <div className="mb-6 mt-2">
          <h3 className="text-lg font-semibold text-white mb-1">{t("pricing.premium.title")}</h3>
          <p className="text-zinc-400 text-sm">{t("pricing.premium.subtitle")}</p>
        </div>

        <div className="mb-6">
          <span className="text-4xl font-bold text-white">{t("pricing.premium.price")}</span>
          <span className="text-zinc-500 text-sm ml-2">{t("pricing.premium.period")}</span>
        </div>

        <ul className="space-y-3 mb-8 flex-1">
          {premiumFeatures.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm text-zinc-300">
              <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        {isPremium ? (
          <div className="space-y-2">
            <button
              disabled
              className="w-full py-3 rounded-xl bg-green-600/20 border border-green-500/40 text-green-400 text-sm font-semibold cursor-default"
            >
              {t("pricing.premium.activeMember")}
            </button>
            <p className="text-center text-xs text-zinc-500">
              {user?.premiumExpiresAt
                ? `${t("pricing.premium.renewsOn")} ${new Date(user.premiumExpiresAt).toLocaleDateString()}`
                : t("pricing.premium.premiumActive")}
            </p>
          </div>
        ) : (
          <button
            onClick={() => {
              if (!isAuthenticated) {
                // Redirect to sign-in first
                window.location.href = `/${currentLocale}/auth/signin`;
                return;
              }
              handleRazorpayCheckout(session?.user);
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 
                       hover:from-blue-500 hover:to-purple-500 
                       text-white text-sm font-bold transition-all duration-300
                       shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02]"
          >
            {isAuthenticated ? t("pricing.premium.getPremium") : t("pricing.premium.signInGetPremium")}
          </button>
        )}
      </div>
    </div>
  );
}
