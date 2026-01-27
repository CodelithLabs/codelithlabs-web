import { BookOpen, Calendar, ArrowUpRight } from "lucide-react";

const papers = [
  {
    id: 1,
    title: "Optimizing C++ Compilation Times for Large Scale ECS",
    abstract: "An analysis of header dependencies and precompiled headers in the VectorDefense engine to reduce build times by 40%.",
    date: "Jan 12, 2026",
    category: "Systems Engineering",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Secure Home Server Architecture: A Post-Mortem",
    abstract: "Lessons learned from deploying a self-hosted Nginx reverse proxy and handling SSL certificates manually on Linux.",
    date: "Dec 28, 2025",
    category: "DevOps",
    readTime: "8 min read"
  }
];

export default function ResearchPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">Research & Engineering</h1>
          <p className="text-xl text-gray-400">
            Technical papers, documentation, and architectural decisions recorded by Code Lith Labs.
          </p>
        </div>

        <div className="grid gap-6">
          {papers.map((paper) => (
            <article key={paper.id} className="group relative p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-blue-400 px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20">
                  {paper.category}
                </span>
                <span className="text-sm text-gray-500 flex items-center gap-2">
                  <Calendar className="w-3 h-3" /> {paper.date}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                {paper.title}
              </h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                {paper.abstract}
              </p>
              
              <div className="flex items-center text-sm font-medium text-white">
                Read Paper <ArrowUpRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}