# Internal API Documentation

**Last Updated:** March 3, 2026  
**Version:** 1.0

This document describes the internal API endpoints used by CodelithLabs. These are not public APIs and should not be called directly by external services.

---

## Table of Contents

1. [Contact Form](#contact-form)
2. [Newsletter Subscription](#newsletter-subscription)
3. [Payment Processing](#payment-processing)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)
6. [Authentication](#authentication)

---

## Contact Form

### `POST /api/contact`

Submit a contact form message.

**Rate Limit:** 5 requests per 15 minutes (per IP)

#### Request

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: {csrf-token}" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "I have a question about your platform",
    "turnstileToken": "0.1234567890abcdef..."
  }'
```

#### Request Body

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `name` | string | Yes | 1-100 characters |
| `email` | string | Yes | Valid email address |
| `message` | string | Yes | 10-5000 characters |
| `turnstileToken` | string | Yes | Valid Cloudflare Turnstile token |

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Message sent successfully. We'll get back to you soon!"
}
```

**Validation Error (400 Bad Request)**
```json
{
  "error": "Invalid email address."
}
```

**CAPTCHA Failed (403 Forbidden)**
```json
{
  "error": "CAPTCHA verification failed. Please try again."
}
```

**Rate Limited (429 Too Many Requests)**
```json
{
  "error": "Too many requests. Please try again in 15 minutes."
}
```

**Server Error (502 Bad Gateway)**
```json
{
  "error": "Failed to send message. Please try again later."
}
```

#### Response Headers

| Header | Value | Purpose |
|--------|-------|---------|
| `X-RateLimit-Limit` | 5 | Maximum requests allowed |
| `X-RateLimit-Remaining` | 3 | Remaining requests in window |
| `X-RateLimit-Reset` | 1709489400 | Unix timestamp when limit resets |
| `Retry-After` | 900 | Seconds to wait before retrying (on 429) |

#### Security

- ✅ CSRF token required in header `X-CSRF-Token`
- ✅ Turnstile CAPTCHA verification required
- ✅ Rate limited by IP address
- ✅ Input validation with Zod schemas
- ✅ Email sanitization before sending
- ✅ Server-side email list protection

#### Implementation

- **Handler:** `src/app/api/contact/route.ts`
- **Schema:** Email via SendGrid
- **Validation:** Zod schema in handler
- **Logging:** Error logs on SendGrid failures

---

## Newsletter Subscription

### `POST /api/newsletter`

Subscribe email to ConvertKit newsletter.

**Rate Limit:** 10 requests per 15 minutes (per IP)

#### Request

```bash
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: {csrf-token}" \
  -d '{
    "email": "subscriber@example.com",
    "firstName": "John"
  }'
```

#### Request Body

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `email` | string | Yes | Valid email address |
| `firstName` | string | No | 0-100 characters |

#### Response

**Success (200 OK)**
```json
{
  "success": true
}
```

**Validation Error (400 Bad Request)**
```json
{
  "error": "Invalid email address."
}
```

**Not Configured (503 Service Unavailable)**
```json
{
  "error": "Newsletter service not configured."
}
```

**ConvertKit Error (502 Bad Gateway)**
```json
{
  "error": "Failed to subscribe. Please try again."
}
```

#### Response Headers

| Header | Value |
|--------|-------|
| `X-RateLimit-Limit` | 10 |
| `X-RateLimit-Remaining` | 9 |
| `X-RateLimit-Reset` | 1709489400 |

#### Security

- ✅ CSRF token required
- ✅ Email validation
- ✅ Rate limited by IP
- ✅ No password required (email only)
- ✅ Graceful error handling
- ✅ API key sent as query parameter (secure)

#### Implementation

- **Handler:** `src/app/api/newsletter/route.ts`
- **External Service:** ConvertKit API v3
- **ConvertKit Endpoint:** `https://api.convertkit.com/v3/forms/{formId}/subscribe`
- **Logging:** Errors logged, no sensitive data

---

## Payment Processing

### `POST /api/razorpay/create-order`

Create a Razorpay payment order for premium subscription.

**Rate Limit:** 5 requests per 15 minutes (per IP)

#### Request

```bash
curl -X POST http://localhost:3000/api/razorpay/create-order \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: {csrf-token}" \
  -d '{
    "amount": 99900,
    "planType": "monthly"
  }'
```

#### Request Body

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `amount` | number | Yes | >= 100 (paise), <= 50000000 |
| `planType` | string | Yes | "monthly" or "annual" |

#### Response

**Success (200 OK)**
```json
{
  "order": {
    "id": "order_1234567890abcdef",
    "amount": 99900,
    "currency": "INR",
    "status": "created"
  }
}
```

**Invalid Amount (400 Bad Request)**
```json
{
  "error": "Amount must be at least 100 paise (₹1.00)"
}
```

**Razorpay Error (502 Bad Gateway)**
```json
{
  "error": "Failed to create payment order. Please try again."
}
```

#### Response Headers

| Header | Value |
|--------|-------|
| `X-RateLimit-Limit` | 5 |
| `X-RateLimit-Remaining` | 4 |
| `X-RateLimit-Reset` | 1709489400 |

#### Security

- ✅ CSRF token required
- ✅ Amount validated server-side
- ✅ Order ID returned (not modifiable by client)
- ✅ Payment signature required for verification
- ✅ Rate limited by IP
- ✅ Authentication optional (can pay without login)

#### Implementation

- **Handler:** `src/app/api/razorpay/create-order/route.ts`
- **External Service:** Razorpay Orders API
- **Auth:** Optional (works for anonymous users)

---

### `POST /api/razorpay/verify-payment`

Verify and process Razorpay payment signature.

**Rate Limit:** 10 requests per 15 minutes (per IP)

**🔐 CRITICAL SECURITY ENDPOINT**

#### Request

```bash
curl -X POST http://localhost:3000/api/razorpay/verify-payment \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: {csrf-token}" \
  -d '{
    "orderId": "order_1234567890abcdef",
    "paymentId": "pay_1234567890abcdef",
    "signature": "abcdef1234567890..."
  }'
```

#### Request Body

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `orderId` | string | Yes | Must match order from /create-order |
| `paymentId` | string | Yes | Razorpay payment ID |
| `signature` | string | Yes | HMAC-SHA256 signature (64 hex chars) |

#### Response

**Success (200 OK)**
```json
{
  "success": true,
  "message": "Payment verified successfully. Your premium upgrade is active!"
}
```

**Signature Invalid (403 Forbidden)**
```json
{
  "error": "Payment verification failed. Fraudulent signature detected."
}
```

**Order Not Found (404 Not Found)**
```json
{
  "error": "Order not found or already processed."
}
```

**Database Error (503 Service Unavailable)**
```json
{
  "error": "Payment processed but status update failed. Contact support."
}
```

#### Response Headers

Same as create-order, with `X-RateLimit-Limit: 10`

#### Security Details

**HMAC-SHA256 Signature Verification:**
```
Signature = HMAC_SHA256(
  key=RAZORPAY_KEY_SECRET,
  message="{orderId}|{paymentId}"
)
```

- ✅ Timing-safe comparison prevents timing attacks
- ✅ Signature generated on server with secret key
- ✅ Client cannot forge valid signature without key
- ✅ Prevents payment tampering or replay attacks
- ✅ Audit logged for all verification attempts
- ✅ Replay protection: Order ID tracked (can't process twice)

**Flow:**
1. Client submits payment data from Razorpay
2. Server calculates expected signature with `RAZORPAY_KEY_SECRET`
3. Server compares with submitted signature (timing-safe)
4. Only on match: User marked as premium in database
5. Session is NOT updated immediately (client refreshes browser)

#### Why This is Critical

- **Payment fraud prevention** - Only Razorpay + secret key can create valid signatures
- **Replay attack prevention** - Each order processed only once
- **Privilege escalation prevention** - Client cannot self-assign premium status

#### Implementation

- **Handler:** `src/app/api/razorpay/verify-payment/route.ts`
- **Signature Algorithm:** HMAC-SHA256
- **Comparison Method:** `crypto.timingSafeEqual()` (NOT `===`)
- **Auth:** Must be authenticated user
- **Audit:** All attempts logged
- **Database:** Tracks processed order IDs

---

## Error Handling

### Error Response Format

All API errors follow this format:

```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE" (optional)
}
```

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Payment verified, message sent |
| 400 | Bad Request | Invalid email, missing field |
| 403 | Forbidden | CSRF token invalid, signature verification failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 502 | Bad Gateway | External service (ConvertKit, Razorpay) failed |
| 503 | Service Unavailable | Database down, required config missing |

### Error Handling Best Practices

- **Sensitive data never logged** - API keys, passwords, tokens excluded
- **Generic messages to client** - Detailed errors only in server logs
- **Retry indicators** - Use `Retry-After` header for transient errors
- **Clear error messages** - Tell users what went wrong and how to fix it

---

## Rate Limiting

### By Endpoint

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/contact` | 5 | 15 minutes |
| `/api/newsletter` | 10 | 15 minutes |
| `/api/razorpay/create-order` | 5 | 15 minutes |
| `/api/razorpay/verify-payment` | 10 | 15 minutes |

### How Rate Limiting Works

1. **Key:** Client IP address (from `X-Forwarded-For` header or socket IP)
2. **Storage:** Redis (with in-memory fallback in development)
3. **Algorithm:** Token bucket (counter increments, resets after TTL)
4. **Response:** `429 Too Many Requests` with `Retry-After` header

### Bypass Rate Limiting

Currently **not possible** (by design - protects against spam/DoS)

Future enhancement: API keys for trusted clients

---

## Authentication

### How Authentication Works

1. **Sign-in:** User clicks "Sign in with Google"
2. **OAuth:** Google handles credentials securely
3. **Session:** Server creates JWT token
4. **Cookie:** Token stored in secure, HTTPOnly cookie
5. **Client:** React reads session via NextAuth's `useSession()` hook

### Authentication Endpoints

These are handled by NextAuth (not custom code):

- `GET /api/auth/signin` - Sign-in page
- `POST /api/auth/callback/google` - Google OAuth callback
- `GET /api/auth/session` - Get current session
- `POST /api/auth/signout` - Sign out

### Checking Authentication in API Routes

```typescript
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  // Authenticated user, proceed...
}
```

### Client-Side Session Access

```tsx
import { useSession } from "next-auth/react";

export function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === "unauthenticated") {
    return <p>Please sign in</p>;
  }
  
  if (session?.user?.isPremium) {
    // Show premium features
  }
}
```

---

## Testing

### Testing with curl

```bash
# Contact form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test message","turnstileToken":"test"}'

# Newsletter
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Razorpay order
curl -X POST http://localhost:3000/api/razorpay/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount":99900,"planType":"monthly"}'
```

### Testing with Vitest

See `src/__tests__/api/*.test.ts` for comprehensive test suites

```bash
npm run test:run -- src/__tests__/api/
```

### Testing with Playwright (E2E)

```bash
npm run test:e2e -- contact.spec.ts
npm run test:e2e -- critical-flows.spec.ts
```

---

## Monitoring & Debugging

### Enable Debug Logging

Set environment variable:
```bash
DEBUG=nextauth:* npm run dev
```

### Check Rate Limiter State

```bash
# View Redis rate limiter state (if using Redis)
redis-cli
> GET codelithlabs:rate-limit:192.168.1.1:contact
```

### Monitor Errors

- **Vercel dashboard:** https://vercel.com → Project → Logs
- **Console logs:** `npm run dev` shows real-time logs

---

## Versioning

This is version 1.0 of the API documentation. 

Future versions may introduce:
- API key authentication for trusted clients
- Webhook support for payment status updates
- Bulk operations
- GraphQL alternative

Breaking changes will be documented with migration guides.

---

**Last Updated:** March 3, 2026  
**Maintained by:** CodelithLabs Development Team
