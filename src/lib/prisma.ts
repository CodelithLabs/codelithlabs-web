import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export function isDatabaseConfigured(): boolean {
  const rawUrl = process.env.DATABASE_URL?.trim();

  if (!rawUrl) {
    return false;
  }

  // Common placeholder values should be treated as not configured.
  if (/^your[-_]/i.test(rawUrl) || /^placeholder/i.test(rawUrl)) {
    return false;
  }

  // Accept direct Postgres URLs for local/dev and Prisma Data Proxy URLs when used.
  const isSupportedProtocol =
    rawUrl.startsWith('postgresql://') ||
    rawUrl.startsWith('postgres://') ||
    rawUrl.startsWith('prisma://') ||
    rawUrl.startsWith('prisma+postgres://');

  return isSupportedProtocol;
}
