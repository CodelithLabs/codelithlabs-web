import { isIP } from "node:net";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

function stripWrappingQuotes(value: string): string {
  return value.replace(/^"|"$/g, "");
}

function normalizeIpCandidate(value: string): string | null {
  let candidate = stripWrappingQuotes(value.trim());

  if (!candidate || candidate.toLowerCase() === "unknown") {
    return null;
  }

  if (candidate.startsWith("for=")) {
    candidate = candidate.slice(4);
  }

  candidate = candidate.replace(/^\[/, "").replace(/\]$/, "");

  if (candidate.startsWith("::ffff:")) {
    candidate = candidate.slice(7);
  }

  if (/^\d{1,3}(?:\.\d{1,3}){3}:\d+$/.test(candidate)) {
    candidate = candidate.replace(/:\d+$/, "");
  }

  const ipv6WithPortMatch = candidate.match(/^\[?([a-f0-9:]+)\]?:(\d+)$/i);
  if (ipv6WithPortMatch && isIP(ipv6WithPortMatch[1]) === 6) {
    candidate = ipv6WithPortMatch[1];
  }

  return isIP(candidate) ? candidate : null;
}

function parseForwardedHeader(header: string | null): string[] {
  if (!header) return [];

  const candidates: string[] = [];

  for (const part of header.split(",")) {
    const match = part.match(/for=("?\[?[^;\]"]+\]?"?)/i);
    if (match?.[1]) {
      candidates.push(match[1]);
    }
  }

  return candidates;
}

function parseListHeader(header: string | null): string[] {
  if (!header) return [];
  return header
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function getClientIp(request: Request): string {
  const candidates = [
    request.headers.get("cf-connecting-ip"),
    request.headers.get("x-real-ip"),
    request.headers.get("x-vercel-forwarded-for"),
    ...parseForwardedHeader(request.headers.get("forwarded")),
    ...parseListHeader(request.headers.get("x-forwarded-for")),
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;

    const normalized = normalizeIpCandidate(candidate);
    if (normalized) {
      return normalized;
    }
  }

  return "unknown";
}

export function isTurnstileConfigured(): boolean {
  return Boolean(
    process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  );
}

export async function verifyTurnstileToken(token: string, ip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("[Security] TURNSTILE_SECRET_KEY not configured");
    return false;
  }

  try {
    const body = new URLSearchParams({ secret, response: token });

    if (ip && ip !== "unknown") {
      body.set("remoteip", ip);
    }

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Security] Turnstile verification failed:", message);
    return false;
  }
}