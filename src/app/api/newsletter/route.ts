// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/api/newsletter/route.ts
// Newsletter subscription via ConvertKit API
// Required env: CONVERTKIT_API_KEY, CONVERTKIT_FORM_ID
// ═══════════════════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1).max(100).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.CONVERTKIT_API_KEY;
    const formId = process.env.CONVERTKIT_FORM_ID;

    if (!apiKey || !formId) {
      console.error('[Newsletter] Missing CONVERTKIT_API_KEY or CONVERTKIT_FORM_ID');
      return NextResponse.json(
        { error: 'Newsletter service not configured.' },
        { status: 503 }
      );
    }

    const res = await fetch(
      `https://api.convertkit.com/v3/forms/${formId}/subscribe`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: apiKey,
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

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    console.error('[Newsletter] API error:', message);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
