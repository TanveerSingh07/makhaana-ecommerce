import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: NextRequest) {
  try {
    const { items, shippingDetails } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 🔐 Get logged-in user (if any)
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ?? null;

    // 🔁 IMPORTANT: Link past guest orders if user is logged in
    if (userId && shippingDetails?.email) {
      await prisma.order.updateMany({
        where: {
          email: shippingDetails.email,
          userId: null,
        },
        data: {
          userId,
        },
      });
    }

    // 1. Fetch variants
    const variantIds = items.map((i: any) => i.productVariantId);

    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds }, isActive: true },
      include: {
        product: true,
        flavour: true,
        packetSize: true,
      },
    });

    // 2. Calculate subtotal
    let subtotal = 0;

    for (const item of items) {
      const variant = variants.find(v => v.id === item.productVariantId);
      if (!variant) {
        return NextResponse.json({ error: "Invalid product" }, { status: 400 });
      }
      if (variant.stockQuantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${variant.product.name}` },
          { status: 400 }
        );
      }
      subtotal += Number(variant.price) * item.quantity;
    }

    // 3. Delivery charge
    const rule = await prisma.deliveryRule.findFirst({
      where: {
        minOrderValue: { lte: subtotal },
        maxOrderValue: { gte: subtotal },
      },
    });

    const deliveryCharge = rule ? Number(rule.deliveryCharge) : 0;
    const total = subtotal + deliveryCharge;

    // 4. Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: `MK${Date.now()}`,
        userId,
        email: shippingDetails.email,
        phone: shippingDetails.phone,
        orderStatus: "confirmed",
        paymentStatus: "pending",
        subtotalAmount: subtotal,
        deliveryCharge,
        totalAmount: total,
        shippingName: shippingDetails.fullName,
        shippingPhone: shippingDetails.phone,
        shippingAddress1: shippingDetails.addressLine1,
        shippingAddress2: shippingDetails.addressLine2,
        shippingCity: shippingDetails.city,
        shippingState: shippingDetails.state,
        shippingPincode: shippingDetails.pincode,
        items: {
          create: variants.map(variant => {
            const qty = items.find(
              (i: any) => i.productVariantId === variant.id
            ).quantity;

            return {
              productVariantId: variant.id,
              productNameSnapshot: variant.product.name,
              flavourSnapshot: variant.flavour.name,
              packetSizeSnapshot: variant.packetSize.label,
              skuSnapshot: variant.sku,
              unitPriceSnapshot: variant.price,
              quantity: qty,
              lineTotal: Number(variant.price) * qty,
            };
          }),
        },
      },
    });

    // 5. Reduce stock + inventory log
    for (const item of items) {
      await prisma.productVariant.update({
        where: { id: item.productVariantId },
        data: { stockQuantity: { decrement: item.quantity } },
      });

      await prisma.inventoryLog.create({
        data: {
          productVariantId: item.productVariantId,
          changeQty: -item.quantity,
          reason: "Order placed",
          referenceType: "order",
          referenceId: order.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Order failed" }, { status: 500 });
  }
}
