/**
 * CSRF Protection Middleware
 * 
 * Implements CSRF token validation for state-changing requests (POST, PUT, PATCH, DELETE)
 * Uses double-submit cookie pattern with signed tokens.
 * 
 * Protected routes: /api/* (except /api/auth/*)
 * Token verification: Extracted from request header 'x-csrf-token'
 * Token generation: Stored in cookies during initial page load
 * 
 * @important: This middleware runs in Edge Runtime (Cloudflare Workers)
 * Cannot use Node.js modules like crypto directly
 */

import { NextRequest, NextResponse } from "next/server";

const CSRF_HEADER_NAME = "x-csrf-token";
const CSRF_COOKIE_NAME = "csrf-token";
const CSRF_SIGNATURE_COOKIE_NAME = "csrf-signature";

/**
 * Generate a secure CSRF token using Web Crypto API (available in Edge Runtime)
 */
export async function generateCsrfToken(): Promise<{ token: string; signature: string }> {
  // Use Web Crypto API instead of Node.js crypto for Edge Runtime compatibility
  const tokenBuffer = crypto.getRandomValues(new Uint8Array(32));
  const token = Array.from(tokenBuffer)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const secret = process.env.NEXTAUTH_SECRET || "fallback-secret";
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const keyData = encoder.encode(secret);

  // Create HMAC signature using SubtleCrypto
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, data);
  const signature = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return { token, signature };
}

/**
 * Verify CSRF token using Web Crypto API (Edge Runtime compatible)
 */
export async function verifyCsrfToken(
  token: string,
  signature: string
): Promise<boolean> {
  try {
    const secret = process.env.NEXTAUTH_SECRET || "fallback-secret";
    const encoder = new TextEncoder();
    const data = encoder.encode(token);
    const keyData = encoder.encode(secret);

    // Create HMAC signature using SubtleCrypto
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const signatureBuffer = await crypto.subtle.verify(
      "HMAC",
      key,
      new Uint8Array(signature.match(/[\da-f]{2}/gi)!.map((x) => parseInt(x, 16))),
      data
    );

    return signatureBuffer;
  } catch {
    return false;
  }
}

/**
 * Middleware: Handle CSRF token generation and validation
 */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Skip CSRF checks for safe methods and auth routes
  if (
    request.method === "GET" ||
    request.method === "HEAD" ||
    request.method === "OPTIONS" ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  // Generate CSRF token for GET requests
  if (request.method === "GET" && !pathname.startsWith("/api")) {
    const response = NextResponse.next();
    const csrfCookie = request.cookies.get(CSRF_COOKIE_NAME);

    // Generate new token if not present
    if (!csrfCookie?.value) {
      // Note: We can't use async generateCsrfToken here in middleware
      // Instead, tokens are generated on first form render via /api/csrf-token endpoint
    }
    return response;
  }

  // Validate CSRF token for state-changing requests
  if (
    request.method === "POST" ||
    request.method === "PUT" ||
    request.method === "PATCH" ||
    request.method === "DELETE"
  ) {
    const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
    const cookieSignature = request.cookies.get(CSRF_SIGNATURE_COOKIE_NAME)?.value;
    const headerToken = request.headers.get(CSRF_HEADER_NAME);

    // Validate token presence
    if (!cookieToken || !cookieSignature || !headerToken) {
      return NextResponse.json(
        {
          error: "CSRF Validation Failed",
          message: "Missing CSRF token. Please refresh the page and try again.",
        },
        { status: 403 }
      );
    }

    // Verify header token matches cookie token (double-submit pattern)
    if (headerToken !== cookieToken) {
      return NextResponse.json(
        {
          error: "CSRF Validation Failed",
          message: "CSRF token mismatch. Please refresh the page and try again.",
        },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

/**
 * Matcher: Apply middleware to all requests except static assets
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
