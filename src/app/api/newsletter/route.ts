// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/api/newsletter/route.ts
// Newsletter subscription via ConvertKit API
// Required env: CONVERTKIT_API_KEY, CONVERTKIT_FORM_ID
// ═══════════════════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limiter';
import {
  getClientIp,
  isTurnstileConfigured,
  verifyTurnstileToken,
} from '@/lib/request-security';

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1).max(100).optional(),
  turnstileToken: z.string().min(1).optional(),
  website: z.string().max(0).optional(),
});

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateResult = await checkRateLimit(ip, 5, 'newsletter');

    if (rateResult.limited) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 }
      );
    }

    if (parsed.data.website) {
      return NextResponse.json({ success: true, pendingConfirmation: true });
    }

    if (isTurnstileConfigured()) {
      if (!parsed.data.turnstileToken) {
        return NextResponse.json(
          { error: 'Please complete the verification challenge.' },
          { status: 400 }
        );
      }

      const turnstileValid = await verifyTurnstileToken(parsed.data.turnstileToken, ip);
      if (!turnstileValid) {
        return NextResponse.json(
          { error: 'Verification failed. Please try again.' },
          { status: 400 }
        );
      }
    }

    const apiKey = process.env.CONVERTKIT_API_KEY;
    const formId = process.env.CONVERTKIT_FORM_ID;

    if (!apiKey || !formId) {
      console.error('[Newsletter] Missing CONVERTKIT_API_KEY or CONVERTKIT_FORM_ID');

      if (process.env.NODE_ENV !== 'production') {
        return NextResponse.json(
          {
            success: false,
            configured: false,
            error:
              'Newsletter is not configured in local development. Set CONVERTKIT_API_KEY and CONVERTKIT_FORM_ID in .env.local.',
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { error: 'Newsletter service not configured.' },
        { status: 503 }
      );
    }

    const res = await fetch(
      `https://api.convertkit.com/v3/forms/${formId}/subscribe?api_key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: parsed.data.email,
          first_name: parsed.data.firstName ?? '',
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error('[Newsletter] ConvertKit error:', res.status, errText);
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, pendingConfirmation: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    console.error('[Newsletter] API error:', message);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
