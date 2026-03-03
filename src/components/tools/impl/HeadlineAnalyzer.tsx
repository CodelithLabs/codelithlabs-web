'use client';

import { memo, useState, useCallback } from 'react';

interface AnalysisResult {
  score: number;
  wordCount: number;
  characterCount: number;
  powerWords: string[];
  emotionalWords: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  suggestions: string[];
  grade: string;
}

const powerWords = ['free', 'new', 'you', 'now', 'instantly', 'easy', 'proven', 'guaranteed', 'secret', 'discover', 'amazing', 'exclusive', 'limited', 'ultimate', 'essential', 'powerful', 'breakthrough', 'revolutionary', 'transform', 'unlock'];
const emotionalWords = ['love', 'hate', 'fear', 'angry', 'happy', 'sad', 'excited', 'worried', 'shocked', 'amazing', 'terrible', 'wonderful', 'horrible', 'fantastic', 'devastating', 'thrilling', 'heartbreaking', 'inspiring', 'frustrating', 'delightful'];
const negativeWords = ['not', 'never', 'no', 'don\'t', 'won\'t', 'can\'t', 'fail', 'mistake', 'wrong', 'bad', 'worst', 'avoid', 'stop', 'problem', 'crisis'];
const positiveWords = ['best', 'great', 'top', 'good', 'amazing', 'excellent', 'perfect', 'success', 'win', 'achieve', 'improve', 'boost', 'grow', 'increase', 'simple'];

function HeadlineAnalyzer() {
  const [headline, setHeadline] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = useCallback(() => {
    if (!headline.trim()) {
      setResult(null);
      return;
    }

    const words = headline.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    const characterCount = headline.length;

    // Find power words
    const foundPowerWords = words.filter(w => powerWords.includes(w.replace(/[^a-z]/g, '')));
    const foundEmotionalWords = words.filter(w => emotionalWords.includes(w.replace(/[^a-z]/g, '')));

    // Sentiment analysis
    const positiveCount = words.filter(w => positiveWords.includes(w.replace(/[^a-z]/g, ''))).length;
    const negativeCount = words.filter(w => negativeWords.includes(w.replace(/[^a-z]/g, ''))).length;
    const sentiment = positiveCount > negativeCount ? 'positive' : negativeCount > positiveCount ? 'negative' : 'neutral';

    // Calculate score
    let score = 50; // Base score

    // Word count (ideal: 6-12 words)
    if (wordCount >= 6 && wordCount <= 12) score += 15;
    else if (wordCount >= 4 && wordCount <= 15) score += 10;
    else score -= 5;

    // Character count (ideal: 50-60 characters)
    if (characterCount >= 50 && characterCount <= 60) score += 10;
    else if (characterCount >= 40 && characterCount <= 70) score += 5;

    // Power words
    score += Math.min(foundPowerWords.length * 5, 15);

    // Emotional words
    score += Math.min(foundEmotionalWords.length * 3, 10);

    // Numbers in headline
    if (/\d/.test(headline)) score += 10;

    // Question mark
    if (headline.includes('?')) score += 5;

    // Starts with "How to"
    if (headline.toLowerCase().startsWith('how to')) score += 5;

    // Contains colon (listicle style)
    if (headline.includes(':')) score += 5;

    score = Math.min(100, Math.max(0, score));

    // Grade
    let grade: string;
    if (score >= 90) grade = 'A+';
    else if (score >= 80) grade = 'A';
    else if (score >= 70) grade = 'B';
    else if (score >= 60) grade = 'C';
    else if (score >= 50) grade = 'D';
    else grade = 'F';

    // Suggestions
    const suggestions: string[] = [];
    if (wordCount < 6) suggestions.push('Add more words to make headline more descriptive (aim for 6-12 words)');
    if (wordCount > 15) suggestions.push('Shorten your headline for better readability');
    if (foundPowerWords.length === 0) suggestions.push('Add power words like "proven", "essential", or "ultimate"');
    if (foundEmotionalWords.length === 0) suggestions.push('Add emotional words to connect with readers');
    if (!/\d/.test(headline)) suggestions.push('Consider adding a number for specificity');
    if (characterCount > 70) suggestions.push('Keep under 70 characters for social media optimization');

    setResult({
      score,
      wordCount,
      characterCount,
      powerWords: foundPowerWords,
      emotionalWords: foundEmotionalWords,
      sentiment,
      suggestions,
      grade,
    });
  }, [headline]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Headline Analyzer</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Enter Your Headline</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g., 10 Proven Ways to Double Your Productivity Today"
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </div>
          <button
            onClick={handleAnalyze}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Analyze Headline
          </button>
        </div>
      </div>

      {result && (
        <>
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Headline Score</h3>
              <div className={`text-4xl font-bold ${
                result.score >= 70 ? 'text-green-400' : result.score >= 50 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {result.score}/100
              </div>
            </div>
            <div className="h-4 bg-zinc-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${
                  result.score >= 70 ? 'bg-green-500' : result.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${result.score}%` }}
              />
            </div>
            <div className="text-center mt-2">
              <span className="text-zinc-400">Grade: </span>
              <span className={`text-2xl font-bold ${
                result.score >= 70 ? 'text-green-400' : result.score >= 50 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {result.grade}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{result.wordCount}</div>
              <div className="text-sm text-zinc-400">Words</div>
            </div>
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{result.characterCount}</div>
              <div className="text-sm text-zinc-400">Characters</div>
            </div>
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{result.powerWords.length}</div>
              <div className="text-sm text-zinc-400">Power Words</div>
            </div>
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-center">
              <div className={`text-2xl font-bold capitalize ${
                result.sentiment === 'positive' ? 'text-green-400' : result.sentiment === 'negative' ? 'text-red-400' : 'text-zinc-400'
              }`}>
                {result.sentiment}
              </div>
              <div className="text-sm text-zinc-400">Sentiment</div>
            </div>
          </div>

          {result.suggestions.length > 0 && (
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Suggestions for Improvement</h3>
              <ul className="space-y-2">
                {result.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-zinc-300">
                    <span className="text-yellow-400 mt-1">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default memo(HeadlineAnalyzer);
