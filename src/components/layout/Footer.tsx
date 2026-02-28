export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a]">

      {/* Privacy-First Trust Banner */}
      <div className="border-b border-white/10 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm text-zinc-300 font-medium">
                Privacy-first tools. No server storage. Your data never leaves your browser.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Tools */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Tools</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><a href="/tools" className="hover:text-white transition-colors">All Tools</a></li>
                <li><a href="/tools/category/developer" className="hover:text-white transition-colors">Developer Tools</a></li>
                <li><a href="/tools/category/image" className="hover:text-white transition-colors">Image Tools</a></li>
                <li><a href="/tools/category/converter" className="hover:text-white transition-colors">Converters</a></li>
                <li><a href="/tools/category/calculator" className="hover:text-white transition-colors">Calculators</a></li>
                <li><a href="/tools/category/ai" className="hover:text-white transition-colors">AI Tools</a></li>
              </ul>
            </div>
            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="/team" className="hover:text-white transition-colors">Our Team</a></li>
                <li><a href="/tech-stack" className="hover:text-white transition-colors">Tech Stack</a></li>
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            {/* Open Source */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Open Source</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>
                  <a href="https://github.com/codelithlabs" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    GitHub
                  </a>
                </li>
              </ul>
              <p className="text-xs text-zinc-600 mt-4 leading-relaxed">
                CodelithLabs is not affiliated with codelithlab.com or any similarly named entities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright & Bottom Bar */}
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
          <p>&copy; 2026 CodelithLabs. All rights reserved. Kokrajhar, Assam, India.</p>
          <div className="flex gap-4 items-center">
            <a href="https://github.com/codelithlabs" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">
              GitHub
            </a>
            <a href="/contact" className="hover:text-zinc-300 transition-colors">
              Contact
            </a>
            <span className="text-zinc-700">|</span>
            <span className="text-xs text-zinc-600">Built with Next.js + TypeScript</span>
          </div>
        </div>
      </div>
    </footer>
  );
}