import AdminGuard from "../components/admin/AdminGuard";
import Link from "next/link";
import { signOut } from "next-auth/react";
import AdminLogoutButton from "../components/admin/AdminLogoutButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-100 flex">
        <aside className="w-64 bg-gray-900 text-white p-6">
          <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
          <nav className="space-y-3 text-sm">
            <Link href="/admin" className="block hover:text-emerald-400">
              Dashboard
            </Link>
            <Link href="/admin/orders" className="block hover:text-emerald-400">
              Orders
            </Link>
            <Link
              href="/admin/products"
              className="block hover:text-emerald-400"
            >
              Products
            </Link>
            <Link
              href="/admin/delivery-rules"
              className="block hover:text-emerald-400"
            >
              Delivery Rules
            </Link>
            <Link
              href="/admin/messages"
              className="block hover:text-emerald-400"
            >
              Messages
            </Link>
            <AdminLogoutButton />
          </nav>
        </aside>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </AdminGuard>
  );
}
