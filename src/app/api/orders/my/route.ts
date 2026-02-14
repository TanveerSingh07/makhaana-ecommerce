import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/authOptions'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json([], { status: 200 })
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      items: true,
    },
  })

  const safeOrders = orders.map(order => ({
    ...order,
    subtotalAmount: Number(order.subtotalAmount),
    deliveryCharge: Number(order.deliveryCharge),
    discountAmount: Number(order.discountAmount),
    totalAmount: Number(order.totalAmount),
    items: order.items.map(item => ({
      ...item,
      unitPriceSnapshot: Number(item.unitPriceSnapshot),
      lineTotal: Number(item.lineTotal),
    })),
  }))

  return NextResponse.json(safeOrders)
}
