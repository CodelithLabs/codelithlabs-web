// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/lib/email-templates/contact-notification.ts
// HTML email template sent to the team when someone submits the contact form
// ═══════════════════════════════════════════════════════════════════════════

import type { ContactFormData } from "@/lib/schemas/contact";

export function buildNotificationEmail(data: ContactFormData): string {
  const { name, email, phone, company, subject, message } = data;

  const optionalRows = [
    phone
      ? `<tr><td style="padding:8px 16px;color:#94a3b8;font-size:14px;vertical-align:top;width:120px;">Phone</td><td style="padding:8px 16px;color:#e2e8f0;font-size:14px;">${escapeHtml(phone)}</td></tr>`
      : "",
    company
      ? `<tr><td style="padding:8px 16px;color:#94a3b8;font-size:14px;vertical-align:top;width:120px;">Company</td><td style="padding:8px 16px;color:#e2e8f0;font-size:14px;">${escapeHtml(company)}</td></tr>`
      : "",
  ].join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">
    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#3b82f6;font-size:20px;margin:0 0 4px;">CodelithLabs</h1>
      <p style="color:#64748b;font-size:13px;margin:0;">New Contact Form Submission</p>
    </div>

    <!-- Card -->
    <div style="background-color:#111113;border:1px solid #1e293b;border-radius:12px;overflow:hidden;">
      <!-- Subject badge -->
      <div style="padding:20px 24px;border-bottom:1px solid #1e293b;background-color:#0f172a;">
        <span style="display:inline-block;padding:4px 12px;border-radius:9999px;background-color:rgba(59,130,246,0.1);color:#60a5fa;font-size:12px;font-weight:600;border:1px solid rgba(59,130,246,0.2);">
          ${escapeHtml(subject)}
        </span>
      </div>

      <!-- Details table -->
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 16px;color:#94a3b8;font-size:14px;vertical-align:top;width:120px;">Name</td><td style="padding:8px 16px;color:#e2e8f0;font-size:14px;font-weight:600;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding:8px 16px;color:#94a3b8;font-size:14px;vertical-align:top;width:120px;">Email</td><td style="padding:8px 16px;"><a href="mailto:${escapeHtml(email)}" style="color:#60a5fa;text-decoration:none;font-size:14px;">${escapeHtml(email)}</a></td></tr>
        ${optionalRows}
      </table>

      <!-- Message -->
      <div style="padding:16px 24px;border-top:1px solid #1e293b;">
        <p style="color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Message</p>
        <div style="background-color:#0a0a0a;border:1px solid #1e293b;border-radius:8px;padding:16px;">
          <p style="color:#e2e8f0;font-size:14px;line-height:1.6;margin:0;white-space:pre-wrap;">${escapeHtml(message)}</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:24px;">
      <p style="color:#475569;font-size:12px;margin:0;">
        Reply directly to this email to respond to ${escapeHtml(name)}.
      </p>
    </div>
  </div>
</body>
</html>`.trim();
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
