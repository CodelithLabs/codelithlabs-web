"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-white">
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <div className="mb-6 p-5 bg-red-500/10 rounded-full border border-red-500/20">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Critical Error</h1>
          <p className="text-gray-400 max-w-md mb-8">
            The application encountered a fatal error. Please try refreshing the page.
          </p>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </body>
    </html>
  );
}
