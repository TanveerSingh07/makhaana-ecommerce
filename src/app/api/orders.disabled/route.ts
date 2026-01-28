import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOrderNumber, calculateDeliveryCharge } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()

    const {
      items,
      shippingDetails,
      paymentId,
      paymentMethod
    } = body

    // Calculate totals
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.productVariantId },
        include: {
          product: true,
          flavour: true,
          packetSize: true
        }
      })

      if (!variant) {
        return NextResponse.json(
          { error: `Product variant ${item.productVariantId} not found` },
          { status: 404 }
        )
      }

      if (variant.stockQuantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${variant.product.name}` },
          { status: 400 }
        )
      }

      const lineTotal = parseFloat(variant.price.toString()) * item.quantity
      subtotal += lineTotal

      orderItems.push({
        productVariantId: variant.id,
        productNameSnapshot: variant.product.name,
        flavourSnapshot: variant.flavour.name,
        packetSizeSnapshot: variant.packetSize.label,
        skuSnapshot: variant.sku,
        unitPriceSnapshot: variant.price,
        quantity: item.quantity,
        lineTotal
      })
    }

    // Get delivery rules
    const deliveryRules = await prisma.deliveryRule.findMany()
    const deliveryCharge = calculateDeliveryCharge(subtotal, deliveryRules)
    const totalAmount = subtotal + deliveryCharge

    // Create order
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: session?.user?.id || null,
          email: shippingDetails.email,
          phone: shippingDetails.phone,
          subtotalAmount: subtotal,
          deliveryCharge,
          discountAmount: 0,
          totalAmount,
          shippingName: shippingDetails.fullName,
          shippingPhone: shippingDetails.phone,
          shippingAddress1: shippingDetails.addressLine1,
          shippingAddress2: shippingDetails.addressLine2,
          shippingCity: shippingDetails.city,
          shippingState: shippingDetails.state,
          shippingPincode: shippingDetails.pincode,
          items: {
            create: orderItems
          }
        },
        include: {
          items: {
            include: {
              productVariant: {
                include: {
                  product: true,
                  flavour: true,
                  packetSize: true
                }
              }
            }
          }
        }
      })

      // Create payment record
      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          paymentGateway: 'razorpay',
          paymentId,
          paymentMethod: paymentMethod || 'online',
          amount: totalAmount,
          status: 'success'
        }
      })

      // Update order status
      await tx.orderStatusHistory.create({
        data: {
          orderId: newOrder.id,
          status: 'confirmed',
          note: 'Order placed successfully',
          changedBy: 'system'
        }
      })

      // Reduce stock and create inventory logs
      for (const item of orderItems) {
        await tx.productVariant.update({
          where: { id: item.productVariantId },
          data: {
            stockQuantity: {
              decrement: item.quantity
            }
          }
        })

        await tx.inventoryLog.create({
          data: {
            productVariantId: item.productVariantId,
            changeQty: -item.quantity,
            reason: 'Order placed',
            referenceType: 'order',
            referenceId: newOrder.id
          }
        })
      }

      return newOrder
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber
    })

  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}