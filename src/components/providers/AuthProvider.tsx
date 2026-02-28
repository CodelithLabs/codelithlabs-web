// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/providers/AuthProvider.tsx
// SessionProvider wrapper for NextAuth.js v5 — must be a client component
// ═══════════════════════════════════════════════════════════════════════════
"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
