// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/about/page.tsx
// About Page - Company information, team, mission, and values
// ═══════════════════════════════════════════════════════════════════════════

import { Metadata } from 'next';
import { Users, Target, Shield, Code2, Heart, Globe, Zap, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us - Meet the CodelithLabs Team',
  description: 'Learn about CodelithLabs, our mission to provide free online tools, and meet the team building the future of web utilities. Based in Kokrajhar, Assam, India.',
  keywords: [
    'about codelithlabs',
    'codelithlabs team',
    'free tools platform',
    'web utilities',
    'open source tools',
    'privacy-first tools',
  ],
  openGraph: {
    title: 'About CodelithLabs',
    description: 'Meet the team building free, privacy-first online tools for developers and creators worldwide.',
    type: 'website',
    url: 'https://codelithlabs.in/about/',
  },
  alternates: {
    canonical: 'https://codelithlabs.in/about/',
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Person Schema for Founders */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Prasanta Ray",
              "jobTitle": "Founder & CEO",
              "worksFor": {
                "@type": "Organization",
                "name": "CodelithLabs"
              },
              "alumniOf": "Technology Education",
              "knowsAbout": ["Web Development", "JavaScript", "React", "Next.js", "Software Architecture"],
              "sameAs": [
                "https://github.com/prasantaray"
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Donbil Mwshary",
              "jobTitle": "Co-Founder & CTO",
              "worksFor": {
                "@type": "Organization",
                "name": "CodelithLabs"
              },
              "knowsAbout": ["Software Engineering", "Cloud Infrastructure", "DevOps", "System Design"],
              "sameAs": [
                "https://github.com/donbilmwshary"
              ]
            }
          ])
        }}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
        <div className="max-w-5xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            About CodelithLabs
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            We're on a mission to make powerful web tools accessible to everyone,
            completely free and without compromising your privacy.
          </p>
        </div>
      </section>

      {/* Affiliation Disclaimer */}
      <section className="px-6 -mt-10 mb-8 relative z-20">
        <div className="max-w-5xl mx-auto">
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl px-6 py-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-amber-200/80 leading-relaxed">
              <strong className="text-amber-300">Disclaimer:</strong>{' '}
              CodelithLabs.in is an independent platform and is not affiliated with codelithlab.com
              (a Pune-based IT company). We are a separate engineering team based in Kokrajhar, Assam, India.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-2xl border border-zinc-800">
              <Target className="w-12 h-12 text-blue-500 mb-4" />
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-300 leading-relaxed">
                To democratize access to professional-grade web utilities by providing
                free, privacy-focused tools that process everything client-side. No accounts,
                no tracking, no data collection—just pure functionality.
              </p>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-2xl border border-zinc-800">
              <Globe className="w-12 h-12 text-purple-500 mb-4" />
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-gray-300 leading-relaxed">
                A world where developers, designers, and content creators have instant
                access to the tools they need, without barriers. We envision a platform
                with hundreds of specialized utilities, all free and open.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-6 bg-zinc-900/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Core Values</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <Lock className="w-10 h-10 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
              <p className="text-gray-400 text-sm">
                All processing happens in your browser. Your data never touches our servers.
              </p>
            </div>

            <div className="text-center p-6">
              <Heart className="w-10 h-10 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Free Access for Everyone</h3>
              <p className="text-gray-400 text-sm">
                Core tools remain free for everyone. Premium is optional for ad-free workflows and priority support.
              </p>
            </div>

            <div className="text-center p-6">
              <Zap className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Performance</h3>
              <p className="text-gray-400 text-sm">
                Lightning-fast processing with optimized code and modern web APIs.
              </p>
            </div>

            <div className="text-center p-6">
              <Code2 className="w-10 h-10 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Open Source</h3>
              <p className="text-gray-400 text-sm">
                Transparent code that you can inspect, trust, and contribute to.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Meet the Team</h2>
            <p className="text-gray-300 text-lg">
              Built by developers, for developers
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Founder 1 */}
            <div className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-2xl border border-zinc-800 hover:border-blue-500/50 transition-all">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
                PR
              </div>
              <h3 className="text-2xl font-bold text-center mb-2">Prasanta Ray</h3>
              <p className="text-blue-400 text-center mb-4">Founder & CEO</p>
              <p className="text-gray-300 text-sm text-center mb-4">
                Full-stack developer with a passion for building tools that solve real problems.
                Specializes in React, Next.js, and modern web architecture.
              </p>
              <div className="flex justify-center gap-4">
                <a
                  href="https://github.com/prasantaray"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Founder 2 */}
            <div className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-2xl border border-zinc-800 hover:border-purple-500/50 transition-all">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
                DM
              </div>
              <h3 className="text-2xl font-bold text-center mb-2">Donbil Mwshary</h3>
              <p className="text-purple-400 text-center mb-4">Co-Founder & CTO</p>
              <p className="text-gray-300 text-sm text-center mb-4">
                Infrastructure wizard with expertise in cloud architecture, DevOps, and system design.
                Ensures our platform scales efficiently and reliably.
              </p>
              <div className="flex justify-center gap-4">
                <a
                  href="https://github.com/donbilmwshary"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-500 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Contact */}
      <section className="py-20 px-6 bg-zinc-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-2xl border border-zinc-800">
              <Shield className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Our Location</h3>
              <p className="text-gray-300 mb-2">
                <strong>Headquarters:</strong><br />
                Kokrajhar, Assam<br />
                India
              </p>
              <p className="text-gray-400 text-sm mt-4">
                Proudly serving users worldwide from the heart of Northeast India.
              </p>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-2xl border border-zinc-800">
              <Globe className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Get in Touch</h3>
              <p className="text-gray-300 mb-4">
                Have questions, suggestions, or want to collaborate?<br />
                We'd love to hear from you!
              </p>
              <a
                href="mailto:contact@codelithlabs.in"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">Built With Modern Technology</h2>
          <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
            Our platform leverages cutting-edge web technologies to deliver fast,
            reliable, and secure tools.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Next.js 16', desc: 'React Framework' },
              { name: 'TypeScript', desc: 'Type Safety' },
              { name: 'Tailwind CSS', desc: 'Modern Styling' },
              { name: 'Web Workers', desc: 'Performance' },
              { name: 'Docker', desc: 'Deployment' },
              { name: 'Web APIs', desc: 'Native Features' },
              { name: 'Client-Side', desc: 'Zero Backend' },
              { name: 'Open Source', desc: 'Community' },
            ].map((tech, index) => (
              <div
                key={index}
                className="bg-zinc-900/50 backdrop-blur-sm p-6 rounded-xl border border-zinc-800 text-center hover:border-blue-500/50 transition-all"
              >
                <div className="text-lg font-semibold mb-1">{tech.name}</div>
                <div className="text-sm text-gray-400">{tech.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
