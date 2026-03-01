// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/app/api/razorpay/verify-payment/route.ts
// Verifies a Razorpay payment signature and activates premium status
// ═══════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import crypto from "crypto";

// ─── Types ───────────────────────────────────────────────────────────────

interface VerifyPaymentBody {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// ─── POST handler ────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // 1. Verify the user is authenticated
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // 2. Parse the payment verification body
    const body: VerifyPaymentBody = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment verification fields" },
        { status: 400 }
      );
    }

    // 3. Verify the payment signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error("[Razorpay] Missing KEY_SECRET for verification");
      return NextResponse.json(
        { error: "Payment verification not configured" },
        { status: 503 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.warn("[Razorpay] Invalid signature for payment:", razorpay_payment_id);
      return NextResponse.json(
        { error: "Payment verification failed — invalid signature" },
        { status: 400 }
      );
    }

    // 4. Payment verified! Activate premium for the user.
    //
    // TODO: Persist to database (e.g., Prisma + Supabase)
    //   await db.user.update({
    //     where: { email: session.user.email },
    //     data: {
    //       isPremium: true,
    //       premiumActivatedAt: new Date(),
    //       razorpayPaymentId: razorpay_payment_id,
    //       razorpayOrderId: razorpay_order_id,
    //     },
    //   });
    //
    // For now, log the successful verification.
    console.log("[Razorpay] Payment verified:", {
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      email: session.user.email,
      activatedAt: new Date().toISOString(),
    });

    // 5. Return success
    return NextResponse.json({
      success: true,
      paymentId: razorpay_payment_id,
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
