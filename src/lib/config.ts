/**
 * Environment variable validation and configuration
 * 
 * This module ensures all required environment variables are set and valid
 * at application startup, preventing silent failures or degraded functionality.
 * 
 * Generated using Zod for runtime type safety.
 */

import { z } from "zod";

// Define schema for all environment variables
const envSchema = z.object({
  // NextAuth / Authentication
  NEXTAUTH_SECRET: z.string().min(16, "NEXTAUTH_SECRET must be at least 16 characters long"),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL").optional(),

  // OAuth - Google
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required for OAuth"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required for OAuth"),

  // Email - SendGrid
  SENDGRID_API_KEY: z.string().min(1, "SENDGRID_API_KEY is required for email functionality"),
  SENDGRID_FROM_EMAIL: z.string().email("SENDGRID_FROM_EMAIL must be a valid email").optional(),

  // CAPTCHA - Cloudflare Turnstile
  TURNSTILE_SECRET_KEY: z.string().min(1, "TURNSTILE_SECRET_KEY is required for CAPTCHA"),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1, "NEXT_PUBLIC_TURNSTILE_SITE_KEY is required for CAPTCHA"),

  // Newsletter - ConvertKit
  CONVERTKIT_API_KEY: z.string().min(1, "CONVERTKIT_API_KEY is required for newsletter"),
  CONVERTKIT_FORM_ID: z.string().min(1, "CONVERTKIT_FORM_ID is required for newsletter").optional(),
  CONVERTKIT_API_SECRET: z.string().min(1, "CONVERTKIT_API_SECRET is required for newsletter").optional(),

  // Payment - Razorpay
  RAZORPAY_KEY_ID: z.string().min(1, "RAZORPAY_KEY_ID is required for payments"),
  RAZORPAY_KEY_SECRET: z.string().min(1, "RAZORPAY_KEY_SECRET is required for payments"),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1, "RAZORPAY_WEBHOOK_SECRET is required for webhook verification").optional(),

  // Ops / admin endpoints
  PREMIUM_AUDIT_ADMIN_EMAILS: z.string().optional(),

  // Cache - Redis (optional, with in-memory fallback)
  REDIS_URL: z.string().url("REDIS_URL must be a valid URL").optional(),

  // Analytics - Microsoft Clarity (optional)
  NEXT_PUBLIC_CLARITY_ID: z.string().optional(),

  // Google Analytics (optional)
  NEXT_PUBLIC_GA_ID: z.string().optional(),

  // Environment detection
  NODE_ENV: z.enum(["development", "production", "test"]).optional().default("production"),
});

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validate and return environment configuration
 * Throws descriptive error if validation fails
 */
export function getEnvConfig(): EnvConfig {
  try {
    const config = envSchema.parse(process.env);
    return config;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues
        .map((issue) => `  • ${issue.path.join(".")}: ${issue.message}`)
        .join("\n");

      throw new Error(
        `❌ Environment configuration validation failed:\n${missingVars}\n\n` +
        `📝 Check your .env.local or .env file and ensure all required variables are set.\n` +
        `💡 See .env.example for reference.`
      );
    }
    throw error;
  }
}

/**
 * Configuration object - safely accessed throughout the app
 * This is parsed at build time and runtime startup
 */
export const config = getEnvConfig();

/**
 * Fallback empty config for development/test with explicit missing values
 * Use in test files to avoid environment requirements
 */
export function getMockEnvConfig(overrides: Partial<EnvConfig> = {}): EnvConfig {
  return {
    NEXTAUTH_SECRET: "test-secret-test-secret-test-secret",
    NEXTAUTH_URL: "http://localhost:3000",
    GOOGLE_CLIENT_ID: "test-client-id",
    GOOGLE_CLIENT_SECRET: "test-client-secret",
    SENDGRID_API_KEY: "test-sendgrid-key",
    SENDGRID_FROM_EMAIL: "test@example.com",
    TURNSTILE_SECRET_KEY: "test-turnstile-secret",
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: "test-turnstile-site-key",
    CONVERTKIT_API_KEY: "test-convertkit-key",
    CONVERTKIT_FORM_ID: "12345",
    CONVERTKIT_API_SECRET: "test-convertkit-secret",
    RAZORPAY_KEY_ID: "test-razorpay-id",
    RAZORPAY_KEY_SECRET: "test-razorpay-secret",
    RAZORPAY_WEBHOOK_SECRET: "test-razorpay-webhook-secret",
    PREMIUM_AUDIT_ADMIN_EMAILS: "admin@example.com",
    REDIS_URL: undefined,
    NEXT_PUBLIC_CLARITY_ID: undefined,
    NEXT_PUBLIC_GA_ID: undefined,
    NODE_ENV: "test",
    ...overrides,
  };
}
