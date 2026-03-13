const ADMIN_EMAILS_ENV_KEYS = ['PREMIUM_AUDIT_ADMIN_EMAILS', 'ADMIN_EMAILS'] as const;

function getConfiguredAdminEmails(): string[] {
  return ADMIN_EMAILS_ENV_KEYS.flatMap((key) =>
    (process.env[key] ?? '')
      .split(',')
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function isPremiumAuditConfigured(): boolean {
  return getConfiguredAdminEmails().length > 0;
}

export function canAccessPremiumAudit(email?: string | null): boolean {
  if (!email) return false;
  return getConfiguredAdminEmails().includes(email.trim().toLowerCase());
}