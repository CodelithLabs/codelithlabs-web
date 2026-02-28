"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ShieldCheck, Globe, Cpu, Server } from "lucide-react";
import { ProjectCard, ProjectData } from "@/components/projects/ProjectCard";

// ═══════════════════════════════════════════════════════════════════════════
// ENHANCED PROJECT DATA
// ═══════════════════════════════════════════════════════════════════════════

const projects: ProjectData[] = [
  {
    id: "vectordefense",
    title: "VectorDefense",
    category: "Game Dev",
    description:
      "High-performance C++ Tower Defense Engine featuring a custom Entity-Component-System and multithreaded rendering pipeline.",
    architectureOverview:
      "ECS-based game loop with OpenGL 4.5 renderer, spatial hash grid for collision, and lock-free task scheduler for parallel entity updates.",
    techStack: ["C++17", "OpenGL", "ECS", "SFML", "CMake"],
    github: "https://github.com/codelithlabs/vectordefense",
    status: "active",
    color: "blue",
    icon: <ShieldCheck className="w-5 h-5 text-blue-400" />,
  },
  {
    id: "citk-connect",
    title: "CITK-Connect",
    category: "Web App",
    description:
      "Full-stack campus connectivity platform enabling resource management, event scheduling, and real-time communication for university infrastructure.",
    architectureOverview:
      "Next.js SSR frontend with PostgreSQL backend, JWT-based auth, WebSocket real-time updates, and RESTful API layer with Zod validation.",
    techStack: ["Next.js", "PostgreSQL", "Prisma", "REST API", "JWT"],
    github: "https://github.com/codelithlabs/citk-connect",
    status: "active",
    color: "purple",
    icon: <Globe className="w-5 h-5 text-purple-400" />,
  },
  {
    id: "core-s",
    title: "Core-S Infrastructure",
    category: "Systems",
    description:
      "Self-hosted Linux server architecture with Nginx reverse proxy, automated SSL, Docker containerization, and uptime monitoring.",
    architectureOverview:
      "Debian-based host running Docker Compose orchestration, Nginx reverse proxy with Let's Encrypt auto-renewal, Prometheus + Grafana monitoring stack.",
    techStack: ["Linux", "Docker", "Nginx", "Grafana", "Bash"],
    status: "completed",
    color: "green",
    icon: <Server className="w-5 h-5 text-green-400" />,
  },
  {
    id: "codelith-web",
    title: "CodelithLabs Platform",
    category: "Web App",
    description:
      "Enterprise-grade tools platform with 90+ browser-based utilities, static site generation, and automated content pipelines.",
    architectureOverview:
      "Next.js 16 static export with Turbopack, Web Worker-based processing for image/JSON tools, Tailwind CSS design system, Vercel edge CDN.",
    techStack: ["Next.js 16", "TypeScript", "Tailwind", "Web Workers", "Vercel"],
    github: "https://github.com/codelithlabs/codelithlabs-web",
    status: "active",
    color: "indigo",
    icon: <Cpu className="w-5 h-5 text-indigo-400" />,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function ProjectsIndex() {
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Web App", "Game Dev", "Systems"];

  const filteredProjects =
    filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="accent-bar mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Work
            </h1>
            <p className="text-zinc-400 max-w-xl">
              A collection of research initiatives, client deliverables, and
              open-source contributions from the CodelithLabs engineering team.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  filter === cat
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-zinc-500 border-white/[0.08] hover:border-white/[0.20] hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}