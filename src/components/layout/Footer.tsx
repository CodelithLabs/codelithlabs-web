export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a]">
      {/* Google-Style Link Bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-400">
            <a href="/contact" className="hover:text-white transition-colors">
              Help
            </a>
            <a href="/contact" className="hover:text-white transition-colors">
              Feedback
            </a>
            <a href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="/terms" className="hover:text-white transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>

      {/* Copyright & Social */}
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
          <p>&copy; 2026 CodelithLabs. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="https://github.com/codelithlabs" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">
              GitHub
            </a>
            <a href="/contact" className="hover:text-zinc-300 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}