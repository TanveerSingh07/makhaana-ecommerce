"use client";

import { useState } from "react";
import Link from "next/link";
import AdminLogoutButton from "../components/admin/AdminLogoutButton";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const navLinks = (
    <>
      <Link href="/admin" className="block py-2 hover:text-emerald-400">
        Dashboard
      </Link>
      <Link href="/admin/orders" className="block py-2 hover:text-emerald-400">
        Orders
      </Link>
      <Link
        href="/admin/products"
        className="block py-2 hover:text-emerald-400"
      >
        Products
      </Link>
      <Link
        href="/admin/delivery-rules"
        className="block py-2 hover:text-emerald-400"
      >
        Delivery Rules
      </Link>
      <Link
        href="/admin/messages"
        className="block py-2 hover:text-emerald-400"
      >
        Messages
      </Link>
      <AdminLogoutButton />
    </>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* HEADER */}
      <header className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between md:hidden">
        <h2 className="font-semibold text-lg">Admin Panel</h2>
        <button onClick={() => setOpen(!open)}>☰</button>
      </header>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="md:hidden bg-gray-700 text-white px-4 py-4 space-y-2 border-t border-gray-700">
          {navLinks}
        </div>
      )}

      <div className="flex flex-1">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:flex md:flex-col w-64 bg-gray-900 text-white p-6">
          <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
          <nav className="space-y-2 text-sm">{navLinks}</nav>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 bg-gray-100 w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}