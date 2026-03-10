// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/api/razorpay/webhook/route.ts
// Handles Razorpay webhook events for premium lifecycle reconciliation
// ═══════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { activatePremiumForUser } from "@/lib/premium-membership";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import {
  PREMIUM_AMOUNT_PAISE,
  PREMIUM_CURRENCY,
  PREMIUM_PLAN_CODE,
  verifyRazorpayWebhookSignature,
} from "@/lib/razorpay";

type RazorpayWebhookEvent = {
  event?: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        amount?: number;
        currency?: string;
      };
    };
  };
};

async function markPaymentFailed(orderId: string, paymentId?: string, signature?: string) {
  await prisma.payment.updateMany({
    where: { razorpayOrderId: orderId },
    data: {
      status: "FAILED",
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
    },
  });
}

async function markPaymentVerified(orderId: string, paymentId?: string, signature?: string) {
  const payment = await prisma.payment.findUnique({
    where: { razorpayOrderId: orderId },
    select: { userId: true, amountPaise: true, status: true },
  });

  if (!payment?.userId) {
    console.warn("[Razorpay webhook] No local payment found for order:", orderId);
    return null;
  }

  // Idempotency: if already verified, return existing expiry without re-activating
  if (payment.status === "VERIFIED") {
    const user = await prisma.user.findUnique({
      where: { id: payment.userId },
      select: { premiumExpiresAt: true },
    });
    return user?.premiumExpiresAt ?? null;
  }

  // Validate amount matches expected before activation
  if (payment.amountPaise !== PREMIUM_AMOUNT_PAISE) {
    console.error(
      "[Razorpay webhook] Amount mismatch for order:", orderId,
      "expected:", PREMIUM_AMOUNT_PAISE,
      "found:", payment.amountPaise
    );
    return null;
  }

  const verifiedAt = new Date();
  const premiumExpiresAt = await activatePremiumForUser(payment.userId, verifiedAt);

  await prisma.payment.update({
    where: { razorpayOrderId: orderId },
    data: {
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      status: "VERIFIED",
      verifiedAt,
    },
  });

  return premiumExpiresAt;
}

export async function POST(request: NextRequest) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        { error: "Premium database is not configured. Please contact support." },
        { status: 503 }
      );
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("[Razorpay webhook] Missing RAZORPAY_WEBHOOK_SECRET");
      return NextResponse.json(
        { error: "Webhook verification is not configured" },
        { status: 503 }
      );
    }

    const signature = request.headers.get("x-razorpay-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing webhook signature" }, { status: 400 });
    }

    const rawBody = await request.text();
    const isValidSignature = verifyRazorpayWebhookSignature({
      body: rawBody,
      signature,
      secret: webhookSecret,
    });

    if (!isValidSignature) {
      console.warn("[Razorpay webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody) as RazorpayWebhookEvent;
    const eventName = event.event ?? "unknown";

    const paymentEntity = event.payload?.payment?.entity;
    const orderId = paymentEntity?.order_id;
    const paymentId = paymentEntity?.id;

    if (!orderId) {
      return NextResponse.json({ received: true, ignored: true, reason: "No order_id" });
    }

    if (eventName === "payment.captured" || eventName === "order.paid") {
      const premiumExpiresAt = await markPaymentVerified(orderId, paymentId, signature);
      return NextResponse.json({
        received: true,
        event: eventName,
        orderId,
        premiumExpiresAt: premiumExpiresAt?.toISOString() ?? null,
      });
    }

    if (eventName === "payment.failed") {
      await markPaymentFailed(orderId, paymentId, signature);
      return NextResponse.json({ received: true, event: eventName, orderId });
    }

    return NextResponse.json({ received: true, ignored: true, event: eventName, orderId });
  } catch (error) {
    console.error("[Razorpay webhook] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
