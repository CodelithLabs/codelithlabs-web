// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/monetization/PricingCard.tsx
// Freemium pricing UI — Free vs. Premium (Ad-Free) tiers + Razorpay
// ═══════════════════════════════════════════════════════════════════════════
"use client";

import { useNonce } from "@/app/nonce-context";
import { useUser } from "@/lib/user-context";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

type CheckoutStatus = "idle" | "loading" | "verifying" | "success" | "error";

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

  function loadRazorpayScript(nonce?: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    if (nonce) {
      script.nonce = nonce;
    }
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

  async function startRazorpayCheckout(params: {
    user?: { name?: string | null; email?: string | null };
    nonce?: string;
    setStatus: (s: CheckoutStatus) => void;
    setError: (msg: string) => void;
  }) {
    const { user, nonce, setStatus, setError } = params;
    const loaded = await loadRazorpayScript(nonce);
    if (!loaded) {
      setStatus("error");
      setError("Payment gateway failed to load. Please check your connection and try again.");
      return;
    }

    let orderId: string;
    let keyId: string;

    try {
      const res = await fetch("/api/razorpay/create-order", { method: "POST" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        setStatus("error");
        setError(err.error ?? "Failed to create payment order. Please try again.");
        return;
      }
      const data = await res.json();
      orderId = data.orderId;
      keyId = data.keyId;
    } catch {
      setStatus("error");
      setError("Network error. Please check your connection and try again.");
      return;
    }

    const options: RazorpayOptions = {
      key: keyId,
      amount: 9900,
      currency: "INR",
      name: "CodelithLabs Premium",
      description: "Ad-Free Membership — Monthly (Introductory ₹99)",
      order_id: orderId,
      image: "https://codelithlabs.in/icon.png",
      prefill: {
        name: user?.name ?? "",
        email: user?.email ?? "",
      },
      theme: { color: "#2979FF" },
      handler: async (response) => {
        setStatus("verifying");
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
            setStatus("success");
          } else {
            setStatus("error");
            setError("Payment verification failed. Please contact support with your payment ID: " + response.razorpay_payment_id);
          }
        } catch {
          setStatus("error");
          setError("Payment received but verification failed. Contact support with payment ID: " + response.razorpay_payment_id);
        }
      },
  };

  const rzp = new window.Razorpay!(options);
  rzp.open();
}

export function PricingCard() {
  const { user, isPremium, isAuthenticated } = useUser();
  const { data: session } = useSession();
  const nonce = useNonce();
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1] || "en";
  const [checkoutStatus, setCheckoutStatus] = useState<CheckoutStatus>("idle");
  const [checkoutError, setCheckoutError] = useState("");

    useEffect(() => {
      if (checkoutStatus === "success") {
        const timer = setTimeout(() => window.location.reload(), 3000);
        return () => clearTimeout(timer);
      }
    }, [checkoutStatus]);

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
        {/* Checkout status banners */}
        {checkoutStatus === "success" && (
          <div className="md:col-span-2 flex items-start gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400">
            <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-sm">Premium activated! 🎉</p>
              <p className="text-xs mt-0.5 text-green-400/80">Your ad-free access is now live. The page will refresh in 3 seconds…</p>
            </div>
          </div>
        )}
        {checkoutStatus === "verifying" && (
          <div className="md:col-span-2 flex items-center gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Loader2 className="w-5 h-5 animate-spin shrink-0" />
            <p className="text-sm font-medium">Verifying your payment…</p>
          </div>
        )}
        {checkoutStatus === "error" && (
          <div className="md:col-span-2 flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-sm">Payment issue</p>
              <p className="text-xs mt-0.5 text-red-400/80">{checkoutError}</p>
            </div>
          </div>
        )}
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

      <div className="relative rounded-2xl border border-blue-500/40 bg-gradient-to-b from-blue-500/10 to-zinc-900/50 p-8 flex flex-col shadow-lg shadow-blue-500/5">
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
          <div className="mb-1 flex items-center gap-2">
            <span className="text-zinc-500 text-sm line-through">{t("pricing.premium.originalPrice")}</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
              {t("pricing.premium.introductoryBadge")}
            </span>
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
                window.location.href = `/${currentLocale}/auth/signin`;
                return;
              }

                setCheckoutStatus("loading");
                setCheckoutError("");
                startRazorpayCheckout({
                  user: session?.user,
                  nonce: nonce || undefined,
                  setStatus: setCheckoutStatus,
                  setError: setCheckoutError,
                });
            }}
              disabled={checkoutStatus === "loading" || checkoutStatus === "verifying"}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 
                       hover:from-blue-500 hover:to-purple-500 
                         text-white text-sm font-bold transition-all duration-300
                         shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02]
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
              {checkoutStatus === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Preparing checkout…
                </span>
              ) : (
                isAuthenticated ? t("pricing.premium.getPremium") : t("pricing.premium.signInGetPremium")
              )}
          </button>
        )}
      </div>
    </div>
  );
}
