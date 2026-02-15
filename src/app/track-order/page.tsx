"use client";

import { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

const STATUS_STEPS = [
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
];

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    if (!orderNumber && !email) {
      toast.error("Enter order number or email");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, email }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setOrders(data);
    } catch {
      toast.error("Order not found");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Track Your Order</h1>

          {/* Search */}
          <div className="bg-white rounded-lg shadow p-6 mb-6 space-y-4">
            <input
              placeholder="Order Number"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <p className="text-center text-gray-500 text-sm">OR</p>
            <input
              placeholder="Email used during checkout"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />

            <button
              onClick={fetchOrders}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold"
            >
              {loading ? "Checking..." : "Track Order"}
            </button>
          </div>

          {/* Orders */}
          {orders.map((order) => {
            const status = order.orderStatus;
            const isPending = status === "pending";
            const isCancelled = status === "cancelled";
            const currentIndex = STATUS_STEPS.indexOf(status);

            return (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow p-6 mb-6"
              >
                <p className="font-semibold mb-1">Order #{order.orderNumber}</p>
                <p className="text-sm text-gray-500 mb-6">
                  {new Date(order.createdAt).toLocaleString()}
                </p>

                {/* PENDING STATUS */}
                {isPending && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <p className="font-semibold text-yellow-800">Order Pending</p>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Your order is still pending. We'll notify you once it's confirmed.
                    </p>
                  </div>
                )}

                {/* CANCELLED STATUS */}
                {isCancelled && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <p className="font-semibold text-red-800">Order Cancelled</p>
                    </div>
                    <p className="text-sm text-red-700">
                      This order has been cancelled. If payment was made, refund will be processed in 3-5 business days.
                    </p>
                  </div>
                )}

                {/* TIMELINE - Only show if not pending/cancelled */}
                {!isPending && !isCancelled && (
                  <div className="mb-8 overflow-x-auto pb-2">
                    <div className="min-w-[500px] flex items-start justify-between">
                      {STATUS_STEPS.map((step, idx) => {
                        const active = idx <= currentIndex;

                        return (
                          <div
                            key={step}
                            className="flex-1 flex flex-col items-center text-center relative"
                          >
                            {/* Dot */}
                            <div
                              className={`w-3 h-3 rounded-full z-10 ${
                                active ? "bg-emerald-600" : "bg-gray-300"
                              }`}
                            />

                            {/* Line */}
                            {idx < STATUS_STEPS.length - 1 && (
                              <div
                                className={`absolute top-1.5 left-1/2 w-full h-px ${
                                  idx < currentIndex
                                    ? "bg-emerald-600"
                                    : "bg-gray-300"
                                }`}
                              />
                            )}

                            {/* Label */}
                            <span
                              className={`mt-2 text-xs font-medium ${
                                active ? "text-emerald-600" : "text-gray-400"
                              }`}
                            >
                              {STATUS_LABELS[step]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Items */}
                <div className="border-t pt-3 space-y-2">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div>
                        <p className="font-medium">
                          {item.productNameSnapshot} × {item.quantity}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.flavourSnapshot} • {item.packetSizeSnapshot}
                        </p>
                      </div>
                      <span>{formatPrice(item.lineTotal)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1 text-sm text-gray-600 pt-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.subtotalAmount)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>
                      {order.deliveryCharge > 0
                        ? formatPrice(order.deliveryCharge)
                        : "FREE"}
                    </span>
                  </div>

                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </>
  );
}