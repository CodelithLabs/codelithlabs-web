'use client';
import { useState } from 'react';
import { FileCode, Copy, Check, Download } from 'lucide-react';

export default function ReadmeGenerator() {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [tech, setTech] = useState('');
  const [installation, setInstallation] = useState('npm install');
  const [usage, setUsage] = useState('npm start');
  const [license, setLicense] = useState('MIT');
  const [author, setAuthor] = useState('');
  const [features, setFeatures] = useState('');
  const [contributing, setContributing] = useState(true);
  const [badges, setBadges] = useState(true);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let md = '';
    if (badges && projectName) {
      md += `![License](https://img.shields.io/badge/license-${license}-blue.svg)\n`;
      md += `![Version](https://img.shields.io/badge/version-1.0.0-green.svg)\n\n`;
    }
    md += `# ${projectName || 'Project Name'}\n\n`;
    md += `${description || 'A brief description of your project.'}\n\n`;
    if (features) {
      md += `## ✨ Features\n\n`;
      features.split('\n').filter(Boolean).forEach(f => { md += `- ${f.trim()}\n`; });
      md += '\n';
    }
    if (tech) {
      md += `## 🛠️ Tech Stack\n\n`;
      tech.split(',').map(t => t.trim()).filter(Boolean).forEach(t => { md += `- ${t}\n`; });
      md += '\n';
    }
    md += `## 📦 Installation\n\n\`\`\`bash\n${installation}\n\`\`\`\n\n`;
    md += `## 🚀 Usage\n\n\`\`\`bash\n${usage}\n\`\`\`\n\n`;
    if (contributing) {
      md += `## 🤝 Contributing\n\nContributions are welcome! Please feel free to submit a Pull Request.\n\n`;
      md += `1. Fork the project\n2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)\n3. Commit your changes (\`git commit -m 'Add AmazingFeature'\`)\n4. Push to the branch (\`git push origin feature/AmazingFeature\`)\n5. Open a Pull Request\n\n`;
    }
    md += `## 📄 License\n\nThis project is licensed under the ${license} License.\n\n`;
    if (author) md += `## 👤 Author\n\n**${author}**\n\n`;
    md += `---\n\n⭐ Star this repo if you found it useful!\n`;

    return md;
  };

  const output = generate();
  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  const download = () => { const blob = new Blob([output], { type: 'text/markdown' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'README.md'; a.click(); URL.revokeObjectURL(url); };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <FileCode className="w-4 h-4 inline mr-2" /><strong>README Generator:</strong> Create professional GitHub README files with badges, features, installation steps, and more.
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div><label className="text-xs block mb-1">Project Name</label><input value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="My Awesome Project" className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm" /></div>
        <div><label className="text-xs block mb-1">Author</label><input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Your Name" className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm" /></div>
      </div>
      <div><label className="text-xs block mb-1">Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="What does your project do?" className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm" /></div>
      <div><label className="text-xs block mb-1">Features (one per line)</label><textarea value={features} onChange={e => setFeatures(e.target.value)} rows={3} placeholder="Fast and lightweight\nEasy to use\nWell documented" className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm" /></div>
      <div className="grid md:grid-cols-2 gap-3">
        <div><label className="text-xs block mb-1">Tech Stack (comma-separated)</label><input value={tech} onChange={e => setTech(e.target.value)} placeholder="React, TypeScript, Tailwind" className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm" /></div>
        <div><label className="text-xs block mb-1">License</label>
          <select value={license} onChange={e => setLicense(e.target.value)} className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm">
            <option>MIT</option><option>Apache-2.0</option><option>GPL-3.0</option><option>BSD-3-Clause</option><option>ISC</option><option>Unlicense</option>
          </select>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div><label className="text-xs block mb-1">Install Command</label><input value={installation} onChange={e => setInstallation(e.target.value)} className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm font-mono" /></div>
        <div><label className="text-xs block mb-1">Run Command</label><input value={usage} onChange={e => setUsage(e.target.value)} className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 text-sm font-mono" /></div>
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={badges} onChange={e => setBadges(e.target.checked)} /> Badges</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={contributing} onChange={e => setContributing(e.target.checked)} /> Contributing Section</label>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg">
        <div className="flex justify-between items-center px-4 py-2 border-b border-zinc-800">
          <span className="text-xs text-gray-400">README.md Preview</span>
          <div className="flex gap-2"><button onClick={copy} className="text-gray-400 hover:text-white">{copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}</button><button onClick={download} className="text-gray-400 hover:text-white"><Download className="w-4 h-4" /></button></div>
        </div>
        <pre className="p-4 text-xs font-mono text-green-400 overflow-auto max-h-80 whitespace-pre-wrap">{output}</pre>
      </div>
    </div>
  );
}
