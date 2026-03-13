// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/api/razorpay/create-order/route.ts
// Creates a Razorpay order for Premium subscription checkout
// ═══════════════════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import {
  PREMIUM_AMOUNT_PAISE,
  PREMIUM_CURRENCY,
  PREMIUM_PLAN_CODE,
} from "@/lib/razorpay";
import crypto from "crypto";
import { checkRateLimit } from "@/lib/rate-limiter";
import { getClientIp } from "@/lib/request-security";

// ─── Types ───────────────────────────────────────────────────────────────

interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
}

// ─── Constants ───────────────────────────────────────────────────────────

const RAZORPAY_API = "https://api.razorpay.com/v1";

// ─── POST handler ────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    // 0. Rate limiting (10 requests per 15 min per IP)
    const ip = getClientIp(request);
    const rateResult = await checkRateLimit(ip, 10, 'razorpay');
    if (rateResult.limited) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // 1. Verify the user is authenticated
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // 2. Validate Razorpay credentials exist
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error("[Razorpay] Missing API credentials");
      return NextResponse.json(
        { error: "Payment service not configured" },
        { status: 503 }
      );
    }

    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        { error: "Premium database is not configured. Please contact support." },
        { status: 503 }
      );
    }

    // 3. Generate a unique receipt ID
    const receipt = `rcpt_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

    // 4. Create Razorpay order via API
    const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const orderResponse = await fetch(`${RAZORPAY_API}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${basicAuth}`,
      },
      body: JSON.stringify({
        amount: PREMIUM_AMOUNT_PAISE,
        currency: PREMIUM_CURRENCY,
        receipt,
        notes: {
          email: session.user.email,
          userId: session.user.id ?? "",
          plan: PREMIUM_PLAN_CODE,
        },
      }),
    });

    if (!orderResponse.ok) {
      const errBody = await orderResponse.text();
      console.error("[Razorpay] Order creation failed:", orderResponse.status, errBody);
      return NextResponse.json(
        { error: "Failed to create payment order" },
        { status: 502 }
      );
    }

    const order: RazorpayOrderResponse = await orderResponse.json();

    const dbUser = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {
        name: session.user.name ?? undefined,
        image: session.user.image ?? undefined,
      },
      create: {
        email: session.user.email,
        name: session.user.name ?? undefined,
        image: session.user.image ?? undefined,
      },
      select: { id: true },
    });

    await prisma.payment.upsert({
      where: { razorpayOrderId: order.id },
      update: {
        userId: dbUser.id,
        amountPaise: order.amount,
        currency: order.currency,
        status: "CREATED",
        provider: "razorpay",
        planCode: PREMIUM_PLAN_CODE,
      },
      create: {
        userId: dbUser.id,
        razorpayOrderId: order.id,
        amountPaise: order.amount,
        currency: order.currency,
        status: "CREATED",
        provider: "razorpay",
        planCode: PREMIUM_PLAN_CODE,
      },
    });

    // 5. Return order details to the client
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId, // Public key for client-side Razorpay SDK
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[Razorpay] create-order error:", message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
