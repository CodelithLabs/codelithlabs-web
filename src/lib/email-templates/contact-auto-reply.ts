// ═══════════════════════════════════════════════════════════════════════════
// FILE: src/lib/email-templates/contact-auto-reply.ts
// HTML email template sent to the user as an auto-reply confirmation
// ═══════════════════════════════════════════════════════════════════════════

export function buildAutoReplyEmail(name: string): string {
  const firstName = name.split(" ")[0] || name;

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">
    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#3b82f6;font-size:24px;margin:0 0 4px;">CodelithLabs</h1>
      <p style="color:#64748b;font-size:13px;margin:0;">Thank you for reaching out</p>
    </div>

    <!-- Card -->
    <div style="background-color:#111113;border:1px solid #1e293b;border-radius:12px;padding:32px 24px;">
      <h2 style="color:#e2e8f0;font-size:20px;margin:0 0 16px;">
        Hi ${escapeHtml(firstName)},
      </h2>
      <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 16px;">
        We've received your message and our team will review it shortly.
        You can expect a response within <strong style="color:#e2e8f0;">24 hours</strong> during business days.
      </p>
      <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 24px;">
        If your inquiry is urgent, feel free to email us directly at
        <a href="mailto:team.codelithlabs@gmail.com" style="color:#60a5fa;text-decoration:none;">team.codelithlabs@gmail.com</a>.
      </p>

      <!-- Divider -->
      <div style="border-top:1px solid #1e293b;margin:24px 0;"></div>

      <!-- What we do -->
      <p style="color:#64748b;font-size:13px;margin:0 0 12px;text-transform:uppercase;letter-spacing:1px;">While you wait, explore</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;">
            <a href="https://codelithlabs.in/tools" style="color:#60a5fa;text-decoration:none;font-size:14px;">
              🛠️ 100+ Free Online Tools
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;">
            <a href="https://codelithlabs.in/blog" style="color:#60a5fa;text-decoration:none;font-size:14px;">
              📝 Engineering Blog
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;">
            <a href="https://codelithlabs.in/projects" style="color:#60a5fa;text-decoration:none;font-size:14px;">
              🚀 Our Projects
            </a>
          </td>
        </tr>
      </table>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:24px;">
      <p style="color:#475569;font-size:12px;margin:0 0 8px;">
        This is an automated confirmation. Please do not reply to this email.
      </p>
      <p style="color:#334155;font-size:11px;margin:0;">
        &copy; 2026 CodelithLabs &middot; Kokrajhar, Assam, India
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
