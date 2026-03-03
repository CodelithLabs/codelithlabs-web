'use client';

import { memo, useState, useCallback } from 'react';

interface GitCommand {
  category: string;
  name: string;
  command: string;
  description: string;
}

const gitCommands: GitCommand[] = [
  // Setup
  { category: 'Setup', name: 'Initialize repo', command: 'git init', description: 'Create a new local repository' },
  { category: 'Setup', name: 'Clone repo', command: 'git clone <url>', description: 'Clone a remote repository' },
  { category: 'Setup', name: 'Set user name', command: 'git config --global user.name "<name>"', description: 'Configure your name' },
  { category: 'Setup', name: 'Set user email', command: 'git config --global user.email "<email>"', description: 'Configure your email' },
  
  // Basic
  { category: 'Basic', name: 'Check status', command: 'git status', description: 'Show working tree status' },
  { category: 'Basic', name: 'Stage file', command: 'git add <file>', description: 'Add file to staging area' },
  { category: 'Basic', name: 'Stage all', command: 'git add .', description: 'Add all changes to staging' },
  { category: 'Basic', name: 'Commit', command: 'git commit -m "<message>"', description: 'Commit staged changes' },
  { category: 'Basic', name: 'Commit all', command: 'git commit -am "<message>"', description: 'Stage and commit all changes' },
  
  // Branches
  { category: 'Branches', name: 'List branches', command: 'git branch', description: 'List local branches' },
  { category: 'Branches', name: 'Create branch', command: 'git branch <name>', description: 'Create a new branch' },
  { category: 'Branches', name: 'Switch branch', command: 'git checkout <branch>', description: 'Switch to a branch' },
  { category: 'Branches', name: 'Create & switch', command: 'git checkout -b <name>', description: 'Create and switch to branch' },
  { category: 'Branches', name: 'Delete branch', command: 'git branch -d <name>', description: 'Delete a branch' },
  { category: 'Branches', name: 'Merge branch', command: 'git merge <branch>', description: 'Merge branch into current' },
  
  // Remote
  { category: 'Remote', name: 'Add remote', command: 'git remote add origin <url>', description: 'Add a remote repository' },
  { category: 'Remote', name: 'View remotes', command: 'git remote -v', description: 'List remote repositories' },
  { category: 'Remote', name: 'Push', command: 'git push origin <branch>', description: 'Push to remote' },
  { category: 'Remote', name: 'Push (set upstream)', command: 'git push -u origin <branch>', description: 'Push and set upstream' },
  { category: 'Remote', name: 'Pull', command: 'git pull origin <branch>', description: 'Pull from remote' },
  { category: 'Remote', name: 'Fetch', command: 'git fetch', description: 'Fetch remote changes' },
  
  // History
  { category: 'History', name: 'View log', command: 'git log', description: 'Show commit history' },
  { category: 'History', name: 'Short log', command: 'git log --oneline', description: 'Compact commit history' },
  { category: 'History', name: 'Graph log', command: 'git log --graph --oneline --all', description: 'Visual branch history' },
  { category: 'History', name: 'Show diff', command: 'git diff', description: 'Show unstaged changes' },
  { category: 'History', name: 'Show staged diff', command: 'git diff --staged', description: 'Show staged changes' },
  
  // Undo
  { category: 'Undo', name: 'Unstage file', command: 'git reset HEAD <file>', description: 'Unstage a file' },
  { category: 'Undo', name: 'Discard changes', command: 'git checkout -- <file>', description: 'Discard local changes' },
  { category: 'Undo', name: 'Reset soft', command: 'git reset --soft HEAD~1', description: 'Undo last commit, keep changes' },
  { category: 'Undo', name: 'Reset hard', command: 'git reset --hard HEAD~1', description: 'Undo last commit, discard changes' },
  { category: 'Undo', name: 'Revert commit', command: 'git revert <commit>', description: 'Create commit that undoes changes' },
  
  // Stash
  { category: 'Stash', name: 'Stash changes', command: 'git stash', description: 'Stash working changes' },
  { category: 'Stash', name: 'List stashes', command: 'git stash list', description: 'List all stashes' },
  { category: 'Stash', name: 'Apply stash', command: 'git stash apply', description: 'Apply most recent stash' },
  { category: 'Stash', name: 'Pop stash', command: 'git stash pop', description: 'Apply and remove stash' },
  { category: 'Stash', name: 'Drop stash', command: 'git stash drop', description: 'Remove most recent stash' },
];

function GitCommandGenerator() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(gitCommands.map(c => c.category))];

  const filteredCommands = gitCommands.filter(cmd => {
    const matchesSearch = search === '' || 
      cmd.name.toLowerCase().includes(search.toLowerCase()) ||
      cmd.command.toLowerCase().includes(search.toLowerCase()) ||
      cmd.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || cmd.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Git Command Generator</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Search Commands</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, command, or description..."
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredCommands.map((cmd, idx) => (
          <div
            key={idx}
            className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 hover:border-zinc-600 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-medium">{cmd.name}</span>
                  <span className="px-2 py-0.5 bg-zinc-700 rounded text-xs text-zinc-400">{cmd.category}</span>
                </div>
                <code className="text-green-400 font-mono text-sm">{cmd.command}</code>
                <p className="text-zinc-400 text-sm mt-1">{cmd.description}</p>
              </div>
              <button
                onClick={() => handleCopy(cmd.command)}
                className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCommands.length === 0 && (
        <div className="text-center text-zinc-400 py-8">
          No commands found matching your search.
        </div>
      )}
    </div>
  );
}

export default memo(GitCommandGenerator);
