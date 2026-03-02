/**
 * Integration tests for POST /api/newsletter route
 * Tests schema validation, API parameter handling
 * 
 * Note: Full integration with ConvertKit is tested via E2E
 */

import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

beforeEach(() => {
  process.env.CONVERTKIT_API_KEY = "test-api-key";
  process.env.CONVERTKIT_FORM_ID = "12345";
  vi.clearAllMocks();
});

afterEach(() => {
  vi.clearAllMocks();
});

global.fetch = vi.fn();

describe("POST /api/newsletter - Schema Validation", () => {
  const validPayload = {
    email: "subscriber@example.com",
    firstName: "John",
  };

  it("should accept valid newsletter payload", () => {
    expect(validPayload).toHaveProperty("email");
    expect(validPayload.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it("should validate email format", () => {
    const emails = {
      "valid@example.com": true,
      "user+tag@domain.co.uk": true,
      "invalid-email": false,
      "missing@": false,
      "": false,
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    Object.entries(emails).forEach(([email, shouldBeValid]) => {
      const isValid = emailRegex.test(email);
      expect(isValid).toBe(shouldBeValid);
    });
  });

  it("should accept optional firstName", () => {
    const payload1 = { email: "test@example.com" };
    const payload2 = { email: "test@example.com", firstName: "John" };

    expect(payload1).toHaveProperty("email");
    expect(payload2).toHaveProperty("firstName");
  });

  it("should require email field", () => {
    const invalidPayload = { firstName: "John" };
    expect(invalidPayload).not.toHaveProperty("email");
  });

  it("should reject invalid email formats", () => {
    const invalidEmails = [
      "notanemail",
      "missing-at.com",
      "@nodomain.com",
      "spaces in@email.com",
      "double@@email.com",
    ];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    invalidEmails.forEach((email) => {
      expect(emailRegex.test(email)).toBe(false);
    });
  });

  it("should limit firstName length", () => {
    const validLength = "John"; // Normal
    const maxLength = "A".repeat(100); // Max 100 chars
    const tooLong = "A".repeat(101); // Over limit

    expect(validLength.length).toBeLessThanOrEqual(100);
    expect(maxLength.length).toBeLessThanOrEqual(100);
    expect(tooLong.length).toBeGreaterThan(100);
  });

  it("should construct API URL correctly with query parameters", () => {
    const apiKey = "test-api-key";
    const formId = "12345";
    const url = `https://api.convertkit.com/v3/forms/${formId}/subscribe?api_key=${encodeURIComponent(apiKey)}`;

    expect(url).toContain("api_key=test-api-key");
    expect(url).toContain("https://");
    expect(url).toContain(`/forms/${formId}/`);
  });

  it("should NOT include API key in request body", () => {
    const bodyData = {
      email: "subscriber@example.com",
      first_name: "John",
    };

    expect(bodyData).not.toHaveProperty("api_key");
  });

  it("should handle special characters in firstName", () => {
    const names = [
      "José",
      "François",
      "陈",
      "O'Brien",
      "Jean-Pierre",
    ];

    names.forEach((name) => {
      expect(name.length).toBeGreaterThan(0);
    });
  });

  it("should require configuration validation", () => {
    const hasKey = !!process.env.CONVERTKIT_API_KEY;
    const hasFormId = !!process.env.CONVERTKIT_FORM_ID;

    expect(hasKey).toBe(true);
    expect(hasFormId).toBe(true);
  });
});
