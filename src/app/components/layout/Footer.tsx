'use client';

import Link from 'next/link';
import { use } from 'react';
import toast from "react-hot-toast";

export default function Footer() {
  const notReady = (label: string) =>
    toast(`📦 ${label} page coming soon`, {
      duration: 2500,
    });
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              M
            </div>
            <span className="text-xl font-semibold text-white">
              Makhaana
            </span>
          </div>
          <p className="text-sm text-gray-400 max-w-xs">
            Premium quality fox nuts delivered fresh to your doorstep.
            Healthy snacking made delicious.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/shop">Shop</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/cart">Cart</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-semibold mb-4">
            Customer Service
          </h4>
          <ul className="space-y-2 text-sm">
            <li
              className="cursor-pointer"
              onClick={() => notReady("Shipping Info")}
            >
              Shipping Info
            </li>
            <li
              className="cursor-pointer"
              onClick={() => notReady("Returns & Refunds")}
            >
              Returns & Refunds
            </li>
            <li
              className="cursor-pointer"
              onClick={() => notReady("FAQs")}
            >
              FAQs
            </li>
            <li>
              <Link href="/track-order">Track Order</Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contact</h4>
          <p className="text-sm">hello@makhaana.com</p>
          <p className="text-sm mt-1">+91 98765 43210</p>
          <p className="text-xs text-gray-500 mt-2">
            Mon–Sat: 9 AM – 6 PM
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Makhaana. All rights reserved.
      </div>
    </footer>
  )
}

