"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView } from "framer-motion";
import { Github, Linkedin, Mail, Shield, Server, Code2, Globe, ArrowUpRight, Sparkles, Terminal, Cpu, Zap } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import Head from "next/head";

// ─── SEO Metadata (add to layout.tsx or use generateMetadata in server component) ───
// export const metadata = {
//   title: "Meet the Team | CodeLithLabs – Software Engineering Leadership",
//   description: "Meet the expert team behind CodeLithLabs — founders and engineers driving innovation in cloud infrastructure, system architecture, and full-stack development.",
//   keywords: ["CodeLithLabs team", "Prasanta Ray", "Donbil Mwshahary", "Harun Al Roshid", "software engineering", "cloud infrastructure"],
//   openGraph: { title: "CodeLithLabs Team", description: "Meet the engineers building the future.", url: "https://codelithlabs.in/team", siteName: "CodeLithLabs" },
// };

// ─── Team Data ───────────────────────────────────────────────────────────────────
const team = [
  {
    name: "Prasanta Ray",
    prefix: "Mr.",
    role: "CEO & Founder",
    id: "prasanta-ray",
    specialty: "System Architecture & Strategic Planning",
    description: "Visionary leader steering CodeLithLabs with a deep focus on scalable system design, long-term product strategy, and building engineering culture from the ground up.",
    icon: Shield,
    accentColor: "#3b82f6",
    glowColor: "rgba(59,130,246,0.15)",
    borderGlow: "rgba(59,130,246,0.4)",
    status: "Strategic Planning",
    portfolio: "https://prasanta.codelithlabs.in",
    tags: ["Architecture", "Leadership", "Strategy", "Cloud"],
    index: 0,
  },
  {
    name: "Donbil Mwshahary",
    prefix: "Mr.",
    role: "Co-Founder & CTO",
    id: "donbil-mwshahary",
    specialty: "Operations & Cloud Infrastructure",
    description: "Technical co-founder driving infrastructure innovation, DevOps automation, and cloud-native solutions that power CodeLithLabs' core platform.",
    icon: Server,
    accentColor: "#6366f1",
    glowColor: "rgba(99,102,241,0.15)",
    borderGlow: "rgba(99,102,241,0.4)",
    status: "Infrastructure Deployment",
    portfolio: "https://donbil.codelithlabs.in",
    tags: ["DevOps", "Cloud", "Infrastructure", "Automation"],
    index: 1,
  },
  {
    name: "Md Harun Al Roshid Mollah",
    prefix: "",
    role: "Lead Engineer",
    id: "harun-al-roshid",
    specialty: "Full-Stack Development & Systems Engineering",
    description: "Core engineer with expertise across the full stack — from backend APIs to pixel-perfect frontends — delivering robust, performant, and elegant software solutions.",
    icon: Code2,
    accentColor: "#14b8a6",
    glowColor: "rgba(20,184,166,0.15)",
    borderGlow: "rgba(20,184,166,0.4)",
    status: "Active Development",
    portfolio: "https://harun.codelithlabs.in",
    tags: ["Full-Stack", "React", "Node.js", "APIs"],
    index: 2,
  },
];

// ─── Particle Field ───────────────────────────────────────────────────────────────
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.fill();
      });
      // Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100,150,255,${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };

    draw();
    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.6 }} />;
}

