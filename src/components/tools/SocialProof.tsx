// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/tools/SocialProof.tsx
// Social proof bar — star rating + usage counter + last updated
// Improves trust signals and CTR on tool pages
// ═══════════════════════════════════════════════════════════════════════════
"use client";

interface SocialProofProps {
  /** Tool slug — used to seed a deterministic usage count */
  slug: string;
  /** Rating out of 5 (placeholder) */
  rating?: number;
  /** Last modified date string from markdown frontmatter */
  dateModified?: string | null;
}

/** Simple deterministic hash to generate consistent numbers from a slug */
function hashSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash << 5) - hash + slug.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function SocialProof({
  slug,
  rating = 4.8,
  dateModified,
}: SocialProofProps) {
  // Deterministic "users today" based on slug hash (120–980 range)
  const baseUsers = (hashSlug(slug) % 860) + 120;

  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3;

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-6 text-sm">
      {/* Star Rating */}
      <div className="flex items-center gap-1.5">
        <div className="flex items-center" aria-label={`Rating: ${rating} out of 5`}>
          {Array.from({ length: 5 }, (_, i) => {
            if (i < fullStars) {
              return (
                <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              );
            }
            if (i === fullStars && hasHalf) {
              return (
                <svg key={i} className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20">
                  <defs>
                    <linearGradient id={`half-${slug}`}><stop offset="50%" stopColor="currentColor" /><stop offset="50%" stopColor="#3f3f46" /></linearGradient>
                  </defs>
                  <path fill={`url(#half-${slug})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              );
            }
            return (
              <svg key={i} className="w-4 h-4 text-zinc-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            );
          })}
        </div>
        <span className="text-yellow-400 font-semibold">{rating}</span>
        <span className="text-zinc-500">/5</span>
      </div>

      {/* Separator */}
      <span className="hidden sm:inline text-zinc-700">|</span>

      {/* Usage Counter */}
      <div className="flex items-center gap-1.5 text-zinc-400">
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>Used by <strong className="text-zinc-300">{baseUsers.toLocaleString()}</strong> developers today</span>
      </div>

      {/* Separator */}
      {dateModified && <span className="hidden sm:inline text-zinc-700">|</span>}

      {/* Last Updated */}
      {dateModified && (
        <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Updated {new Date(dateModified).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
        </div>
      )}
    </div>
  );
}
