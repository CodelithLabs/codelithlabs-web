// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/components/contact/ContactForm.tsx
// Interactive contact form with zod validation, Turnstile captcha,
// and animated submission states
// ═══════════════════════════════════════════════════════════════════════════

"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Turnstile, type BoundTurnstileObject } from "react-turnstile";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  contactFormSchema,
  INQUIRY_TYPES,
  type ContactFormData,
} from "@/lib/schemas/contact";

// ─── Types ───────────────────────────────────────────────────────────────

type FormStatus = "idle" | "submitting" | "success" | "error";

interface FieldErrors {
  [key: string]: string[] | undefined;
}

// ─── Component ───────────────────────────────────────────────────────────

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "General Inquiry",
    message: "",
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [apiError, setApiError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<BoundTurnstileObject | null>(null);

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  // ─── Handlers ────────────────────────────────────────────────────────

  const updateField = useCallback(
    (field: keyof ContactFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear field error on change
      if (fieldErrors[field]) {
        setFieldErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    },
    [fieldErrors]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setApiError("");

      // Client-side validation
      const result = contactFormSchema.safeParse(formData);
      if (!result.success) {
        setFieldErrors(result.error.flatten().fieldErrors);
        return;
      }
      setFieldErrors({});

      if (!turnstileToken) {
        setApiError("Please complete the verification challenge.");
        return;
      }

      setStatus("submitting");

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, turnstileToken }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (data.fieldErrors) {
            setFieldErrors(data.fieldErrors);
            setStatus("error");
          } else {
            setApiError(data.error || "Something went wrong.");
            setStatus("error");
          }
          // Reset Turnstile on failure
          turnstileRef.current?.reset();
          setTurnstileToken("");
          return;
        }

        setStatus("success");
      } catch (e: unknown) {
        const msg =
          e instanceof Error ? e.message : "Network error. Please try again.";
        setApiError(msg);
        setStatus("error");
        turnstileRef.current?.reset();
        setTurnstileToken("");
      }
    },
    [formData, turnstileToken]
  );

  // ─── Input classes ───────────────────────────────────────────────────

  const inputBase =
    "w-full bg-white/5 border rounded-lg px-4 py-3 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all";

  const getInputClass = (field: string) =>
    `${inputBase} ${fieldErrors[field] ? "border-red-500/50" : "border-white/10"}`;

  // ─── Success state ───────────────────────────────────────────────────

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6"
        >
          <CheckCircle2 className="w-8 h-8 text-green-400" />
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-3">Message Sent!</h3>
        <p className="text-zinc-400 max-w-sm mb-2">
          Thank you for reaching out. We&apos;ve sent a confirmation to your
          email.
        </p>
        <p className="text-zinc-500 text-sm">
          Expect a response within{" "}
          <span className="text-white font-medium">24 hours</span>.
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setFormData({
              name: "",
              email: "",
              phone: "",
              company: "",
              subject: "General Inquiry",
              message: "",
            });
            setTurnstileToken("");
            turnstileRef.current?.reset();
          }}
          className="mt-8 px-6 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 text-sm hover:border-zinc-500 hover:text-white transition-all"
        >
          Send Another Message
        </button>
      </motion.div>
    );
  }

  // ─── Form ────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* API Error Banner */}
      <AnimatePresence>
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20"
          >
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{apiError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name + Email row */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="contact-name"
            name="name"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            className={getInputClass("name")}
            placeholder="John Doe"
            disabled={status === "submitting"}
          />
          <FieldError errors={fieldErrors.name} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            id="contact-email"
            name="email"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            className={getInputClass("email")}
            placeholder="john@company.com"
            disabled={status === "submitting"}
          />
          <FieldError errors={fieldErrors.email} />
        </div>
      </div>

      {/* Phone + Company row */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300">Phone</label>
          <input
            type="tel"
            id="contact-phone"
            name="phone"
            value={formData.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className={getInputClass("phone")}
            placeholder="+91 98765 43210"
            disabled={status === "submitting"}
          />
          <FieldError errors={fieldErrors.phone} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300">Company</label>
          <input
            type="text"
            id="contact-company"
            name="company"
            value={formData.company}
            onChange={(e) => updateField("company", e.target.value)}
            className={getInputClass("company")}
            placeholder="Acme Inc."
            disabled={status === "submitting"}
          />
          <FieldError errors={fieldErrors.company} />
        </div>
      </div>

      {/* Subject */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-300">
          Inquiry Type <span className="text-red-400">*</span>
        </label>
        <select
          id="contact-subject"
          name="subject"
          value={formData.subject}
          onChange={(e) => updateField("subject", e.target.value)}
          className={`${getInputClass("subject")} appearance-none`}
          disabled={status === "submitting"}
        >
          {INQUIRY_TYPES.map((type) => (
            <option key={type} value={type} className="bg-zinc-900">
              {type}
            </option>
          ))}
        </select>
        <FieldError errors={fieldErrors.subject} />
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-300">
          Message <span className="text-red-400">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          value={formData.message}
          onChange={(e) => updateField("message", e.target.value)}
          className={`${getInputClass("message")} h-32 resize-none`}
          placeholder="Tell us how we can help..."
          disabled={status === "submitting"}
        />
        <div className="flex justify-between">
          <FieldError errors={fieldErrors.message} />
          <span className="text-xs text-zinc-600">
            {formData.message.length}/5000
          </span>
        </div>
      </div>

      {/* Turnstile */}
      {turnstileSiteKey && (
        <div className="flex justify-center">
          <Turnstile
            sitekey={turnstileSiteKey}
            onVerify={(token, boundTurnstile) => {
              setTurnstileToken(token);
              turnstileRef.current = boundTurnstile;
            }}
            onExpire={() => setTurnstileToken("")}
            theme="dark"
          />
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400
                   disabled:from-blue-600/50 disabled:to-blue-500/50 disabled:cursor-not-allowed
                   text-white font-semibold py-3.5 rounded-xl transition-all duration-200
                   flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20
                   hover:shadow-blue-500/30"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Message
          </>
        )}
      </button>

      {/* Legal note */}
      <p className="text-xs text-center text-zinc-500">
        By submitting, you agree to our{" "}
        <Link href="/privacy" className="underline hover:text-zinc-300 transition-colors">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href="/terms" className="underline hover:text-zinc-300 transition-colors">
          Terms of Service
        </Link>
        .
      </p>
    </form>
  );
}

// ─── Field Error Display ─────────────────────────────────────────────────

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <p className="text-xs text-red-400 mt-1">{errors[0]}</p>
  );
}
