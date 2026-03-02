// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/tech-stack/page.tsx
// Transparency page showing the technologies powering CodelithLabs
// ═══════════════════════════════════════════════════════════════════════════

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Our Tech Stack — Transparency | CodelithLabs',
  description: 'Full transparency into the technologies powering CodelithLabs: Next.js, TypeScript, Tailwind CSS, Docker, Web Workers, and client-side processing architecture.',
  keywords: ['tech stack', 'next.js', 'typescript', 'tailwind', 'docker', 'open source', 'web architecture'],
  alternates: { canonical: 'https://codelithlabs.in/tech-stack/' },
  openGraph: {
    title: 'Our Tech Stack — CodelithLabs',
    description: 'Full transparency into how CodelithLabs is built.',
    url: 'https://codelithlabs.in/tech-stack/',
    type: 'website',
    siteName: 'CodelithLabs',
  },
  robots: { index: true, follow: true },
};

interface StackItem {
  name: string;
  role: string;
  description: string;
  color: string;
  version?: string;
}

const TECH_STACK: StackItem[] = [
  {
    name: 'Next.js 16',
    role: 'Framework',
    description: 'App Router with Static Site Generation (SSG) for all tool pages. Every route is pre-rendered at build time for instant loading and zero server costs.',
    color: '#FFFFFF',
    version: '16.x',
  },
  {
    name: 'TypeScript',
    role: 'Language',
    description: 'Strict mode TypeScript across the entire codebase. Full type safety for tool implementations, API types, and component props.',
    color: '#3178C6',
    version: '5.x',
  },
  {
    name: 'Tailwind CSS',
    role: 'Styling',
    description: 'Utility-first CSS for consistent, responsive, dark-mode UI. Zero custom CSS files — everything is composable and tree-shakeable.',
    color: '#06B6D4',
    version: '3.x',
  },
  {
    name: 'Web Workers',
    role: 'Performance',
    description: 'Heavy computations (image processing, JSON formatting, hash generation) run in dedicated Web Worker threads to keep the main UI thread smooth.',
    color: '#F59E0B',
  },
  {
    name: 'Canvas API',
    role: 'Image Processing',
    description: 'All image tools (resize, crop, compress, filter, watermark) use the HTML5 Canvas API for pixel-perfect, client-side processing.',
    color: '#10B981',
  },
  {
    name: 'Docker',
    role: 'Deployment',
    description: 'Containerized builds with multi-stage Dockerfile for reproducible, secure deployments. Docker Compose for local development.',
    color: '#2496ED',
  },
  {
    name: 'Client-Side JS',
    role: 'Core Architecture',
    description: 'Zero server-side data processing. Every tool runs entirely in the browser using JavaScript, Canvas, and Web Workers. Your data never touches our servers.',
    color: '#EF4444',
  },
  {
    name: 'Lucide Icons',
    role: 'Icons',
    description: 'Open-source icon library with 1000+ beautifully consistent icons. Tree-shakeable for minimal bundle impact.',
    color: '#EC4899',
  },
];

const ARCHITECTURE_PRINCIPLES = [
  {
    title: 'Privacy by Design',
    description: 'No server-side data processing. No user accounts. No tracking beyond anonymized analytics. Your data stays in your browser.',
    icon: '🔒',
  },
  {
    title: 'Performance First',
    description: 'Static Site Generation for instant page loads. Web Workers for heavy computation. Lazy loading for all tool implementations.',
    icon: '⚡',
  },
  {
    title: 'Zero Dependencies Where Possible',
    description: 'Most tools are built with vanilla JavaScript + Canvas API. External libraries only when they provide significant value.',
    icon: '📦',
  },
  {
    title: 'SEO Optimized',
    description: 'Every page has structured data, Open Graph tags, XML sitemap entries, and semantic HTML. Built for search engines from day one.',
    icon: '🔍',
  },
];

export default function TechStackPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <header className="mb-12">
          <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
            <Link href="/" className="hover:text-zinc-300 transition">Home</Link>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-300">Tech Stack</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Our Tech Stack
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Full transparency into how CodelithLabs is built. We believe developers 
            trust platforms that show their work.
          </p>
        </header>

        {/* Architecture Principles */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6">Architecture Principles</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {ARCHITECTURE_PRINCIPLES.map(principle => (
              <div
                key={principle.title}
                className="p-5 border border-zinc-800 rounded-xl bg-zinc-900/30"
              >
                <div className="text-2xl mb-3">{principle.icon}</div>
                <h3 className="text-base font-semibold text-white mb-2">{principle.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{principle.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6">Technologies</h2>
          <div className="space-y-4">
            {TECH_STACK.map(item => (
              <div
                key={item.name}
                className="p-5 border border-zinc-800 rounded-xl bg-zinc-900/30 
                           hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                  </div>
                  <span className="text-xs text-zinc-500 px-2 py-0.5 bg-zinc-800 rounded-full">
                    {item.role}
                  </span>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed ml-6">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Open Source */}
        <section className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/30">
          <h2 className="text-xl font-semibold text-white mb-4">Open Source Commitment</h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-4">
            CodelithLabs is committed to the open-source community. We use open-source 
            tools and contribute back where possible. Our platform is built on a foundation 
            of community-driven software.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://github.com/codelithlabs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 
                         hover:bg-zinc-700 text-white text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              View on GitHub
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 
                         hover:border-zinc-600 text-zinc-300 text-sm font-medium transition-colors"
            >
              Suggest Improvements
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
