import { notFound } from "next/navigation";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";
import Link from "next/link";

// 1. Mock Data Database
const projects = {
  "vectordefense": {
    title: "VectorDefense",
    subtitle: "High-Performance C++ Tower Defense Engine",
    date: "Nov 2025 - Present",
    tags: ["C++", "SFML", "Game Theory", "Memory Optimization"],
    description: "VectorDefense is a research-driven game engine project focused on optimizing entity-component systems (ECS) in C++. It features a custom rendering pipeline using SFML and implements pathfinding algorithms (A*) optimized for large-scale enemy waves.",
    github: "https://github.com/codelithlabs/vectordefense",
    demo: "#",
    stats: [
      { label: "Frame Rate", value: "144+ FPS" },
      { label: "Entity Count", value: "2,000+" },
      { label: "Memory Footprint", value: "< 150MB" }
    ]
  },
  "citk-connect": {
    title: "CITK-Connect",
    subtitle: "Campus Connectivity & Resource Platform",
    date: "Dec 2025 - Jan 2026",
    tags: ["React", "Node.js", "Hackathon", "Real-time"],
    description: "Developed for the Google Developer Group (GDG) On Campus hackathon. This platform bridges the gap between students and campus resources, featuring real-time event updates, forum discussions, and resource sharing.",
    github: "#",
    demo: "#",
    stats: [
      { label: "Users", value: "Alpha" },
      { label: "Uptime", value: "99.9%" },
      { label: "Latency", value: "45ms" }
    ]
  }
};

// 2. Generate Static Params (Server Side)
export async function generateStaticParams() {
  return Object.keys(projects).map((slug) => ({
    slug: slug,
  }));
}

// 3. Page Component (Server Component)
// Note: In Next.js 15+, params is a Promise, so we make the component async and await it.
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await the params object
  const { slug } = await params;
  
  const project = projects[slug as keyof typeof projects];

  if (!project) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center text-sm text-gray-500 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Operations
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3 mb-6">
            {project.tags.map((tag) => (
              <span 
                key={tag} 
                className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono border border-blue-500/20"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            {project.title}
          </h1>
          <p className="text-xl text-gray-400">{project.subtitle}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-12 border-y border-white/10 py-8">
          {project.stats.map((stat, i) => (
            <div key={i}>
              <div className="text-2xl font-bold text-white font-mono">{stat.value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Content Body */}
        <div className="prose prose-invert prose-lg max-w-none mb-12">
          <h3 className="text-2xl font-bold text-white mb-4">Project Overview</h3>
          <p className="text-gray-300 leading-relaxed">{project.description}</p>
        </div>

        {/* Links */}
        <div className="flex gap-4">
          <a 
            href={project.github} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            <Github className="w-4 h-4" /> View Source
          </a>
          {project.demo !== "#" && (
            <a 
              href={project.demo} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 border border-white/20 text-white rounded-lg font-medium hover:bg-white/5 transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Live Demo
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
