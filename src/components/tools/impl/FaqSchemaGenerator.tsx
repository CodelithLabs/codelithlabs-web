'use client';
import { useState, useCallback, memo } from 'react';
import { HelpCircle, Copy, Plus, Trash2, Download, Check } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FaqSchemaGeneratorComponent = function FaqSchemaGenerator() {
  const [faqs, setFaqs] = useState<FaqItem[]>([
    { question: 'What is your return policy?', answer: 'We offer a 30-day return policy for all products in original condition.' },
    { question: 'How long does shipping take?', answer: 'Standard shipping takes 3-5 business days. Express shipping is available for 1-2 day delivery.' },
  ]);
  const [copied, setCopied] = useState(false);

  const addFaq = useCallback(() => {
    setFaqs(prev => [...prev, { question: '', answer: '' }]);
  }, []);

  const removeFaq = useCallback((idx: number) => {
    setFaqs(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const updateFaq = useCallback((idx: number, field: 'question' | 'answer', value: string) => {
    setFaqs(prev => prev.map((f, i) => i === idx ? { ...f, [field]: value } : f));
  }, []);

  const generateSchema = useCallback(() => {
    const validFaqs = faqs.filter(f => f.question.trim() && f.answer.trim());
    
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': validFaqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer,
        },
      })),
    };

    return JSON.stringify(schema, null, 2);
  }, [faqs]);

  const generateHtml = useCallback(() => {
    return `<script type="application/ld+json">
${generateSchema()}
</script>`;
  }, [generateSchema]);

  const copyToClipboard = (type: 'json' | 'html') => {
    navigator.clipboard.writeText(type === 'json' ? generateSchema() : generateHtml());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([generateSchema()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'faq-schema.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const validCount = faqs.filter(f => f.question.trim() && f.answer.trim()).length;

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <HelpCircle className="w-4 h-4 inline mr-2" />
        <strong>FAQ Schema Generator:</strong> Create Google-compliant FAQPage structured data for rich search results. Add FAQ items and export ready-to-use JSON-LD.
      </div>

      {/* FAQ Items */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <div className="flex-1 space-y-2">
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Question {idx + 1}</label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                    placeholder="What is your question?"
                    className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Answer</label>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                    placeholder="The answer to the question..."
                    rows={3}
                    className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm resize-y"
                  />
                </div>
              </div>
              <button
                onClick={() => removeFaq(idx)}
                disabled={faqs.length === 1}
                className="p-2 text-zinc-500 hover:text-red-400 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            {faq.question.trim() && faq.answer.trim() && (
              <div className="mt-2 flex items-center gap-1 text-green-400 text-xs">
                <Check className="w-3 h-3" />
                Valid FAQ item
              </div>
            )}
          </div>
        ))}

        <button
          onClick={addFaq}
          className="w-full py-2 border border-dashed border-zinc-700 hover:border-zinc-600 rounded-lg text-zinc-400 hover:text-zinc-300 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add FAQ Item
        </button>
      </div>

      {/* Stats */}
      <div className="text-sm text-zinc-400">
        {validCount} of {faqs.length} FAQ items valid
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => copyToClipboard('json')}
          className="flex-1 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg flex items-center justify-center gap-2 text-sm"
        >
          <Copy className="w-4 h-4" />
          {copied ? 'Copied!' : 'Copy JSON-LD'}
        </button>
        <button
          onClick={() => copyToClipboard('html')}
          className="flex-1 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg flex items-center justify-center gap-2 text-sm"
        >
          <Copy className="w-4 h-4" />
          Copy with Script Tag
        </button>
        <button
          onClick={downloadFile}
          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 text-sm"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>

      {/* Preview */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-zinc-400">Generated Schema</h4>
        <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-300 font-mono overflow-auto max-h-64">
          {generateSchema()}
        </pre>
      </div>

      {/* Tips */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-400">
        <strong className="text-zinc-300">Best Practices:</strong>
        <ul className="mt-1 space-y-1">
          <li>• Keep answers concise but complete</li>
          <li>• Use real questions your customers ask</li>
          <li>• Don&apos;t use FAQPage for promotional content</li>
          <li>• Add schema to pages where FAQs are visible to users</li>
          <li>• Test with Google&apos;s Rich Results Test</li>
        </ul>
      </div>
    </div>
  );
};

export default memo(FaqSchemaGeneratorComponent);
