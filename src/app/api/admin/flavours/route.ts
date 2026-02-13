import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const flavours = await prisma.flavour.findMany({
    where: { isActive: true },
  })
  return NextResponse.json(flavours)
}
