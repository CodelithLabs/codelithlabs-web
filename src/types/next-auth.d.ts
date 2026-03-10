// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/types/next-auth.d.ts
// Module augmentation for NextAuth.js v5 — extend session with premium state
// ═══════════════════════════════════════════════════════════════════════════

import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    isPremium?: boolean;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isPremium: boolean;
      premiumExpiresAt?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isPremium?: boolean;
    provider?: string;
    premiumExpiresAt?: string | null;
  }
}
