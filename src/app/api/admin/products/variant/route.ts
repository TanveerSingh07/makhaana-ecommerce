import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { variantId, price, stockQuantity } = await req.json()

  const existing = await prisma.productVariant.findUnique({
    where: { id: variantId },
  })

  const difference = stockQuantity - existing!.stockQuantity

  const updated = await prisma.productVariant.update({
    where: { id: variantId },
    data: {
      price,
      stockQuantity,
    },
  })

  if (difference !== 0) {
    await prisma.inventoryLog.create({
      data: {
        productVariantId: variantId,
        changeQty: difference,
        reason: "Admin update",
        referenceType: "admin",
      },
    })
  }

  return NextResponse.json(updated)
}
