'use client';

import { memo, useState, useCallback } from 'react';

function ReadingTimeCalculator() {
  const [text, setText] = useState('');
  const [wordsPerMinute, setWordsPerMinute] = useState('200');
  const [result, setResult] = useState<{
    wordCount: number;
    characterCount: number;
    sentenceCount: number;
    paragraphCount: number;
    readingTime: { minutes: number; seconds: number };
    speakingTime: { minutes: number; seconds: number };
    readingLevel: string;
  } | null>(null);

  const handleCalculate = useCallback(() => {
    if (!text.trim()) {
      setResult(null);
      return;
    }

    const wpm = parseInt(wordsPerMinute) || 200;
    const speakingWpm = 150;

    // Word count
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    // Character count (excluding spaces)
    const characterCount = text.replace(/\s/g, '').length;

    // Sentence count
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceCount = sentences.length;

    // Paragraph count
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const paragraphCount = paragraphs.length || 1;

    // Reading time
    const readingMinutes = Math.floor(wordCount / wpm);
    const readingSeconds = Math.round((wordCount % wpm) / wpm * 60);

    // Speaking time
    const speakingMinutes = Math.floor(wordCount / speakingWpm);
    const speakingSeconds = Math.round((wordCount % speakingWpm) / speakingWpm * 60);

    // Reading level (Flesch-Kincaid approximation)
    const avgWordsPerSentence = wordCount / Math.max(1, sentenceCount);
    const avgSyllablesPerWord = characterCount / wordCount / 2.5; // Rough estimate
    const fleschKincaid = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59;
    
    let readingLevel: string;
    if (fleschKincaid <= 5) readingLevel = 'Elementary';
    else if (fleschKincaid <= 8) readingLevel = 'Middle School';
    else if (fleschKincaid <= 12) readingLevel = 'High School';
    else if (fleschKincaid <= 16) readingLevel = 'College';
    else readingLevel = 'Graduate';

    setResult({
      wordCount,
      characterCount,
      sentenceCount,
      paragraphCount,
      readingTime: { minutes: readingMinutes, seconds: readingSeconds },
      speakingTime: { minutes: speakingMinutes, seconds: speakingSeconds },
      readingLevel,
    });
  }, [text, wordsPerMinute]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Reading Time Calculator</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Paste Your Text</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your article, blog post, or any text here..."
              rows={10}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Reading Speed (words per minute)</label>
            <select
              value={wordsPerMinute}
              onChange={(e) => setWordsPerMinute(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="150">Slow Reader (150 WPM)</option>
              <option value="200">Average Reader (200 WPM)</option>
              <option value="250">Fast Reader (250 WPM)</option>
              <option value="300">Speed Reader (300 WPM)</option>
            </select>
          </div>
          <button
            onClick={handleCalculate}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Calculate Reading Time
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Results</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {result.readingTime.minutes > 0 ? `${result.readingTime.minutes}m ` : ''}
                {result.readingTime.seconds}s
              </div>
              <div className="text-sm text-zinc-400">Reading Time</div>
            </div>
            <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {result.speakingTime.minutes > 0 ? `${result.speakingTime.minutes}m ` : ''}
                {result.speakingTime.seconds}s
              </div>
              <div className="text-sm text-zinc-400">Speaking Time</div>
            </div>
            <div className="bg-purple-900/20 border border-purple-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{result.readingLevel}</div>
              <div className="text-sm text-zinc-400">Reading Level</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{result.wordCount.toLocaleString()}</div>
              <div className="text-sm text-zinc-400">Words</div>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{result.characterCount.toLocaleString()}</div>
              <div className="text-sm text-zinc-400">Characters</div>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{result.sentenceCount}</div>
              <div className="text-sm text-zinc-400">Sentences</div>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{result.paragraphCount}</div>
              <div className="text-sm text-zinc-400">Paragraphs</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(ReadingTimeCalculator);
