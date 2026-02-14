import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ orderNumber: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { orderNumber } = await context.params   
  const { status } = await req.json()

  if (!orderNumber) {
    return NextResponse.json({ error: "Invalid order number" }, { status: 400 })
  }

  await prisma.order.update({
    where: { orderNumber },
    data: {
      orderStatus: status,
      statusHistory: {
        create: {
          status,
          changedBy: session.user.email ?? "admin",
        },
      },
    },
  })

  return NextResponse.json({ success: true })
}
