import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { email, orderNumber } = await req.json()

    if (orderNumber) {
      const order = await prisma.order.findUnique({
        where: { orderNumber },
        include: { items: true },
      })

      if (!order) {
        return NextResponse.json(
          { message: 'Order not found' },
          { status: 404 }
        )
      }

      return NextResponse.json([order])
    }

    if (email) {
      const orders = await prisma.order.findMany({
        where: { email },
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      })

      return NextResponse.json(orders)
    }

    return NextResponse.json(
      { message: 'Email or Order Number required' },
      { status: 400 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
