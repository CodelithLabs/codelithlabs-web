// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/tools/impl/MarkdownPreviewer.tsx
// Live Markdown to HTML Previewer (Simple, No External Libraries)
// ═══════════════════════════════════════════════════════════════════════════
'use client';

import { useState, useMemo } from 'react';

export default function MarkdownPreviewer() {
  const [markdown, setMarkdown] = useState('# Hello World\n\nThis is **bold** and this is *italic*.\n\n## Features\n- Bullet point 1\n- Bullet point 2\n\n[Link to Google](https://google.com)');

  // Simple markdown to HTML converter (basic implementation)
  const convertMarkdownToHtml = (md: string): string => {
    let html = md;

    // Headers (h1-h6)
    html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
    html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
    html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');

    // Strikethrough
    html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

    // Inline code
    html = html.replace(/`(.+?)`/g, '<code>$1</code>');

    // Links [text](url)
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Images ![alt](url)
    html = html.replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" />');

    // Unordered lists
    html = html.replace(/^\-\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/^\*\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Ordered lists
    html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');

    // Blockquotes
    html = html.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');

    // Horizontal rule
    html = html.replace(/^---$/gm, '<hr />');
    html = html.replace(/^\*\*\*$/gm, '<hr />');

    // Paragraphs (split by double newline)
    const lines = html.split('\n');
    html = lines
      .map((line) => {
        if (
          line.trim() === '' ||
          line.startsWith('<h') ||
          line.startsWith('<ul>') ||
          line.startsWith('<ol>') ||
          line.startsWith('<li>') ||
          line.startsWith('<blockquote>') ||
          line.startsWith('<hr')
        ) {
          return line;
        }
        return `<p>${line}</p>`;
      })
      .join('\n');

    return html;
  };

  const htmlOutput = useMemo(() => convertMarkdownToHtml(markdown), [markdown]);

  return (
    <div className="space-y-6">

      {/* Editor & Preview Grid */}
      <div className="grid md:grid-cols-2 gap-4">

        {/* Markdown Input */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Markdown Input:
          </label>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="# Enter markdown here..."
            className="w-full h-96 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3
                     text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500
                     focus:ring-2 focus:ring-blue-500/20 transition-all resize-none font-mono text-sm"
          />
        </div>

        {/* HTML Preview */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Live Preview:
          </label>
          <div
            className="w-full h-96 bg-white border border-zinc-700 rounded-lg px-4 py-3
                     overflow-y-auto prose prose-sm prose-invert max-w-none
                     [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:text-zinc-900
                     [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:text-zinc-900
                     [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:text-zinc-900
                     [&_p]:mb-3 [&_p]:text-zinc-700
                     [&_strong]:font-bold [&_strong]:text-zinc-900
                     [&_em]:italic [&_em]:text-zinc-700
                     [&_code]:bg-zinc-200 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_code]:text-red-600
                     [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-700
                     [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-3
                     [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-3
                     [&_li]:mb-1 [&_li]:text-zinc-700
                     [&_blockquote]:border-l-4 [&_blockquote]:border-zinc-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-zinc-600
                     [&_hr]:my-4 [&_hr]:border-zinc-300
                     [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded"
            dangerouslySetInnerHTML={{ __html: htmlOutput }}
          />
        </div>

      </div>

      {/* Clear Button */}
      <button
        onClick={() => setMarkdown('')}
        className="w-full px-4 py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-medium
                 rounded-lg transition-colors"
      >
        Clear Markdown
      </button>

      {/* Markdown Cheatsheet */}
      <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
        <h3 className="text-sm font-bold text-white mb-3">Quick Markdown Reference:</h3>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 text-xs text-zinc-400 font-mono">
          <div><code className="text-blue-400"># H1</code> - Heading 1</div>
          <div><code className="text-blue-400">## H2</code> - Heading 2</div>
          <div><code className="text-blue-400">**bold**</code> - Bold text</div>
          <div><code className="text-blue-400">*italic*</code> - Italic text</div>
          <div><code className="text-blue-400">[link](url)</code> - Link</div>
          <div><code className="text-blue-400">![alt](url)</code> - Image</div>
          <div><code className="text-blue-400">- item</code> - Bullet list</div>
          <div><code className="text-blue-400">1. item</code> - Numbered list</div>
          <div><code className="text-blue-400">`code`</code> - Inline code</div>
          <div><code className="text-blue-400">&gt; quote</code> - Blockquote</div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-300 flex gap-3">
        <span className="text-xl">🔒</span>
        <p>
          <strong>100% Client-Side:</strong> Markdown conversion happens entirely in your browser.
          No data is uploaded to our servers.
        </p>
      </div>

    </div>
  );
}
