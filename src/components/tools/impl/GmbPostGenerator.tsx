'use client';
import { useState, useCallback, memo } from 'react';
import { MapPin, Copy, Calendar, Image, Check, Sparkles } from 'lucide-react';

type PostType = 'UPDATE' | 'EVENT' | 'OFFER' | 'PRODUCT';

interface GmbPost {
  type: PostType;
  title: string;
  description: string;
  ctaType: string;
  ctaUrl: string;
  eventStart?: string;
  eventEnd?: string;
  offerCode?: string;
  terms?: string;
}

const CTA_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'BOOK', label: 'Book' },
  { value: 'ORDER', label: 'Order online' },
  { value: 'BUY', label: 'Buy' },
  { value: 'LEARN_MORE', label: 'Learn more' },
  { value: 'SIGN_UP', label: 'Sign up' },
  { value: 'CALL', label: 'Call now' },
  { value: 'GET_OFFER', label: 'Get offer' },
];

const GmbPostGeneratorComponent = function GmbPostGenerator() {
  const [post, setPost] = useState<GmbPost>({
    type: 'UPDATE',
    title: '',
    description: '',
    ctaType: 'LEARN_MORE',
    ctaUrl: '',
    eventStart: '',
    eventEnd: '',
    offerCode: '',
    terms: '',
  });
  const [copied, setCopied] = useState(false);

  const updatePost = useCallback((field: keyof GmbPost, value: string) => {
    setPost(prev => ({ ...prev, [field]: value }));
  }, []);

  const charCount = post.description.length;
  const maxChars = post.type === 'EVENT' || post.type === 'OFFER' ? 1500 : 1500;
  const titleMaxChars = 58;

  const generatePreview = useCallback(() => {
    let preview = '';
    
    if (post.title) {
      preview += `📌 ${post.title}\n\n`;
    }
    
    preview += post.description;
    
    if (post.type === 'OFFER' && post.offerCode) {
      preview += `\n\n🏷️ Code: ${post.offerCode}`;
    }
    
    if (post.type === 'EVENT' && post.eventStart) {
      const start = new Date(post.eventStart);
      const end = post.eventEnd ? new Date(post.eventEnd) : null;
      preview += `\n\n📅 ${start.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`;
      if (end) {
        preview += ` - ${end.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`;
      }
    }
    
    if (post.ctaType && post.ctaUrl) {
      const ctaLabel = CTA_OPTIONS.find(c => c.value === post.ctaType)?.label;
      preview += `\n\n🔗 [${ctaLabel}](${post.ctaUrl})`;
    }
    
    return preview;
  }, [post]);

  const templates = [
    {
      name: 'New Product',
      post: {
        type: 'PRODUCT' as PostType,
        title: 'New Arrival: [Product Name]',
        description: 'Introducing our latest [product category]! 🎉\n\nPerfect for [target audience/use case]. Features include:\n\n✓ Feature 1\n✓ Feature 2\n✓ Feature 3\n\nAvailable now in-store and online.',
        ctaType: 'BUY',
        ctaUrl: '',
      },
    },
    {
      name: 'Special Offer',
      post: {
        type: 'OFFER' as PostType,
        title: 'Limited Time: 20% Off [Category]',
        description: '🔥 Don&apos;t miss our exclusive offer!\n\nGet 20% off all [products/services] this week only.\n\nWhether you&apos;re looking for [benefit 1] or [benefit 2], now is the perfect time to save.\n\nVisit us today or shop online!',
        ctaType: 'GET_OFFER',
        ctaUrl: '',
        offerCode: 'SAVE20',
        terms: 'Valid until [date]. Cannot be combined with other offers.',
      },
    },
    {
      name: 'Event',
      post: {
        type: 'EVENT' as PostType,
        title: '[Event Name] - Free Admission',
        description: 'Join us for an exciting [event type]! 🎊\n\nWhat to expect:\n• Activity 1\n• Activity 2\n• Refreshments included\n\nPerfect for [audience]. All skill levels welcome!\n\nSpaces are limited - reserve your spot today.',
        ctaType: 'BOOK',
        ctaUrl: '',
        eventStart: '',
        eventEnd: '',
      },
    },
    {
      name: 'Update',
      post: {
        type: 'UPDATE' as PostType,
        title: 'We&apos;re Open for [Season/Holiday]',
        description: '📢 Important Update\n\nWe want to let you know about our [announcement].\n\nHere&apos;s what this means for you:\n• Point 1\n• Point 2\n\nThank you for your continued support! Questions? Give us a call or stop by.',
        ctaType: 'CALL',
        ctaUrl: '',
      },
    },
  ];

  const applyTemplate = (template: typeof templates[0]) => {
    setPost(prev => ({ ...prev, ...template.post }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatePreview());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <MapPin className="w-4 h-4 inline mr-2" />
        <strong>Google Business Profile Post Generator:</strong> Create engaging posts for your Google Business listing. Supports updates, events, offers, and products.
      </div>

      {/* Templates */}
      <div>
        <label className="text-sm font-medium text-zinc-400 block mb-2">Quick Templates</label>
        <div className="flex flex-wrap gap-2">
          {templates.map(t => (
            <button
              key={t.name}
              onClick={() => applyTemplate(t)}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-lg flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Post Type */}
      <div>
        <label className="text-sm font-medium text-zinc-300 block mb-2">Post Type</label>
        <div className="flex gap-2">
          {(['UPDATE', 'EVENT', 'OFFER', 'PRODUCT'] as PostType[]).map(type => (
            <button
              key={type}
              onClick={() => updatePost('type', type)}
              className={`px-4 py-2 rounded-lg text-sm ${
                post.type === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {type.charAt(0) + type.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium text-zinc-300">Title</label>
          <span className={`text-xs ${post.title.length > titleMaxChars ? 'text-red-400' : 'text-zinc-500'}`}>
            {post.title.length}/{titleMaxChars}
          </span>
        </div>
        <input
          type="text"
          value={post.title}
          onChange={(e) => updatePost('title', e.target.value)}
          maxLength={80}
          placeholder="Attention-grabbing title..."
          className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700"
        />
      </div>

      {/* Description */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium text-zinc-300">Description</label>
          <span className={`text-xs ${charCount > maxChars ? 'text-red-400' : 'text-zinc-500'}`}>
            {charCount}/{maxChars}
          </span>
        </div>
        <textarea
          value={post.description}
          onChange={(e) => updatePost('description', e.target.value)}
          rows={6}
          placeholder="Write your post content here..."
          className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 resize-y"
        />
      </div>

      {/* Event Dates */}
      {post.type === 'EVENT' && (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-zinc-300 block mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Start Date
            </label>
            <input
              type="datetime-local"
              value={post.eventStart}
              onChange={(e) => updatePost('eventStart', e.target.value)}
              className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-300 block mb-1">End Date</label>
            <input
              type="datetime-local"
              value={post.eventEnd}
              onChange={(e) => updatePost('eventEnd', e.target.value)}
              className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700"
            />
          </div>
        </div>
      )}

      {/* Offer Details */}
      {post.type === 'OFFER' && (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-zinc-300 block mb-1">Offer Code</label>
            <input
              type="text"
              value={post.offerCode}
              onChange={(e) => updatePost('offerCode', e.target.value)}
              placeholder="e.g., SUMMER20"
              className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-300 block mb-1">Terms & Conditions</label>
            <input
              type="text"
              value={post.terms}
              onChange={(e) => updatePost('terms', e.target.value)}
              placeholder="e.g., Valid until Dec 31"
              className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700"
            />
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-zinc-300 block mb-1">Call to Action</label>
          <select
            value={post.ctaType}
            onChange={(e) => updatePost('ctaType', e.target.value)}
            className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700"
          >
            {CTA_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-300 block mb-1">CTA Link URL</label>
          <input
            type="url"
            value={post.ctaUrl}
            onChange={(e) => updatePost('ctaUrl', e.target.value)}
            placeholder="https://..."
            className="w-full bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700"
          />
        </div>
      </div>

      {/* Actions */}
      <button
        onClick={copyToClipboard}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2"
      >
        <Copy className="w-4 h-4" />
        {copied ? 'Copied!' : 'Copy Post Content'}
      </button>

      {/* Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-zinc-400">Preview</h4>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Image className="w-3 h-3" />
            Add a photo when posting
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-sans">
            {generatePreview() || 'Start typing to see preview...'}
          </pre>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-400">
        <strong className="text-zinc-300">Best Practices:</strong>
        <ul className="mt-1 space-y-1">
          <li>• Include a high-quality photo (1200x900px recommended)</li>
          <li>• Post regularly (1-2 times per week)</li>
          <li>• Use emojis sparingly for visual appeal</li>
          <li>• Include a clear call-to-action</li>
          <li>• Posts expire after 7 days (events stay until date passes)</li>
        </ul>
      </div>
    </div>
  );
};

export default memo(GmbPostGeneratorComponent);
