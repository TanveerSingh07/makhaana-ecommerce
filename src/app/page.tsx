import Link from 'next/link'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import { HeartIcon, TruckIcon, SparklesIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { prisma } from '../lib/prisma'
import { formatPrice } from '../lib/utils'
import Image from 'next/image'

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    take: 4,
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
      product.variants.map(v => v.flavour.name)
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

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()

  const features = [
    {
      icon: HeartIcon,
      title: 'Healthy Snacking',
      description: 'Low-calorie, high-protein superfood'
    },
    {
      icon: SparklesIcon,
      title: 'Multiple Flavours',
      description: 'Choose from a variety of delicious flavours'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Quality Assured',
      description: 'Fresh packaging with strict quality control'
    },
    {
      icon: TruckIcon,
      title: 'Fast Delivery',
      description: 'Quick and reliable delivery across India'
    }
  ]

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeIn">
                Premium Makhaana for Healthy Living
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-emerald-100 animate-fadeIn" style={{animationDelay: '0.1s'}}>
                Delicious, nutritious, and perfect for guilt-free snacking. Available in multiple flavours and sizes.
              </p>
              <div className="flex flex-wrap gap-4 animate-fadeIn" style={{animationDelay: '0.2s'}}>
                <Link
                  href="/shop"
                  className="bg-white text-emerald-700 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
                >
                  Shop Now
                </Link>
                <Link
                  href="/about"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-emerald-700 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-lg text-gray-600">
                Explore our premium selection of makhaana
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.images[0].altText || product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-emerald-600 font-bold mb-2">
                      From {formatPrice(product.minPrice)}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {product.flavours.slice(0, 3).map((flavour, idx) => (
                        <span key={idx} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded">
                          {flavour}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500">
                      {product.sizes.join(' | ')}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/shop"
                className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Choose Makhaana?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We source the finest quality fox nuts, process them with care, and package them fresh to preserve their natural goodness. Every batch is tested for quality and freshness before it reaches you.
            </p>
            <div className="flex justify-center items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">100%</div>
                <div className="text-sm text-gray-600">Natural</div>
              </div>
              <div className="h-12 w-px bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">Fresh</div>
                <div className="text-sm text-gray-600">Packaging</div>
              </div>
              <div className="h-12 w-px bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">5⭐</div>
                <div className="text-sm text-gray-600">Rated</div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}