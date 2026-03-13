'use client';

import { useNonce } from '@/app/nonce-context';

interface JsonLdScriptProps {
  data: unknown;
  id?: string;
}

export function JsonLdScript({ data, id }: JsonLdScriptProps) {
  const nonce = useNonce();

  return (
    <script
      id={id}
      suppressHydrationWarning
      nonce={nonce || undefined}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}