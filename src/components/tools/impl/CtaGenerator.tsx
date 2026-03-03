'use client';

import { memo, useState, useCallback } from 'react';

const ctaTemplates = {
  signup: [
    'Get Started Free',
    'Sign Up Now',
    'Create Your Account',
    'Join {{count}}+ Users Today',
    'Start Your Free Trial',
    'Get Instant Access',
  ],
  buy: [
    'Buy Now',
    'Add to Cart',
    'Get Yours Today',
    'Shop Now',
    'Unlock {{benefit}}',
    'Claim Your {{product}}',
  ],
  learn: [
    'Learn More',
    'Discover How',
    'See How It Works',
    'Find Out More',
    'Explore {{topic}}',
    'See the Difference',
  ],
  download: [
    'Download Free',
    'Get Your Copy',
    'Download Now',
    'Get the {{resource}}',
    'Grab Your Free {{resource}}',
    'Access Now',
  ],
  contact: [
    'Contact Us',
    'Get in Touch',
    'Book a Call',
    'Schedule a Demo',
    'Talk to an Expert',
    'Request a Quote',
  ],
  subscribe: [
    'Subscribe Now',
    'Join Our Newsletter',
    'Stay Updated',
    'Get Weekly Tips',
    'Never Miss an Update',
    'Join {{count}}+ Subscribers',
  ],
};

const urgencyWords = ['Now', 'Today', 'Limited Time', 'Last Chance', "Don't Miss Out", 'Before It\'s Gone', 'Exclusive Offer', 'Only {{count}} Left'];
const benefitWords = ['Free', 'Instant', 'Save {{amount}}', 'Get {{benefit}}', 'Unlock', 'Discover', 'Transform', 'Boost'];

function CtaGenerator() {
  const [category, setCategory] = useState<keyof typeof ctaTemplates>('signup');
  const [product, setProduct] = useState('');
  const [benefit, setBenefit] = useState('');
  const [count, setCount] = useState('10,000');
  const [includeUrgency, setIncludeUrgency] = useState(false);
  const [includeBenefit, setIncludeBenefit] = useState(false);
  const [result, setResult] = useState<string[]>([]);

  const handleGenerate = useCallback(() => {
    const templates = ctaTemplates[category];
    const generated: string[] = [];

    // Generate base CTAs
    templates.forEach(template => {
      let cta = template
        .replace('{{product}}', product || 'Product')
        .replace('{{benefit}}', benefit || 'Premium Access')
        .replace('{{count}}', count)
        .replace('{{topic}}', product || 'Our Solutions')
        .replace('{{resource}}', product || 'Guide');
      generated.push(cta);
    });

    // Add urgency variations
    if (includeUrgency) {
      const baseCtAs = [...generated];
      urgencyWords.forEach(urgency => {
        const baseCTA = baseCtAs[Math.floor(Math.random() * baseCtAs.length)];
        const urgencyText = urgency.replace('{{count}}', count);
        generated.push(`${urgencyText} - ${baseCTA}`);
      });
    }

    // Add benefit variations
    if (includeBenefit) {
      benefitWords.forEach(word => {
        const benefitText = word
          .replace('{{amount}}', '50%')
          .replace('{{benefit}}', benefit || 'Results');
        generated.push(`${benefitText} → ${ctaTemplates[category][0]}`);
      });
    }

    // Shuffle and limit
    const shuffled = generated.sort(() => Math.random() - 0.5).slice(0, 15);
    setResult(shuffled);
  }, [category, product, benefit, count, includeUrgency, includeBenefit]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">CTA Generator</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">CTA Type</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as keyof typeof ctaTemplates)}
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="signup">Sign Up / Registration</option>
              <option value="buy">Purchase / E-commerce</option>
              <option value="learn">Learn More</option>
              <option value="download">Download / Lead Magnet</option>
              <option value="contact">Contact / Demo</option>
              <option value="subscribe">Subscribe / Newsletter</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Product/Service Name (optional)</label>
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="e.g., Premium Plan"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Key Benefit (optional)</label>
              <input
                type="text"
                value={benefit}
                onChange={(e) => setBenefit(e.target.value)}
                placeholder="e.g., 2x Productivity"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Social Proof Number (optional)</label>
            <input
              type="text"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              placeholder="e.g., 10,000"
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeUrgency}
                onChange={(e) => setIncludeUrgency(e.target.checked)}
                className="mr-2"
              />
              <span className="text-zinc-300 text-sm">Include Urgency Elements</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeBenefit}
                onChange={(e) => setIncludeBenefit(e.target.checked)}
                className="mr-2"
              />
              <span className="text-zinc-300 text-sm">Include Benefit Prefixes</span>
            </label>
          </div>
          <button
            onClick={handleGenerate}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Generate CTAs
          </button>
        </div>
      </div>

      {result.length > 0 && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Generated CTAs</h3>
          <div className="space-y-3">
            {result.map((cta, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-zinc-900 rounded-lg p-4 border border-zinc-700 hover:border-blue-500 transition-colors"
              >
                <span className="text-green-400 font-medium">{cta}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(cta)}
                  className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded transition-colors"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(CtaGenerator);
