"use client";

import { motion } from "framer-motion";
import { ArrowRight, FlaskConical, Shield, Zap } from "lucide-react";
import Link from "next/link";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] } },
};

const badges = [
  { label: "90+ Free Tools", icon: Zap, color: "text-glow-blue" },
  { label: "100% Client-Side", icon: Shield, color: "text-glow-green" },
  { label: "Open Source", icon: FlaskConical, color: "text-glow-cyan" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />
      <div className="absolute inset-0 bg-glow-radial opacity-60" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0a0a0a] to-transparent" />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        {/* Lab Badge */}
        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm">
            <span className="status-dot" />
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              Research Lab Active
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.05] mb-6"
        >
          Open Source Innovation.
          <br />
          <span className="bg-gradient-to-r from-glow-blue via-glow-cyan to-glow-blue bg-[length:200%_auto] animate-shimmer bg-clip-text text-transparent">
            System Architecture.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeUp}
          className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          We build high-performance developer tools, fintech solutions, and research
          infrastructure — all engineered from Kokrajhar, shipped to the world.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link
            href="/tools"
            className="group flex items-center gap-2 px-7 py-3.5 bg-glow-blue text-white font-semibold rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-glow-blue/20 hover:shadow-glow-blue/40"
          >
            Explore Tools
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/research"
            className="flex items-center gap-2 px-7 py-3.5 border border-white/[0.12] text-white font-semibold rounded-xl hover:bg-white/[0.06] transition-all"
          >
            View Research
          </Link>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02]"
              >
                <Icon className={`w-4 h-4 ${badge.color}`} />
                <span className="text-sm text-zinc-300 font-medium">{badge.label}</span>
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
