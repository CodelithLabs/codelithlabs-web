'use client';
import { useState, useCallback, memo } from 'react';
import { Linkedin, Copy, Sparkles, Hash } from 'lucide-react';

const BlogToLinkedinPostComponent = function BlogToLinkedinPost() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [copied, setCopied] = useState(false);

  const convertToLinkedIn = useCallback(() => {
    if (!input.trim()) return;

    const sentences = input
      .replace(/([.!?])\s+/g, '$1|')
      .split('|')
      .map(s => s.trim())
      .filter(s => s.length > 10);

    // Extract hook (first impactful sentence)
    let hook = sentences[0] || '';
    if (hook.length > 100) {
      hook = hook.substring(0, 100) + '...';
    }

    // Extract 3-5 key insights
    const insights = sentences
      .slice(1, 6)
      .filter(s => s.length > 30 && s.length < 150)
      .map(s => s.replace(/\.$/, ''));

    // Extract keywords for hashtags
    const words = input.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
    const wordFreq: Record<string, number> = {};
    words.forEach(w => {
      if (!['this', 'that', 'with', 'from', 'have', 'been', 'were', 'what', 'when', 'where', 'which', 'their', 'there', 'about', 'would', 'could', 'should'].includes(w)) {
        wordFreq[w] = (wordFreq[w] || 0) + 1;
      }
    });
    const topKeywords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));

    // Build LinkedIn post
    const hookEmoji = includeEmojis ? '🔥 ' : '';
    const pointEmoji = includeEmojis ? '✅ ' : '• ';
    
    let post = `${hookEmoji}${hook}\n\n`;
    
    if (insights.length > 0) {
      post += `Here's what I learned:\n\n`;
      insights.forEach(insight => {
        post += `${pointEmoji}${insight}\n`;
      });
      post += '\n';
    }

    // Call to action
    const ctas = [
      'What are your thoughts on this?',
      'Have you experienced something similar?',
      'I\'d love to hear your perspective in the comments.',
      'Drop a comment below with your take!',
    ];
    post += `${includeEmojis ? '💬 ' : ''}${ctas[Math.floor(Math.random() * ctas.length)]}\n\n`;

    // Hashtags
    if (includeHashtags && topKeywords.length > 0) {
      post += topKeywords.map(k => `#${k}`).join(' ');
    }

    setOutput(post.trim());
  }, [input, includeEmojis, includeHashtags]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const charCount = output.length;
  const isOverLimit = charCount > 3000;

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Linkedin className="w-4 h-4 inline mr-2" />
        <strong>Blog to LinkedIn Post:</strong> Transform your blog content into an engaging LinkedIn post with hooks, key insights, and relevant hashtags.
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Paste your blog content:
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your blog post content here..."
          className="w-full h-40 bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-white placeholder-zinc-500 resize-y focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeEmojis}
            onChange={(e) => setIncludeEmojis(e.target.checked)}
            className="w-4 h-4 rounded bg-zinc-700 border-zinc-600"
          />
          <span className="text-sm text-zinc-300">Include emojis</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeHashtags}
            onChange={(e) => setIncludeHashtags(e.target.checked)}
            className="w-4 h-4 rounded bg-zinc-700 border-zinc-600"
          />
          <Hash className="w-4 h-4 text-zinc-400" />
          <span className="text-sm text-zinc-300">Include hashtags</span>
        </label>
      </div>

      <button
        onClick={convertToLinkedIn}
        disabled={!input.trim()}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        Generate LinkedIn Post
      </button>

      {output && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">LinkedIn Post</h3>
            <div className="flex items-center gap-3">
              <span className={`text-sm ${isOverLimit ? 'text-red-400' : 'text-zinc-400'}`}>
                {charCount}/3000 characters
              </span>
              <button
                onClick={copyToClipboard}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <pre className="whitespace-pre-wrap text-zinc-200 font-sans text-sm">{output}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(BlogToLinkedinPostComponent);
