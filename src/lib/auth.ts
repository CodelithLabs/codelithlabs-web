// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/lib/auth.ts
// NextAuth.js v5 (Auth.js) configuration — Google OAuth + Premium state
// ═══════════════════════════════════════════════════════════════════════════

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: googleClientId && googleClientSecret
    ? [
        Google({
          clientId: googleClientId,
          clientSecret: googleClientSecret,
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
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "codelithlabs-fallback-secret-change-in-production",
});
