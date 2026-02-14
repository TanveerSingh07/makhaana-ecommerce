"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  items?: {
    id: string;
    productNameSnapshot: string;
    quantity: number;
  }[];
}

export default function MyOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
      return;
    }

    if (status === "authenticated") {
      fetch("/api/orders/my")
        .then((res) => res.json())
        .then((data) => {
          setOrders(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status, router]);

  if (status === "loading" || loading) return null;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="bg-white rounded-xl shadow p-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">Signed in as</p>
              <p className="text-lg font-semibold text-gray-900">
                {session?.user?.email}
              </p>
            </div>

            <Link
              href="/track-order"
              className="mt-4 sm:mt-0 text-emerald-600 font-medium hover:underline"
            >
              Track an order →
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

          {orders.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <p className="text-gray-600 mb-4">
                You haven’t placed any orders yet.
              </p>
              <Link
                href="/shop"
                className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  {/* LEFT */}
                  <div>
                    <p className="text-sm text-gray-500">Order Number</p>
                    <p className="font-semibold text-lg">{order.orderNumber}</p>

                    <p className="text-sm text-gray-500 mt-1">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      <span
                        className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                          order.orderStatus === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.orderStatus === "confirmed"
                              ? "bg-blue-100 text-blue-700"
                              : order.orderStatus === "delivered"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {order.orderStatus.toUpperCase()}
                      </span>

                      {order.paymentStatus === "paid" ? (
                        <span className="inline-block mt-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                          PAID
                        </span>
                      ) : (
                        <span className="inline-block mt-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                          PAYMENT PENDING
                        </span>
                      )}
                    </div>

                    {order.items && order.items.length > 0 && (
                      <p className="text-sm text-gray-600 mt-2">
                        {order.items[0].productNameSnapshot}
                        {order.items.length > 1 &&
                          ` + ${order.items.length - 1} more`}
                      </p>
                    )}
                  </div>

                  {/* RIGHT */}
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-xl font-bold text-emerald-600">
                      {formatPrice(order.totalAmount)}
                    </p>

                    <Link
                      href={`/my-orders/${order.orderNumber}`}
                      className="inline-block mt-3 text-sm text-emerald-600 font-medium hover:underline"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
