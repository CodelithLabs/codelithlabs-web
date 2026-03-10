import { prisma } from "@/lib/prisma";
import { calculatePremiumExpiry } from "@/lib/razorpay";

export async function activatePremiumForUser(userId: string, activatedAt = new Date()): Promise<Date> {
  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: { premiumExpiresAt: true },
  });

  const billingStart =
    existing?.premiumExpiresAt && existing.premiumExpiresAt > activatedAt
      ? existing.premiumExpiresAt
      : activatedAt;

  const premiumExpiresAt = calculatePremiumExpiry(billingStart);

  await prisma.user.update({
    where: { id: userId },
    data: {
      isPremium: true,
      premiumActivatedAt: activatedAt,
      premiumExpiresAt,
    },
  });

  return premiumExpiresAt;
}

export function isPremiumActive(isPremium: boolean, premiumExpiresAt: Date | null): boolean {
  if (!isPremium) return false;
  if (!premiumExpiresAt) return true;
  return premiumExpiresAt.getTime() > Date.now();
}
