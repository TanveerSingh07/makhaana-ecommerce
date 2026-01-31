"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "./../components/layout/Header";
import Footer from "./../components/layout/Footer";
import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get("orderNumber");

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!orderNumber) {
      router.push("/");
    }
  }, [orderNumber, router]);

  if (!mounted) return null;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-16 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-6">
              <CheckCircleIcon className="w-12 h-12 text-emerald-600" />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order Confirmed
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been placed
              successfully.
            </p>

            {/* Order Number */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 mb-6">
              <p className="text-sm text-gray-600 mb-1">Order Number</p>
              <p className="text-2xl font-bold text-emerald-700 tracking-wide">
                {orderNumber}
              </p>
            </div>

            {/* Next Steps */}
            <div className="text-left bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                What happens next?
              </h3>
              <ul className="space-y-3">
                {[
                  "You'll receive an order confirmation email shortly",
                  "You can track your order status with the given order number",
                  "We'll prepare your order with care",
                  "Expect delivery within 3–5 business days",
                ].map((text, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-gray-700">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/track-order?orderNumber=${orderNumber}`}
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                Track Your Order
              </Link>

              <Link
                href="/shop"
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="mt-8 text-center text-sm text-gray-500">
            Need help? Contact us at{" "}
            <span className="font-medium">hello@makhaana.com</span> or{" "}
            <span className="font-medium">+91 98765 43210</span>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
