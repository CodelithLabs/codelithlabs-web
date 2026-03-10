import { describe, expect, it } from "vitest";
import {
  buildPaymentSignaturePayload,
  calculatePremiumExpiry,
  computeRazorpayPaymentSignature,
  computeRazorpayWebhookSignature,
  verifyRazorpayPaymentSignature,
  verifyRazorpayWebhookSignature,
} from "@/lib/razorpay";

describe("razorpay utils", () => {
  const secret = "test_secret";

  it("builds payment signature payload correctly", () => {
    expect(buildPaymentSignaturePayload("order_123", "pay_456")).toBe("order_123|pay_456");
  });

  it("verifies valid payment signatures", () => {
    const signature = computeRazorpayPaymentSignature("order_123", "pay_456", secret);

    expect(
      verifyRazorpayPaymentSignature({
        orderId: "order_123",
        paymentId: "pay_456",
        signature,
        secret,
      })
    ).toBe(true);
  });

  it("rejects invalid payment signatures", () => {
    expect(
      verifyRazorpayPaymentSignature({
        orderId: "order_123",
        paymentId: "pay_456",
        signature: "invalid_signature",
        secret,
      })
    ).toBe(false);
  });

  it("verifies valid webhook signatures", () => {
    const body = JSON.stringify({ event: "payment.captured", payload: { payment: { entity: { id: "pay_1" } } } });
    const signature = computeRazorpayWebhookSignature(body, secret);

    expect(verifyRazorpayWebhookSignature({ body, signature, secret })).toBe(true);
  });

  it("rejects webhook signature with modified body", () => {
    const originalBody = JSON.stringify({ event: "payment.captured" });
    const signature = computeRazorpayWebhookSignature(originalBody, secret);
    const tamperedBody = JSON.stringify({ event: "payment.failed" });

    expect(
      verifyRazorpayWebhookSignature({
        body: tamperedBody,
        signature,
        secret,
      })
    ).toBe(false);
  });

  it("calculates premium expiry from a base date", () => {
    const base = new Date("2026-03-09T00:00:00.000Z");
    const expiry = calculatePremiumExpiry(base, 1);

    expect(expiry.toISOString()).toBe("2026-04-09T00:00:00.000Z");
  });
});
