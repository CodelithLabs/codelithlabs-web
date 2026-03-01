// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/tools/ShareButtons.tsx
// Social sharing buttons for tool pages
// ═══════════════════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import { Share2, Twitter, Linkedin, Link2, Check } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description: string;
}

export function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description);

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: '#1DA1F2',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: '#0A66C2',
    },
    {
      name: 'WhatsApp',
      icon: Share2,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: '#25D366',
    },
    {
      name: 'Reddit',
      icon: Share2,
      href: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      color: '#FF4500',
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description, url });
      } catch {
        // User cancelled the share
      }
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-zinc-500 font-medium mr-1">Share:</span>

      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg border border-zinc-700/50 bg-zinc-800/30 hover:bg-zinc-800
                     text-zinc-400 hover:text-white transition-all group"
          aria-label={`Share on ${link.name}`}
          title={`Share on ${link.name}`}
        >
          <link.icon className="w-3.5 h-3.5" />
        </a>
      ))}

      {/* Copy link button */}
      <button
        onClick={copyLink}
        className={`p-2 rounded-lg border transition-all ${
          copied
            ? 'border-green-500/50 bg-green-500/10 text-green-400'
            : 'border-zinc-700/50 bg-zinc-800/30 hover:bg-zinc-800 text-zinc-400 hover:text-white'
        }`}
        aria-label="Copy link"
        title="Copy link"
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
      </button>

      {/* Native share (mobile) */}
      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <button
          onClick={handleNativeShare}
          className="p-2 rounded-lg border border-zinc-700/50 bg-zinc-800/30 hover:bg-zinc-800
                     text-zinc-400 hover:text-white transition-all sm:hidden"
          aria-label="Share"
          title="Share"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
