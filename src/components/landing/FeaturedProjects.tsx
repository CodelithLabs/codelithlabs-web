"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Globe, Server, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const projects = [
  {
    slug: "vectordefense",
    title: "VectorDefense",
    description: "A high-performance C++ Tower Defense Engine featuring a custom Entity-Component-System architecture, OpenGL rendering, and multithreaded game loops.",
    tags: ["C++", "OpenGL", "ECS", "Game Engine"],
    icon: Shield,
    color: "from-blue-500/20 to-blue-600/5",
    borderColor: "hover:border-blue-500/30",
    tagColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    slug: "citk-connect",
    title: "CITK-Connect",
    description: "A full-stack campus connectivity platform enabling resource management, event scheduling, and real-time communication for university infrastructure.",
    tags: ["Next.js", "PostgreSQL", "REST API", "Auth"],
    icon: Globe,
    color: "from-purple-500/20 to-purple-600/5",
    borderColor: "hover:border-purple-500/30",
    tagColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
  {
    slug: "core-s",
    title: "Core-S Infrastructure",
    description: "Self-hosted Linux server architecture with Nginx reverse proxy, automated SSL, Docker containerization, and monitoring dashboards.",
    tags: ["Linux", "Docker", "Nginx", "DevOps"],
    icon: Server,
    color: "from-green-500/20 to-green-600/5",
    borderColor: "hover:border-green-500/30",
    tagColor: "bg-green-500/10 text-green-400 border-green-500/20",
  },
];

export function FeaturedProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <div className="accent-bar mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Engineering Initiatives
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl">
            Active research and development projects spanning game engine design, full-stack platforms, and infrastructure systems.
          </p>
        </motion.div>

        {/* Project Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((project, i) => {
            const Icon = project.icon;
            return (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className={`group relative block h-full p-7 rounded-2xl border border-white/[0.08] bg-white/[0.02] ${project.borderColor} transition-all overflow-hidden`}
                >
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  <div className="relative z-10">
                    {/* Icon + Arrow */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-glow transition-all">
                      {project.title}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed mb-5">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className={`text-xs font-mono px-2 py-1 rounded-md border ${project.tagColor}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 text-center"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white font-medium transition-colors"
          >
            View all projects
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
