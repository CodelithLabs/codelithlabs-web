export function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 text-center text-sm text-gray-600 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; 2026 Codelithlabs. All Systems Nominal.</p>
        <div className="flex gap-4">
          <a href="https://github.com/codelithlabs" target="_blank" className="hover:text-blue-500 transition-colors">GitHub</a>
          <a href="#" className="hover:text-blue-500 transition-colors">Twitter</a>
        </div>
      </div>
    </footer>
  );
}