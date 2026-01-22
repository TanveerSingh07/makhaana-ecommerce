import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(numPrice)
}

export function generateOrderNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `MKH-${year}${month}${day}-${random}`
}

export function generateSKU(productSlug: string, flavourSlug: string, sizeLabel: string): string {
  return `${productSlug.toUpperCase()}-${flavourSlug.toUpperCase()}-${sizeLabel}`.replace(/\s+/g, '-')
}

export function calculateDeliveryCharge(subtotal: number, rules: any[]): number {
  const rule = rules.find(
    r => subtotal >= parseFloat(r.minOrderValue) && subtotal <= parseFloat(r.maxOrderValue)
  )
  return rule ? parseFloat(rule.deliveryCharge) : 50 // Default ₹50
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}