"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import toast from "react-hot-toast"
import { formatPrice } from "@/lib/utils"

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
]

export default function AdminOrderDetailsPage() {
  const { orderNumber } = useParams()
  const [order, setOrder] = useState<any>(null)
  const [newStatus, setNewStatus] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/orders/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderNumber }),
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setOrder(data[0])
          setNewStatus(data[0].orderStatus)
        }
      })
  }, [orderNumber])

  const updateStatus = async () => {
    setLoading(true)

    const res = await fetch(`/api/admin/orders/${orderNumber}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })

    if (res.ok) toast.success("Order updated")
    else toast.error("Failed")

    setLoading(false)
  }

  if (!order) return null

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">
        Order #{order.orderNumber}
      </h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
       <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <select
            value={newStatus}
            onChange={e => setNewStatus(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {ORDER_STATUSES.map(s => (
              <option key={s} value={s}>
                {s.toUpperCase()}
              </option>
            ))}
          </select>

          <button
            onClick={updateStatus}
            disabled={loading}
            className="bg-emerald-600 text-white px-4 py-2 rounded w-full sm:w-auto"
          >
            Save
          </button>
        </div>

        <p>Total: {formatPrice(Number(order.totalAmount))}</p>
        <p>Payment: {order.paymentStatus}</p>
      </div>
    </>
  )
}
