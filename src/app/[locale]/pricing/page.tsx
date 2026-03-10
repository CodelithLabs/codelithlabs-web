// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/[locale]/pricing/page.tsx
// Locale-aware pricing page — PricingCard + FAQ + trust signals
// ═══════════════════════════════════════════════════════════════════════════

import type { Metadata } from "next";
import { PricingCard } from "@/components/monetization/PricingCard";

export const metadata: Metadata = {
  title: "Pricing — Free & Premium Plans",
  description:
    "All CodelithLabs tools stay free. Upgrade to Premium for ad-free usage, priority support, and faster workflows. Start at ₹299/month with secure Razorpay checkout.",
  openGraph: {
    title: "Pricing — CodelithLabs",
    description: "Free tools for everyone. Premium for power users.",
  },
};

const PRICING_FAQ = [
  {
    q: "Can I use all tools for free?",
    a: "Yes! Every tool on CodelithLabs is 100% free with no usage limits. Premium simply removes ads and adds convenience features.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We use Razorpay, which supports UPI, credit/debit cards, net banking, and popular wallets like Paytm, PhonePe, and Google Pay.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Premium is monthly with no long-term lock-in. If you need help with cancellation or billing, contact support and we'll handle it quickly.",
  },
  {
    q: "Is my payment data secure?",
    a: "All payments are processed by Razorpay, a PCI-DSS Level 1 compliant payment gateway. We never see or store your card details.",
  },
  {
    q: "Do free users lose access to tools?",
    a: "No. Every tool remains free to use. Premium is for users who want an ad-free workflow, faster priority queue, and dedicated support.",
  },
  {
    q: "Who should buy Premium?",
    a: "Premium is best for daily users, freelancers, students preparing projects, content teams, and developers who want zero-distraction workflows and quicker support.",
  },
];

export default function PricingPage() {
  const pricingSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "CodelithLabs Pricing",
    description: "Free and Premium plans for CodelithLabs developer tools",
    url: "https://codelithlabs.in/pricing/",
    mainEntity: {
      "@type": "Product",
      name: "CodelithLabs Premium",
      description: "Ad-free membership with priority access to 200+ developer tools",
      offers: [
        {
          "@type": "Offer",
          name: "Free",
          price: "0",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
        },
        {
          "@type": "Offer",
          name: "Premium",
          price: "299",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          priceValidUntil: "2027-12-31",
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />

      <div className="min-h-screen bg-[#0a0a0a]">
        {/* Hero */}
        <section className="pt-24 pb-16 px-6 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6">
            PRICING
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Simple, transparent pricing
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            All tools are free forever. Go Premium for an ad-free, distraction-free
            experience with priority support and early access.
          </p>
        </section>

        {/* Pricing Cards */}
        <section className="px-6 pb-20">
          <PricingCard />
        </section>

        {/* Trust Signals */}
        <section className="border-t border-zinc-800/50 bg-zinc-950/50 py-16 px-6">
          <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-1">200+</div>
              <div className="text-sm text-zinc-400">Free Tools</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">100%</div>
              <div className="text-sm text-zinc-400">Client-Side Processing</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">0</div>
              <div className="text-sm text-zinc-400">Data Stored on Servers</div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {PRICING_FAQ.map(({ q, a }) => (
                <details
                  key={q}
                  className="group rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-5 cursor-pointer text-white font-medium text-sm hover:bg-zinc-800/30 transition-colors">
                    {q}
                    <svg
                      className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-5 text-sm text-zinc-400 leading-relaxed">
                    {a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
