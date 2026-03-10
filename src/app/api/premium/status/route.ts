import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isPremiumActive } from "@/lib/premium-membership";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    const premiumExpiresAt = session.user.premiumExpiresAt ?? null;
    const active = session.user.isPremium ?? false;

    return NextResponse.json({
      isPremium: active,
      premiumExpiresAt,
      source: "session",
    });
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      isPremium: true,
      premiumExpiresAt: true,
    },
  });

  const active = isPremiumActive(dbUser?.isPremium ?? false, dbUser?.premiumExpiresAt ?? null);
  const premiumExpiresAt = dbUser?.premiumExpiresAt?.toISOString() ?? null;

  if (dbUser?.isPremium && !active) {
    await prisma.user.update({
      where: { email: session.user.email },
      data: { isPremium: false },
    });
  }

  return NextResponse.json({
    isPremium: active,
    premiumExpiresAt,
    source: "database",
  });
}
