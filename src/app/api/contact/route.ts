import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    await prisma.contactMessage.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        subject: body.subject || null,
        message: body.message,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact error:", error)
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    )
  }
}
