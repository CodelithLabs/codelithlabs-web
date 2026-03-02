// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/blog/GiscusComments.tsx
// GitHub Discussions-powered comments via Giscus
// Setup: Enable Discussions on CodelithLabs/codelithlabs-web repo
// Install Giscus app: https://github.com/apps/giscus
// ═══════════════════════════════════════════════════════════════════════════

'use client';

import { useEffect, useRef } from 'react';

interface GiscusCommentsProps {
  /** Maps to a specific discussion (typically the blog post slug) */
  term: string;
}

export function GiscusComments({ term }: GiscusCommentsProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Don't double-mount
    if (ref.current.querySelector('.giscus')) return;

    const repo = process.env.NEXT_PUBLIC_GISCUS_REPO || 'CodelithLabs/codelithlabs-web';
    const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID || '';
    const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY || 'Blog Comments';
    const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || '';

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', repo);
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', category);
    script.setAttribute('data-category-id', categoryId);
    script.setAttribute('data-mapping', 'specific');
    script.setAttribute('data-term', term);
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', 'noborder_dark');
    script.setAttribute('data-lang', 'en');
    script.setAttribute('data-loading', 'lazy');
    script.crossOrigin = 'anonymous';
    script.async = true;

    const container = ref.current;
    container.appendChild(script);

    return () => {
      // Cleanup on unmount - use captured container ref
      const giscusFrame = container?.querySelector('.giscus');
      if (giscusFrame) giscusFrame.remove();
    };
  }, [term]);

  return (
    <div className="mt-12 pt-8 border-t border-zinc-800">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        Comments
      </h2>
      <div ref={ref} />
    </div>
  );
}
