'use client'

import Link from 'next/link'
import Header from './../components/layout/Header'
import Footer from './../components/layout/Footer'
import { useCartStore } from '../../store/cartStore'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore()

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center pt-10">
          <div className="text-center px-4">
            <svg
              className="mx-auto h-24 w-24 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add some products to get started!
            </p>
            <Link
              href="/shop"
              className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const subtotal = getTotal()

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Shopping Cart
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                >
                  {/* Image */}
                  <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.productName}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Details and Controls */}
                  <div className="flex-grow w-full">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      {/* Product Info */}
                      <div className="flex-grow min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                          {item.productName}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          <span className="font-medium">Flavour:</span> {item.flavour} |{' '}
                          <span className="font-medium">Size:</span> {item.packetSize}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">SKU: {item.sku}</p>
                      </div>

                      {/* Quantity and Price Controls */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.productVariantId, item.quantity - 1)
                            }
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <MinusIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <span className="w-8 sm:w-12 text-center font-semibold text-sm sm:text-base">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productVariantId, item.quantity + 1)
                            }
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <PlusIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right min-w-[80px]">
                          <p className="font-bold text-gray-900 text-sm sm:text-base">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatPrice(item.price)} each
                          </p>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.productVariantId)}
                          className="text-red-600 hover:text-red-800 flex-shrink-0"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:sticky lg:top-20">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm sm:text-base">Subtotal</span>
                    <span className="font-semibold text-sm sm:text-base break-all">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between items-start gap-2 text-xs sm:text-sm text-gray-500">
                    <span className="flex-shrink-0">Delivery charges</span>
                    <span className="text-right">Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center text-base sm:text-lg font-bold">
                    <span>Subtotal</span>
                    <span className="text-emerald-600 break-all">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full bg-emerald-600 text-white text-center py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/shop"
                  className="block w-full text-center mt-3 text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}