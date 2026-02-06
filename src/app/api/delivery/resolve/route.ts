import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { subtotal } = await req.json();

  if (typeof subtotal !== "number") {
    return NextResponse.json(
      { error: "Invalid subtotal" },
      { status: 400 }
    );
  }

  const rule = await prisma.deliveryRule.findFirst({
    where: {
      minOrderValue: { lte: subtotal },
      maxOrderValue: { gte: subtotal },
    },
  });

  return NextResponse.json({
    deliveryCharge: rule ? Number(rule.deliveryCharge) : 0,
  });
}
