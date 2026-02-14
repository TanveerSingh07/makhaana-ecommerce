import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' }
        },
        variants: {
          where: { isActive: true },
          include: {
            flavour: true,
            packetSize: true
          }
        }
      }
    })

    const productsWithMeta = products.map(product => {
      const prices = product.variants.map(v => parseFloat(v.price.toString()))
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0
      
      const flavours = Array.from(new Set(
        product.variants.map(v => JSON.stringify({
          id: v.flavour.id,
          name: v.flavour.name,
          slug: v.flavour.slug
        }))
      )).map(f => JSON.parse(f))
      
      const sizes = Array.from(new Set(
        product.variants.map(v => JSON.stringify({
          id: v.packetSize.id,
          label: v.packetSize.label,
          weightGrams: v.packetSize.weightGrams
        }))
      )).map(s => JSON.parse(s))

      return {
        ...product,
        minPrice,
        availableFlavours: flavours,
        availableSizes: sizes
      }
    })

    return NextResponse.json(productsWithMeta)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}