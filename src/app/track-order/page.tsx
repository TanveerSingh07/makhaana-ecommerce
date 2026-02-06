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
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
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
            const currentIndex = STATUS_STEPS.indexOf(order.orderStatus);

            return (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow p-6 mb-6"
              >
                <p className="font-semibold mb-1">Order #{order.orderNumber}</p>
                <p className="text-sm text-gray-500 mb-6">
                  {new Date(order.createdAt).toLocaleString()}
                </p>

                {/* ✅ CENTERED TIMELINE WITH LABELS */}
                <div className="flex items-start justify-between mb-8">
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
