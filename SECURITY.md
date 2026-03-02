# Security Policy

**Last Updated:** March 3, 2026  
**Version:** 1.0

---

## Overview

CodelithLabs is committed to maintaining the highest security standards for user data and platform integrity. This document outlines our security practices, vulnerability disclosure policy, and security features.

---

## Security Features

### 🔐 Authentication & Authorization

- **NextAuth v5 (Auth.js)** with Google OAuth 2.0
- **JWT-based sessions** with strong HMAC-SHA256 signing
- **Secure cookies** with `HttpOnly`, `Secure`, and `SameSite=Lax` flags
- **Custom isPremium flag** set server-side after payment verification only
- **Session callbacks** validate and expose minimal user data to client

**How it works:**
1. User signs in via Google OAuth
2. Server creates JWT token with `isPremium=false` by default
3. Only after Razorpay payment verification, `isPremium` is set to `true`
4. Client cannot self-assign payment status

### 🛡️ CSRF Protection

- **Middleware-based validation** on all state-changing requests (POST, PUT, PATCH, DELETE)
- **Double-submit cookie pattern** with signed tokens
- **HMAC-SHA256 signatures** validate token integrity
- **Token rotation** on every request for maximum security
- **SameSite cookies** provide additional browser-level protection

**Protected Endpoints:**
- `/api/contact` - Contact form submission
- `/api/newsletter` - Newsletter signup
- `/api/razorpay/*` - Payment processing
- All custom API routes except `/api/auth/*`

### 🤖 CAPTCHA Protection

- **Cloudflare Turnstile** on all user-facing forms
- **Server-side verification** (Turnstile token validation required)
- **Rate limiting** (5-10 requests per 15 minutes by IP)
- **Automatic spam detection** via Turnstile analytics

### 🔑 API Key Security

- **Environment variable validation** at startup (fail-fast on missing keys)
- **Never logged** - API keys excluded from logs and error messages
- **Sent privately** - Keys transmitted to external APIs only over HTTPS
- **ConvertKit API key** sent as query parameter (not in request body)
- **Razorpay secrets** used only server-side for payment signature verification

### 💳 Payment Security

- **Razorpay integration** - PCI-DSS level 1 compliance
- **HMAC-SHA256 signature verification** - Verifies payment authenticity
- **Timing-safe comparison** - Prevents timing attacks on signatures
- **Replay attack prevention** - Tracks processed order IDs
- **No client-side trust** - Server always verifies payment signatures

**Payment Flow:**
1. Client initiates order creation via `.../api/razorpay/create-order`
2. Server returns order ID without amount (prevents tampering)
3. Razorpay processes payment in secure popup
4. Client submits verification with paymentId + orderId + signature
5. Server verifies signature using HMAC-SHA256
6. Only on verified signature: user marked as premium

### 🌐 HTTPS & TLS

- **HTTPS only** on all routes (enforced by CSP and HSTS)
- **HSTS with preload** - Prevents downgrade attacks
- **Minimum TLS 1.2** - No insecure protocols
- **Certificate pinning considerations** - Vercel handles automatically

### 🔒 Content Security Policy

**Strict CSP headers** configured in [vercel.json](vercel.json):
```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'nonce-{random}' *.google-analytics.com clarity.ms;
  style-src 'self' 'unsafe-inline' fonts.googleapis.com;
  img-src 'self' data: https:;
  font-src 'self' fonts.gstatic.com;
  connect-src 'self' *.google-analytics.com clarity.ms;
  frame-src challenges.cloudflare.com;
  form-action 'self';
  base-uri 'self';
```

**Protects against:**
- XSS attacks via script injection
- Unauthorized API calls
- Clickjacking
- Man-in-the-middle downgrade attacks

### 📧 Email Security

- **SendGrid API** for all transactional emails
- **HTTPS-only** communication with SendGrid
- **Authorization header** with Bearer token (not in body)
- **Input sanitization** - User-provided text escaped before rendering
- **Email validation** - Server-side validation of recipient addresses
- **No credentials in logs** - API keys never logged

### 🔍 Input Validation

- **Zod schemas** - Runtime validation of all API requests
- **Type safety** - TypeScript strict mode enabled
- **Sanitization** - HTML-unsafe content escapes before output
- **File validation** - Image compression validates file type and size (max 15MB)
- **Rate limiting** - Prevents brute force and DoS attacks

### 🎨 Output Encoding

- **DOMPurify** - Sanitizes user-generated HTML in markdown previewer
- **React autoescape** - Default safe escaping in JSX
- **JSON-only API responses** - No HTML/JavaScript in API outputs
- **Content-Type headers** - Correct MIME types prevent type sniffing

### 📝 Logging & Monitoring

- **Error logging** - Detailed errors logged server-side, generic messages to client
- **Payment audit trail** - All payment verifications logged for reconciliation
- **No sensitive data logging** - API keys, passwords, tokens excluded
- **Vercel Analytics** - Performance and error monitoring
- **Turnstile analytics** - CAPTCHA challenge insights

### 🔐 Secrets Management

**Best practices:**
- **Never hardcoded** - All secrets in environment variables
- **Fail-fast approach** - Build fails if required secrets missing
- **Rotation capability** - Can update secrets without code change
- **Access control** - Limited to necessary services only
- **Vercel integration** - Secrets stored in Vercel UI, not repository

