'use client'

import { useState } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

const STATUS_STEPS = [
  'pending',
  'confirmed',
  'packed',
  'shipped',
  'delivered',
]

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchOrders = async () => {
    if (!orderNumber && !email) {
      toast.error('Enter order number or email')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, email }),
      })

      if (!res.ok) throw new Error()

      const data = await res.json()
      setOrders(data)
    } catch {
      toast.error('Order not found')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

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
              onChange={e => setOrderNumber(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <p className="text-center text-gray-500 text-sm">OR</p>
            <input
              placeholder="Email used during checkout"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />

            <button
              onClick={fetchOrders}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold"
            >
              {loading ? 'Checking...' : 'Track Order'}
            </button>
          </div>

          {/* Orders */}
          {orders.map(order => {
            const currentIndex = STATUS_STEPS.indexOf(order.orderStatus)

            return (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow p-6 mb-6"
              >
                <p className="font-semibold mb-1">
                  Order #{order.orderNumber}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {new Date(order.createdAt).toLocaleString()}
                </p>

                {/* Timeline */}
                <div className="flex justify-between mb-6">
                  {STATUS_STEPS.map((step, idx) => (
                    <div
                      key={step}
                      className={`text-xs text-center flex-1 ${
                        idx <= currentIndex
                          ? 'text-emerald-600 font-semibold'
                          : 'text-gray-400'
                      }`}
                    >
                      <div className="mb-1">●</div>
                      {step}
                    </div>
                  ))}
                </div>

                {/* Items */}
                <div className="border-t pt-3 space-y-2">
                  {order.items.map((i: any) => (
                    <div
                      key={i.id}
                      className="flex justify-between text-sm"
                    >
                      <span>
                        {i.productNameSnapshot} × {i.quantity}
                      </span>
                      <span>{formatPrice(i.lineTotal)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 font-bold flex justify-between mt-3">
                  <span>Total</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      <Footer />
    </>
  )
}
