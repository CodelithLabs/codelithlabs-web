'use client';
import { useState, useCallback, memo } from 'react';
import { HelpCircle, Copy, Sparkles, Plus, Trash2 } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const TextToFaqComponent = function TextToFaq() {
  const [input, setInput] = useState('');
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [maxFaqs, setMaxFaqs] = useState(5);
  const [copied, setCopied] = useState(false);

  const generateFaqs = useCallback(() => {
    if (!input.trim()) return;

    const sentences = input
      .replace(/([.!?])\s+/g, '$1|')
      .split('|')
      .map(s => s.trim())
      .filter(s => s.length > 20);

    // Extract existing questions
    const existingQuestions = sentences.filter(s => s.endsWith('?'));

    // Common question prefixes to generate
    const questionPrefixes = [
      'What is', 'How does', 'Why is', 'When should', 'Who can',
      'What are the benefits of', 'How can you', 'What makes',
    ];

    // Extract key nouns and phrases for question generation
    const keyPhrases: string[] = [];
    sentences.forEach(s => {
      const matches = s.match(/(?:the |a |an )?([A-Z][a-z]+(?:\s+[a-z]+){0,2})/g);
      if (matches) {
        matches.forEach(m => {
          const phrase = m.replace(/^(the |a |an )/i, '').trim();
          if (phrase.length > 3 && !keyPhrases.includes(phrase)) {
            keyPhrases.push(phrase);
          }
        });
      }
    });

    const generatedFaqs: FaqItem[] = [];

    // Add existing questions first
    existingQuestions.slice(0, Math.floor(maxFaqs / 2)).forEach(q => {
      // Find a relevant answer from the text
      const answer = sentences.find(s => 
        !s.endsWith('?') && 
        s.length > 50 &&
        keyPhrases.some(phrase => s.toLowerCase().includes(phrase.toLowerCase()))
      ) || sentences.find(s => !s.endsWith('?') && s.length > 50) || '';
      
      if (answer) {
        generatedFaqs.push({ question: q, answer });
      }
    });

    // Generate new questions from content
    keyPhrases.slice(0, maxFaqs - generatedFaqs.length).forEach((phrase, idx) => {
      const prefix = questionPrefixes[idx % questionPrefixes.length];
      const question = `${prefix} ${phrase.toLowerCase()}?`;
      
      // Find relevant answer
      const answer = sentences.find(s => 
        !s.endsWith('?') && 
        s.toLowerCase().includes(phrase.toLowerCase())
      ) || sentences[idx] || '';

      if (answer && !generatedFaqs.some(f => f.question.toLowerCase() === question.toLowerCase())) {
        generatedFaqs.push({ 
          question: question.charAt(0).toUpperCase() + question.slice(1), 
          answer 
        });
      }
    });

    // Fill remaining slots with general questions
    while (generatedFaqs.length < maxFaqs && sentences.length > generatedFaqs.length) {
      const idx = generatedFaqs.length;
      const sentence = sentences[idx];
      if (sentence && !sentence.endsWith('?')) {
        const words = sentence.split(' ').slice(0, 3).join(' ');
        generatedFaqs.push({
          question: `What about ${words.toLowerCase()}?`,
          answer: sentence,
        });
      } else {
        break;
      }
    }

    setFaqs(generatedFaqs.slice(0, maxFaqs));
  }, [input, maxFaqs]);

  const updateFaq = (idx: number, field: 'question' | 'answer', value: string) => {
    setFaqs(prev => prev.map((faq, i) => 
      i === idx ? { ...faq, [field]: value } : faq
    ));
  };

  const removeFaq = (idx: number) => {
    setFaqs(prev => prev.filter((_, i) => i !== idx));
  };

  const addFaq = () => {
    setFaqs(prev => [...prev, { question: '', answer: '' }]);
  };

  const copyFaqs = useCallback(() => {
    const text = faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [faqs]);

  const copySchema = useCallback(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(f => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.answer
        }
      }))
    };
    navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [faqs]);

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <HelpCircle className="w-4 h-4 inline mr-2" />
        <strong>Text to FAQ:</strong> Convert any content into a FAQ format. Automatically generates questions and extracts answers from your text.
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Paste your content:
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your article, documentation, or any content to convert into FAQ format..."
          className="w-full h-40 bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-white placeholder-zinc-500 resize-y focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex items-center gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Number of FAQs</label>
          <select
            value={maxFaqs}
            onChange={(e) => setMaxFaqs(Number(e.target.value))}
            className="bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700"
          >
            {[3, 5, 7, 10].map(n => (
              <option key={n} value={n}>{n} FAQs</option>
            ))}
          </select>
        </div>
        <button
          onClick={generateFaqs}
          disabled={!input.trim()}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg flex items-center justify-center gap-2 mt-5"
        >
          <Sparkles className="w-4 h-4" />
          Generate FAQs
        </button>
      </div>

      {faqs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Generated FAQs ({faqs.length})</h3>
            <div className="flex gap-2">
              <button
                onClick={copyFaqs}
                className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded-lg flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
              <button
                onClick={copySchema}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                Copy Schema
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 font-semibold shrink-0">Q{idx + 1}:</span>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                    className="flex-1 bg-transparent text-white focus:outline-none"
                    placeholder="Enter question..."
                  />
                  <button
                    onClick={() => removeFaq(idx)}
                    className="p-1 text-zinc-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400 font-semibold shrink-0">A:</span>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                    className="flex-1 bg-zinc-800 text-zinc-300 rounded p-2 text-sm resize-y min-h-[60px]"
                    placeholder="Enter answer..."
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addFaq}
            className="w-full py-2 border border-dashed border-zinc-700 hover:border-zinc-600 rounded-lg text-zinc-400 hover:text-zinc-300 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add FAQ
          </button>
        </div>
      )}
    </div>
  );
};

export default memo(TextToFaqComponent);
