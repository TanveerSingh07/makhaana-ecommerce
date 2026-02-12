import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/utils"

export default async function AdminDashboard() {
  const totalOrders = await prisma.order.count()

  const pendingOrders = await prisma.order.count({
    where: { orderStatus: "pending" },
  })

  const revenue = await prisma.order.aggregate({
    _sum: { totalAmount: true },
    where: { paymentStatus: "paid" },
  })

  const lowStock = await prisma.productVariant.count({
    where: { stockQuantity: { lt: 10 } },
  })

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-6">
        <StatCard title="Total Orders" value={totalOrders} />
        <StatCard title="Pending Orders" value={pendingOrders} />
        <StatCard
          title="Total Revenue"
          value={formatPrice(Number(revenue._sum.totalAmount || 0))}
        />
        <StatCard title="Low Stock Items" value={lowStock} />
      </div>
    </>
  )
}

function StatCard({ title, value }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold mt-3">{value}</p>
    </div>
  )
}
