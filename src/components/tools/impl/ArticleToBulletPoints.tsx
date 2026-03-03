'use client';
import { useState, useCallback, memo } from 'react';
import { List, Copy, Trash2, Sparkles } from 'lucide-react';

const ArticleToBulletPointsComponent = function ArticleToBulletPoints() {
  const [input, setInput] = useState('');
  const [bullets, setBullets] = useState<string[]>([]);
  const [maxPoints, setMaxPoints] = useState(7);
  const [copied, setCopied] = useState(false);

  const extractBulletPoints = useCallback(() => {
    if (!input.trim()) return;

    // Split into sentences
    const sentences = input
      .replace(/([.!?])\s+/g, '$1|')
      .split('|')
      .map(s => s.trim())
      .filter(s => s.length > 20);

    // Score sentences by importance indicators
    const scored = sentences.map(sentence => {
      let score = 0;
      // Contains numbers/stats
      if (/\d+%?/.test(sentence)) score += 3;
      // Contains key phrases
      if (/important|key|main|essential|critical|significant|notable/i.test(sentence)) score += 2;
      // Starts with action verbs
      if (/^(The|This|It|They|We|You|One|First|Second|Third|Finally|However|Moreover|Additionally)/i.test(sentence)) score += 1;
      // Length bonus (not too short, not too long)
      if (sentence.length > 50 && sentence.length < 200) score += 1;
      // Contains quotes
      if (/".*"/.test(sentence)) score += 2;
      return { sentence, score };
    });

    // Sort by score and take top points
    const topPoints = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, maxPoints)
      .map(item => {
        // Clean up the sentence for bullet format
        let bullet = item.sentence;
        // Remove leading articles if they don't add meaning
        bullet = bullet.replace(/^(The |This |It |A |An )/i, '');
        // Capitalize first letter
        bullet = bullet.charAt(0).toUpperCase() + bullet.slice(1);
        // Remove trailing period
        bullet = bullet.replace(/\.$/, '');
        return bullet;
      });

    setBullets(topPoints);
  }, [input, maxPoints]);

  const copyToClipboard = useCallback(() => {
    const text = bullets.map(b => `• ${b}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [bullets]);

  const clear = useCallback(() => {
    setInput('');
    setBullets([]);
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <List className="w-4 h-4 inline mr-2" />
        <strong>Article to Bullet Points:</strong> Extract key points from any article or text. The tool analyzes sentence importance and extracts the most significant points.
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Paste your article or long-form text:
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your article, blog post, or any long-form content here..."
          className="w-full h-48 bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-white placeholder-zinc-500 resize-y focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-zinc-300 mb-1">Max bullet points</label>
          <select
            value={maxPoints}
            onChange={(e) => setMaxPoints(Number(e.target.value))}
            className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700"
          >
            {[3, 5, 7, 10, 15].map(n => (
              <option key={n} value={n}>{n} points</option>
            ))}
          </select>
        </div>
        <button
          onClick={extractBulletPoints}
          disabled={!input.trim()}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Extract Points
        </button>
      </div>

      {bullets.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Key Points ({bullets.length})</h3>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded-lg flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={clear}
                className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded-lg flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Clear
              </button>
            </div>
          </div>
          <ul className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-2">
            {bullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-3 text-zinc-200">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default memo(ArticleToBulletPointsComponent);
