import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderNumber,
    } = await req.json();

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderNumber
    ) {
      return NextResponse.json(
        { error: "Missing payment details" },
        { status: 400 }
      );
    }

    // 🔐 Verify Razorpay signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // 🔎 Fetch order to get correct amount
    const order = await prisma.order.findUnique({
      where: { orderNumber },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // ✅ Mark order as paid + create payment record
    await prisma.order.update({
      where: { orderNumber },
      data: {
        paymentStatus: "paid",
        orderStatus: "confirmed", 
        payments: {
          create: {
            paymentGateway: "razorpay",
            paymentId: razorpay_payment_id,
            paymentMethod: "online",
            amount: order.totalAmount, // ✅ REQUIRED & CORRECT
            status: "success",
          },
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment verification failed:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
