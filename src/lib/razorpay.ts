import crypto from "crypto";

export const PREMIUM_PLAN_CODE = "premium_monthly";
export const PREMIUM_AMOUNT_PAISE = 29900;
export const PREMIUM_CURRENCY = "INR";
export const PREMIUM_DURATION_MONTHS = 1;

function timingSafeHexEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left, "utf8");
  const rightBuffer = Buffer.from(right, "utf8");

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function buildPaymentSignaturePayload(orderId: string, paymentId: string): string {
  return `${orderId}|${paymentId}`;
}

export function computeRazorpayPaymentSignature(orderId: string, paymentId: string, secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(buildPaymentSignaturePayload(orderId, paymentId))
    .digest("hex");
}

export function verifyRazorpayPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
  secret: string;
}): boolean {
  const expected = computeRazorpayPaymentSignature(params.orderId, params.paymentId, params.secret);
  return timingSafeHexEqual(expected, params.signature);
}

export function computeRazorpayWebhookSignature(body: string, secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
}

export function verifyRazorpayWebhookSignature(params: {
  body: string;
  signature: string;
  secret: string;
}): boolean {
  const expected = computeRazorpayWebhookSignature(params.body, params.secret);
  return timingSafeHexEqual(expected, params.signature);
}

export function calculatePremiumExpiry(from = new Date(), months = PREMIUM_DURATION_MONTHS): Date {
  const expiry = new Date(from);
  expiry.setMonth(expiry.getMonth() + months);
  return expiry;
}
