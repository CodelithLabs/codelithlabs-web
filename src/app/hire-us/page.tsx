// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/hire-us/page.tsx
// Conversion-focused "Hire Us" authority page
// ═══════════════════════════════════════════════════════════════════════════

import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hire Us — Custom Software Development | CodelithLabs",
  description:
    "Need custom tools, web apps, or infrastructure? The CodelithLabs engineering team builds production-grade software for startups and enterprises. Based in India.",
  keywords:
    "hire developers, custom software development, web app development India, hire engineers, freelance development team, CodelithLabs",
  openGraph: {
    title: "Hire the CodelithLabs Engineering Team",
    description:
      "Production-grade web apps, custom tools, and infrastructure from the team behind 100+ free online tools.",
    url: "https://codelithlabs.in/hire-us",
    type: "website",
    siteName: "CodelithLabs",
  },
  alternates: { canonical: "https://codelithlabs.in/hire-us" },
};

const SERVICES = [
  {
    title: "Custom Web Applications",
    icon: "🌐",
    description:
      "Full-stack web apps built with Next.js, React, and Node.js — optimized for performance, SEO, and scalability.",
    examples: ["SaaS dashboards", "Internal tools", "E-commerce platforms"],
  },
  {
    title: "Browser-Based Tools",
    icon: "🛠️",
    description:
      "Client-side processing tools like the 100+ tools on CodelithLabs — built with privacy-first architecture and Web Workers.",
    examples: ["Data processors", "Converters", "Calculators"],
  },
  {
    title: "API & Backend Systems",
    icon: "⚡",
    description:
      "REST and GraphQL APIs, microservices, serverless functions, and database architecture for production workloads.",
    examples: ["Payment integrations", "Auth systems", "Data pipelines"],
  },
  {
    title: "DevOps & Infrastructure",
    icon: "☁️",
    description:
      "CI/CD pipelines, Docker containerization, cloud deployments on AWS/GCP/Vercel, and monitoring setups.",
    examples: ["Deployment automation", "Cloud migration", "Uptime monitoring"],
  },
  {
    title: "SEO & Performance Optimization",
    icon: "📈",
    description:
      "Technical SEO audits, Core Web Vitals optimization, structured data implementation, and page speed improvements.",
    examples: ["Schema markup", "Lighthouse 90+ scores", "Content strategy"],
  },
  {
    title: "Open Source Contributions",
    icon: "🤝",
    description:
      "We contribute to and maintain open source projects. Need help with a fork, feature, or community plugin? We can help.",
    examples: ["Feature development", "Bug fixes", "Plugin architecture"],
  },
];

const PROCESS_STEPS = [
  {
    step: 1,
    title: "Discovery Call",
    description: "We learn about your requirements, timeline, and budget in a free 30-minute consultation.",
  },
  {
    step: 2,
    title: "Proposal & Architecture",
    description: "We deliver a detailed proposal with architecture diagrams, milestones, and transparent pricing.",
  },
  {
    step: 3,
    title: "Agile Development",
    description: "Two-week sprints with regular demos, code reviews, and CI/CD from day one.",
  },
  {
    step: 4,
    title: "Launch & Support",
    description: "We deploy to production, monitor performance, and provide ongoing maintenance support.",
  },
];

export default function HireUsPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "CodelithLabs Engineering Services",
    url: "https://codelithlabs.in/hire-us",
    description:
      "Custom software development, web applications, and infrastructure services by the CodelithLabs engineering team.",
    areaServed: { "@type": "Country", name: "India" },
    priceRange: "$$",
    provider: {
      "@type": "Organization",
      name: "CodelithLabs",
      url: "https://codelithlabs.in",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Development Services",
      itemListElement: SERVICES.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.title,
          description: s.description,
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <div className="min-h-screen bg-[#0a0a0a]">
        {/* Hero */}
        <section className="relative py-20 sm:py-28 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10" />
          <div className="relative max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6">
              Available for Projects
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Build With the Team Behind{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                100+ Free Tools
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
              The CodelithLabs engineering team builds production-grade web
              applications, custom tools, and cloud infrastructure for startups
              and enterprises.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600
                           hover:from-blue-500 hover:to-purple-500 text-white font-semibold
                           shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40
                           transition-all duration-300 hover:scale-105"
              >
                Start a Project →
              </Link>
              <Link
                href="/projects"
                className="px-8 py-3.5 rounded-xl border border-zinc-700 text-zinc-300
                           hover:border-zinc-500 hover:text-white transition-all"
              >
                View Our Work
              </Link>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
            What We Build
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50
                           hover:border-blue-500/30 transition-all group"
              >
                <div className="text-3xl mb-4">{service.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-3">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.examples.map((ex) => (
                    <span
                      key={ex}
                      className="px-2.5 py-1 rounded-full text-xs bg-zinc-800/80 text-zinc-400 border border-zinc-700/50"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Process Timeline */}
        <section className="max-w-4xl mx-auto px-4 pb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
            How We Work
          </h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-zinc-800 hidden sm:block" />
            <div className="space-y-8">
              {PROCESS_STEPS.map((step) => (
                <div key={step.step} className="flex gap-6 items-start">
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30
                               flex items-center justify-center text-blue-400 font-bold text-lg relative z-10"
                  >
                    {step.step}
                  </div>
                  <div className="pt-2">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {step.title}
                    </h3>
                    <p className="text-zinc-400 text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-4 pb-20 text-center">
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Build Something Great?
            </h2>
            <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
              Tell us about your project and get a free consultation. No
              obligation, just honest engineering advice.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl
                         bg-gradient-to-r from-blue-600 to-purple-600
                         hover:from-blue-500 hover:to-purple-500 text-white font-semibold
                         shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40
                         transition-all duration-300 hover:scale-105"
            >
              Get in Touch →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
