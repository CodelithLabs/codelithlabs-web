'use client';
import { useState, useCallback, memo } from 'react';
import { Mic, Copy, Sparkles, Clock, User } from 'lucide-react';

interface ShowNotes {
  title: string;
  summary: string;
  keyTopics: string[];
  timestamps: { time: string; topic: string }[];
  quotes: string[];
  resources: string[];
}

const PodcastNotesGeneratorComponent = function PodcastNotesGenerator() {
  const [input, setInput] = useState('');
  const [podcastTitle, setPodcastTitle] = useState('');
  const [guestName, setGuestName] = useState('');
  const [notes, setNotes] = useState<ShowNotes | null>(null);
  const [copied, setCopied] = useState(false);

  const generateNotes = useCallback(() => {
    if (!input.trim()) return;

    const sentences = input
      .replace(/([.!?])\s+/g, '$1|')
      .split('|')
      .map(s => s.trim())
      .filter(s => s.length > 10);

    // Generate summary from first few sentences
    const summary = sentences.slice(0, 3).join(' ').substring(0, 300);

    // Extract key topics (sentences with topic indicators)
    const keyTopics = sentences
      .filter(s => /talk about|discuss|topic|point|important|key/i.test(s))
      .slice(0, 5)
      .map(s => s.replace(/^(we |they |I )/i, '').substring(0, 100));

    // If no topics found, take most important sentences
    if (keyTopics.length === 0) {
      sentences
        .filter(s => s.length > 50 && s.length < 150)
        .slice(0, 5)
        .forEach(s => keyTopics.push(s.substring(0, 100)));
    }

    // Generate fake timestamps (evenly distributed)
    const duration = Math.floor(sentences.length / 5) * 10; // Rough estimate
    const timestamps = keyTopics.map((topic, idx) => ({
      time: `${Math.floor((idx * duration) / keyTopics.length)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      topic: topic.substring(0, 60),
    }));

    // Extract quotes (sentences with quotation marks or strong statements)
    const quotes = sentences
      .filter(s => /".*"/.test(s) || /believe|think|important|always|never|best|worst/i.test(s))
      .slice(0, 3)
      .map(s => s.substring(0, 150));

    // Extract potential resources/mentions
    const resources: string[] = [];
    sentences.forEach(s => {
      const bookMatch = s.match(/book(?:s)?\s+(?:called\s+)?["']?([^"'.]+)/i);
      const websiteMatch = s.match(/(?:website|site|blog|podcast)\s+(?:called\s+)?["']?([^"'.]+)/i);
      if (bookMatch) resources.push(`📚 ${bookMatch[1].trim()}`);
      if (websiteMatch) resources.push(`🔗 ${websiteMatch[1].trim()}`);
    });

    setNotes({
      title: podcastTitle || 'Podcast Episode',
      summary: summary || 'Episode summary goes here.',
      keyTopics,
      timestamps,
      quotes,
      resources: resources.slice(0, 5),
    });
  }, [input, podcastTitle]);

  const copyNotes = useCallback(() => {
    if (!notes) return;
    
    let text = `# ${notes.title}\n`;
    if (guestName) text += `Guest: ${guestName}\n`;
    text += `\n## Summary\n${notes.summary}\n`;
    text += `\n## Key Topics\n${notes.keyTopics.map(t => `- ${t}`).join('\n')}\n`;
    if (notes.timestamps.length > 0) {
      text += `\n## Timestamps\n${notes.timestamps.map(t => `${t.time} - ${t.topic}`).join('\n')}\n`;
    }
    if (notes.quotes.length > 0) {
      text += `\n## Notable Quotes\n${notes.quotes.map(q => `> "${q}"`).join('\n')}\n`;
    }
    if (notes.resources.length > 0) {
      text += `\n## Resources Mentioned\n${notes.resources.join('\n')}\n`;
    }
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [notes, guestName]);

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Mic className="w-4 h-4 inline mr-2" />
        <strong>Podcast Notes Generator:</strong> Transform podcast transcripts into structured show notes with timestamps, key topics, and quotes.
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Podcast Title</label>
          <input
            type="text"
            value={podcastTitle}
            onChange={(e) => setPodcastTitle(e.target.value)}
            placeholder="Episode title..."
            className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Guest Name (optional)</label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Guest name..."
              className="w-full bg-zinc-800 text-white p-2 pl-9 rounded-lg border border-zinc-700 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Paste podcast transcript:
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your podcast transcript or detailed notes here..."
          className="w-full h-48 bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-white placeholder-zinc-500 resize-y focus:outline-none focus:border-blue-500"
        />
      </div>

      <button
        onClick={generateNotes}
        disabled={!input.trim()}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        Generate Show Notes
      </button>

      {notes && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{notes.title}</h3>
            <button
              onClick={copyNotes}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              {copied ? 'Copied!' : 'Copy Markdown'}
            </button>
          </div>

          {guestName && (
            <div className="flex items-center gap-2 text-zinc-400">
              <User className="w-4 h-4" />
              <span>Guest: {guestName}</span>
            </div>
          )}

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-zinc-300 mb-2">Summary</h4>
            <p className="text-zinc-400 text-sm">{notes.summary}</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-zinc-300 mb-2">Key Topics</h4>
            <ul className="space-y-1">
              {notes.keyTopics.map((topic, idx) => (
                <li key={idx} className="text-zinc-400 text-sm flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </div>

          {notes.timestamps.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-zinc-300 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Timestamps
              </h4>
              <ul className="space-y-1">
                {notes.timestamps.map((ts, idx) => (
                  <li key={idx} className="text-zinc-400 text-sm flex items-center gap-3">
                    <span className="text-blue-400 font-mono w-12">{ts.time}</span>
                    <span>{ts.topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {notes.quotes.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-zinc-300 mb-2">Notable Quotes</h4>
              <div className="space-y-2">
                {notes.quotes.map((quote, idx) => (
                  <blockquote key={idx} className="text-zinc-400 text-sm italic border-l-2 border-blue-500 pl-3">
                    &quot;{quote}&quot;
                  </blockquote>
                ))}
              </div>
            </div>
          )}

          {notes.resources.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-zinc-300 mb-2">Resources Mentioned</h4>
              <ul className="space-y-1">
                {notes.resources.map((resource, idx) => (
                  <li key={idx} className="text-zinc-400 text-sm">{resource}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(PodcastNotesGeneratorComponent);
