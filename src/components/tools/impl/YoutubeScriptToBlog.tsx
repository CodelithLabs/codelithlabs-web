'use client';
import { useState, useCallback, memo } from 'react';
import { Youtube, FileText, Copy, Sparkles } from 'lucide-react';

const YoutubeScriptToBlogComponent = function YoutubeScriptToBlog() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [blogTitle, setBlogTitle] = useState('');
  const [includeIntro, setIncludeIntro] = useState(true);
  const [includeConclusion, setIncludeConclusion] = useState(true);
  const [copied, setCopied] = useState(false);

  const convertToBlog = useCallback(() => {
    if (!input.trim()) return;

    // Clean up transcript (remove timestamps, speaker labels, etc.)
    let cleaned = input
      .replace(/\[\d+:\d+(?::\d+)?\]/g, '') // Remove timestamps like [00:00]
      .replace(/^\d+:\d+(?::\d+)?\s*/gm, '') // Remove timestamp starts
      .replace(/^(?:Speaker\s*\d*|Host|Guest):\s*/gmi, '') // Remove speaker labels
      .replace(/\n{3,}/g, '\n\n') // Normalize multiple newlines
      .trim();

    const paragraphs = cleaned.split('\n\n').filter(p => p.trim().length > 20);

    // Generate title if not provided
    const title = blogTitle || (paragraphs[0] ? 
      paragraphs[0].split(/[.!?]/)[0].substring(0, 60) + '...' : 
      'Blog Post');

    let blog = `# ${title}\n\n`;

    // Add introduction
    if (includeIntro) {
      blog += `## Introduction\n\n`;
      if (paragraphs[0]) {
        blog += paragraphs[0] + '\n\n';
      }
    }

    // Process main content
    const mainContent = includeIntro ? paragraphs.slice(1) : paragraphs;
    
    // Group paragraphs into sections (roughly every 3-4 paragraphs)
    const sections: string[][] = [];
    let currentSection: string[] = [];

    mainContent.forEach((para, idx) => {
      currentSection.push(para);
      if (currentSection.length >= 3 || idx === mainContent.length - 1) {
        sections.push([...currentSection]);
        currentSection = [];
      }
    });

    // Generate section headings and content
    sections.forEach((section, idx) => {
      if (section.length === 0) return;

      // Generate heading from first sentence of section
      const firstSentence = section[0].split(/[.!?]/)[0];
      const heading = firstSentence.length > 50 
        ? firstSentence.substring(0, 47) + '...'
        : firstSentence;

      if (!includeConclusion || idx < sections.length - 1) {
        blog += `## ${heading}\n\n`;
      } else {
        blog += `## Conclusion\n\n`;
      }

      section.forEach(para => {
        blog += para + '\n\n';
      });
    });

    // Add conclusion if enabled and not already added
    if (includeConclusion && sections.length > 0) {
      const lastPara = paragraphs[paragraphs.length - 1] || '';
      if (!blog.includes('## Conclusion')) {
        blog += `## Final Thoughts\n\n`;
        blog += `In summary, ${lastPara.toLowerCase()}\n\n`;
      }
    }

    // Add call to action
    blog += `---\n\n`;
    blog += `*This blog post was adapted from a video script. Watch the full video for more details!*\n`;

    setOutput(blog.trim());
  }, [input, blogTitle, includeIntro, includeConclusion]);

  const copyOutput = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const wordCount = output.split(/\s+/).filter(w => w).length;

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Youtube className="w-4 h-4 inline mr-2" />
        <strong>YouTube Script to Blog:</strong> Transform your video script or transcript into a formatted blog post with sections, headings, and structure.
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">Blog Title (optional)</label>
        <input
          type="text"
          value={blogTitle}
          onChange={(e) => setBlogTitle(e.target.value)}
          placeholder="Enter blog title or leave blank to auto-generate..."
          className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Paste your video script or transcript:
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your YouTube video script, transcript, or speaking notes here...

Timestamps and speaker labels will be automatically removed."
          className="w-full h-48 bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-white placeholder-zinc-500 resize-y focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeIntro}
            onChange={(e) => setIncludeIntro(e.target.checked)}
            className="w-4 h-4 rounded bg-zinc-700 border-zinc-600"
          />
          <span className="text-sm text-zinc-300">Include Introduction</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeConclusion}
            onChange={(e) => setIncludeConclusion(e.target.checked)}
            className="w-4 h-4 rounded bg-zinc-700 border-zinc-600"
          />
          <span className="text-sm text-zinc-300">Include Conclusion</span>
        </label>
      </div>

      <button
        onClick={convertToBlog}
        disabled={!input.trim()}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        Convert to Blog Post
      </button>

      {output && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Blog Post
              </h3>
              <span className="text-xs text-zinc-500">{wordCount} words</span>
            </div>
            <button
              onClick={copyOutput}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              {copied ? 'Copied!' : 'Copy Markdown'}
            </button>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-zinc-200 font-sans text-sm">{output}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(YoutubeScriptToBlogComponent);
