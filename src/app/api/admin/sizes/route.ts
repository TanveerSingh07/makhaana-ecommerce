import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const sizes = await prisma.packetSize.findMany({
    where: { isActive: true },
  })
  return NextResponse.json(sizes)
}
