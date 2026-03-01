// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/lib/schemas/contact.ts
// Shared Zod validation schema for the contact form
// Used by both the client (ContactForm.tsx) and server (API route)
// ═══════════════════════════════════════════════════════════════════════════

import { z } from "zod";

export const INQUIRY_TYPES = [
  "General Inquiry",
  "Partnership",
  "Support",
  "Careers",
  "Feedback",
  "Other",
] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number];

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(254, "Email must be under 254 characters")
    .trim()
    .toLowerCase(),
  phone: z
    .string()
    .max(20, "Phone number must be under 20 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  company: z
    .string()
    .max(100, "Company name must be under 100 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  subject: z.enum(INQUIRY_TYPES, {
    errorMap: () => ({ message: "Please select an inquiry type" }),
  }),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be under 5000 characters")
    .trim(),
});

/** Schema with Turnstile token for server-side validation */
export const contactSubmissionSchema = contactFormSchema.extend({
  turnstileToken: z.string().min(1, "Please complete the verification"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;
