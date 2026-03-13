import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { canAccessPremiumAudit, isPremiumAuditConfigured } from '@/lib/admin-access';
import { isDatabaseConfigured, prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  if (!isPremiumAuditConfigured()) {
    return NextResponse.json(
      { error: 'Premium audit access is not configured' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  if (!canAccessPremiumAudit(session.user.email)) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: 'Premium database is not configured' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const stuckThreshold = new Date(Date.now() - 30 * 60 * 1000);

  const [
    totalPayments,
    verifiedPayments,
    failedPayments,
    createdPayments,
    recentPayments,
    recentWebhookEvents,
    stuckPayments,
    failedWebhookEvents,
  ] = await Promise.all([
    prisma.payment.count(),
    prisma.payment.count({ where: { status: 'VERIFIED' } }),
    prisma.payment.count({ where: { status: 'FAILED' } }),
    prisma.payment.count({ where: { status: 'CREATED' } }),
    prisma.payment.findMany({
      take: 25,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        razorpayOrderId: true,
        razorpayPaymentId: true,
        amountPaise: true,
        currency: true,
        status: true,
        createdAt: true,
        verifiedAt: true,
        user: {
          select: {
            email: true,
            isPremium: true,
            premiumExpiresAt: true,
          },
        },
      },
    }),
    prisma.webhookEvent.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      select: {
        eventId: true,
        eventName: true,
        orderId: true,
        paymentId: true,
        status: true,
        deliveryCount: true,
        note: true,
        errorMessage: true,
        createdAt: true,
        processedAt: true,
        lastSeenAt: true,
      },
    }),
    prisma.payment.findMany({
      where: {
        status: 'CREATED',
        createdAt: { lt: stuckThreshold },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        razorpayOrderId: true,
        amountPaise: true,
        currency: true,
        createdAt: true,
        user: { select: { email: true } },
      },
    }),
    prisma.webhookEvent.findMany({
      where: { status: 'FAILED' },
      take: 20,
      orderBy: { createdAt: 'desc' },
      select: {
        eventId: true,
        eventName: true,
        orderId: true,
        paymentId: true,
        errorMessage: true,
        createdAt: true,
        lastSeenAt: true,
      },
    }),
  ]);

  return NextResponse.json(
    {
      generatedAt: new Date().toISOString(),
      requestedBy: session.user.email,
      summary: {
        totalPayments,
        verifiedPayments,
        failedPayments,
        pendingPayments: createdPayments,
        stuckPayments: stuckPayments.length,
        failedWebhookEvents: failedWebhookEvents.length,
      },
      recentPayments,
      recentWebhookEvents,
      anomalies: {
        stuckPayments,
        failedWebhookEvents,
      },
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}