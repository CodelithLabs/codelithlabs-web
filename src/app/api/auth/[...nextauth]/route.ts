// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/api/auth/[...nextauth]/route.ts
// NextAuth.js v5 catch-all API route handler
// ═══════════════════════════════════════════════════════════════════════════

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
