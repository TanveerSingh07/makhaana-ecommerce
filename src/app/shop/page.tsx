import Link from 'next/link'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'

async function getProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
        take: 1
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

  return products.map(product => {
    const prices = product.variants.map(v => parseFloat(v.price.toString()))
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0
    
    const flavours = Array.from(new Set(
      product.variants.map(v => ({
        name: v.flavour.name,
        slug: v.flavour.slug
      }))
    ))
    
    const sizes = Array.from(new Set(
      product.variants.map(v => v.packetSize.label)
    ))

    return {
      ...product,
      minPrice,
      flavours,
      sizes
    }
  })
}

export default async function ShopPage() {
  const products = await getProducts()

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900">Shop All Products</h1>
            <p className="mt-2 text-gray-600">
              Premium quality makhaana in various flavours and sizes
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.images[0].altText || product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <p className="text-emerald-600 font-bold text-lg mb-3">
                      From {formatPrice(product.minPrice)}
                    </p>

                    {/* Flavours */}
                    <div className="mb-2">
                      <p className="text-xs text-gray-500 mb-1">Available Flavours:</p>
                      <div className="flex flex-wrap gap-1">
                        {product.flavours.slice(0, 3).map((flavour, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full"
                          >
                            {flavour.name}
                          </span>
                        ))}
                        {product.flavours.length > 3 && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            +{product.flavours.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Sizes */}
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Sizes:</span> {product.sizes.join(', ')}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}