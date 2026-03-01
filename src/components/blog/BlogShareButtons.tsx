// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/blog/BlogShareButtons.tsx
// Client wrapper for ShareButtons used on blog post pages.
// Blog pages are server components, so this thin wrapper provides the
// 'use client' boundary needed for the interactive share buttons.
// ═══════════════════════════════════════════════════════════════════════════

'use client';

import { ShareButtons } from '@/components/tools/ShareButtons';

interface BlogShareButtonsProps {
  url: string;
  title: string;
  description: string;
}

export function BlogShareButtons({ url, title, description }: BlogShareButtonsProps) {
  return <ShareButtons url={url} title={title} description={description} />;
}
