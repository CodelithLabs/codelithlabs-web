'use client';
import { useState, useCallback, memo } from 'react';
import { Mail, Twitter, Copy, Sparkles } from 'lucide-react';

const EmailToTweetComponent = function EmailToTweet() {
  const [input, setInput] = useState('');
  const [tweets, setTweets] = useState<string[]>([]);
  const [style, setStyle] = useState<'professional' | 'casual' | 'punchy'>('casual');
  const [copied, setCopied] = useState<number | null>(null);

  const convertToTweet = useCallback(() => {
    if (!input.trim()) return;

    // Extract key parts from email
    const lines = input.split('\n').filter(l => l.trim());
    
    // Remove common email parts
    const contentLines = lines.filter(line => {
      const lower = line.toLowerCase();
      return !lower.startsWith('dear ') &&
             !lower.startsWith('hi ') &&
             !lower.startsWith('hello ') &&
             !lower.startsWith('from:') &&
             !lower.startsWith('to:') &&
             !lower.startsWith('subject:') &&
             !lower.startsWith('sent:') &&
             !lower.startsWith('best regards') &&
             !lower.startsWith('sincerely') &&
             !lower.startsWith('thanks,') &&
             !lower.startsWith('thank you,') &&
             !lower.includes('@') &&
             line.length > 10;
    });

    // Combine and extract sentences
    const text = contentLines.join(' ');
    const sentences = text
      .replace(/([.!?])\s+/g, '$1|')
      .split('|')
      .map(s => s.trim())
      .filter(s => s.length > 15);

    // Generate different tweet styles
    const generatedTweets: string[] = [];

    // Main point tweet
    const mainPoint = sentences[0] || '';
    
    switch (style) {
      case 'professional':
        if (mainPoint) {
          const prof = mainPoint.length > 250 ? mainPoint.substring(0, 247) + '...' : mainPoint;
          generatedTweets.push(prof);
        }
        if (sentences[1]) {
          generatedTweets.push(`Key insight: ${sentences[1].substring(0, 240)}`);
        }
        break;
        
      case 'casual':
        if (mainPoint) {
          const casual = `Just got this insight: ${mainPoint}`.substring(0, 280);
          generatedTweets.push(casual);
        }
        if (sentences.length > 1) {
          const tldr = `TL;DR: ${sentences.slice(0, 2).join(' ')}`.substring(0, 280);
          generatedTweets.push(tldr);
        }
        break;
        
      case 'punchy':
        if (mainPoint) {
          const punchy = mainPoint
            .replace(/^(I |We |The |This |That )/i, '')
            .replace(/\.$/, '!');
          generatedTweets.push(punchy.length > 280 ? punchy.substring(0, 277) + '...' : punchy);
        }
        if (sentences[1]) {
          generatedTweets.push(`🔥 ${sentences[1].substring(0, 270)}`);
        }
        break;
    }

    // Generate a summary tweet
    if (sentences.length > 2) {
      const summary = `Key points:\n${sentences.slice(0, 3).map((s, i) => `${i + 1}. ${s.substring(0, 60)}...`).join('\n')}`;
      if (summary.length <= 280) {
        generatedTweets.push(summary);
      }
    }

    setTweets(generatedTweets.filter(t => t.length <= 280));
  }, [input, style]);

  const copyTweet = useCallback((idx: number) => {
    navigator.clipboard.writeText(tweets[idx]);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  }, [tweets]);

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Mail className="w-4 h-4 inline mr-2" />
        <strong>Email to Tweet:</strong> Transform email content into tweet-ready summaries. Great for sharing newsletter insights or email announcements.
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Paste your email content:
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your email content here (headers, signatures, etc. will be automatically filtered out)..."
          className="w-full h-48 bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-white placeholder-zinc-500 resize-y focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-zinc-300 mb-1">Tweet style</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as 'professional' | 'casual' | 'punchy')}
            className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="punchy">Punchy</option>
          </select>
        </div>
        <button
          onClick={convertToTweet}
          disabled={!input.trim()}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg flex items-center justify-center gap-2 mt-5"
        >
          <Sparkles className="w-4 h-4" />
          Generate Tweets
        </button>
      </div>

      {tweets.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Twitter className="w-5 h-5 text-blue-400" />
            Tweet Options ({tweets.length})
          </h3>
          <div className="space-y-3">
            {tweets.map((tweet, idx) => (
              <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <div className="flex justify-between items-start gap-3">
                  <p className="text-zinc-200 text-sm whitespace-pre-wrap flex-1">{tweet}</p>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs ${tweet.length > 280 ? 'text-red-400' : 'text-zinc-500'}`}>
                      {tweet.length}/280
                    </span>
                    <button
                      onClick={() => copyTweet(idx)}
                      className="p-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-white"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {copied === idx && (
                  <span className="text-green-400 text-xs mt-2 block">Copied!</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(EmailToTweetComponent);
