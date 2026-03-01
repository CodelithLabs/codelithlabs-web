// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/__tests__/schemas/contact.test.ts
// Unit tests for the contact form Zod validation schema
// ═══════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import { contactFormSchema, contactSubmissionSchema, INQUIRY_TYPES } from '@/lib/schemas/contact';

describe('contactFormSchema', () => {
  const validData = {
    name: 'Test User',
    email: 'test@example.com',
    subject: 'General Inquiry',
    message: 'This is a test message that is long enough to pass validation.',
  };

  it('accepts valid data with required fields only', () => {
    const result = contactFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('accepts valid data with all optional fields', () => {
    const result = contactFormSchema.safeParse({
      ...validData,
      phone: '+1234567890',
      company: 'Test Corp',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty name', () => {
    const result = contactFormSchema.safeParse({ ...validData, name: '' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = contactFormSchema.safeParse({ ...validData, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects too-short message', () => {
    const result = contactFormSchema.safeParse({ ...validData, message: 'short' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid subject', () => {
    const result = contactFormSchema.safeParse({ ...validData, subject: 'Invalid Subject' });
    expect(result.success).toBe(false);
  });

  it('accepts all valid inquiry types', () => {
    for (const type of INQUIRY_TYPES) {
      const result = contactFormSchema.safeParse({ ...validData, subject: type });
      expect(result.success).toBe(true);
    }
  });
});

describe('contactSubmissionSchema', () => {
  it('requires turnstileToken in addition to form data', () => {
    const result = contactSubmissionSchema.safeParse({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'General Inquiry',
      message: 'This is a valid message for testing purposes.',
      turnstileToken: 'test-token-123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects submission without turnstileToken', () => {
    const result = contactSubmissionSchema.safeParse({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'General Inquiry',
      message: 'This is a valid message for testing purposes.',
    });
    expect(result.success).toBe(false);
  });
});
