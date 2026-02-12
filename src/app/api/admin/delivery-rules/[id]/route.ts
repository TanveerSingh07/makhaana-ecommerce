import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { id } = await context.params
  const body = await req.json()

  const updated = await prisma.deliveryRule.update({
    where: { id },
    data: {
      minOrderValue: Number(body.minOrderValue),
      maxOrderValue: Number(body.maxOrderValue ?? body.maxOrderValue),
      deliveryCharge: Number(body.deliveryCharge),
    },
  })

  return NextResponse.json(updated)
}
