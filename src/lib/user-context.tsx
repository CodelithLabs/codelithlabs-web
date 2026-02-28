// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/lib/user-context.tsx
// User context providing premium state derived from NextAuth session
// ═══════════════════════════════════════════════════════════════════════════
"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
} from "react";
import { useSession } from "next-auth/react";

// ─── Types ───────────────────────────────────────────────────────────────

interface UserContextValue {
  /** The user object from the session, or null if not logged in */
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    isPremium: boolean;
  } | null;
  /** Whether the user has an active premium (ad-free) membership */
  isPremium: boolean;
  /** Whether the session is still loading */
  isLoading: boolean;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
}

// ─── Context ─────────────────────────────────────────────────────────────

const UserContext = createContext<UserContextValue>({
  user: null,
  isPremium: false,
  isLoading: true,
  isAuthenticated: false,
});

// ─── Provider ────────────────────────────────────────────────────────────

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const value = useMemo<UserContextValue>(() => {
    const isLoading = status === "loading";
    const isAuthenticated = status === "authenticated" && !!session?.user;
    const user = isAuthenticated ? (session.user as UserContextValue["user"]) : null;
    const isPremium = user?.isPremium ?? false;

    return { user, isPremium, isLoading, isAuthenticated };
  }, [session, status]);

  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (ctx === undefined) {
    throw new Error("useUser must be used within a <UserProvider>");
  }
  return ctx;
}
