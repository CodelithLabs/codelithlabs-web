// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/lib/auth.ts
// NextAuth.js v5 (Auth.js) configuration — Google OAuth + Premium state
// ═══════════════════════════════════════════════════════════════════════════

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { isPremiumActive } from "@/lib/premium-membership";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

// Get auth secret - fail fast in production if not set
function getAuthSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  
  if (!secret) {
    // During build-time static generation, use placeholder (auth not actually invoked)
    // Check if we're in a build context
    const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' ||
                       process.env.NEXT_PHASE === 'phase-development-server';
    
    if (isBuildTime) {
      return "build-time-placeholder-not-for-production-use";
    }
    
    // At runtime, throw error
    throw new Error(
      "CRITICAL: NEXTAUTH_SECRET environment variable is not set. " +
      "Generate a secure secret with: openssl rand -base64 33"
    );
  }
  
  return secret;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: googleClientId && googleClientSecret
    ? [
        Google({
          clientId: googleClientId,
          clientSecret: googleClientSecret,
          authorization: {
            params: {
              prompt: "consent",
              access_type: "offline",
              response_type: "code",
            },
          },
        }),
      ]
    : [],

  // Pages — customise sign-in UI later
  pages: {
    signIn: "/auth/signin",
    // error: "/auth/error",
  },

  callbacks: {
    /**
     * JWT callback — attach custom fields to the token.
     * `isPremium` defaults to false. Once Razorpay webhook confirms payment,
     * flip this via a database lookup.
     */
    async jwt({ token, user, account }) {
      if (account && user) {
        token.provider = account.provider;
      }

      if (!token.email) {
        token.isPremium = false;
        token.premiumExpiresAt = null;
        return token;
      }

      if (!isDatabaseConfigured()) {
        token.isPremium = false;
        token.premiumExpiresAt = null;
        return token;
      }

      try {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: {
            isPremium: true,
            premiumExpiresAt: true,
          },
        });

        const premiumActive = isPremiumActive(dbUser?.isPremium ?? false, dbUser?.premiumExpiresAt ?? null);
        token.isPremium = premiumActive;
        token.premiumExpiresAt = dbUser?.premiumExpiresAt?.toISOString() ?? null;
      } catch (error) {
        console.error("[Auth] Failed to load premium status from DB:", error);
        token.isPremium = false;
        token.premiumExpiresAt = null;
      }

      return token;
    },

    /**
     * Session callback — expose custom fields to the client session.
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.isPremium = (token.isPremium as boolean) ?? false;
        session.user.id = token.sub ?? "";
        session.user.premiumExpiresAt = (token.premiumExpiresAt as string | null) ?? null;
      }
      return session;
    },
  },

  // Secret for JWT encryption
  secret: getAuthSecret(),
});
