// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/api/razorpay/webhook/route.ts
// Handles Razorpay webhook events for premium lifecycle reconciliation
// ═══════════════════════════════════════════════════════════════════════════

import crypto from "crypto";
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

type WebhookReservation = {
  duplicate: boolean;
  status?: string;
};

async function reserveWebhookEvent(params: {
  eventId: string;
  eventName: string;
  orderId?: string;
  paymentId?: string;
  payloadHash: string;
  userId?: string;
}): Promise<WebhookReservation> {
  try {
    await prisma.webhookEvent.create({
      data: {
        eventId: params.eventId,
        eventName: params.eventName,
        orderId: params.orderId,
        paymentId: params.paymentId,
        payloadHash: params.payloadHash,
        userId: params.userId,
      },
    });

    return { duplicate: false };
  } catch (error) {
    const prismaError = error as { code?: string };
    if (prismaError.code !== "P2002") {
      throw error;
    }

    const existing = await prisma.webhookEvent.update({
      where: { eventId: params.eventId },
      data: {
        deliveryCount: { increment: 1 },
        lastSeenAt: new Date(),
      },
      select: { status: true },
    });

    return { duplicate: true, status: existing.status };
  }
}

async function finalizeWebhookEvent(
  eventId: string,
  status: "PROCESSED" | "IGNORED" | "FAILED",
  note?: string,
  errorMessage?: string
) {
  await prisma.webhookEvent.update({
    where: { eventId },
    data: {
      status,
      note,
      errorMessage,
      processedAt: new Date(),
      lastSeenAt: new Date(),
    },
  });
}

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
    select: { userId: true, amountPaise: true, currency: true, status: true },
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
  if (payment.amountPaise !== PREMIUM_AMOUNT_PAISE || payment.currency !== PREMIUM_CURRENCY) {
    console.error(
      "[Razorpay webhook] Local payment mismatch for order:", orderId,
      "expected:", PREMIUM_AMOUNT_PAISE,
      PREMIUM_CURRENCY,
      "found:", payment.amountPaise,
      payment.currency
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
  let eventId: string | null = null;

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
    const payloadHash = crypto.createHash("sha256").update(rawBody).digest("hex");

    const paymentEntity = event.payload?.payment?.entity;
    const orderId = paymentEntity?.order_id;
    const paymentId = paymentEntity?.id;

    eventId = request.headers.get("x-razorpay-event-id")?.trim() || `${eventName}:${payloadHash}`;
    const reservation = await reserveWebhookEvent({
      eventId,
      eventName,
      orderId,
      paymentId,
      payloadHash,
    });

    if (reservation.duplicate) {
      return NextResponse.json({
        received: true,
        duplicate: true,
        event: eventName,
        eventId,
        orderId,
        status: reservation.status,
      });
    }

    if (!orderId) {
      await finalizeWebhookEvent(eventId, "IGNORED", "No order_id");
      return NextResponse.json({ received: true, ignored: true, reason: "No order_id" });
    }

    if (eventName === "payment.captured" || eventName === "order.paid") {
      const hasProviderTotals =
        typeof paymentEntity?.amount === "number" ||
        typeof paymentEntity?.currency === "string";

      if (
        hasProviderTotals &&
        (paymentEntity?.amount !== PREMIUM_AMOUNT_PAISE ||
          paymentEntity?.currency !== PREMIUM_CURRENCY)
      ) {
        console.error(
          "[Razorpay webhook] Provider payload mismatch for order:",
          orderId,
          "expected:",
          PREMIUM_AMOUNT_PAISE,
          PREMIUM_CURRENCY,
          "found:",
          paymentEntity?.amount,
          paymentEntity?.currency
        );

        await finalizeWebhookEvent(eventId, "IGNORED", "amount-or-currency-mismatch");

        return NextResponse.json({
          received: true,
          ignored: true,
          event: eventName,
          orderId,
          reason: "amount-or-currency-mismatch",
        });
      }

      const premiumExpiresAt = await markPaymentVerified(orderId, paymentId, signature);
      await finalizeWebhookEvent(
        eventId,
        premiumExpiresAt ? "PROCESSED" : "IGNORED",
        premiumExpiresAt ? "payment-verified" : "verification-noop"
      );
      return NextResponse.json({
        received: true,
        event: eventName,
        orderId,
        premiumExpiresAt: premiumExpiresAt?.toISOString() ?? null,
      });
    }

    if (eventName === "payment.failed") {
      await markPaymentFailed(orderId, paymentId, signature);
      await finalizeWebhookEvent(eventId, "PROCESSED", "payment-failed");
      return NextResponse.json({ received: true, event: eventName, orderId });
    }

    await finalizeWebhookEvent(eventId, "IGNORED", `unsupported-event:${eventName}`);
    return NextResponse.json({ received: true, ignored: true, event: eventName, orderId });
  } catch (error) {
    if (eventId) {
      const message = error instanceof Error ? error.message : "Unknown error";
      await finalizeWebhookEvent(eventId, "FAILED", "webhook-processing-failed", message);
    }
    console.error("[Razorpay webhook] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
