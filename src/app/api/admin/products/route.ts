import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const variants = await prisma.productVariant.findMany({
    include: {
      product: true,
      flavour: true,
      packetSize: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(variants)
}
