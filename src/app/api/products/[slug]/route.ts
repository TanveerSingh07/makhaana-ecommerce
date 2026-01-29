import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        slug: params.slug,
        isActive: true,
      },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        variants: {
          where: { isActive: true },
          include: {
            flavour: true,
            packetSize: true,
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product by slug:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
