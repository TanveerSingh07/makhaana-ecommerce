import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

interface CheckoutItem {
  productVariantId: string
  quantity: number
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const items: CheckoutItem[] = body.items
    const customer = body.customer
    const paymentId = body.paymentId

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const order = await prisma.$transaction(async (tx) => {
      let subtotal = new Prisma.Decimal(0)

      // Fetch variants from DB
      const variants = await tx.productVariant.findMany({
        where: {
          id: { in: items.map(i => i.productVariantId) },
          isActive: true,
        },
        include: {
          product: true,
          flavour: true,
          packetSize: true,
        },
      })

      if (variants.length !== items.length) {
        throw new Error('Invalid product variant detected')
      }

      // Stock validation + subtotal
      for (const item of items) {
        const variant = variants.find(v => v.id === item.productVariantId)!

        if (variant.stockQuantity < item.quantity) {
          throw new Error(`Insufficient stock for ${variant.product.name}`)
        }

        subtotal = subtotal.plus(
          new Prisma.Decimal(variant.price).mul(item.quantity)
        )
      }

      // Delivery charge
      const deliveryRule = await tx.deliveryRule.findFirst({
        where: {
          minOrderValue: { lte: subtotal },
          maxOrderValue: { gte: subtotal },
        },
      })

      const deliveryCharge = deliveryRule
        ? new Prisma.Decimal(deliveryRule.deliveryCharge)
        : new Prisma.Decimal(0)

      const totalAmount = subtotal.plus(deliveryCharge)

      // Create ORDER
      const order = await tx.order.create({
        data: {
          orderNumber: `MK-${Date.now()}`,
          orderStatus: 'confirmed',
          paymentStatus: 'paid',

          subtotalAmount: subtotal,
          deliveryCharge,
          discountAmount: new Prisma.Decimal(0),
          totalAmount,

          email: customer.email,
          phone: customer.phone,

          shippingName: customer.name,
          shippingPhone: customer.phone,
          shippingAddress1: customer.addressLine1,
          shippingAddress2: customer.addressLine2 || null,
          shippingCity: customer.city,
          shippingState: customer.state,
          shippingPincode: customer.pincode,
        },
      })

      // Order items + stock + inventory log
      for (const item of items) {
        const variant = variants.find(v => v.id === item.productVariantId)!
        const lineTotal = new Prisma.Decimal(variant.price).mul(item.quantity)

        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productVariantId: variant.id,

            productNameSnapshot: variant.product.name,
            flavourSnapshot: variant.flavour.name,
            packetSizeSnapshot: variant.packetSize.label,
            skuSnapshot: variant.sku,

            unitPriceSnapshot: variant.price,
            quantity: item.quantity,
            lineTotal,
          },
        })

        await tx.productVariant.update({
          where: { id: variant.id },
          data: {
            stockQuantity: { decrement: item.quantity },
          },
        })

        await tx.inventoryLog.create({
          data: {
            productVariantId: variant.id,
            changeQty: -item.quantity,
            reason: 'ORDER_PLACED',
            referenceType: 'ORDER',
            referenceId: order.id,
          },
        })
      }

      return order
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
    })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json(
      { error: error.message || 'Checkout failed' },
      { status: 500 }
    )
  }
}
