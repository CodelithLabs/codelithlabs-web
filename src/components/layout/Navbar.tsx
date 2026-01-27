"use client";

import { Terminal } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tighter text-white flex items-center gap-2 group">
          <Terminal className="w-5 h-5 text-blue-500 group-hover:text-blue-400 transition-colors" />
          Codelithlabs
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <Link href="/research" className="hover:text-white transition-colors">Research</Link>
          <Link href="/projects" className="hover:text-white transition-colors">Projects</Link>
          <Link href="/team" className="hover:text-white transition-colors">Team</Link>
          
          {/* The Money Button */}
          <Link href="/contact" className="px-4 py-2 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition-colors">
            Hire Us
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}