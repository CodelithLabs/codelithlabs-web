---
title: "JWT Decoder - Free Online JSON Web Token Inspector"
description: "Decode and inspect JWTs instantly. View header, payload claims, expiration time, and signature verification status — no libraries or sign-up needed."
keywords: ["jwt decoder", "jwt debugger", "json web token", "decode jwt", "jwt inspector", "jwt claims", "jwt verify", "jwt.io alternative"]
category: "developer"
slug: "jwt-decoder"
datePublished: "2025-01-15T00:00:00.000Z"
dateModified: "2026-02-28T00:00:00.000Z"
author: "CodelithLabs Team"
---

# JWT Decoder

Paste a JSON Web Token and instantly see its decoded header, payload, and signature. View all claims with human-readable timestamps, check token expiration status, and verify signatures with your secret key — all processed in your browser with no server requests.

## 🚀 Features

- **Instant Decoding** — Header and payload are decoded and syntax-highlighted immediately on paste
- **Claim Visualization** — Standard claims (`iss`, `sub`, `aud`, `exp`, `iat`, `nbf`) are labeled with descriptions and formatted values
- **Expiration Status** — Visual indicator showing whether the token is valid, expired, or not-yet-valid based on current time
- **Human-Readable Timestamps** — Unix timestamps in `exp`, `iat`, `nbf` are displayed as local dates and "time from now" (e.g., "Expires in 2 hours")
- **Signature Verification** — Enter your HS256/HS384/HS512 secret to verify the signature integrity
- **Algorithm Display** — Shows the signing algorithm (HS256, RS256, ES256, etc.) from the header
- **Token Structure** — Color-coded visualization of the three JWT parts: header (red), payload (purple), signature (cyan)

## 📖 How to Use JWT Decoder

1. **Paste JWT** — Copy a JWT from your application, API response, or browser cookies and paste it into the input field.
2. **View Decoded Parts** — The header (algorithm, type) and payload (all claims) are displayed as formatted JSON.
3. **Check Expiration** — The expiration status badge shows "Valid", "Expired", or "Not Yet Valid" with countdown/elapsed time.
4. **Verify Signature (Optional)** — Enter your HMAC secret key to verify the signature. The tool shows a green check or red X.
5. **Inspect Claims** — Each standard claim has a description popup explaining its purpose (hover over the claim name).

## 💡 Common Use Cases

### API Debugging
When an API returns a 401 or 403, decode the JWT from the `Authorization` header to check if it's expired, has the wrong audience, or is missing required scopes.

### Authentication Troubleshooting
Decode JWTs stored in cookies or localStorage to verify that the identity provider set the correct claims, roles, and permissions after login.

### Security Auditing
Review third-party JWTs to ensure they use strong algorithms (RS256 or ES256), have reasonable expiration times, and don't leak sensitive information in the payload.

### Mobile App Development
Inspect access tokens and refresh tokens during mobile app development to verify expiration handling, token refresh flows, and claim contents.

### OAuth/OIDC Debugging
Decode `id_token` values from OpenID Connect flows to verify `iss`, `aud`, `nonce`, and `at_hash` claims match your application's configuration.

## 🎯 Why Choose CodelithLabs JWT Decoder?

### Privacy-Critical Use Case
JWTs often contain email addresses, user IDs, roles, and other PII. Decoding them on third-party servers is a security risk. Our tool runs entirely in your browser — the token never leaves your machine.

### More Than Just Decoding
Most JWT decoders just show raw JSON. Ours explains each standard claim, converts timestamps to human-readable dates, shows expiration status, and verifies HMAC signatures.

### No Library or Install Required
No need to install `jwt-decode`, `jsonwebtoken`, or any npm package. Just open the page and paste your token.

## 🔧 Technical Details

### JWT Structure
A JWT consists of three Base64URL-encoded parts separated by dots:
```
header.payload.signature
```
- **Header**: `{"alg":"HS256","typ":"JWT"}` — Signing algorithm and token type
- **Payload**: `{"sub":"1234567890","name":"John Doe","iat":1516239022}` — Claims (data)
- **Signature**: HMAC-SHA256 or RSA/ECDSA signature of `header.payload`

### Supported Algorithms
| Algorithm | Type | Key |
|-----------|------|-----|
| HS256/384/512 | HMAC | Symmetric (shared secret) |
| RS256/384/512 | RSA | Asymmetric (public/private key) |
| ES256/384/512 | ECDSA | Asymmetric (elliptic curve) |
| PS256/384/512 | RSA-PSS | Asymmetric |

### Standard Claims (RFC 7519)
| Claim | Name | Description |
|-------|------|-------------|
| `iss` | Issuer | Who issued the token |
| `sub` | Subject | Who the token is about |
| `aud` | Audience | Intended recipient |
| `exp` | Expiration | Token expiry (Unix timestamp) |
| `iat` | Issued At | When the token was created |
| `nbf` | Not Before | Token isn't valid before this time |
| `jti` | JWT ID | Unique token identifier |

## 📝 Best Practices

1. **Never put secrets in JWT payloads** — JWTs are encoded, not encrypted. Anyone can decode the payload. Only put non-sensitive claims in the payload.
2. **Use short expiration times** — Access tokens should expire in 15-60 minutes. Use refresh tokens for longer sessions.
3. **Verify signatures in production** — Always verify JWT signatures server-side. Client-side decoding is for debugging only.
4. **Choose RS256 over HS256** — Asymmetric algorithms (RS256) don't require sharing a secret key between services, reducing the blast radius of key compromise.
5. **Validate all standard claims** — Check `iss`, `aud`, `exp`, and `nbf` on every request. Don't just check the signature.

## ❓ Frequently Asked Questions

### Is decoding a JWT the same as verifying it?
No. **Decoding** extracts the header and payload (anyone can do this — no key needed). **Verification** checks the signature against a secret or public key to confirm the token hasn't been tampered with. Always verify in production.

### Can someone read my JWT?
Yes. JWT payloads are Base64URL-encoded, not encrypted. Anyone who intercepts a JWT can decode and read all claims. For sensitive data, use JWE (JSON Web Encryption) instead of JWS (JSON Web Signature).

### What does "none" algorithm mean?
The `"alg": "none"` header means the token is unsigned. This is a known attack vector — attackers modify the algorithm to "none" and strip the signature. Always reject unsigned tokens in production.

### Why am I getting 401 errors with a valid-looking JWT?
Common causes: (1) Token expired — check the `exp` claim. (2) Wrong audience — the `aud` claim doesn't match the API's expected value. (3) Clock skew — server time differs from the issuer by more than the allowed tolerance.

### Can I create JWTs with this tool?
This tool is a decoder/inspector only. Creating production JWTs should be done server-side with proper libraries (jsonwebtoken for Node.js, PyJWT for Python, java-jwt for Java) that handle signing securely.

## 🌟 Related Tools

- [Base64 Encoder](/tools/base64-encoder) — Encode/decode Base64 (JWT uses Base64URL variant)
- [JSON Formatter](/tools/json-formatter) — Format the decoded JWT payload for readability
- [Hash Generator](/tools/hash-generator) — Generate SHA-256 hashes (used in JWT signatures)
- [Password Generator](/tools/password-generator) — Generate strong JWT signing secrets
- [API Tester](/tools/api-tester) — Test APIs with JWT authentication headers
