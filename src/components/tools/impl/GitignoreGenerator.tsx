'use client';
import { useState, useCallback, memo } from 'react';
import { FileCode, Copy, Download, Search, Check } from 'lucide-react';

interface GitignoreTemplate {
  name: string;
  category: string;
  patterns: string[];
}

const GITIGNORE_TEMPLATES: GitignoreTemplate[] = [
  {
    name: 'Node.js',
    category: 'Languages',
    patterns: [
      'node_modules/', '.npm', '.env', '.env.local', '.env.*.local', 'npm-debug.log*',
      'yarn-debug.log*', 'yarn-error.log*', '.pnpm-debug.log*', 'dist/', 'build/',
      '.cache/', '*.tsbuildinfo', '.next/', 'out/',
    ],
  },
  {
    name: 'Python',
    category: 'Languages',
    patterns: [
      '__pycache__/', '*.py[cod]', '*$py.class', '*.so', '.Python', 'build/', 'dist/',
      '*.egg-info/', '.eggs/', '*.egg', '.venv/', 'venv/', 'ENV/', '.env',
      '.mypy_cache/', '.pytest_cache/', '.coverage', 'htmlcov/', '*.ipynb_checkpoints',
    ],
  },
  {
    name: 'Java',
    category: 'Languages',
    patterns: [
      '*.class', '*.jar', '*.war', '*.ear', 'target/', '.gradle/', 'build/',
      '.idea/', '*.iml', '*.ipr', '*.iws', 'gradle-app.setting', '.settings/',
      '.classpath', '.project',
    ],
  },
  {
    name: 'Go',
    category: 'Languages',
    patterns: ['*.exe', '*.exe~', '*.dll', '*.so', '*.dylib', '*.test', '*.out', 'vendor/', 'go.work'],
  },
  {
    name: 'Rust',
    category: 'Languages',
    patterns: ['target/', '*.rs.bk', 'Cargo.lock', '*.pdb'],
  },
  {
    name: 'VS Code',
    category: 'IDEs',
    patterns: ['.vscode/*', '!.vscode/settings.json', '!.vscode/tasks.json', '!.vscode/launch.json', '!.vscode/extensions.json'],
  },
  {
    name: 'JetBrains',
    category: 'IDEs',
    patterns: ['.idea/', '*.iml', '*.ipr', '*.iws', 'out/', '.idea_modules/', 'atlassian-ide-plugin.xml'],
  },
  {
    name: 'macOS',
    category: 'OS',
    patterns: ['.DS_Store', '.AppleDouble', '.LSOverride', 'Icon', '._*', '.Spotlight-V100', '.Trashes'],
  },
  {
    name: 'Windows',
    category: 'OS',
    patterns: ['Thumbs.db', 'Thumbs.db:encryptable', 'ehthumbs.db', 'ehthumbs_vista.db', '*.stackdump', 'Desktop.ini', '$RECYCLE.BIN/'],
  },
  {
    name: 'Linux',
    category: 'OS',
    patterns: ['*~', '.fuse_hidden*', '.directory', '.Trash-*', '.nfs*'],
  },
  {
    name: 'Docker',
    category: 'Tools',
    patterns: ['docker-compose*.yml', '.docker/', '*.tar', '.dockerignore'],
  },
  {
    name: 'Logs',
    category: 'Common',
    patterns: ['*.log', 'logs/', '*.log.*', 'npm-debug.log*', 'yarn-debug.log*', 'yarn-error.log*'],
  },
  {
    name: 'Environment',
    category: 'Common',
    patterns: ['.env', '.env.*', '!.env.example', '!.env.sample', '.env.local', '.env.*.local', '*.pem', '*.key'],
  },
];

const GitignoreGeneratorComponent = function GitignoreGenerator() {
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>(['Node.js', 'macOS', 'Environment']);
  const [customPatterns, setCustomPatterns] = useState('');
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);

  const toggleTemplate = useCallback((name: string) => {
    setSelectedTemplates(prev =>
      prev.includes(name)
        ? prev.filter(t => t !== name)
        : [...prev, name]
    );
  }, []);

  const generateGitignore = useCallback(() => {
    const sections: string[] = [];

    // Group selected templates by category
    const byCategory: Record<string, GitignoreTemplate[]> = {};
    GITIGNORE_TEMPLATES
      .filter(t => selectedTemplates.includes(t.name))
      .forEach(t => {
        if (!byCategory[t.category]) byCategory[t.category] = [];
        byCategory[t.category].push(t);
      });

    Object.entries(byCategory).forEach(([category, templates]) => {
      sections.push(`# ═══════════════════════════════════════`);
      sections.push(`# ${category.toUpperCase()}`);
      sections.push(`# ═══════════════════════════════════════`);
      sections.push('');

      templates.forEach(t => {
        sections.push(`# ${t.name}`);
        sections.push(...t.patterns);
        sections.push('');
      });
    });

    // Add custom patterns
    if (customPatterns.trim()) {
      sections.push(`# ═══════════════════════════════════════`);
      sections.push(`# CUSTOM`);
      sections.push(`# ═══════════════════════════════════════`);
      sections.push('');
      sections.push(customPatterns.trim());
    }

    return sections.join('\n').trim();
  }, [selectedTemplates, customPatterns]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateGitignore());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([generateGitignore()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.gitignore';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredTemplates = GITIGNORE_TEMPLATES.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [...new Set(GITIGNORE_TEMPLATES.map(t => t.category))];

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <FileCode className="w-4 h-4 inline mr-2" />
        <strong>.gitignore Generator:</strong> Generate .gitignore files from popular templates. Select multiple presets and add custom patterns.
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search templates..."
          className="w-full bg-zinc-800 text-white p-3 pl-10 rounded-lg border border-zinc-700 focus:border-blue-500"
        />
      </div>

      {/* Template Selection */}
      <div className="space-y-4">
        {categories.map(category => {
          const categoryTemplates = filteredTemplates.filter(t => t.category === category);
          if (categoryTemplates.length === 0) return null;

          return (
            <div key={category}>
              <h4 className="text-sm font-medium text-zinc-400 mb-2">{category}</h4>
              <div className="flex flex-wrap gap-2">
                {categoryTemplates.map(template => (
                  <button
                    key={template.name}
                    onClick={() => toggleTemplate(template.name)}
                    className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition-colors ${
                      selectedTemplates.includes(template.name)
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
                    }`}
                  >
                    {selectedTemplates.includes(template.name) && <Check className="w-3 h-3" />}
                    {template.name}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Patterns */}
      <div>
        <label className="text-sm font-medium text-zinc-300 block mb-2">Custom Patterns</label>
        <textarea
          value={customPatterns}
          onChange={(e) => setCustomPatterns(e.target.value)}
          placeholder="Add custom patterns (one per line)&#10;*.secret&#10;my-private-folder/&#10;temp-*"
          className="w-full h-24 bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-white font-mono resize-y"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={copyToClipboard}
          className="flex-1 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg flex items-center justify-center gap-2"
        >
          <Copy className="w-4 h-4" />
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button
          onClick={downloadFile}
          className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download .gitignore
        </button>
      </div>

      {/* Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-zinc-400">Preview</h4>
          <span className="text-xs text-zinc-500">{selectedTemplates.length} templates selected</span>
        </div>
        <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-sm text-zinc-300 font-mono overflow-auto max-h-64">
          {generateGitignore() || '# Select templates to generate .gitignore'}
        </pre>
      </div>
    </div>
  );
};

export default memo(GitignoreGeneratorComponent);
