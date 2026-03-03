'use client';
import { useState, useCallback, memo } from 'react';
import { MessageCircle, Copy, Star, Sparkles, RefreshCw } from 'lucide-react';

type ReviewTone = 'professional' | 'friendly' | 'empathetic' | 'formal';
type ReviewSentiment = 'positive' | 'neutral' | 'negative';

interface ReviewTemplate {
  sentiment: ReviewSentiment;
  issue?: string;
  template: string;
}

const RESPONSE_TEMPLATES: ReviewTemplate[] = [
  // Positive
  {
    sentiment: 'positive',
    template: "Thank you so much for your wonderful review, {name}! We're thrilled to hear you had such a great experience with us. Your kind words mean the world to our team. We look forward to serving you again soon!",
  },
  {
    sentiment: 'positive',
    template: "Wow, {name}! Thank you for this amazing feedback! It's customers like you that make our work so rewarding. We're so glad we could exceed your expectations. See you next time!",
  },
  {
    sentiment: 'positive',
    template: "Hi {name}, thank you for taking the time to share your experience! We're delighted that you enjoyed {specific}. Your satisfaction is our top priority, and it's great to know we hit the mark!",
  },
  // Neutral
  {
    sentiment: 'neutral',
    template: "Thank you for your feedback, {name}. We appreciate you taking the time to share your thoughts. We're always looking for ways to improve, and your input is valuable. Please don't hesitate to reach out if there's anything specific we can do better.",
  },
  {
    sentiment: 'neutral',
    template: "Hi {name}, thanks for sharing your experience. We're glad some aspects met your expectations, and we'd love to make your next visit even better. Feel free to contact us directly at {contact} to discuss any suggestions.",
  },
  // Negative
  {
    sentiment: 'negative',
    issue: 'service',
    template: "Dear {name}, we sincerely apologize for the service experience you described. This falls short of our standards, and we take your feedback very seriously. We'd like to make this right. Please reach out to us at {contact} so we can discuss this further and ensure it doesn't happen again.",
  },
  {
    sentiment: 'negative',
    issue: 'quality',
    template: "Thank you for bringing this to our attention, {name}. We're truly sorry the quality didn't meet your expectations. This is not the experience we want for our customers. Please contact us at {contact} - we'd like to make it up to you and address the issues you experienced.",
  },
  {
    sentiment: 'negative',
    issue: 'wait',
    template: "{name}, we apologize for the long wait time you experienced. We understand how valuable your time is, and we're working to address this issue. Thank you for your patience and for letting us know. We're committed to improving and hope you'll give us another chance.",
  },
  {
    sentiment: 'negative',
    issue: 'general',
    template: "Dear {name}, we're sorry to hear about your experience. We take all feedback seriously and want to make things right. Please reach out to us directly at {contact} so we can better understand what happened and find a resolution. Your satisfaction matters to us.",
  },
];

