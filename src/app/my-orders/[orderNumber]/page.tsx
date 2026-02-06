"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { formatPrice } from "@/lib/utils";

export default function OrderDetailsPage() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    fetch("/api/orders/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderNumber }),
    })
      .then((res) => res.json())
      .then((data) => setOrder(data[0]));
  }, [orderNumber]);

  if (!order) return null;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold mb-6">
            Order #{order.orderNumber}
          </h1>

          {/* Status */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <p className="text-sm text-gray-500 mb-1">Order Status</p>
            <div className="flex items-center gap-3 mt-2">

              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
                {order.orderStatus.toUpperCase()}
              </span>

              {order.paymentStatus === "paid" ? (
                <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                  PAID
                </span>
              ) : (
                <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
                  PAYMENT PENDING
                </span>
              )}
            </div>

            <p className="text-sm text-gray-500 mt-3">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Items */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="font-semibold mb-4">Items Ordered</h2>

            <div className="space-y-3">
              {order.items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{item.productNameSnapshot}</p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Flavour:</span>{" "}
                      {item.flavourSnapshot || "—"} |{" "}
                      <span className="font-medium">Size:</span>{" "}
                      {item.packetSizeSnapshot || "—"} |{" "}
                      <span className="font-medium">Qty:</span> {item.quantity}
                    </p>

                    <p className="text-sm text-gray-500">
                      SKU: {item.skuSnapshot || "—"}
                    </p>
                  </div>

                  <div className="font-semibold">
                    {formatPrice(item.lineTotal)}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-bold mt-4">
              <span>Total</span>
              <span className="text-emerald-600">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-semibold mb-3">Shipping Details</h2>

            <p className="text-sm">
              {order.shippingName}
              <br />
              {order.shippingAddress1}
              <br />
              {order.shippingCity}, {order.shippingState} -{" "}
              {order.shippingPincode}
            </p>

            <p className="text-sm mt-2 text-gray-600">
              Phone: {order.shippingPhone}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
