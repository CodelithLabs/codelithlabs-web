// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/(legal)/terms/page.tsx
// Terms of Service - Required for Google AdSense approval
// Standard terms for a free online tools platform
// ═══════════════════════════════════════════════════════════════════════════

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - CodelithLabs Tools',
  description: 'Terms of Service for CodelithLabs Tools platform. Read our usage terms and conditions.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Header */}
        <header className="mb-10">
          <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
            <a href="/" className="hover:text-zinc-300 transition">Home</a>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-300">Terms of Service</span>
          </nav>

          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-zinc-400">Last updated: February 14, 2025</p>
        </header>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-8">

          {/* Introduction */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Acceptance of Terms</h2>
            <p className="text-zinc-400 leading-relaxed">
              Welcome to CodelithLabs Tools ("we," "us," or "our"). By accessing or using our website
              at <span className="text-blue-400">codelithlabs.in</span> (the "Service"), you agree to
              be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please
              do not use our Service.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Description of Service</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              CodelithLabs Tools provides a collection of free online tools for text processing, image
              manipulation, code formatting, calculators, generators, and more. Most tools process data
              client-side in your browser without server transmission.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              We reserve the right to modify, suspend, or discontinue any part of the Service at any
              time without notice.
            </p>
          </section>

          {/* Section 3 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">3. User Responsibilities</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">You agree to:</p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-4">
              <li>Use the Service only for lawful purposes</li>
              <li>Not use the Service to harm, harass, or violate the rights of others</li>
              <li>Not attempt to gain unauthorized access to our systems or other users' data</li>
              <li>Not use automated tools (bots, scrapers) to access the Service excessively</li>
              <li>Not upload malicious code, viruses, or harmful content</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Intellectual Property</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              All content on the Service, including text, graphics, logos, code, and software, is the
              property of CodelithLabs or its licensors and is protected by copyright, trademark, and
              other intellectual property laws.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              You may not reproduce, distribute, modify, or create derivative works from our content
              without explicit written permission, except for personal, non-commercial use of our tools.
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">5. User Content and Data</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              When you use our tools, you may input text, files, or other data ("User Content"). For
              client-side tools, this data is processed entirely in your browser and is not transmitted
              to our servers.
            </p>
            <p className="text-zinc-400 leading-relaxed mb-4">
              You retain all rights to your User Content. By using our Service, you represent and
              warrant that:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-4">
              <li>You own or have rights to the User Content</li>
              <li>The User Content does not violate any laws or third-party rights</li>
              <li>The User Content does not contain viruses or malicious code</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Disclaimer of Warranties</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
              EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-4">
              <li>Warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
              <li>Warranties that the Service will be uninterrupted, error-free, or secure</li>
              <li>Warranties regarding the accuracy or reliability of results from our tools</li>
            </ul>
            <p className="text-zinc-400 leading-relaxed mt-4">
              You use the Service at your own risk. We do not guarantee that results from our tools will
              meet your requirements.
            </p>
          </section>

          {/* Section 7 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Limitation of Liability</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, CODELITHLABS SHALL NOT BE LIABLE FOR ANY:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-4">
              <li>Indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, revenue, data, or business opportunities</li>
              <li>Damages arising from your use or inability to use the Service</li>
              <li>Damages from unauthorized access to or alteration of your data</li>
            </ul>
            <p className="text-zinc-400 leading-relaxed mt-4">
              Our total liability for any claim related to the Service shall not exceed $100 USD or the
              amount you paid us (if any) in the past 12 months, whichever is less.
            </p>
          </section>

          {/* Section 8 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">8. Third-Party Services</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              Our Service may contain links to third-party websites or services (e.g., Google AdSense,
              Google Analytics). We are not responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-4">
              <li>The content, policies, or practices of third-party services</li>
              <li>Any damages or losses caused by your use of third-party services</li>
            </ul>
            <p className="text-zinc-400 leading-relaxed mt-4">
              Your use of third-party services is at your own risk and subject to their terms and policies.
            </p>
          </section>

          {/* Section 9 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">9. Advertising</h2>
            <p className="text-zinc-400 leading-relaxed">
              We display advertisements through Google AdSense to keep our tools free. These ads may be
              personalized based on your browsing behavior. You can control ad personalization through
              your Google Ads settings or by using browser extensions to block ads.
            </p>
          </section>

          {/* Section 10 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">10. Indemnification</h2>
            <p className="text-zinc-400 leading-relaxed">
              You agree to indemnify, defend, and hold harmless CodelithLabs, its affiliates, officers,
              and employees from any claims, liabilities, damages, losses, or expenses (including legal
              fees) arising from:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-4 mt-4">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of third parties</li>
              <li>Your User Content</li>
            </ul>
          </section>

          {/* Section 11 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">11. Termination</h2>
            <p className="text-zinc-400 leading-relaxed">
              We reserve the right to suspend or terminate your access to the Service at any time,
              without notice, for any reason, including violation of these Terms. Upon termination,
              your right to use the Service will immediately cease.
            </p>
          </section>

          {/* Section 12 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">12. Changes to Terms</h2>
            <p className="text-zinc-400 leading-relaxed">
              We may revise these Terms from time to time. The updated Terms will be posted on this page
              with a new "Last Updated" date. Continued use of the Service after changes constitutes
              acceptance of the revised Terms.
            </p>
          </section>

          {/* Section 13 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">13. Governing Law</h2>
            <p className="text-zinc-400 leading-relaxed">
              These Terms are governed by and construed in accordance with the laws of India, without
              regard to conflict of law principles. Any disputes arising from these Terms or the Service
              shall be resolved in the courts of India.
            </p>
          </section>

          {/* Section 14 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">14. Contact Us</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              If you have questions about these Terms, please contact us:
            </p>
            <div className="bg-zinc-800/50 rounded-lg p-4 space-y-2 text-sm">
              <p className="text-zinc-300">
                <strong>Email:</strong>{' '}
                <a href="mailto:legal@codelithlabs.in" className="text-blue-400 hover:text-blue-300">
                  legal@codelithlabs.in
                </a>
              </p>
              <p className="text-zinc-300">
                <strong>Website:</strong>{' '}
                <a href="https://codelithlabs.in" className="text-blue-400 hover:text-blue-300">
                  https://codelithlabs.in
                </a>
              </p>
            </div>
          </section>

        </div>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-zinc-800">
          <div className="flex flex-wrap gap-6 text-sm">
            <a href="/privacy" className="text-zinc-400 hover:text-white transition">
              Privacy Policy
            </a>
            <a href="/tools" className="text-zinc-400 hover:text-white transition">
              Browse Tools
            </a>
            <a href="/" className="text-zinc-400 hover:text-white transition">
              Back to Home
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