const ReviewResponseGeneratorComponent = function ReviewResponseGenerator() {
  const [reviewerName, setReviewerName] = useState('');
  const [sentiment, setSentiment] = useState<ReviewSentiment>('positive');
  const [rating, setRating] = useState(5);
  const [issue, setIssue] = useState('');
  const [specificMention, setSpecificMention] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [tone, setTone] = useState<ReviewTone>('professional');
  const [customNotes, setCustomNotes] = useState('');
  const [response, setResponse] = useState('');
  const [copied, setCopied] = useState(false);

  const generateResponse = useCallback(() => {
    // Find appropriate template
    let templates = RESPONSE_TEMPLATES.filter(t => t.sentiment === sentiment);
    if (sentiment === 'negative' && issue) {
      templates = templates.filter(t => t.issue === issue || t.issue === 'general');
    }

    // Select random template
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    // Replace placeholders
    let result = template.template
      .replace(/{name}/g, reviewerName || 'there')
      .replace(/{specific}/g, specificMention || 'your visit')
      .replace(/{contact}/g, contactInfo || 'our customer service team');

    // Apply tone adjustments
    if (tone === 'friendly') {
      result = result.replace(/Dear /g, 'Hey ').replace(/sincerely/g, 'really');
    } else if (tone === 'formal') {
      result = result.replace(/Wow, /g, '').replace(/!/g, '.').replace(/We're thrilled/g, 'We are pleased');
    } else if (tone === 'empathetic') {
      result = result.replace(/We sincerely apologize/g, 'We completely understand your frustration and sincerely apologize');
    }

    // Add custom notes if provided
    if (customNotes) {
      result += ` ${customNotes}`;
    }

    // Add signature
    result += '\n\n- The [Business Name] Team';

    setResponse(result);
  }, [reviewerName, sentiment, issue, specificMention, contactInfo, tone, customNotes]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSentimentChange = (newSentiment: ReviewSentiment) => {
    setSentiment(newSentiment);
    if (newSentiment === 'positive') setRating(5);
    else if (newSentiment === 'neutral') setRating(3);
    else setRating(1);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <MessageCircle className="w-4 h-4 inline mr-2" />
        <strong>Review Response Generator:</strong> Create professional, personalized responses to customer reviews. Customize tone and handle positive, neutral, or negative feedback.
      </div>

      {/* Review Details */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-4">
        <h4 className="text-sm font-medium text-zinc-300">Review Details</h4>

        {/* Sentiment */}
        <div>
          <label className="text-xs text-zinc-500 block mb-2">Review Sentiment</label>
          <div className="flex gap-2">
            {(['positive', 'neutral', 'negative'] as ReviewSentiment[]).map(s => (
              <button
                key={s}
                onClick={() => handleSentimentChange(s)}
                className={`flex-1 py-2 rounded-lg text-sm capitalize ${
                  sentiment === s
                    ? s === 'positive' ? 'bg-green-600 text-white'
                    : s === 'neutral' ? 'bg-yellow-600 text-white'
                    : 'bg-red-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Rating Display */}
        <div>
          <label className="text-xs text-zinc-500 block mb-2">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="p-1"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= rating
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-zinc-600'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Reviewer Name</label>
            <input
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Customer's name"
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Your Contact Info</label>
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="email@business.com or phone"
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
        </div>

        {sentiment === 'negative' && (
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Main Issue</label>
            <select
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            >
              <option value="">Select issue type...</option>
              <option value="service">Poor Service</option>
              <option value="quality">Quality Issues</option>
              <option value="wait">Long Wait Times</option>
              <option value="general">General Complaint</option>
            </select>
          </div>
        )}

        {sentiment === 'positive' && (
          <div>
            <label className="text-xs text-zinc-500 block mb-1">What They Specifically Liked</label>
            <input
              type="text"
              value={specificMention}
              onChange={(e) => setSpecificMention(e.target.value)}
              placeholder="e.g., the friendly staff, quick service, great food"
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
        )}

        {/* Tone */}
        <div>
          <label className="text-xs text-zinc-500 block mb-2">Response Tone</label>
          <div className="flex flex-wrap gap-2">
            {(['professional', 'friendly', 'empathetic', 'formal'] as ReviewTone[]).map(t => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`px-3 py-1.5 rounded-lg text-sm capitalize ${
                  tone === t
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Notes */}
        <div>
          <label className="text-xs text-zinc-500 block mb-1">Additional Notes (optional)</label>
          <input
            type="text"
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            placeholder="Any additional details to include..."
            className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
          />
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generateResponse}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        Generate Response
      </button>

      {/* Response Output */}
      {response && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-zinc-400">Generated Response</h4>
            <div className="flex gap-2">
              <button
                onClick={generateResponse}
                className="text-xs text-zinc-400 hover:text-zinc-300 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Regenerate
              </button>
              <button
                onClick={copyToClipboard}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <p className="text-sm text-zinc-300 whitespace-pre-wrap">{response}</p>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-400">
        <strong className="text-zinc-300">Best Practices:</strong>
        <ul className="mt-1 space-y-1">
          <li>• Respond to all reviews, positive and negative, within 24-48 hours</li>
          <li>• Always thank the reviewer for their feedback</li>
          <li>• For negative reviews, take the conversation offline</li>
          <li>• Don&apos;t copy-paste the same response - personalize each one</li>
          <li>• Keep responses concise but genuine</li>
        </ul>
      </div>
    </div>
  );
};

export default memo(ReviewResponseGeneratorComponent);
