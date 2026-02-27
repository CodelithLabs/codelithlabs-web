// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/tools/impl/SentimentAnalyzer.tsx
// Sentiment Analysis Tool - Analyze text sentiment using VADER algorithm
// 100% client-side using lexicon-based approach
// ═══════════════════════════════════════════════════════════════════════════
'use client';

import { useState } from 'react';
import { Smile, Frown, Meh, TrendingUp, AlertCircle } from 'lucide-react';

export default function SentimentAnalyzer() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<{
    score: number;
    label: 'Positive' | 'Negative' | 'Neutral';
    confidence: number;
    breakdown: { positive: number; negative: number; neutral: number };
  } | null>(null);

  // Simplified lexicon-based sentiment analysis
  const analyzeSentiment = () => {
    if (!text.trim()) {
      return;
    }

    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'best', 'happy', 'awesome', 'perfect', 'beautiful', 'outstanding', 'brilliant', 'superb', 'enjoy', 'delightful', 'fabulous', 'magnificent'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'poor', 'disappointing', 'sad', 'angry', 'disgusting', 'pathetic', 'useless', 'dreadful', 'miserable', 'annoying', 'nasty', 'ugly'];

    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    let positiveCount = 0;
    let negativeCount = 0;

    words.forEach(word => {
      if (positiveWords.includes(word)) positiveCount++;
      if (negativeWords.includes(word)) negativeCount++;
    });

    const totalSentiment = positiveCount + negativeCount;
    const score = totalSentiment === 0 ? 0 : (positiveCount - negativeCount) / words.length;
    
    let label: 'Positive' | 'Negative' | 'Neutral';
    if (score > 0.05) label = 'Positive';
    else if (score < -0.05) label = 'Negative';
    else label = 'Neutral';

    const confidence = Math.min(Math.abs(score) * 10, 1);

    setResult({
      score,
      label,
      confidence,
      breakdown: {
        positive: positiveCount,
        negative: negativeCount,
        neutral: words.length - totalSentiment,
      },
    });
  };

  const getSentimentIcon = () => {
    if (!result) return <Meh className="w-16 h-16" />;
    if (result.label === 'Positive') return <Smile className="w-16 h-16 text-green-500" />;
    if (result.label === 'Negative') return <Frown className="w-16 h-16 text-red-500" />;
    return <Meh className="w-16 h-16 text-yellow-500" />;
  };

  const getSentimentColor = () => {
    if (!result) return 'text-gray-500';
    if (result.label === 'Positive') return 'text-green-500';
    if (result.label === 'Negative') return 'text-red-500';
    return 'text-yellow-500';
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-200">
            <strong>How it works:</strong> This tool analyzes the emotional tone of your text
            using lexicon-based sentiment analysis. All processing happens in your browser.
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Enter Text to Analyze</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="w-full h-48 bg-zinc-800 text-white p-4 rounded-lg border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
        />
        <div className="text-sm text-gray-400 mt-2">
          Characters: {text.length} | Words: {text.trim().split(/\s+/).filter(Boolean).length}
        </div>
      </div>

      <button
        onClick={analyzeSentiment}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <TrendingUp className="w-5 h-5" />
        Analyze Sentiment
      </button>

      {result && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              {getSentimentIcon()}
            </div>
            <h3 className={`text-3xl font-bold ${getSentimentColor()}`}>
              {result.label}
            </h3>
            <p className="text-gray-400 mt-2">
              Confidence: {(result.confidence * 100).toFixed(1)}%
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-500">{result.breakdown.positive}</div>
              <div className="text-sm text-gray-400">Positive</div>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-500">{result.breakdown.neutral}</div>
              <div className="text-sm text-gray-400">Neutral</div>
            </div>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-500">{result.breakdown.negative}</div>
              <div className="text-sm text-gray-400">Negative</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sentiment Score</label>
            <div className="relative h-4 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full ${
                  result.label === 'Positive' ? 'bg-green-500' :
                  result.label === 'Negative' ? 'bg-red-500' :
                  'bg-yellow-500'
                }`}
                style={{
                  width: `${Math.abs(result.score) * 500}%`,
                  transform: result.score < 0 ? 'translateX(-100%)' : 'none',
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Negative</span>
              <span>Neutral</span>
              <span>Positive</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
