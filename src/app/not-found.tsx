"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="h-screen w-full bg-[#0a0a0a] flex flex-col items-center justify-center text-center px-4">
            <div className="mb-8 p-6 bg-red-500/10 rounded-full border border-red-500/20 animate-pulse">
                <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>

            <h1 className="text-7xl font-bold text-white mb-2 tracking-tighter">404</h1>
            <h2 className="text-xl font-mono text-red-400 mb-8">CRITICAL_PROCESS_DIED</h2>

            <p className="text-gray-500 max-w-md mb-10 leading-relaxed">
                The requested resource could not be located in the memory sector.
                It may have been moved, deleted, or never existed in this timeline.
            </p>

            <Link
                href="/"
                className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Return to Operations
            </Link>
        </div>
    );
}