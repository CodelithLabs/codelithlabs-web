'use client';
import { useState } from 'react';
import { Type, Copy, Check, RefreshCw } from 'lucide-react';

export default function FontPairSuggester() {
  const [style, setStyle] = useState<'modern' | 'classic' | 'playful' | 'minimal'>('modern');
  const [copied, setCopied] = useState('');

  const pairings: Record<string, { heading: string; body: string; css: string; description: string }[]> = {
    modern: [
      { heading: 'Inter', body: 'Inter', css: "font-family: 'Inter', sans-serif;", description: 'Clean and versatile, great for web apps' },
      { heading: 'Space Grotesk', body: 'DM Sans', css: "font-family: 'Space Grotesk', sans-serif;", description: 'Geometric heading with friendly body text' },
      { heading: 'Outfit', body: 'Source Sans 3', css: "font-family: 'Outfit', sans-serif;", description: 'Modern geometric pairing with great readability' },
      { heading: 'Syne', body: 'Inter', css: "font-family: 'Syne', sans-serif;", description: 'Bold, distinctive headings with neutral body' },
    ],
    classic: [
      { heading: 'Playfair Display', body: 'Source Serif 4', css: "font-family: 'Playfair Display', serif;", description: 'Elegant serif combination for editorial content' },
      { heading: 'Cormorant', body: 'Proza Libre', css: "font-family: 'Cormorant', serif;", description: 'Luxurious heading with readable body text' },
      { heading: 'Libre Baskerville', body: 'Open Sans', css: "font-family: 'Libre Baskerville', serif;", description: 'Traditional serif heading with modern sans body' },
      { heading: 'Merriweather', body: 'Nunito', css: "font-family: 'Merriweather', serif;", description: 'Warm and inviting, great for blogs' },
    ],
    playful: [
      { heading: 'Fredoka', body: 'Quicksand', css: "font-family: 'Fredoka', sans-serif;", description: 'Rounded and friendly, great for kids/creative' },
      { heading: 'Baloo 2', body: 'Nunito', css: "font-family: 'Baloo 2', cursive;", description: 'Fun, bubbly heading with soft body text' },
      { heading: 'Righteous', body: 'Poppins', css: "font-family: 'Righteous', cursive;", description: 'Retro heading with modern geometric body' },
      { heading: 'Pacifico', body: 'Raleway', css: "font-family: 'Pacifico', cursive;", description: 'Brush script heading with elegant body' },
    ],
    minimal: [
      { heading: 'IBM Plex Sans', body: 'IBM Plex Sans', css: "font-family: 'IBM Plex Sans', sans-serif;", description: 'Clean corporate font with great weight range' },
      { heading: 'Manrope', body: 'Manrope', css: "font-family: 'Manrope', sans-serif;", description: 'Modern geometric sans-serif for everything' },
      { heading: 'Plus Jakarta Sans', body: 'Plus Jakarta Sans', css: "font-family: 'Plus Jakarta Sans', sans-serif;", description: 'Trendy and clean, perfect for SaaS' },
      { heading: 'Albert Sans', body: 'Albert Sans', css: "font-family: 'Albert Sans', sans-serif;", description: 'Geometric and neutral, great for dashboards' },
    ],
  };

  const current = pairings[style] || [];
  const copy = (text: string, label: string) => { navigator.clipboard.writeText(text); setCopied(label); setTimeout(() => setCopied(''), 1500); };

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Type className="w-4 h-4 inline mr-2" /><strong>Font Pair Suggester:</strong> Discover beautiful Google Font pairings for your website. Preview headings and body text combinations.
      </div>
      <div className="flex gap-2">
        {(['modern', 'classic', 'playful', 'minimal'] as const).map(s => (
          <button key={s} onClick={() => setStyle(s)} className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize ${style === s ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-gray-400'}`}>{s}</button>
        ))}
      </div>
      <div className="space-y-4">
        {current.map((pair, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <div className="p-6 bg-white">
              <h3 className="text-black text-2xl font-bold mb-2" style={{ fontFamily: `'${pair.heading}', sans-serif` }}>The Quick Brown Fox</h3>
              <p className="text-gray-700 text-sm leading-relaxed" style={{ fontFamily: `'${pair.body}', sans-serif` }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div><span className="text-sm font-semibold">{pair.heading}</span>{pair.heading !== pair.body && <span className="text-gray-500 text-sm"> + {pair.body}</span>}</div>
                <button onClick={() => copy(`@import url('https://fonts.googleapis.com/css2?family=${pair.heading.replace(/ /g, '+')}:wght@400;700&family=${pair.body.replace(/ /g, '+')}:wght@400;500&display=swap');`, pair.heading)} className="text-gray-400 hover:text-white text-xs flex items-center gap-1">{copied === pair.heading ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />} Copy CSS Import</button>
              </div>
              <div className="text-xs text-gray-500">{pair.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
