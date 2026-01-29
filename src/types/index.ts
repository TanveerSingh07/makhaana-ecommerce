import { Decimal } from '@prisma/client/runtime/library'

export interface ProductWithVariants {
  id: string
  name: string
  slug: string
  description: string | null
  isActive: boolean
  images: ProductImage[]
  variants: ProductVariantWithDetails[]
}

export interface ProductVariantWithDetails {
  id: string
  sku: string
  price: Decimal
  mrp: Decimal | null
  stockQuantity: number
  isActive: boolean
  flavour: {
    id: string
    name: string
    slug: string
  }
  packetSize: {
    id: string
    weightGrams: number
    label: string
  }
}

export interface ProductImage {
  id: string
  url: string
  altText: string | null
  sortOrder: number
}

export interface CheckoutFormData {
  fullName: string
  phone: string
  email: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
}

export interface OrderSummary {
  subtotal: number
  deliveryCharge: number
  discount: number
  total: number
}

export interface PaymentResponse {
  success: boolean
  orderId?: string
  orderNumber?: string
  error?: string
}