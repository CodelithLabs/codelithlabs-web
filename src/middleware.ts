/**
 * CSRF Protection Middleware
 * 
 * Implements CSRF token validation for state-changing requests (POST, PUT, PATCH, DELETE)
 * Uses double-submit cookie pattern with signed tokens.
 * 
 * Protected routes: /api/* (except /api/auth/*)
 * Token verification: Extracted from request header 'x-csrf-token'
 * Token generation: Stored in cookies during initial page load
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const CSRF_TOKEN_LENGTH = 32;
const CSRF_HEADER_NAME = "x-csrf-token";
const CSRF_COOKIE_NAME = "csrf-token";
const CSRF_SIGNATURE_COOKIE_NAME = "csrf-signature";

/**
 * Generate a secure CSRF token
 */
export function generateCsrfToken(): { token: string; signature: string } {
  const token = crypto.randomBytes(CSRF_TOKEN_LENGTH).toString("hex");
  const secret = process.env.NEXTAUTH_SECRET || "fallback-secret";
  const signature = crypto
    .createHmac("sha256", secret)
    .update(token)
    .digest("hex");

  return { token, signature };
}

/**
 * Verify CSRF token against stored signature
 */
export function verifyCsrfToken(
  token: string,
  signature: string
): boolean {
  const secret = process.env.NEXTAUTH_SECRET || "fallback-secret";
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(token)
    .digest("hex");

  // Use timing-safe comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
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

  // Generate CSRF token for GET requests (done via separate endpoint)
  if (request.method === "GET" && !pathname.startsWith("/api")) {
    const response = NextResponse.next();
    const csrfCookie = request.cookies.get(CSRF_COOKIE_NAME);
    
    // Generate new token if not present or invalid
    if (!csrfCookie?.value) {
      const { token, signature } = generateCsrfToken();
      response.cookies.set(CSRF_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });
      response.cookies.set(CSRF_SIGNATURE_COOKIE_NAME, signature, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });
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

    // Validate token presence and signature
    if (!cookieToken || !cookieSignature || !headerToken) {
      return NextResponse.json(
        {
          error: "CSRF Validation Failed",
          message: "Missing CSRF token. Please refresh the page and try again.",
        },
        { status: 403 }
      );
    }

    // Verify token matches signature
    if (!verifyCsrfToken(cookieToken, cookieSignature)) {
      return NextResponse.json(
        {
          error: "CSRF Validation Failed",
          message: "Invalid CSRF token. Please refresh the page and try again.",
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
 * Matcher: Apply middleware to all API routes except auth routes
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
