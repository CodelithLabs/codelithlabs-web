"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Globe, Cpu, ArrowUpRight, Filter } from "lucide-react";
import Link from "next/link";

// Mock Data (In real life, this comes from a database)
const projects = [
    {
        id: "vectordefense",
        title: "VectorDefense",
        category: "Game Dev",
        desc: "C++ Tower Defense Engine with custom ECS.",
        color: "blue"
    },
    {
        id: "citk-connect",
        title: "CITK-Connect",
        category: "Web App",
        desc: "Campus resource management platform.",
        color: "purple"
    },
    {
        id: "core-s",
        title: "Core-S Infrastructure",
        category: "Systems",
        desc: "Self-hosted linux server architecture.",
        color: "green"
    },
    {
        id: "codelith-web",
        title: "Codelith Official",
        category: "Web App",
        desc: "Next.js 14 enterprise-grade portfolio.",
        color: "indigo"
    }
];

export default function ProjectsIndex() {
    const [filter, setFilter] = useState("All");
    const categories = ["All", "Web App", "Game Dev", "Systems"];

    const filteredProjects = filter === "All"
        ? projects
        : projects.filter(p => p.category === filter);

    return (
        <main className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-5xl font-bold text-white mb-4">Our Work</h1>
                        <p className="text-gray-400 max-w-xl">
                            A collection of research initiatives, client deliverables, and open-source contributions.
                        </p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${filter === cat
                                        ? "bg-white text-black border-white"
                                        : "bg-transparent text-gray-500 border-white/10 hover:border-white/30 hover:text-white"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dynamic Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                key={project.id}
                            >
                                <Link
                                    href={`/projects/${project.id}`}
                                    className="group block h-full p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] transition-all relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowUpRight className="w-5 h-5 text-white" />
                                    </div>

                                    <div className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-${project.color}-500/10 text-${project.color}-400`}>
                                        {/* Dynamic Icon Logic based on category */}
                                        {project.category === "Game Dev" && <ShieldCheck className="w-6 h-6" />}
                                        {project.category === "Web App" && <Globe className="w-6 h-6" />}
                                        {project.category === "Systems" && <Cpu className="w-6 h-6" />}
                                    </div>

                                    <div className="mb-2">
                                        <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">{project.category}</span>
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:underline decoration-white/30 underline-offset-4">
                                        {project.title}
                                    </h3>

                                    <p className="text-gray-400 leading-relaxed">
                                        {project.desc}
                                    </p>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

            </div>
        </main>
    );
}