**Secrets stored in Vercel:**
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `SENDGRID_API_KEY`
- `TURNSTILE_SECRET_KEY`
- `RAZORPAY_KEY_SECRET`
- `CONVERTKIT_API_KEY`
- `REDIS_URL` (if applicable)

### 🔄 Cookie Security

- **HttpOnly flag** - Prevents JavaScript access (XSS mitigation)
- **Secure flag** - Only transmitted over HTTPS
- **SameSite=Lax** - Prevents CSRF attacks
- **Short expiration** - Session tokens expire after 24-48 hours
- **Signed CSRF tokens** - Cryptographic validation prevents tampering

### 🎯 Client-Side Security

- **No sensitive data in localStorage** - Session data in secure cookies only
- **No inline scripts** - All JavaScript in separate files with CSP nonce
- **No eval() or equivalent** - Safe JSON parsing (JSON.parse, not eval)
- **Web Workers** - Long-running tasks offloaded to avoid blocking main thread
- **No DOM mutations from untrusted data** - Safe templating with React

### 🚀 Deployment Security

- **Vercel edge functions** - DDoS protection by default
- **Auto-scaling** - Handles traffic spikes without manual intervention
- **Git integration** - Automatic deployments from protected `main` branch
- **Preview environments** - Staging for testing before production release
- **Environment parity** - Same configs across dev/staging/production

---

## Vulnerability Disclosure

If you discover a security vulnerability, please report it responsibly:

**Email:** security@codelithlabs.in (or team.codelithlabs@gmail.com)

### Disclosure Timeline

1. **Discovery** - You find a vulnerability
2. **Report** (within 48 hours of discovery):
   - Describe the vulnerability
   - Include steps to reproduce
   - Provide proof-of-concept if possible
   - Your contact information
3. **Acknowledgment** (within 24 hours):
   - We confirm receipt of your report
   - We assign a severity level
4. **Investigation** (within 3-5 days):
   - We validate the vulnerability
   - We determine affected components
5. **Fix & Test** (within 7-14 days depending on severity):
   - We develop and test a fix
   - We may request additional information
6. **Disclosure** (coordinated):
   - We deploy the fix
   - We Credit you publicly (if desired)
   - We publish a security advisory

### Severity Levels

| Level | Impact | Example | Timeline |
|-------|--------|---------|----------|
| **Critical** | Complete system compromise | Remote code execution, auth bypass | 24-48 hours |
| **High** | Major security breach | SQL injection, XSS in core feature | 3-7 days |
| **Medium** | Significant risk | Account takeover risk, data exposure | 7-14 days |
| **Low** | Minor risk | Information disclosure, DoS of specific resource | 30 days |

### What We Ask

- **Do not** publicly disclose before we contact you back
- **Do not** access data beyond testing the vulnerability
- **Do not** target production data (test on staging if possible)
- **Do** give us reasonable time to fix before disclosure
- **Do** provide detailed, actionable information

### What We Provide

- Public acknowledgment (if desired)
- Potential reward/bounty (for critical vulnerabilities)
- Transparency in our response process
- Updates on fix status

---

## Security Best Practices for Users

### When Using CodelithLabs

1. **Keep your password strong** - Use a unique password for Google account
2. **Enable 2FA on Google** - Add extra protection to your Google account
3. **Don't share your link** - Premium feature links are personal to your account
4. **Verify payment confirmation** - Check email after purchasing premium
5. **Log out on shared devices** - Don't stay signed in on public computers
6. **Report suspicious activity** - Contact us immediately if something seems wrong

### Client-Side Processing Privacy

- **All tool processing is client-side** - Your data never leaves your browser
- **Images, text, files** - Processed entirely in your browser's memory
- **No server upload** - Except for contact/newsletter forms (required)
- **Network tab verification** - You can verify no data is sent to our servers

---

## Security Headers

All responses include security headers:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Content-Security-Policy: [as listed above]
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

---

## Regular Security Reviews

- **Code audits** - Automated via ESLint and TypeScript strict mode
- **Dependency scanning** - npm audit on each build
- **Security advisories** - Monitored and patched promptly
- **Manual review** - Security review before each major release
- **Penetration testing** - Planned annually or after major changes

---

## Known Limitations

### Out of Scope

- **Browser vulnerabilities** - We cannot fix 0-day browser bugs
- **Google OAuth issues** - Reported directly to Google Security
- **Razorpay/SendGrid security** - Our responsibility to use them securely
- **Network-level attacks** - DDoS protections are Vercel's responsibility

### Currently Acknowledged Risks

1. **NextAuth v5 beta** - Using beta software; plan upgrade to v5.0.0 stable
2. **ConvertKit privacy** - User email sent to ConvertKit per their privacy policy
3. **Analytics tracking** - Limited Microsoft Clarity and Google Analytics tracking
4. **Third-party scripts** - Analytics and CAPTCHA scripts add attack surface

---

## Contact

**Security Team:** security@codelithlabs.in  
**General Support:** team.codelithlabs@gmail.com  
**GitHub Issues:** [CodelithLabs/codelithlabs-web](https://github.com/CodelithLabs/codelithlabs-web/issues) - **Do NOT report security issues here**

---

**Disclaimer:** This security policy represents our current best practices. Security is an ongoing process, and we continuously improve our systems. This policy may be updated without notice.
