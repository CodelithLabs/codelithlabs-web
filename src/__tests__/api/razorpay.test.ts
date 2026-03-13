import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const {
  authMock,
  checkRateLimitMock,
  isDatabaseConfiguredMock,
  activatePremiumForUserMock,
  isPremiumActiveMock,
  verifyRazorpayPaymentSignatureMock,
  verifyRazorpayWebhookSignatureMock,
  fetchRazorpayPaymentDetailsMock,
  isRazorpayPaymentCapturedMock,
  canAccessPremiumAuditMock,
  isPremiumAuditConfiguredMock,
  prismaMock,
} = vi.hoisted(() => {
  const prisma = {
    user: {
      upsert: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    payment: {
      count: vi.fn(),
      upsert: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    webhookEvent: {
      create: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
    },
  };

  return {
    authMock: vi.fn(),
    checkRateLimitMock: vi.fn(),
    isDatabaseConfiguredMock: vi.fn(),
    activatePremiumForUserMock: vi.fn(),
    isPremiumActiveMock: vi.fn(),
    verifyRazorpayPaymentSignatureMock: vi.fn(),
    verifyRazorpayWebhookSignatureMock: vi.fn(),
    fetchRazorpayPaymentDetailsMock: vi.fn(),
    isRazorpayPaymentCapturedMock: vi.fn(),
    canAccessPremiumAuditMock: vi.fn(),
    isPremiumAuditConfiguredMock: vi.fn(),
    prismaMock: prisma,
  };
});

vi.mock("@/lib/auth", () => ({
  auth: authMock,
}));

vi.mock("@/lib/rate-limiter", () => ({
  checkRateLimit: checkRateLimitMock,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
  isDatabaseConfigured: isDatabaseConfiguredMock,
}));

vi.mock("@/lib/premium-membership", () => ({
  activatePremiumForUser: activatePremiumForUserMock,
  isPremiumActive: isPremiumActiveMock,
}));

vi.mock("@/lib/admin-access", () => ({
  canAccessPremiumAudit: canAccessPremiumAuditMock,
  isPremiumAuditConfigured: isPremiumAuditConfiguredMock,
}));

vi.mock("@/lib/razorpay", () => ({
  PREMIUM_PLAN_CODE: "premium_monthly",
  PREMIUM_AMOUNT_PAISE: 29900,
  PREMIUM_CURRENCY: "INR",
  fetchRazorpayPaymentDetails: fetchRazorpayPaymentDetailsMock,
  isRazorpayPaymentCaptured: isRazorpayPaymentCapturedMock,
  verifyRazorpayPaymentSignature: verifyRazorpayPaymentSignatureMock,
  verifyRazorpayWebhookSignature: verifyRazorpayWebhookSignatureMock,
}));

import { POST as createOrderPOST } from "@/app/api/razorpay/create-order/route";
import { POST as verifyPaymentPOST } from "@/app/api/razorpay/verify-payment/route";
import { POST as webhookPOST } from "@/app/api/razorpay/webhook/route";
import { GET as premiumAuditGET } from "@/app/api/admin/premium-audit/route";
import { GET as premiumStatusGET } from "@/app/api/premium/status/route";

describe("Razorpay and premium API routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RAZORPAY_KEY_ID = "test_key_id";
    process.env.RAZORPAY_KEY_SECRET = "test_key_secret";
    process.env.RAZORPAY_WEBHOOK_SECRET = "test_webhook_secret";

    checkRateLimitMock.mockResolvedValue({ limited: false });
    authMock.mockResolvedValue({
      user: {
        id: "user_1",
        email: "test@example.com",
        name: "Test User",
        image: null,
        isPremium: false,
      },
    });
    isDatabaseConfiguredMock.mockReturnValue(true);
    verifyRazorpayPaymentSignatureMock.mockReturnValue(true);
    verifyRazorpayWebhookSignatureMock.mockReturnValue(true);
    fetchRazorpayPaymentDetailsMock.mockResolvedValue({
      id: "pay_1",
      order_id: "order_1",
      amount: 29900,
      currency: "INR",
      status: "captured",
      captured: true,
    });
    isRazorpayPaymentCapturedMock.mockReturnValue(true);
    activatePremiumForUserMock.mockResolvedValue(new Date("2026-04-10T00:00:00.000Z"));
    isPremiumActiveMock.mockReturnValue(true);
    isPremiumAuditConfiguredMock.mockReturnValue(true);
    canAccessPremiumAuditMock.mockReturnValue(true);

    prismaMock.user.upsert.mockResolvedValue({ id: "user_1" } as any);
    prismaMock.user.findUnique.mockResolvedValue({
      id: "user_1",
      isPremium: true,
      premiumExpiresAt: new Date("2026-04-10T00:00:00.000Z"),
    } as any);
    prismaMock.user.update.mockResolvedValue({} as any);
    prismaMock.payment.count.mockResolvedValue(0);
    prismaMock.payment.upsert.mockResolvedValue({} as any);
    prismaMock.payment.findUnique.mockResolvedValue({
      userId: "user_1",
      razorpayOrderId: "order_1",
      amountPaise: 29900,
      currency: "INR",
      status: "CREATED",
    } as any);
    prismaMock.payment.findMany.mockResolvedValue([] as any);
    prismaMock.payment.update.mockResolvedValue({} as any);
    prismaMock.payment.updateMany.mockResolvedValue({ count: 1 });
    prismaMock.webhookEvent.create.mockResolvedValue({ id: "wh_1" } as any);
    prismaMock.webhookEvent.update.mockResolvedValue({ status: "PROCESSED" } as any);
    prismaMock.webhookEvent.findMany.mockResolvedValue([] as any);

    vi.stubGlobal("fetch", vi.fn());
  });

  describe("POST /api/razorpay/create-order", () => {
    it("returns 429 when rate limited", async () => {
      checkRateLimitMock.mockResolvedValueOnce({ limited: true, resetAt: Date.now() + 1000 });

      const res = await createOrderPOST(new Request("http://localhost/api/razorpay/create-order", { method: "POST" }));

      expect(res.status).toBe(429);
    });

    it("returns 401 when unauthenticated", async () => {
      authMock.mockResolvedValueOnce(null);

      const res = await createOrderPOST(new Request("http://localhost/api/razorpay/create-order", { method: "POST" }));

      expect(res.status).toBe(401);
    });

    it("returns 503 when payment credentials are missing", async () => {
      delete process.env.RAZORPAY_KEY_ID;
      delete process.env.RAZORPAY_KEY_SECRET;

      const res = await createOrderPOST(new Request("http://localhost/api/razorpay/create-order", { method: "POST" }));

      expect(res.status).toBe(503);
    });

    it("returns 503 when DB is not configured", async () => {
      isDatabaseConfiguredMock.mockReturnValueOnce(false);

      const res = await createOrderPOST(new Request("http://localhost/api/razorpay/create-order", { method: "POST" }));

      expect(res.status).toBe(503);
    });

    it("returns 502 when Razorpay order API fails", async () => {
      const fetchMock = vi.mocked(fetch);
      fetchMock.mockResolvedValueOnce(
        new Response("bad request", {
          status: 400,
        })
      );

      const res = await createOrderPOST(new Request("http://localhost/api/razorpay/create-order", { method: "POST" }));

      expect(res.status).toBe(502);
    });

    it("creates order and persists CREATED payment", async () => {
      const fetchMock = vi.mocked(fetch);
      fetchMock.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: "order_123",
            entity: "order",
            amount: 29900,
            amount_paid: 0,
            amount_due: 29900,
            currency: "INR",
            receipt: "rcpt_1",
            status: "created",
            created_at: Date.now(),
          }),
          { status: 200, headers: { "content-type": "application/json" } }
        )
      );

      const res = await createOrderPOST(new Request("http://localhost/api/razorpay/create-order", { method: "POST" }));
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.orderId).toBe("order_123");
      expect(prismaMock.user.upsert).toHaveBeenCalledTimes(1);
      expect(prismaMock.payment.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            status: "CREATED",
            planCode: "premium_monthly",
          }),
        })
      );
    });
  });

  describe("POST /api/razorpay/verify-payment", () => {
    function buildVerifyRequest(body: unknown) {
      return new NextRequest("http://localhost/api/razorpay/verify-payment", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "content-type": "application/json", "x-forwarded-for": "127.0.0.1" },
      });
    }

    it("returns 400 when required fields are missing", async () => {
      const res = await verifyPaymentPOST(
        buildVerifyRequest({
          razorpay_order_id: "order_1",
          razorpay_payment_id: "",
          razorpay_signature: "sig",
        })
      );

      expect(res.status).toBe(400);
    });

    it("returns 400 for invalid signature", async () => {
      verifyRazorpayPaymentSignatureMock.mockReturnValueOnce(false);

      const res = await verifyPaymentPOST(
        buildVerifyRequest({
          razorpay_order_id: "order_1",
          razorpay_payment_id: "pay_1",
          razorpay_signature: "bad_sig",
        })
      );

      expect(res.status).toBe(400);
      expect(prismaMock.payment.upsert).not.toHaveBeenCalled();
    });

    it("returns 503 when DB is not configured", async () => {
      isDatabaseConfiguredMock.mockReturnValueOnce(false);

      const res = await verifyPaymentPOST(
        buildVerifyRequest({
          razorpay_order_id: "order_1",
          razorpay_payment_id: "pay_1",
          razorpay_signature: "sig_1",
        })
      );

      expect(res.status).toBe(503);
      expect(prismaMock.user.upsert).not.toHaveBeenCalled();
      expect(prismaMock.payment.upsert).not.toHaveBeenCalled();
    });

    it("returns 503 when RAZORPAY_KEY_SECRET is missing", async () => {
      delete process.env.RAZORPAY_KEY_SECRET;

      const res = await verifyPaymentPOST(
        buildVerifyRequest({
          razorpay_order_id: "order_1",
          razorpay_payment_id: "pay_1",
          razorpay_signature: "sig_1",
        })
      );

      expect(res.status).toBe(503);
      expect(verifyRazorpayPaymentSignatureMock).not.toHaveBeenCalled();
    });

    it("returns 500 for malformed JSON body", async () => {
      const malformedRequest = new NextRequest("http://localhost/api/razorpay/verify-payment", {
        method: "POST",
        body: "{ this is not valid json",
        headers: { "content-type": "application/json", "x-forwarded-for": "127.0.0.1" },
      });

      const res = await verifyPaymentPOST(malformedRequest);

      expect(res.status).toBe(500);
    });

    it("persists VERIFIED payment and activates premium on success", async () => {
      const res = await verifyPaymentPOST(
        buildVerifyRequest({
          razorpay_order_id: "order_1",
          razorpay_payment_id: "pay_1",
          razorpay_signature: "sig_1",
        })
      );
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.premiumExpiresAt).toBe("2026-04-10T00:00:00.000Z");
      expect(activatePremiumForUserMock).toHaveBeenCalledWith("user_1", expect.any(Date));
      expect(prismaMock.payment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { razorpayOrderId: "order_1" },
          data: expect.objectContaining({
            status: "VERIFIED",
            razorpayPaymentId: "pay_1",
          }),
        })
      );
    });

    it("rejects verification if order creator != current user (403)", async () => {
      // Simulate: user_2 created the order, but user_1 (current session) tries to verify
      prismaMock.payment.findUnique.mockResolvedValueOnce({
        userId: "user_2",
        razorpayOrderId: "order_1",
        amountPaise: 29900,
        currency: "INR",
        status: "CREATED",
      } as any);

      const res = await verifyPaymentPOST(
        buildVerifyRequest({
          razorpay_order_id: "order_1",
          razorpay_payment_id: "pay_1",
          razorpay_signature: "sig_1",
        })
      );

      expect(res.status).toBe(403);
      expect(activatePremiumForUserMock).not.toHaveBeenCalled();
      expect(prismaMock.payment.update).not.toHaveBeenCalled();
    });

    it("rejects verification if payment amount != expected (400)", async () => {
      // Simulate: order was created with wrong amount (e.g., ₹0 or tampered amount)
      prismaMock.payment.findUnique.mockResolvedValueOnce({
        userId: "user_1",
        razorpayOrderId: "order_1",
        amountPaise: 0, // Invalid amount
        currency: "INR",
        status: "CREATED",
      } as any);

      const res = await verifyPaymentPOST(
        buildVerifyRequest({
          razorpay_order_id: "order_1",
          razorpay_payment_id: "pay_1",
          razorpay_signature: "sig_1",
        })
      );

      expect(res.status).toBe(400);
      expect(activatePremiumForUserMock).not.toHaveBeenCalled();
      expect(prismaMock.payment.update).not.toHaveBeenCalled();
    });

    it("returns 404 if payment record not found for orderId", async () => {
      prismaMock.payment.findUnique.mockResolvedValueOnce(null);

      const res = await verifyPaymentPOST(
        buildVerifyRequest({
          razorpay_order_id: "order_nonexistent",
          razorpay_payment_id: "pay_1",
          razorpay_signature: "sig_1",
        })
      );

      expect(res.status).toBe(404);
      expect(activatePremiumForUserMock).not.toHaveBeenCalled();
    });

    it("does not extend premium again when the same order is replay-verified", async () => {
      prismaMock.payment.findUnique.mockResolvedValueOnce({
        userId: "user_1",
        razorpayOrderId: "order_1",
        amountPaise: 29900,
        currency: "INR",
        status: "VERIFIED",
      } as any);
      prismaMock.user.findUnique.mockResolvedValueOnce({
        id: "user_1",
        premiumExpiresAt: new Date("2026-04-10T00:00:00.000Z"),
      } as any);

      const res = await verifyPaymentPOST(
        buildVerifyRequest({
          razorpay_order_id: "order_1",
          razorpay_payment_id: "pay_1",
          razorpay_signature: "sig_1",
        })
      );
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.message).toBe("Premium access is already active.");
      expect(json.premiumExpiresAt).toBe("2026-04-10T00:00:00.000Z");
      expect(activatePremiumForUserMock).not.toHaveBeenCalled();
      expect(prismaMock.payment.update).not.toHaveBeenCalled();
    });

    it("rejects verification when Razorpay reconciliation shows an order mismatch", async () => {
      fetchRazorpayPaymentDetailsMock.mockResolvedValueOnce({
        id: "pay_1",
        order_id: "order_other",
        amount: 29900,
        currency: "INR",
        status: "captured",
        captured: true,
      });

      const res = await verifyPaymentPOST(
        buildVerifyRequest({
          razorpay_order_id: "order_1",
          razorpay_payment_id: "pay_1",
          razorpay_signature: "sig_1",
        })
      );

      expect(res.status).toBe(400);
      expect(activatePremiumForUserMock).not.toHaveBeenCalled();
    });

    it("rejects verification when Razorpay says the payment is not captured", async () => {
      isRazorpayPaymentCapturedMock.mockReturnValueOnce(false);
      fetchRazorpayPaymentDetailsMock.mockResolvedValueOnce({
        id: "pay_1",
        order_id: "order_1",
        amount: 29900,
        currency: "INR",
        status: "authorized",
        captured: false,
      });

      const res = await verifyPaymentPOST(
        buildVerifyRequest({
          razorpay_order_id: "order_1",
          razorpay_payment_id: "pay_1",
          razorpay_signature: "sig_1",
        })
      );

      expect(res.status).toBe(400);
      expect(activatePremiumForUserMock).not.toHaveBeenCalled();
    });
  });

  describe("POST /api/razorpay/webhook", () => {
    function buildWebhookRequest(payload: Record<string, unknown>, signature = "webhook_sig") {
      return new NextRequest("http://localhost/api/razorpay/webhook", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "content-type": "application/json",
          "x-razorpay-signature": signature,
        },
      });
    }

    it("returns 400 when webhook signature is invalid", async () => {
      verifyRazorpayWebhookSignatureMock.mockReturnValueOnce(false);

      const res = await webhookPOST(
        buildWebhookRequest({
          event: "payment.captured",
          payload: { payment: { entity: { id: "pay_1", order_id: "order_1" } } },
        })
      );

      expect(res.status).toBe(400);
    });

    it("returns 503 when DB is not configured", async () => {
      isDatabaseConfiguredMock.mockReturnValueOnce(false);

      const res = await webhookPOST(
        buildWebhookRequest({
          event: "payment.captured",
          payload: { payment: { entity: { id: "pay_1", order_id: "order_1" } } },
        })
      );

      expect(res.status).toBe(503);
    });

    it("returns 503 when RAZORPAY_WEBHOOK_SECRET is missing", async () => {
      delete process.env.RAZORPAY_WEBHOOK_SECRET;

      const res = await webhookPOST(
        buildWebhookRequest({
          event: "payment.captured",
          payload: { payment: { entity: { id: "pay_1", order_id: "order_1" } } },
        })
      );

      expect(res.status).toBe(503);
      expect(verifyRazorpayWebhookSignatureMock).not.toHaveBeenCalled();
    });

    it("returns 400 when webhook signature header is missing", async () => {
      const req = new NextRequest("http://localhost/api/razorpay/webhook", {
        method: "POST",
        body: JSON.stringify({
          event: "payment.captured",
          payload: { payment: { entity: { id: "pay_1", order_id: "order_1" } } },
        }),
        headers: {
          "content-type": "application/json",
        },
      });

      const res = await webhookPOST(req);

      expect(res.status).toBe(400);
      expect(verifyRazorpayWebhookSignatureMock).not.toHaveBeenCalled();
    });

    it("marks payment FAILED on payment.failed event", async () => {
      const res = await webhookPOST(
        buildWebhookRequest({
          event: "payment.failed",
          payload: { payment: { entity: { id: "pay_failed", order_id: "order_failed" } } },
        })
      );

      expect(res.status).toBe(200);
      expect(prismaMock.payment.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { razorpayOrderId: "order_failed" },
          data: expect.objectContaining({
            status: "FAILED",
            razorpayPaymentId: "pay_failed",
          }),
        })
      );
    });

    it("marks payment VERIFIED and extends membership on payment.captured", async () => {
      const res = await webhookPOST(
        buildWebhookRequest({
          event: "payment.captured",
          payload: { payment: { entity: { id: "pay_2", order_id: "order_2" } } },
        })
      );
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.premiumExpiresAt).toBe("2026-04-10T00:00:00.000Z");
      expect(activatePremiumForUserMock).toHaveBeenCalledWith("user_1", expect.any(Date));
      expect(prismaMock.payment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { razorpayOrderId: "order_2" },
          data: expect.objectContaining({ status: "VERIFIED" }),
        })
      );
    });

    it("does NOT activate premium if payment amount is invalid (webhook)", async () => {
      // Simulate: payment record exists but with wrong amount
      prismaMock.payment.findUnique.mockResolvedValueOnce({
        userId: "user_1",
        razorpayOrderId: "order_tampered",
        amountPaise: 100, // Invalid: expected 29900
        currency: "INR",
        status: "CREATED",
      } as any);

      const res = await webhookPOST(
        buildWebhookRequest({
          event: "payment.captured",
          payload: { payment: { entity: { id: "pay_tampered", order_id: "order_tampered" } } },
        })
      );

      // Webhook silently accepts (200) but doesn't activate premium
      expect(res.status).toBe(200);
      expect(activatePremiumForUserMock).not.toHaveBeenCalled();
      // Payment should NOT be marked VERIFIED
      expect(prismaMock.payment.update).not.toHaveBeenCalled();
    });

    it("handles duplicate payment.captured events idempotently", async () => {
      // First webhook call
      const res1 = await webhookPOST(
        buildWebhookRequest({
          event: "payment.captured",
          payload: { payment: { entity: { id: "pay_3", order_id: "order_3" } } },
        })
      );

      expect(res1.status).toBe(200);
      expect(activatePremiumForUserMock).toHaveBeenCalledTimes(1);

      // Reset mocks and simulate already-verified payment
      vi.clearAllMocks();
      prismaMock.payment.findUnique.mockResolvedValueOnce({
        userId: "user_1",
        razorpayOrderId: "order_3",
        razorpayPaymentId: "pay_3",
        amountPaise: 29900,
        currency: "INR",
        status: "VERIFIED", // Already verified
      } as any);

      // Second webhook call (duplicate)
      const res2 = await webhookPOST(
        buildWebhookRequest({
          event: "payment.captured",
          payload: { payment: { entity: { id: "pay_3", order_id: "order_3" } } },
        })
      );

      expect(res2.status).toBe(200);
      // Should not activate premium again (idempotent)
      expect(activatePremiumForUserMock).not.toHaveBeenCalled();
    });

    it("ignores captured webhook events with mismatched provider currency", async () => {
      const res = await webhookPOST(
        buildWebhookRequest({
          event: "payment.captured",
          payload: { payment: { entity: { id: "pay_bad_currency", order_id: "order_2", amount: 29900, currency: "USD" } } },
        })
      );
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.ignored).toBe(true);
      expect(json.reason).toBe("amount-or-currency-mismatch");
      expect(activatePremiumForUserMock).not.toHaveBeenCalled();
    });

    it("short-circuits duplicate webhook deliveries using persisted event ids", async () => {
      prismaMock.webhookEvent.create.mockRejectedValueOnce({ code: "P2002" });
      prismaMock.webhookEvent.update.mockResolvedValueOnce({ status: "PROCESSED" } as any);

      const res = await webhookPOST(
        buildWebhookRequest(
          {
            event: "payment.captured",
            payload: { payment: { entity: { id: "pay_dup", order_id: "order_1" } } },
          },
          "webhook_sig"
        )
      );
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.duplicate).toBe(true);
      expect(activatePremiumForUserMock).not.toHaveBeenCalled();
    });
  });

  describe("GET /api/premium/status", () => {
    it("returns 401 for unauthenticated requests", async () => {
      authMock.mockResolvedValueOnce(null);

      const res = await premiumStatusGET();

      expect(res.status).toBe(401);
    });

    it("returns session-backed status when DB is unavailable", async () => {
      isDatabaseConfiguredMock.mockReturnValueOnce(false);
      authMock.mockResolvedValueOnce({
        user: {
          email: "test@example.com",
          isPremium: true,
          premiumExpiresAt: "2026-04-10T00:00:00.000Z",
        },
      });

      const res = await premiumStatusGET();
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json).toEqual({
        isPremium: true,
        premiumExpiresAt: "2026-04-10T00:00:00.000Z",
        source: "session",
      });
    });

    it("auto-demotes expired premium flag when DB says inactive", async () => {
      isPremiumActiveMock.mockReturnValueOnce(false);
      prismaMock.user.findUnique.mockResolvedValueOnce({
        isPremium: true,
        premiumExpiresAt: new Date("2026-01-01T00:00:00.000Z"),
      });

      const res = await premiumStatusGET();
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.source).toBe("database");
      expect(json.isPremium).toBe(false);
      expect(prismaMock.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { isPremium: false },
        })
      );
    });
  });

  describe("GET /api/admin/premium-audit", () => {
    it("returns 401 for unauthenticated requests", async () => {
      authMock.mockResolvedValueOnce(null);

      const res = await premiumAuditGET();

      expect(res.status).toBe(401);
    });

    it("returns 403 for non-admin users", async () => {
      canAccessPremiumAuditMock.mockReturnValueOnce(false);

      const res = await premiumAuditGET();

      expect(res.status).toBe(403);
    });

    it("returns recent payment and webhook summaries for admins", async () => {
      prismaMock.payment.count
        .mockResolvedValueOnce(4)
        .mockResolvedValueOnce(2)
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(1);
      prismaMock.payment.findMany
        .mockResolvedValueOnce([
          {
            id: "payment_1",
            razorpayOrderId: "order_1",
            razorpayPaymentId: "pay_1",
            amountPaise: 29900,
            currency: "INR",
            status: "VERIFIED",
            createdAt: new Date("2026-03-13T00:00:00.000Z"),
            verifiedAt: new Date("2026-03-13T00:10:00.000Z"),
            user: {
              email: "test@example.com",
              isPremium: true,
              premiumExpiresAt: new Date("2026-04-13T00:00:00.000Z"),
            },
          },
        ] as any)
        .mockResolvedValueOnce([] as any);
      prismaMock.webhookEvent.findMany
        .mockResolvedValueOnce([
          {
            eventId: "payment.captured:abc",
            eventName: "payment.captured",
            orderId: "order_1",
            paymentId: "pay_1",
            status: "PROCESSED",
            deliveryCount: 1,
            note: "payment-verified",
            errorMessage: null,
            createdAt: new Date("2026-03-13T00:00:00.000Z"),
            processedAt: new Date("2026-03-13T00:00:02.000Z"),
            lastSeenAt: new Date("2026-03-13T00:00:02.000Z"),
          },
        ] as any)
        .mockResolvedValueOnce([] as any);

      const res = await premiumAuditGET();
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.summary.totalPayments).toBe(4);
      expect(json.recentPayments).toHaveLength(1);
      expect(json.recentWebhookEvents).toHaveLength(1);
    });
  });
});
