// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/api/contact/route.ts
// Contact form API route — validates input, verifies Turnstile, sends email
// via SendGrid (team notification + sender auto-reply)
//
// Required env vars:
//   SENDGRID_API_KEY        — SendGrid API key
//   SENDGRID_FROM_EMAIL     — Verified sender address (e.g. noreply@codelithlabs.in)
//   CONTACT_EMAIL           — Destination for submissions (team.codelithlabs@gmail.com)
//   TURNSTILE_SECRET_KEY    — Cloudflare Turnstile server-side secret
// ═══════════════════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { contactSubmissionSchema } from "@/lib/schemas/contact";
import { buildNotificationEmail } from "@/lib/email-templates/contact-notification";
import { buildAutoReplyEmail } from "@/lib/email-templates/contact-auto-reply";
import { checkRateLimit } from "@/lib/rate-limiter";
import { getClientIp, verifyTurnstileToken } from "@/lib/request-security";

// ─── POST handler ────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    // 1. Rate limiting (Redis-backed with in-memory fallback)
    const ip = getClientIp(request);

    const rateResult = await checkRateLimit(ip, 5, 'contact');
    if (rateResult.limited) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // 2. Parse & validate request body
    const body = await request.json();
    const parsed = contactSubmissionSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: "Validation failed", fieldErrors },
        { status: 400 }
      );
    }

    const { turnstileToken, ...formData } = parsed.data;

    // 3. Verify Turnstile
    const turnstileValid = await verifyTurnstileToken(turnstileToken, ip);
    if (!turnstileValid) {
      return NextResponse.json(
        { error: "Verification failed. Please try again." },
        { status: 400 }
      );
    }

    // 4. Validate SendGrid configuration
    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;
    const contactEmail =
      process.env.CONTACT_EMAIL ?? "team.codelithlabs@gmail.com";

    if (!apiKey || !fromEmail) {
      console.error("[Contact] Missing SENDGRID_API_KEY or SENDGRID_FROM_EMAIL");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 503 }
      );
    }

    sgMail.setApiKey(apiKey);

    // 5. Send team notification email
    await sgMail.send({
      to: contactEmail,
      from: { email: fromEmail, name: "CodelithLabs Contact Form" },
      replyTo: { email: formData.email, name: formData.name },
      subject: `[Contact] ${formData.subject} — ${formData.name}`,
      html: buildNotificationEmail(formData),
    });

    // 6. Send auto-reply to the sender
    await sgMail.send({
      to: formData.email,
      from: { email: fromEmail, name: "CodelithLabs" },
      subject: "We received your message — CodelithLabs",
      html: buildAutoReplyEmail(formData.name),
    });

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[Contact] API error:", message);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
