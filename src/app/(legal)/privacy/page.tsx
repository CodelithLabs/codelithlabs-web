// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/(legal)/privacy/page.tsx
// Privacy Policy - Required for Google AdSense approval
// Emphasizes client-side processing (data never leaves browser)
// ═══════════════════════════════════════════════════════════════════════════

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - CodelithLabs Tools',
  description: 'Privacy Policy for CodelithLabs Tools platform. Learn how we protect your data with client-side processing.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Header */}
        <header className="mb-10">
          <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
            <a href="/" className="hover:text-zinc-300 transition">Home</a>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-300">Privacy Policy</span>
          </nav>

          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-zinc-400">Last updated: February 14, 2025</p>
        </header>

        {/* Notice Box */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <h2 className="text-lg font-semibold text-blue-400 mb-2">Privacy-First Architecture</h2>
              <p className="text-zinc-300 text-sm leading-relaxed">
                CodelithLabs Tools is built with privacy at its core. Most of our tools process data
                entirely in your browser using client-side JavaScript. <strong>Your data never leaves
                your device</strong> and is never sent to our servers.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-8">

          {/* Section 1 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Information We Collect</h2>

            <h3 className="text-xl font-medium mt-6 mb-3 text-zinc-200">1.1 Data You Process</h3>
            <p className="text-zinc-400 leading-relaxed mb-4">
              When you use our tools (e.g., JSON Formatter, Image Compressor, Password Generator),
              all processing happens in your browser. We do not collect, store, or transmit this data
              to our servers.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3 text-zinc-200">1.2 Analytics Data</h3>
            <p className="text-zinc-400 leading-relaxed mb-4">
              We use Google Analytics to understand how visitors use our site. This includes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-4">
              <li>Pages visited and time spent on each page</li>
              <li>Browser type, device type, and operating system</li>
              <li>Referring website or search terms</li>
              <li>General geographic location (country/city level)</li>
            </ul>
            <p className="text-zinc-400 leading-relaxed mt-4">
              This data is anonymized and aggregated. We do not track individual users.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3 text-zinc-200">1.3 Advertising Data (Google AdSense)</h3>
            <p className="text-zinc-400 leading-relaxed mb-4">
              We display ads via Google AdSense to keep our tools free. Google may use cookies and
              similar technologies to serve personalized ads based on your browsing behavior across
              websites. You can learn more about Google's advertising practices at{' '}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Google Ads Policy
              </a>.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">2. How We Use Information</h2>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-4">
              <li>To provide and maintain our tools platform</li>
              <li>To analyze usage patterns and improve user experience</li>
              <li>To display relevant advertisements (via Google AdSense)</li>
              <li>To detect and prevent abuse or technical issues</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Cookies and Tracking Technologies</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              We use cookies for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-4">
              <li><strong>Analytics</strong>: Google Analytics cookies to understand site usage</li>
              <li><strong>Advertising</strong>: Google AdSense cookies to serve relevant ads</li>
              <li><strong>Preferences</strong>: Local storage to remember your tool settings (stays on your device)</li>
            </ul>
            <p className="text-zinc-400 leading-relaxed mt-4">
              You can disable cookies in your browser settings, but this may affect site functionality.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Data Sharing and Third Parties</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              We do not sell your personal information. We share data with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-4">
              <li>
                <strong>Google</strong>: For analytics (Google Analytics) and advertising (Google AdSense)
              </li>
              <li>
                <strong>Hosting Provider</strong>: Our website is hosted on servers that may log IP addresses
                for security purposes
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Data Security</h2>
            <p className="text-zinc-400 leading-relaxed">
              Since most tools process data client-side, your data never leaves your browser. We use
              HTTPS encryption for all connections. However, no method of transmission over the Internet
              is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          {/* Section 6 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Your Rights</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 ml-4">
              <li><strong>Right to Access</strong>: Request a copy of data we hold about you</li>
              <li><strong>Right to Deletion</strong>: Request deletion of your data</li>
              <li><strong>Right to Opt-Out</strong>: Opt out of personalized advertising</li>
              <li><strong>Right to Data Portability</strong>: Request data in a machine-readable format</li>
            </ul>
            <p className="text-zinc-400 leading-relaxed mt-4">
              To exercise these rights, contact us at{' '}
              <a href="mailto:privacy@codelithlabs.in" className="text-blue-400 hover:text-blue-300">
                privacy@codelithlabs.in
              </a>
            </p>
          </section>

          {/* Section 7 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Children's Privacy</h2>
            <p className="text-zinc-400 leading-relaxed">
              Our services are not directed to individuals under 13 years of age. We do not knowingly
              collect personal information from children. If you believe we have inadvertently collected
              such data, please contact us immediately.
            </p>
          </section>

          {/* Section 8 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">8. International Users</h2>
            <p className="text-zinc-400 leading-relaxed">
              CodelithLabs is operated from India. If you are accessing our site from outside India,
              please be aware that your information may be transferred to and processed in India, where
              data protection laws may differ from those in your country.
            </p>
          </section>

          {/* Section 9 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">9. Changes to This Policy</h2>
            <p className="text-zinc-400 leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will be posted on this page
              with an updated "Last Modified" date. Continued use of our site after changes constitutes
              acceptance of the updated policy.
            </p>
          </section>

          {/* Section 10 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">10. Contact Us</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              If you have questions about this Privacy Policy, please contact us:
            </p>
            <div className="bg-zinc-800/50 rounded-lg p-4 space-y-2 text-sm">
              <p className="text-zinc-300">
                <strong>Email:</strong>{' '}
                <a href="mailto:privacy@codelithlabs.in" className="text-blue-400 hover:text-blue-300">
                  privacy@codelithlabs.in
                </a>
              </p>
              <p className="text-zinc-300">
                <strong>Website:</strong>{' '}
                <a href="https://codelithlabs.in" className="text-blue-400 hover:text-blue-300">
                  https://codelithlabs.in
                </a>
              </p>
              <p className="text-zinc-300">
                <strong>Address:</strong> CodelithLabs, India
              </p>
            </div>
          </section>

        </div>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-zinc-800">
          <div className="flex flex-wrap gap-6 text-sm">
            <a href="/terms" className="text-zinc-400 hover:text-white transition">
              Terms of Service
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
