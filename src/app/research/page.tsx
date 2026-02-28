"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Calendar,
  ArrowUpRight,
  Clock,
  Tag,
  Search,
  FileText,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════
// RESEARCH PAPER DATA
// ═══════════════════════════════════════════════════════════════════════════

interface Paper {
  id: number;
  title: string;
  abstract: string;
  date: string;
  category: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
}

const papers: Paper[] = [
  {
    id: 1,
    title: "Optimizing C++ Compilation Times for Large Scale ECS",
    abstract:
      "An in-depth analysis of header dependencies, precompiled headers, and forward declarations in the VectorDefense engine. Achieved a 40% reduction in incremental build times using module-aware dependency graphs and strategic PCH boundaries across 200+ translation units.",
    date: "Jan 12, 2026",
    category: "Systems Engineering",
    readTime: "5 min",
    tags: ["C++", "ECS", "Build Systems", "Performance"],
    featured: true,
  },
  {
    id: 2,
    title: "Secure Home Server Architecture: A Post-Mortem",
    abstract:
      "Lessons learned from deploying a self-hosted Nginx reverse proxy, automated SSL certificate renewal with Let's Encrypt, Fail2Ban intrusion detection, and Docker container isolation on Debian Linux. Includes a full threat model analysis.",
    date: "Dec 28, 2025",
    category: "DevOps",
    readTime: "8 min",
    tags: ["Linux", "Docker", "Security", "Nginx"],
  },
  {
    id: 3,
    title: "WebWorker Architecture for Browser-Side Processing",
    abstract:
      "Designing a scalable Web Worker pipeline for CPU-intensive browser operations. Covers our approach to image compression, JSON formatting, and hash generation—all running off the main thread with structured clone transfer for zero-copy data movement.",
    date: "Dec 15, 2025",
    category: "Web Engineering",
    readTime: "6 min",
    tags: ["Web Workers", "JavaScript", "Performance", "Browser APIs"],
    featured: true,
  },
  {
    id: 4,
    title: "Static Site Generation at Scale with Next.js 16",
    abstract:
      "How CodelithLabs generates 90+ tool pages at build time using a custom content pipeline. Explores our markdown-driven tool registry, automatic OG image generation, Turbopack integration, and the trade-offs of static export vs. server-side rendering.",
    date: "Nov 30, 2025",
    category: "Frontend Architecture",
    readTime: "7 min",
    tags: ["Next.js", "SSG", "TypeScript", "Turbopack"],
  },
  {
    id: 5,
    title: "Financial Automation Systems Design",
    abstract:
      "Architectural considerations for building transparent financial dashboards with client-side rendering. Covers data modeling for expense tracking, pure CSS visualization alternatives to heavy charting libraries, and maintaining DPDPA compliance for Indian organizations.",
    date: "Nov 15, 2025",
    category: "Systems Design",
    readTime: "5 min",
    tags: ["Finance", "Privacy", "DPDPA", "Architecture"],
  },
  {
    id: 6,
    title: "Campus Network Topology Optimization",
    abstract:
      "A study of network topology patterns for university campus connectivity platforms. Analyzes latency trade-offs between star, mesh, and hybrid topologies for real-time WebSocket communication, with PostgreSQL connection pooling benchmarks under concurrent load.",
    date: "Oct 28, 2025",
    category: "Networking",
    readTime: "9 min",
    tags: ["Networking", "WebSocket", "PostgreSQL", "Performance"],
  },
];

const allCategories = [
  "All",
  ...Array.from(new Set(papers.map((p) => p.category))),
];

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

// ═══════════════════════════════════════════════════════════════════════════
// CATEGORY COLOR MAP
// ═══════════════════════════════════════════════════════════════════════════