// ─── Magnetic Card ────────────────────────────────────────────────────────────────
function MagneticCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [4, -4]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-4, 4]), { stiffness: 300, damping: 30 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1200 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Team Member Card ─────────────────────────────────────────────────────────────
function TeamCard({ member, globalIndex }: { member: typeof team[0]; globalIndex: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: globalIndex * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative"
    >
      <MagneticCard>
        <div
          className="relative overflow-hidden rounded-2xl border transition-all duration-500 cursor-default"
          style={{
            background: hovered
              ? `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, ${member.glowColor}, rgba(10,10,15,0.95) 60%)`
              : "rgba(10,10,15,0.95)",
            borderColor: hovered ? member.borderGlow : "rgba(255,255,255,0.07)",
            boxShadow: hovered
              ? `0 0 40px ${member.glowColor}, 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)`
              : "0 4px 30px rgba(0,0,0,0.3)",
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onMouseMove={handleMouseMove}
        >
          {/* Scanline Overlay */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)",
              zIndex: 1,
            }}
          />

          {/* Top accent bar */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${member.accentColor}, transparent)` }}
            animate={{ opacity: hovered ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}
          />

          {/* Corner decorations */}
          <div className="absolute top-4 right-4 w-6 h-6 pointer-events-none" style={{ zIndex: 2 }}>
            <div className="absolute top-0 right-0 w-full h-px" style={{ background: member.accentColor, opacity: 0.5 }} />
            <div className="absolute top-0 right-0 h-full w-px" style={{ background: member.accentColor, opacity: 0.5 }} />
          </div>
          <div className="absolute bottom-4 left-4 w-6 h-6 pointer-events-none" style={{ zIndex: 2 }}>
            <div className="absolute bottom-0 left-0 w-full h-px" style={{ background: member.accentColor, opacity: 0.5 }} />
            <div className="absolute bottom-0 left-0 h-full w-px" style={{ background: member.accentColor, opacity: 0.5 }} />
          </div>

          <div className="relative z-10 p-7">
            {/* Header Row */}
            <div className="flex items-start justify-between mb-6">
              {/* Icon */}
              <motion.div
                className="relative p-3 rounded-xl"
                style={{ background: `${member.accentColor}15`, border: `1px solid ${member.accentColor}30` }}
                animate={{ boxShadow: hovered ? `0 0 20px ${member.accentColor}40` : "none" }}
                transition={{ duration: 0.3 }}
              >
                <member.icon className="w-6 h-6" style={{ color: member.accentColor }} />
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{ background: `radial-gradient(circle, ${member.accentColor}20, transparent)` }}
                  animate={{ opacity: hovered ? 1 : 0 }}
                />
              </motion.div>

              {/* Live status badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-semibold"
                style={{ background: `${member.accentColor}10`, border: `1px solid ${member.accentColor}25`, color: member.accentColor }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: member.accentColor }} />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: member.accentColor }} />
                </span>
                {member.status}
              </div>
            </div>

            {/* Name & Role */}
            <div className="mb-5">
              <p className="text-[11px] uppercase tracking-widest mb-1.5 font-medium" style={{ color: member.accentColor }}>
                {member.prefix && `${member.prefix} `}
                <span className="text-white/30">·</span>
              </p>
              <h3 className="text-2xl font-bold text-white leading-tight tracking-tight mb-1">
                {member.name}
              </h3>
              <motion.p
                className="text-sm font-semibold"
                style={{ color: member.accentColor }}
                animate={{ opacity: hovered ? 1 : 0.8 }}
              >
                {member.role}
              </motion.p>
            </div>

            {/* Divider */}
            <div className="relative h-px w-full my-5 overflow-hidden">
              <div className="absolute inset-0" style={{ background: "rgba(255,255,255,0.05)" }} />
              <motion.div
                className="absolute inset-y-0 left-0 w-1/2"
                style={{ background: `linear-gradient(90deg, ${member.accentColor}60, transparent)` }}
                animate={{ opacity: hovered ? 1 : 0.4 }}
              />
            </div>

            {/* Description */}
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              {member.description}
            </p>

            {/* Focus Area */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-5">
              <Cpu className="w-3.5 h-3.5 flex-shrink-0" style={{ color: member.accentColor }} />
              <span>{member.specialty}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {member.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md text-[10px] font-medium uppercase tracking-wider"
                  style={{
                    background: `${member.accentColor}10`,
                    border: `1px solid ${member.accentColor}20`,
                    color: member.accentColor,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.15, color: "#fff" }}
                  className="text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-white/5"
                  aria-label={`${member.name} GitHub`}
                >
                  <Github className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  className="text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-white/5"
                  style={{ ["--hover-color" as string]: member.accentColor }}
                  aria-label={`${member.name} LinkedIn`}
                >
                  <Linkedin className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  className="text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-white/5"
                  aria-label={`Contact ${member.name}`}
                >
                  <Mail className="w-4 h-4" />
                </motion.button>
              </div>

              <motion.a
                href={member.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: `${member.accentColor}15`,
                  border: `1px solid ${member.accentColor}30`,
                  color: member.accentColor,
                }}
                whileHover={{
                  background: `${member.accentColor}25`,
                  borderColor: member.accentColor,
                  scale: 1.03,
                  boxShadow: `0 0 15px ${member.accentColor}30`,
                }}
                whileTap={{ scale: 0.97 }}
                aria-label={`View ${member.name}'s portfolio`}
              >
                <Globe className="w-3.5 h-3.5" />
                Portfolio
                <ArrowUpRight className="w-3 h-3" />
              </motion.a>
            </div>
          </div>
        </div>
      </MagneticCard>
    </motion.div>
  );
}

// ─── Animated Counter ─────────────────────────────────────────────────────────────
function Counter({ to, label }: { to: number; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(to / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(timer); }
      else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [inView, to]);

  return (
    <div className="text-center">
      <span ref={ref} className="text-4xl font-black text-white tabular-nums">{count}+</span>
      <p className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-medium">{label}</p>
    </div>
  );
}

// ─── Scrolling Tech Stack Marquee ─────────────────────────────────────────────────
const techStack = ["React", "Next.js", "TypeScript", "Go", "Kubernetes", "AWS", "Docker", "PostgreSQL", "Redis", "Terraform", "GraphQL", "Rust", "Python", "CI/CD"];
function TechMarquee() {
  return (
    <div className="relative overflow-hidden py-4">
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(90deg, #050507, transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(-90deg, #050507, transparent)" }} />
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {[...techStack, ...techStack].map((t, i) => (
          <span key={i} className="text-xs uppercase tracking-widest font-semibold text-gray-600 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-gray-700 inline-block" />
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────────
export default function TeamPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);
  if (!mounted) return null;

  return (
    <>
      {/* ── Inline SEO meta (supplement with layout metadata) ── */}
      <Head>
        <title>Team | CodeLithLabs – Engineering Leadership</title>
        <meta name="description" content="Meet the expert team behind CodeLithLabs — founders and engineers driving innovation in cloud infrastructure, system architecture, and full-stack development." />
        <meta name="keywords" content="CodeLithLabs, Prasanta Ray, Donbil Mwshahary, Harun Al Roshid, software engineers, cloud infrastructure, tech startup India" />
        <meta property="og:title" content="CodeLithLabs Team" />
        <meta property="og:description" content="Visionary engineers building next-gen software at CodeLithLabs." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://codelithlabs.in/team" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "CodeLithLabs",
          "url": "https://codelithlabs.in",
          "member": team.map(m => ({
            "@type": "Person",
            "name": `${m.prefix} ${m.name}`.trim(),
            "jobTitle": m.role,
            "url": m.portfolio,
            "worksFor": { "@type": "Organization", "name": "CodeLithLabs" }
          }))
        })}</script>
      </Head>

      <main
        className="min-h-screen overflow-x-hidden"
        style={{ background: "#050507", color: "#fff", fontFamily: "'DM Sans', 'Inter', sans-serif" }}
      >
        <ParticleField />

        {/* ── Grid Overlay ── */}
        <div className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* ────────────────── HERO ─────────────────── */}
        <section ref={heroRef} className="relative min-h-[70vh] flex flex-col items-center justify-center px-6 pt-32 pb-20">
          {/* Radial glow backdrop */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.07) 0%, transparent 70%)" }} />

          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center max-w-4xl mx-auto">

            {/* Label chip */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm text-xs uppercase tracking-widest text-gray-400 mb-8"
            >
              <Sparkles className="w-3 h-3 text-blue-400" />
              CodeLithLabs · Core Team
              <Zap className="w-3 h-3 text-indigo-400" />
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tighter mb-6"
            >
              <span className="text-white">The Minds</span>
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #14b8a6 100%)" }}
              >
                Behind the Code
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-10"
            >
              A lean team of engineers and strategists obsessed with building scalable, 
              elegant, and impactful technology — from infrastructure to interfaces.
            </motion.p>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="flex items-center justify-center gap-12"
            >
              <Counter to={3} label="Core Members" />
              <div className="h-12 w-px bg-white/10" />
              <Counter to={50} label="Projects Shipped" />
              <div className="h-12 w-px bg-white/10" />
              <Counter to={99} label="Uptime %" />
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-[10px] uppercase tracking-widest text-gray-600">Scroll</span>
            <motion.div
              className="w-px h-10 bg-gradient-to-b from-gray-600 to-transparent"
              animate={{ scaleY: [1, 0.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </section>

        {/* ── Tech Marquee ── */}
        <div className="relative z-10 border-y border-white/[0.05] py-0">
          <TechMarquee />
        </div>

        {/* ────────────────── TEAM GRID ─────────────────── */}
        <section className="relative z-10 px-6 py-24 max-w-7xl mx-auto" aria-label="Team Members">
          
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-16"
          >
            <Terminal className="w-4 h-4 text-blue-500" />
            <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Leadership &amp; Engineering</span>
            <div className="flex-1 h-px bg-white/[0.05]" />
            <span className="text-xs text-gray-700 font-mono">{team.length} members</span>
          </motion.div>

          {/* Cards — 3-column on large, 2 on medium, 1 on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <TeamCard key={member.id} member={member} globalIndex={i} />
            ))}
          </div>
        </section>

        {/* ────────────────── JOIN CTA ─────────────────── */}
        <section className="relative z-10 px-6 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center rounded-2xl border border-white/[0.07] overflow-hidden relative"
            style={{ background: "rgba(10,10,15,0.8)" }}
          >
            {/* Animated background glow */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.1), transparent 60%)" }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)" }} />

            <div className="relative p-12">
              <p className="text-xs uppercase tracking-widest text-indigo-400 mb-4 font-semibold">We're Growing</p>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                Build the future with us
              </h2>
              <p className="text-gray-400 text-base mb-8 max-w-xl mx-auto">
                We're always looking for exceptional engineers who care deeply about craft, 
                performance, and impact. Come help us build something remarkable.
              </p>
              <motion.a
                href="mailto:careers@codelithlabs.in"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", boxShadow: "0 0 30px rgba(99,102,241,0.3)" }}
                whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(99,102,241,0.5)" }}
                whileTap={{ scale: 0.97 }}
              >
                <Mail className="w-4 h-4" />
                Get in Touch
                <ArrowUpRight className="w-4 h-4" />
              </motion.a>
            </div>
          </motion.div>
        </section>

      </main>
    </>
  );
}
