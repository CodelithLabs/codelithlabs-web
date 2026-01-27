"use client";

import { motion } from "framer-motion";
import { Terminal, Cpu, Globe, ArrowRight, ShieldCheck, Code2 } from "lucide-react";
import Link from "next/link"; // <--- Added Import

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-200">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono mb-6 border border-blue-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Systems Online: v2.0.1
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
              Architecting the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
                Digital Infrastructure
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 leading-relaxed mb-10 max-w-2xl">
              Codelithlabs is a research collective dedicated to high-performance backend systems, 
              computational game theory, and open-source innovation.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/research" className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
                Explore Research <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="https://github.com/codelithlabs" target="_blank" className="px-6 py-3 rounded-lg font-medium border border-white/20 hover:bg-white/5 transition-colors text-white">
                View on GitHub
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Metric Grid */}
      <section className="py-12 border-b border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Uptime", value: "99.99%" },
            { label: "Projects", value: "04+" },
            { label: "Contributors", value: "Open" },
            { label: "Stack", value: "Next.js / C++" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-2xl font-bold text-white font-mono">{stat.value}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Showcase */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Active Development</h2>
            <p className="text-gray-400">Current initiatives pushing the boundaries of what's possible.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Project 1: VectorDefense (LINKED) */}
            <Link href="/projects/vectordefense" className="block group p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 text-blue-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">VectorDefense</h3>
              <p className="text-sm text-gray-400 mb-4">
                A high-performance tower defense engine built with C++ and SFML. Optimized for low-level memory management.
              </p>
              <div className="flex gap-2">
                <span className="text-xs px-2 py-1 bg-white/5 rounded text-gray-300">C++</span>
                <span className="text-xs px-2 py-1 bg-white/5 rounded text-gray-300">Game Dev</span>
              </div>
            </Link>

            {/* Project 2: CITK-Connect (LINKED) */}
            <Link href="/projects/citk-connect" className="block group p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 text-purple-400">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">CITK-Connect</h3>
              <p className="text-sm text-gray-400 mb-4">
                Campus connectivity platform facilitating real-time communication and resource sharing.
              </p>
              <div className="flex gap-2">
                <span className="text-xs px-2 py-1 bg-white/5 rounded text-gray-300">React</span>
                <span className="text-xs px-2 py-1 bg-white/5 rounded text-gray-300">Node.js</span>
              </div>
            </Link>

            {/* Project 3: Core-S (Internal - No Link yet) */}
            <div className="group p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 text-green-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">Core-S Infrastructure</h3>
              <p className="text-sm text-gray-400 mb-4">
                Research into self-hosted architectures, ensuring data sovereignty and secure backend processing.
              </p>
              <div className="flex gap-2">
                <span className="text-xs px-2 py-1 bg-white/5 rounded text-gray-300">Linux</span>
                <span className="text-xs px-2 py-1 bg-white/5 rounded text-gray-300">Docker</span>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}