'use client';
import { useState, useCallback, memo } from 'react';
import { Twitter, Copy, Sparkles, ChevronRight } from 'lucide-react';

const BlogToTwitterThreadComponent = function BlogToTwitterThread() {
  const [input, setInput] = useState('');
  const [tweets, setTweets] = useState<string[]>([]);
  const [tweetStyle, setTweetStyle] = useState<'numbered' | 'emoji' | 'plain'>('numbered');
  const [maxTweets, setMaxTweets] = useState(10);
  const [copied, setCopied] = useState<number | null>(null);

  const convertToThread = useCallback(() => {
    if (!input.trim()) return;

    const sentences = input
      .replace(/([.!?])\s+/g, '$1|')
      .split('|')
      .map(s => s.trim())
      .filter(s => s.length > 10);

    // Create hook tweet
    let hookTweet = sentences[0] || '';
    if (hookTweet.length > 250) {
      hookTweet = hookTweet.substring(0, 247) + '...';
    }
    hookTweet = '🧵 ' + hookTweet + '\n\nA thread 👇';

    const threadTweets: string[] = [hookTweet];

    // Process remaining sentences into tweets
    let currentTweet = '';
    
    for (let i = 1; i < sentences.length && threadTweets.length < maxTweets; i++) {
      const sentence = sentences[i];
      const testTweet = currentTweet ? `${currentTweet} ${sentence}` : sentence;
      
      if (testTweet.length <= 260) {
        currentTweet = testTweet;
      } else {
        if (currentTweet) {
          threadTweets.push(currentTweet);
        }
        currentTweet = sentence.length <= 260 ? sentence : sentence.substring(0, 257) + '...';
      }
    }
    
    if (currentTweet && threadTweets.length < maxTweets) {
      threadTweets.push(currentTweet);
    }

    // Add numbering/emoji based on style
    const formattedTweets = threadTweets.map((tweet, idx) => {
      if (idx === 0) return tweet; // Hook tweet already formatted
      
      switch (tweetStyle) {
        case 'numbered':
          return `${idx}/ ${tweet}`;
        case 'emoji':
          const emojis = ['💡', '✨', '🎯', '🚀', '💪', '🔥', '⚡', '🌟', '💎', '🏆'];
          return `${emojis[idx % emojis.length]} ${tweet}`;
        default:
          return tweet;
      }
    });

    // Add closing tweet
    if (formattedTweets.length > 1) {
      formattedTweets.push(
        `${tweetStyle === 'numbered' ? `${formattedTweets.length}/` : '🙏'} That's a wrap!\n\nIf you found this helpful:\n• Like & Retweet the first tweet\n• Follow me for more\n• Drop your thoughts below 👇`
      );
    }

    setTweets(formattedTweets);
  }, [input, tweetStyle, maxTweets]);

  const copyTweet = useCallback((idx: number) => {
    navigator.clipboard.writeText(tweets[idx]);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  }, [tweets]);

  const copyAll = useCallback(() => {
    const text = tweets.map((t, i) => `--- Tweet ${i + 1} ---\n${t}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(-1);
    setTimeout(() => setCopied(null), 2000);
  }, [tweets]);

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Twitter className="w-4 h-4 inline mr-2" />
        <strong>Blog to Twitter Thread:</strong> Convert your blog post into an engaging Twitter/X thread with proper formatting and character limits.
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

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Thread style</label>
          <select
            value={tweetStyle}
            onChange={(e) => setTweetStyle(e.target.value as 'numbered' | 'emoji' | 'plain')}
            className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700"
          >
            <option value="numbered">Numbered (1/, 2/, 3/...)</option>
            <option value="emoji">Emoji bullets</option>
            <option value="plain">Plain text</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Max tweets</label>
          <select
            value={maxTweets}
            onChange={(e) => setMaxTweets(Number(e.target.value))}
            className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700"
          >
            {[5, 10, 15, 20, 25].map(n => (
              <option key={n} value={n}>{n} tweets</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={convertToThread}
        disabled={!input.trim()}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        Generate Thread
      </button>

      {tweets.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Thread ({tweets.length} tweets)</h3>
            <button
              onClick={copyAll}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              {copied === -1 ? 'Copied!' : 'Copy All'}
            </button>
          </div>
          <div className="space-y-3">
            {tweets.map((tweet, idx) => (
              <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 flex-1">
                    <span className="text-zinc-500 text-sm mt-0.5">{idx + 1}</span>
                    <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                    <p className="text-zinc-200 text-sm whitespace-pre-wrap flex-1">{tweet}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${tweet.length > 280 ? 'text-red-400' : 'text-zinc-500'}`}>
                      {tweet.length}/280
                    </span>
                    <button
                      onClick={() => copyTweet(idx)}
                      className="p-1.5 bg-zinc-700 hover:bg-zinc-600 rounded text-zinc-300"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(BlogToTwitterThreadComponent);
