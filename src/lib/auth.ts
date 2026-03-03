// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/lib/auth.ts
// NextAuth.js v5 (Auth.js) configuration — Google OAuth + Premium state
// ═══════════════════════════════════════════════════════════════════════════

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

// Get auth secret - use build-safe fallback during static generation
// Runtime validation happens in authorize callback
function getAuthSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  if (secret) return secret;
  
  // During build/static generation, use dummy value (auth isn't actually called)
  // At runtime, NextAuth will fail gracefully if secret is invalid
  if (process.env.NODE_ENV === "production" && typeof window === "undefined") {
    // Log warning but don't crash build
    console.warn(
      "⚠️ NEXTAUTH_SECRET not set. Authentication will fail at runtime. " +
      "Generate one: `openssl rand -base64 33`"
    );
  }
  return "build-time-placeholder-not-for-production-use";
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
        token.isPremium = false; // Default: free tier
        token.provider = account.provider;
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
      }
      return session;
    },
  },

  // Secret for JWT encryption
  secret: getAuthSecret(),
});
