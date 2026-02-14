import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-8">Orders</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full text-sm">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                <th className="p-4 text-left">Order</th>
                <th className="p-4">Status</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Total</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="p-4 font-medium">{o.orderNumber}</td>
                  <td className="p-4">{o.orderStatus}</td>
                  <td className="p-4">{o.paymentStatus}</td>
                  <td className="p-4">{formatPrice(Number(o.totalAmount))}</td>
                  <td className="p-4">
                    <Link
                      href={`/admin/orders/${o.orderNumber}`}
                      className="text-emerald-600 hover:underline"
                    >
                      Manage →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}