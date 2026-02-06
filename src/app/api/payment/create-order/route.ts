import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { orderNumber } = await req.json();

    const order = await prisma.order.findUnique({
      where: { orderNumber },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(Number(order.totalAmount) * 100),
      currency: "INR",
      receipt: order.orderNumber,
    });

    return NextResponse.json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error("Razorpay create error:", error);
    return NextResponse.json(
      { error: "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
