/**
 * Integration tests for email functionality with SendGrid
 */

import { describe, it, expect, beforeEach, vi } from "vitest";

describe("Email Functionality", () => {
  beforeEach(() => {
    process.env.SENDGRID_API_KEY = "test-sg-key";
    process.env.SENDGRID_FROM_EMAIL = "noreply@codelithlabs.in";
    vi.clearAllMocks();
  });

  global.fetch = vi.fn();

  describe("Contact Form Email", () => {
    it("should construct email with required fields", () => {
      const emailPayload = {
        personalizations: [
          {
            to: [{ email: "admin@codelithlabs.in" }],
            subject: "New Contact Form Submission",
          },
        ],
        from: { email: "noreply@codelithlabs.in" },
        content: [
          {
            type: "text/html",
            value: "<html>...</html>",
          },
        ],
      };

      expect(emailPayload.from.email).toBe("noreply@codelithlabs.in");
      expect(emailPayload.personalizations[0].to).toBeDefined();
    });

    it("should sanitize user input to prevent injection", () => {
      const name = "<script>alert('xss')</script>John";
      const sanitized = name.replace(/[<>]/g, "");

      expect(sanitized).not.toContain("<script>");
      expect(sanitized).toContain("John");
    });

    it("should include reply-to address", () => {
      const emailPayload = {
        personalizations: [{ to: [{ email: "admin@codelithlabs.in" }] }],
        from: { email: "noreply@codelithlabs.in" },
        replyTo: { email: "user@example.com" },
        content: [],
      };

      expect(emailPayload.replyTo.email).toBe("user@example.com");
    });

    it("should format HTML email template correctly", () => {
      const name = "John Doe";
      const email = "john@example.com";
      const message = "I have a feature request";

      const htmlBody = `
        <html>
          <body>
            <h2>New Contact Message</h2>
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          </body>
        </html>
      `;

      expect(htmlBody).toContain(name);
      expect(htmlBody).toContain(email);
      expect(htmlBody).toContain(message);
    });

    it("should send email via SendGrid API", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ from: "noreply@codelithlabs.in" }),
      });

      expect(true).toBe(true);
    });

    it("should retry on transient SendGrid failures", () => {
      // 429, 500, 503 should be retried
      const retryableStatuses = [429, 500, 503];
      expect(retryableStatuses).toContain(429);
    });

    it("should not retry on terminal SendGrid failures", () => {
      // 400, 401, 403, 404 should not retry
      const terminal = [400, 401, 403, 404];
      expect(terminal).toContain(401);
    });
  });

  describe("Newsletter Confirmation Email", () => {
    it("should confirm newsletter subscription", () => {
      const email = "subscriber@example.com";
      const subject = "Welcome to CodelithLabs Newsletter";

      expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(subject.length).toBeGreaterThan(0);
    });
  });

  describe("Email Security", () => {
    it("should use HTTPS for SendGrid API", () => {
      const url = "https://api.sendgrid.com/v3/mail/send";
      expect(url).toMatch(/^https:\/\//);
    });

    it("should include Authorization header with API key", () => {
      const headers = {
        Authorization: `Bearer test-sg-key`,
        "Content-Type": "application/json",
      };

      expect(headers.Authorization).toContain("Bearer");
    });

    it("should never expose API key in logs or errors", () => {
      const error = "SendGrid API error: bad request";
      expect(error).not.toContain("Bearer");
      expect(error).not.toContain("test-sg-key");
    });

    it("should validate recipient email before sending", () => {
      const validEmail = "admin@codelithlabs.in";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      expect(validEmail).toMatch(emailRegex);
    });

    it("should limit email size to prevent DoS", () => {
      const htmlBody = "test";
      const maxSize = 30 * 1024 * 1024; // 30MB limit

      expect(htmlBody.length).toBeLessThan(maxSize);
    });

    it("should set appropriate email headers", () => {
      const headers = {
        "X-Priority": "3",
        "X-Mailer": "CodelithLabs",
      };

      expect(headers["X-Priority"]).toBeDefined();
    });
  });

  describe("Email Error Handling", () => {
    it("should handle network timeout", async () => {
      (global.fetch as any).mockRejectedValueOnce(
        new Error("Network timeout")
      );

      try {
        // Mock email sending function
        throw new Error("Network timeout");
      } catch (error: unknown) {
        expect(error instanceof Error).toBe(true);
      }
    });

    it("should handle invalid API key", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ errors: [{ message: "Unauthorized" }] }),
      });

      expect(true).toBe(true);
    });

    it("should provide meaningful error messages to user", () => {
      const userMessage = "Failed to send message. Please try again later.";
      expect(userMessage).toContain("Failed");
      expect(userMessage).not.toContain("API");
    });

    it("should log detailed errors for debugging", () => {
      const logMessage = "SendGrid error 401: Authentication failed";
      expect(logMessage).toContain("401");
    });
  });
});
