import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const rules = await prisma.deliveryRule.findMany({
    orderBy: { minOrderValue: "asc" },
  })

  return NextResponse.json(rules)
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const rules = await req.json()

    await prisma.deliveryRule.deleteMany()
    await prisma.deliveryRule.createMany({ data: rules })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update delivery rules" },
      { status: 500 }
    )
  }
}
