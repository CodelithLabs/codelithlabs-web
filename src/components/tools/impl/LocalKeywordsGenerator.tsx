'use client';
import { useState, useCallback, memo } from 'react';
import { MapPin, Copy, Sparkles, Download, Check } from 'lucide-react';

interface KeywordData {
  business: string;
  service: string;
  location: string;
  neighborhoods: string;
  modifiers: string[];
}

const MODIFIER_PRESETS = {
  intent: ['near me', 'in [location]', 'best', 'top rated', 'affordable', 'cheap', 'professional', 'reliable', 'trusted', 'local'],
  urgency: ['24 hour', 'emergency', 'same day', 'open now', 'weekend', 'late night'],
  specificity: ['residential', 'commercial', 'for businesses', 'for homes', 'licensed', 'certified', 'insured'],
  comparison: ['vs', 'alternatives', 'reviews', 'prices', 'cost', 'quotes', 'free estimate'],
};

const LocalKeywordsGeneratorComponent = function LocalKeywordsGenerator() {
  const [data, setData] = useState<KeywordData>({
    business: 'plumber',
    service: 'drain cleaning',
    location: 'Austin, TX',
    neighborhoods: 'Downtown, Hyde Park, South Congress',
    modifiers: ['near me', 'best', 'affordable', '24 hour'],
  });
  const [keywords, setKeywords] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const updateData = useCallback((field: keyof KeywordData, value: string | string[]) => {
    setData(prev => ({ ...prev, [field]: value }));
  }, []);

  const toggleModifier = (mod: string) => {
    setData(prev => ({
      ...prev,
      modifiers: prev.modifiers.includes(mod)
        ? prev.modifiers.filter(m => m !== mod)
        : [...prev.modifiers, mod],
    }));
  };

  const generateKeywords = useCallback(() => {
    const results: string[] = [];
    const { business, service, location, neighborhoods, modifiers } = data;
    
    const neighborhoodList = neighborhoods
      .split(',')
      .map(n => n.trim())
      .filter(n => n);

    // Core keywords
    if (business) {
      results.push(business);
      results.push(`${business} ${location}`);
    }

    if (service) {
      results.push(service);
      results.push(`${service} ${location}`);
    }

    if (business && service) {
      results.push(`${service} ${business}`);
      results.push(`${service} ${business} ${location}`);
    }

    // With modifiers
    modifiers.forEach(mod => {
      const modText = mod.replace('[location]', location);
      
      if (business) {
        results.push(`${modText} ${business}`);
        results.push(`${business} ${modText}`);
        results.push(`${modText} ${business} ${location}`);
      }
      
      if (service) {
        results.push(`${modText} ${service}`);
        results.push(`${service} ${modText}`);
      }
    });

    // Neighborhood variations
    neighborhoodList.forEach(neighborhood => {
      if (business) {
        results.push(`${business} ${neighborhood}`);
        results.push(`${business} in ${neighborhood}`);
      }
      if (service) {
        results.push(`${service} ${neighborhood}`);
      }
    });

    // Long-tail combinations
    if (business && service && location) {
      results.push(`best ${business} for ${service} in ${location}`);
      results.push(`${service} services ${location}`);
      results.push(`affordable ${service} ${location}`);
      results.push(`${business} ${service} near me`);
      results.push(`local ${business} ${location}`);
      results.push(`find ${business} in ${location}`);
      results.push(`hire ${business} ${location}`);
    }

    // Question formats
    if (business) {
      results.push(`how much does a ${business} cost in ${location}`);
      results.push(`how to find a good ${business} in ${location}`);
      results.push(`what ${business} should I use in ${location}`);
    }

    // Deduplicate and sort
    const unique = [...new Set(results.map(k => k.toLowerCase().trim()))];
    setKeywords(unique.sort((a, b) => a.length - b.length));
  }, [data]);

  const copyKeywords = (format: 'list' | 'csv' | 'column') => {
    let text = '';
    switch (format) {
      case 'list':
        text = keywords.join('\n');
        break;
      case 'csv':
        text = keywords.join(', ');
        break;
      case 'column':
        text = keywords.map(k => `"${k}"`).join('\n');
        break;
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCsv = () => {
    const csv = 'keyword\n' + keywords.map(k => `"${k}"`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'local-keywords.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <MapPin className="w-4 h-4 inline mr-2" />
        <strong>Local Keywords Generator:</strong> Generate location-based keyword variations for local SEO. Includes modifiers, neighborhoods, and search intent patterns.
      </div>

      {/* Inputs */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Business/Service Type</label>
            <input
              type="text"
              value={data.business}
              onChange={(e) => updateData('business', e.target.value)}
              placeholder="e.g., plumber, dentist, lawyer"
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Specific Service</label>
            <input
              type="text"
              value={data.service}
              onChange={(e) => updateData('service', e.target.value)}
              placeholder="e.g., drain cleaning, teeth whitening"
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Primary Location</label>
            <input
              type="text"
              value={data.location}
              onChange={(e) => updateData('location', e.target.value)}
              placeholder="e.g., Austin, TX"
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Neighborhoods (comma-separated)</label>
            <input
              type="text"
              value={data.neighborhoods}
              onChange={(e) => updateData('neighborhoods', e.target.value)}
              placeholder="e.g., Downtown, Hyde Park, South Congress"
              className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700"
            />
          </div>
        </div>
      </div>

      {/* Modifiers */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-zinc-300 mb-3">Keyword Modifiers</h4>
        {Object.entries(MODIFIER_PRESETS).map(([category, mods]) => (
          <div key={category} className="mb-3">
            <div className="text-xs text-zinc-500 mb-1 capitalize">{category}</div>
            <div className="flex flex-wrap gap-2">
              {mods.map(mod => (
                <button
                  key={mod}
                  onClick={() => toggleModifier(mod)}
                  className={`px-2 py-1 rounded text-xs ${
                    data.modifiers.includes(mod)
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {data.modifiers.includes(mod) && <Check className="w-3 h-3 inline mr-1" />}
                  {mod}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Generate Button */}
      <button
        onClick={generateKeywords}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        Generate Keywords
      </button>

      {/* Results */}
      {keywords.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">{keywords.length} keywords generated</span>
            <div className="flex gap-2">
              <button
                onClick={() => copyKeywords('list')}
                className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-xs rounded"
              >
                <Copy className="w-3 h-3 inline mr-1" />
                {copied ? 'Copied!' : 'Copy List'}
              </button>
              <button
                onClick={() => copyKeywords('csv')}
                className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-xs rounded"
              >
                Copy CSV
              </button>
              <button
                onClick={downloadCsv}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
              >
                <Download className="w-3 h-3 inline mr-1" />
                Download
              </button>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 max-h-80 overflow-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
              {keywords.map((kw, idx) => (
                <div
                  key={idx}
                  className="text-sm text-zinc-300 bg-zinc-800 px-2 py-1 rounded truncate"
                  title={kw}
                >
                  {kw}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Tips */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-400">
        <strong className="text-zinc-300">Usage Tips:</strong>
        <ul className="mt-1 space-y-1">
          <li>• Use these keywords in title tags, meta descriptions, and H1s</li>
          <li>• Create location-specific landing pages for top neighborhoods</li>
          <li>• Add keywords naturally to Google Business Profile description</li>
          <li>• Include in image alt text and internal anchor text</li>
        </ul>
      </div>
    </div>
  );
};

export default memo(LocalKeywordsGeneratorComponent);
