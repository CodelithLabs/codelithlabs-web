// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/(legal)/refund/page.tsx
// Refund & Cancellation Policy - Required for Razorpay KYC approval
// Transparent refund policy balancing customer trust and business sustainability
// ═══════════════════════════════════════════════════════════════════════════

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy - CodelithLabs Tools',
  description: 'Refund and Cancellation Policy for CodelithLabs Premium subscriptions. Learn about our transparent refund process, eligibility, timeline, and how to request a refund.',
  keywords: ['refund policy', 'cancellation policy', 'codelithlabs refund', 'premium refund', 'subscription cancellation'],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Refund & Cancellation Policy — CodelithLabs',
    description: 'Learn about refunds and cancellations for CodelithLabs Premium subscriptions.',
    url: 'https://codelithlabs.in/refund/',
    siteName: 'CodelithLabs',
    type: 'website',
  },
  alternates: {
    canonical: 'https://codelithlabs.in/refund/',
  },
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Header */}
        <header className="mb-10">
          <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
            <Link href="/" className="hover:text-zinc-300 transition">Home</Link>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-300">Refund & Cancellation Policy</span>
          </nav>

          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Refund & Cancellation Policy
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-400">
            <span><strong className="text-zinc-300">Last Updated:</strong> March 10, 2026</span>
            <span className="text-zinc-700">|</span>
            <span><strong className="text-zinc-300">Jurisdiction:</strong> Kokrajhar, Assam, India</span>
          </div>
        </header>

        {/* Notice Box */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h2 className="text-lg font-semibold text-blue-400 mb-2">Customer Trust & Fairness</h2>
              <p className="text-zinc-300 text-sm leading-relaxed">
                CodelithLabs is committed to transparency and customer satisfaction. This policy outlines
                your rights regarding refunds and cancellations for Premium subscriptions while ensuring
                sustainable operations for our small team.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-8">

          {/* Section 1 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Overview</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              This Refund & Cancellation Policy applies to all purchases of CodelithLabs Premium
              subscriptions made through our website at{' '}
              <span className="text-blue-400">codelithlabs.in</span>. By purchasing a Premium
              subscription, you acknowledge that you have read, understood, and agree to this policy.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              CodelithLabs offers a <strong className="text-zinc-300">monthly subscription-based Premium
              membership</strong> that provides ad-free access, priority support, and enhanced features.
              All subscriptions are processed securely through Razorpay.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Cancellation Policy</h2>
            
            <h3 className="text-xl font-medium mt-6 mb-3 text-zinc-200">2.1 How to Cancel</h3>
            <p className="text-zinc-400 leading-relaxed mb-4">
              You may cancel your Premium subscription at any time by:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-4">
              <li>Logging into your Dashboard and navigating to subscription settings</li>
              <li>Contacting our support team at{' '}
                <a href="mailto:support@codelithlabs.in" className="text-blue-400 hover:underline">
                  support@codelithlabs.in
                </a>
              </li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3 text-zinc-200">2.2 Effect of Cancellation</h3>
            <p className="text-zinc-400 leading-relaxed mb-4">
              Upon cancellation:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-4">
              <li>Your Premium benefits will remain active until the end of your current billing cycle</li>
              <li>You will not be charged for subsequent billing periods</li>
              <li>After expiration, your account will revert to the free tier with ads</li>
              <li>No partial refunds are provided for unused time in the current billing cycle</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Refund Policy</h2>

            <h3 className="text-xl font-medium mt-6 mb-3 text-zinc-200">3.1 Refund Eligibility Window</h3>
            <p className="text-zinc-400 leading-relaxed mb-4">
              Refunds may be requested within <strong className="text-zinc-300">7 days of purchase</strong>{' '}
              under the following conditions:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-4">
              <li>You experienced a technical issue that prevented access to Premium features, and we were
                unable to resolve it within a reasonable timeframe</li>
              <li>You were charged incorrectly or multiple times due to a payment processing error</li>
              <li>The Premium features did not match the description on our Pricing page at the time of purchase</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3 text-zinc-200">3.2 Refund Exclusions</h3>
            <p className="text-zinc-400 leading-relaxed mb-4">
              Refunds will <strong className="text-zinc-300">not</strong> be provided in the following cases:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-4">
              <li>Requests made more than 7 days after the original purchase date</li>
              <li>You changed your mind or no longer need the service (please cancel instead)</li>
              <li>You did not use the Premium features during your subscription period</li>
              <li>You violated our <Link href="/terms" className="text-blue-400 hover:underline">Terms of Service</Link></li>
              <li>Your subscription was already cancelled or expired</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3 text-zinc-200">3.3 How to Request a Refund</h3>
            <p className="text-zinc-400 leading-relaxed mb-4">
              To request a refund, please contact our support team at{' '}
              <a href="mailto:support@codelithlabs.in" className="text-blue-400 hover:underline">
                support@codelithlabs.in
              </a>{' '}
              with the following information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-4">
              <li>Your registered email address</li>
              <li>Payment transaction ID or Razorpay order ID</li>
              <li>Date of purchase</li>
              <li>Detailed reason for the refund request</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3 text-zinc-200">3.4 Refund Processing Timeline</h3>
            <p className="text-zinc-400 leading-relaxed mb-4">
              If your refund request is approved:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-4">
              <li>We will process the refund within <strong className="text-zinc-300">5-7 business days</strong></li>
              <li>The refunded amount will be credited to the original payment method used during purchase</li>
              <li>Depending on your bank or payment provider, it may take an additional 3-10 business days
                for the refund to appear in your account</li>
              <li>You will receive an email confirmation once the refund has been processed</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Subscription Renewals</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              CodelithLabs Premium subscriptions automatically renew on a monthly basis. You will be
              charged at the start of each billing cycle unless you cancel before the renewal date.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              We will send a reminder email <strong className="text-zinc-300">3 days before</strong> your
              renewal date. If you do not wish to continue, please cancel before the renewal date to avoid
              being charged.
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Disputed Charges</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              If you believe you have been charged incorrectly or fraudulently, please contact us
              immediately at{' '}
              <a href="mailto:support@codelithlabs.in" className="text-blue-400 hover:underline">
                support@codelithlabs.in
              </a>{' '}
              before disputing the charge with your bank or payment provider.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              <strong className="text-red-400">Important:</strong> Initiating a chargeback without
              contacting us first may result in the immediate suspension of your account and may affect
              your ability to use our services in the future.
            </p>
          </section>

          {/* Section 6 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Promotional Offers & Discounts</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              From time to time, we may offer promotional pricing or discounts for Premium subscriptions.
              These offers are subject to their own terms and conditions, which will be clearly stated at
              the time of purchase.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Promotional subscriptions are generally non-refundable unless otherwise specified in the
              promotion terms.
            </p>
          </section>

          {/* Section 7 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Service Interruptions</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              While we strive to maintain 99.9% uptime, occasional service interruptions may occur due
              to maintenance, technical issues, or unforeseen circumstances.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              If a service interruption prevents access to Premium features for more than{' '}
              <strong className="text-zinc-300">48 continuous hours</strong>, you may be eligible for a
              pro-rated refund or account credit at our discretion. Please contact support for assistance.
            </p>
          </section>

          {/* Section 8 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">8. Changes to This Policy</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              We reserve the right to modify this Refund & Cancellation Policy at any time. Changes will
              be effective immediately upon posting to this page with an updated "Last Updated" date.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              We encourage you to review this policy periodically. Continued use of the Service after any
              changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Section 9 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">9. Contact Information</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              If you have questions about this Refund & Cancellation Policy or need assistance with a
              refund or cancellation request, please contact us:
            </p>
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 space-y-2">
              <p className="text-zinc-300">
                <strong>Email:</strong>{' '}
                <a href="mailto:support@codelithlabs.in" className="text-blue-400 hover:underline">
                  support@codelithlabs.in
                </a>
              </p>
              <p className="text-zinc-300">
                <strong>Support Hours:</strong> Monday - Friday, 10:00 AM - 6:00 PM IST
              </p>
              <p className="text-zinc-300">
                <strong>Average Response Time:</strong> Within 24-48 hours
              </p>
            </div>
          </section>

          {/* Related Policies */}
          <section className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Related Policies</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              For more information about how we operate, please review our related policies:
            </p>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <Link href="/privacy" className="text-blue-400 hover:underline flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-blue-400 hover:underline flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-blue-400 hover:underline flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Contact Us
                </Link>
              </li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}
