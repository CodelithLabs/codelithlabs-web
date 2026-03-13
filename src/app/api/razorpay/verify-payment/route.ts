// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/api/razorpay/verify-payment/route.ts
// Verifies a Razorpay payment signature and activates premium status
// ═══════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { activatePremiumForUser } from "@/lib/premium-membership";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import {
  PREMIUM_AMOUNT_PAISE,
  PREMIUM_CURRENCY,
  PREMIUM_PLAN_CODE,
  fetchRazorpayPaymentDetails,
  isRazorpayPaymentCaptured,
  verifyRazorpayPaymentSignature,
} from "@/lib/razorpay";
import { checkRateLimit } from "@/lib/rate-limiter";
import { getClientIp } from "@/lib/request-security";

interface VerifyPaymentBody {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateResult = await checkRateLimit(ip, 10, "razorpay-verify");
    if (rateResult.limited) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body: VerifyPaymentBody = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment verification fields" },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      console.error("[Razorpay] Missing credentials for verification");
      return NextResponse.json(
        { error: "Payment verification not configured" },
        { status: 503 }
      );
    }

    const isValidSignature = verifyRazorpayPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      secret: keySecret,
    });

    if (!isValidSignature) {
      console.warn("[Razorpay] Invalid signature for payment:", razorpay_payment_id);
      return NextResponse.json(
        { error: "Payment verification failed — invalid signature" },
        { status: 400 }
      );
    }

    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        { error: "Premium database is not configured. Please contact support." },
        { status: 503 }
      );
    }

    // Verify order ownership and amount BEFORE activating premium
    const existingPayment = await prisma.payment.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
      select: { userId: true, amountPaise: true, currency: true, status: true },
    });

    if (!existingPayment) {
      console.warn("[Razorpay] No payment record found for order:", razorpay_order_id);
      return NextResponse.json(
        { error: "Payment order not found" },
        { status: 404 }
      );
    }

    // Verify current user matches order creator
    const currentDbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, premiumExpiresAt: true },
    });

    if (!currentDbUser) {
      return NextResponse.json(
        { error: "User account not found" },
        { status: 404 }
      );
    }

    if (existingPayment.userId !== currentDbUser.id) {
      console.warn(
        "[Razorpay] Order ownership mismatch:",
        "order created by userId", existingPayment.userId,
        "but verification attempted by userId", currentDbUser.id
      );
      return NextResponse.json(
        { error: "This payment order was created by a different user" },
        { status: 403 }
      );
    }

    if (existingPayment.status === "VERIFIED") {
      return NextResponse.json({
        success: true,
        paymentId: razorpay_payment_id,
        premiumExpiresAt: currentDbUser.premiumExpiresAt?.toISOString() ?? null,
        message: "Premium access is already active.",
      });
    }

    let providerPayment;

    try {
      providerPayment = await fetchRazorpayPaymentDetails(
        razorpay_payment_id,
        keyId,
        keySecret
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("[Razorpay] Failed payment reconciliation:", message);
      return NextResponse.json(
        { error: "Unable to reconcile payment with Razorpay" },
        { status: 502 }
      );
    }

    if (providerPayment.order_id !== razorpay_order_id) {
      console.error(
        "[Razorpay] Provider order mismatch for payment:",
        razorpay_payment_id,
        "expected:",
        razorpay_order_id,
        "found:",
        providerPayment.order_id
      );
      return NextResponse.json(
        { error: "Payment reconciliation failed — order mismatch" },
        { status: 400 }
      );
    }

    // Validate payment amount matches expected
    if (existingPayment.amountPaise !== PREMIUM_AMOUNT_PAISE) {
      console.error(
        "[Razorpay] Amount mismatch for order:", razorpay_order_id,
        "expected:", PREMIUM_AMOUNT_PAISE,
        "found:", existingPayment.amountPaise
      );
      return NextResponse.json(
        { error: "Payment amount mismatch" },
        { status: 400 }
      );
    }

    if (providerPayment.amount !== existingPayment.amountPaise) {
      console.error(
        "[Razorpay] Provider amount mismatch for payment:",
        razorpay_payment_id,
        "expected:",
        existingPayment.amountPaise,
        "found:",
        providerPayment.amount
      );
      return NextResponse.json(
        { error: "Payment reconciliation failed — amount mismatch" },
        { status: 400 }
      );
    }

    if (providerPayment.currency !== existingPayment.currency) {
      console.error(
        "[Razorpay] Provider currency mismatch for payment:",
        razorpay_payment_id,
        "expected:",
        existingPayment.currency,
        "found:",
        providerPayment.currency
      );
      return NextResponse.json(
        { error: "Payment reconciliation failed — currency mismatch" },
        { status: 400 }
      );
    }

    if (!isRazorpayPaymentCaptured(providerPayment)) {
      console.warn(
        "[Razorpay] Payment not captured during reconciliation:",
        razorpay_payment_id,
        providerPayment.status
      );
      return NextResponse.json(
        { error: "Payment has not been captured yet" },
        { status: 400 }
      );
    }

    const activatedAt = new Date();

    const premiumExpiresAt = await activatePremiumForUser(currentDbUser.id, activatedAt);

    await prisma.payment.update({
      where: { razorpayOrderId: razorpay_order_id },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "VERIFIED",
        verifiedAt: activatedAt,
      },
    });

    // PII-safe logging: avoid email in production
    const isDevEnv = process.env.NODE_ENV === "development";
    if (isDevEnv) {
      console.log("[Razorpay] Payment verified and persisted:", {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        email: session.user.email,
        userId: currentDbUser.id,
        activatedAt: activatedAt.toISOString(),
        premiumExpiresAt: premiumExpiresAt.toISOString(),
      });
    } else {
      console.log("[Razorpay] Payment verified:", {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        userId: currentDbUser.id,
        premiumExpiresAt: premiumExpiresAt.toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      paymentId: razorpay_payment_id,
      premiumExpiresAt: premiumExpiresAt.toISOString(),
      message: "Premium access activated!",
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[Razorpay] verify-payment error:", message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
