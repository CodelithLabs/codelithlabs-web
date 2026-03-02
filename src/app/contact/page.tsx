// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/contact/page.tsx
// Contact page — SEO-optimized server component with interactive client form
// ═══════════════════════════════════════════════════════════════════════════

import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";

// ─── SEO Metadata ────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Contact Us — Get in Touch",
  description:
    "Have a question, idea, or partnership proposal? Reach out to the CodelithLabs team. We typically respond within 24 hours.",
  keywords: [
    "contact CodelithLabs",
    "get in touch",
    "hire developers India",
    "CodelithLabs support",
    "partnership inquiry",
    "software development contact",
  ],
  openGraph: {
    title: "Contact Us — CodelithLabs",
    description:
      "Reach out to the CodelithLabs engineering team for inquiries, partnerships, or support.",
    url: "https://codelithlabs.in/contact/",
    type: "website",
    siteName: "CodelithLabs",
  },
  alternates: { canonical: "https://codelithlabs.in/contact/" },
};

// ─── FAQ Data ────────────────────────────────────────────────────────────

const FAQ = [
  {
    q: "What's the typical response time?",
    a: "We aim to respond to all inquiries within 24 hours during business days. Urgent matters can be sent directly to team.codelithlabs@gmail.com.",
  },
  {
    q: "What types of inquiries do you handle?",
    a: "We handle general questions, partnership proposals, support requests, career inquiries, and feedback. For project-specific quotes, visit our Hire Us page.",
  },
  {
    q: "Can I hire your team for a project?",
    a: "Absolutely! We build custom web apps, browser-based tools, APIs, and cloud infrastructure. Check out our Hire Us page for detailed service offerings and our process.",
  },
  {
    q: "Do you offer support for existing projects?",
    a: "Yes. We provide code audits, performance optimization, bug fixes, and ongoing maintenance for existing codebases built with Next.js, React, Node.js, and related technologies.",
  },
  {
    q: "What's the best way to reach you for urgent matters?",
    a: "For time-sensitive inquiries, email us directly at team.codelithlabs@gmail.com. For everything else, the contact form above is the fastest way to get a structured response.",
  },
];

// ─── Page Component ──────────────────────────────────────────────────────

export default function ContactPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact CodelithLabs",
    description:
      "Get in touch with the CodelithLabs engineering team for inquiries, partnerships, or support.",
    url: "https://codelithlabs.in/contact/",
    mainEntity: {
      "@type": "Organization",
      name: "CodelithLabs",
      url: "https://codelithlabs.in",
      email: "team.codelithlabs@gmail.com",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "team.codelithlabs@gmail.com",
        availableLanguage: ["English", "Hindi"],
        areaServed: "Worldwide",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kokrajhar",
        addressRegion: "Assam",
        addressCountry: "IN",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />

      <div className="min-h-screen bg-[#0a0a0a]">
        {/* ── Hero Section ─────────────────────────────────────────── */}
        <section className="relative pt-28 pb-16 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5" />
          <div className="relative max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
              </span>
              Get in Touch
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Let&apos;s Start a{" "}
              <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                Conversation
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto">
              Have a question, idea, or just want to say hello? We&apos;d love
              to hear from you. Our team typically responds within 24 hours.
            </p>
          </div>
        </section>

        {/* ── Main Content: Form + Info Cards ──────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left: Contact Form (3/5 width) */}
            <div className="lg:col-span-3">
              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-white mb-6">
                  Send Us a Message
                </h2>
                <ContactForm />
              </div>
            </div>

            {/* Right: Info Cards (2/5 width) */}
            <div className="lg:col-span-2 space-y-4">
              {/* Email Card */}
              <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-blue-500/30 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">Email Us</h3>
                    <a
                      href="mailto:team.codelithlabs@gmail.com"
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors break-all"
                    >
                      team.codelithlabs@gmail.com
                    </a>
                    <p className="text-xs text-zinc-500 mt-1">For direct inquiries</p>
                  </div>
                </div>
              </div>

              {/* Response Time Card */}
              <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-blue-500/30 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-green-500/10 text-green-400 group-hover:bg-green-500/20 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">Response Time</h3>
                    <p className="text-sm text-zinc-300">Usually within 24 hours</p>
                    <p className="text-xs text-zinc-500 mt-1">Business days (Mon–Sat)</p>
                  </div>
                </div>
              </div>

              {/* Location Card */}
              <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-blue-500/30 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">Location</h3>
                    <p className="text-sm text-zinc-300">Kokrajhar, Assam</p>
                    <p className="text-xs text-zinc-500 mt-1">India</p>
                  </div>
                </div>
              </div>

              {/* Map Embed */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
                <iframe
                  title="CodelithLabs Location — Kokrajhar, Assam, India"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57325.72696!2d90.24!3d26.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37590e654f4c6b1b%3A0x5c6a0e17a1b7af55!2sKokrajhar%2C%20Assam!5e0!3m2!1sen!2sin!4v1"
                  className="w-full h-40 border-0 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen={false}
                />
              </div>

              {/* Social Links Card */}
              <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50">
                <h3 className="text-sm font-semibold text-white mb-3">Connect With Us</h3>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://github.com/codelithlabs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/60 border border-zinc-700/50 text-zinc-300 text-sm hover:border-zinc-500 hover:text-white transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </a>
                  <a
                    href="https://twitter.com/codelithlabs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/60 border border-zinc-700/50 text-zinc-300 text-sm hover:border-zinc-500 hover:text-white transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    X / Twitter
                  </a>
                  <a
                    href="https://linkedin.com/company/codelithlabs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/60 border border-zinc-700/50 text-zinc-300 text-sm hover:border-zinc-500 hover:text-white transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ Section ──────────────────────────────────────────── */}
        <section className="border-t border-zinc-800/50 py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {FAQ.map(({ q, a }) => (
                <details
                  key={q}
                  className="group rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-5 cursor-pointer text-white font-medium text-sm hover:bg-zinc-800/30 transition-colors">
                    {q}
                    <svg
                      className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform shrink-0 ml-4"
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

        {/* ── CTA Banner ───────────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto px-4 pb-20 text-center">
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Looking to Start a Project?
            </h2>
            <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
              Check out our services, process, and past work. We build
              production-grade software for startups and enterprises.
            </p>
            <Link
              href="/hire-us"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl
                         bg-gradient-to-r from-blue-600 to-purple-600
                         hover:from-blue-500 hover:to-purple-500 text-white font-semibold
                         shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40
                         transition-all duration-300 hover:scale-105"
            >
              Explore Our Services →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