const categoryColors: Record<string, { text: string; bg: string; border: string }> = {
  "Systems Engineering": { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  DevOps: { text: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
  "Web Engineering": { text: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  "Frontend Architecture": { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  "Systems Design": { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  Networking: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function ResearchPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = papers.filter((p) => {
    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory;
    const matchesSearch =
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.abstract.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-28 pb-20 px-6">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "CodelithLabs Research & Engineering",
            description:
              "Technical papers, architectural decisions, and engineering post-mortems from the CodelithLabs team.",
            url: "https://codelithlabs.in/research",
            numberOfItems: papers.length,
            provider: {
              "@type": "Organization",
              name: "CodelithLabs",
              url: "https://codelithlabs.in",
            },
          }),
        }}
      />

      <div className="max-w-5xl mx-auto">
        {/* ── Header ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="accent-bar mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Research &amp; Engineering
          </h1>
          <p className="text-zinc-400 max-w-2xl text-lg">
            Technical papers, architectural decisions, and engineering
            post-mortems from the CodelithLabs team. Peer-reviewed by practice.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-6 mt-6">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <FileText className="w-4 h-4" />
              <span>{papers.length} Papers Published</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Tag className="w-4 h-4" />
              <span>
                {Array.from(new Set(papers.flatMap((p) => p.tags))).length}{" "}
                Topics Covered
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <BookOpen className="w-4 h-4" />
              <span>Open Access</span>
            </div>
          </div>
        </motion.div>

        {/* ── Search & Filters ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-10 space-y-4"
        >
          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-glow-blue transition-colors" />
            <input
              type="text"
              placeholder="Search papers, topics, or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-glow-blue/40 focus:ring-1 focus:ring-glow-blue/20 transition-all font-mono text-sm"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  activeCategory === cat
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-zinc-500 border-white/[0.08] hover:border-white/[0.20] hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Featured Banner ───────────────────────────────────────── */}
        {activeCategory === "All" && search === "" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-10"
          >
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-600 mb-4">
              Featured Research
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {papers
                .filter((p) => p.featured)
                .map((paper, i) => {
                  const colors = categoryColors[paper.category] || {
                    text: "text-zinc-400",
                    bg: "bg-zinc-500/10",
                    border: "border-zinc-500/20",
                  };
                  return (
                    <motion.article
                      key={paper.id}
                      custom={i}
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      className="group relative p-6 rounded-2xl border border-glow-blue/20 bg-glow-blue/[0.03] hover:bg-glow-blue/[0.06] transition-all cursor-pointer"
                    >
                      <div className="absolute top-4 right-4">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-glow-blue/60 bg-glow-blue/10 px-2 py-0.5 rounded-full">
                          Featured
                        </span>
                      </div>

                      <span
                        className={`text-[11px] font-mono px-2 py-0.5 rounded ${colors.bg} ${colors.text} border ${colors.border}`}
                      >
                        {paper.category}
                      </span>

                      <h3 className="text-lg font-bold text-white mt-3 mb-2 group-hover:text-glow-blue transition-colors leading-snug">
                        {paper.title}
                      </h3>

                      <p className="text-zinc-500 text-sm line-clamp-2 mb-4">
                        {paper.abstract}
                      </p>

                      <div className="flex items-center justify-between text-xs text-zinc-600">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {paper.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {paper.readTime}
                          </span>
                        </div>
                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-glow-blue transition-opacity" />
                      </div>
                    </motion.article>
                  );
                })}
            </div>
          </motion.div>
        )}

        {/* ── Paper List ────────────────────────────────────────────── */}
        <div className="space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-600 mb-2">
            {activeCategory === "All" && search === ""
              ? "All Papers"
              : `${filtered.length} Result${filtered.length !== 1 ? "s" : ""}`}
          </h2>

          <AnimatePresence mode="popLayout">
            {filtered.map((paper, i) => {
              const colors = categoryColors[paper.category] || {
                text: "text-zinc-400",
                bg: "bg-zinc-500/10",
                border: "border-zinc-500/20",
              };

              return (
                <motion.article
                  key={paper.id}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -12 }}
                  layout
                  className="group relative p-6 md:p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all cursor-pointer"
                >
                  {/* Top row: category + meta */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded ${colors.bg} ${colors.text} border ${colors.border}`}
                    >
                      {paper.category}
                    </span>
                    <div className="flex items-center gap-4 text-xs text-zinc-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {paper.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {paper.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-glow-blue transition-colors leading-snug">
                    {paper.title}
                  </h3>

                  {/* Abstract */}
                  <p className="text-zinc-400 leading-relaxed mb-5 text-sm md:text-base">
                    {paper.abstract}
                  </p>

                  {/* Tags + Read */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {paper.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono text-zinc-500 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium text-white group-hover:text-glow-blue transition-colors">
                      Read Paper
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>

          {/* Empty State */}
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <BookOpen className="w-10 h-10 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500">
                No papers match your search. Try a different query or category.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}