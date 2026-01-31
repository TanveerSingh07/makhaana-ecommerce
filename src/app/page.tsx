import Link from 'next/link'
import Image from 'next/image'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    take: 4,
    include: {
      images: { orderBy: { sortOrder: 'asc' }, take: 1 },
      variants: {
        where: { isActive: true },
        include: { flavour: true, packetSize: true },
      },
    },
  })

  return products.map((product) => {
    const prices = product.variants.map((v) =>
      parseFloat(v.price.toString())
    )

    return {
      ...product,
      minPrice: prices.length ? Math.min(...prices) : 0,
    }
  })
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <>
      <Header />

      <main className="pt-16">
        {/* ================= HERO ================= */}
        <section className="bg-[#f9fbfa]">
          <div className="max-w-7xl mx-auto px-6 py-28 text-center">
            {/* Badge */}
            <p className="text-sm font-medium text-primary mb-4">
              Premium Quality Guaranteed
            </p>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Healthy Snacking,
              <br />
              <span className="text-primary">Deliciously Simple</span>
            </h1>

            {/* Subtext */}
            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
              Premium makhaana in multiple flavours and sizes. Low-calorie,
              high-protein superfood delivered fresh to your door.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/shop"
                className="px-8 py-3 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition"
              >
                Shop Now
              </Link>

              <Link
                href="/about"
                className="px-8 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-4xl mx-auto">
              {[
                { value: '10K+', label: 'Happy Customers' },
                { value: '50K+', label: 'Products Sold' },
                { value: '4.8 ⭐', label: 'Rating' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-14">
              Why Choose Makhaana?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: '❤️',
                  title: 'Healthy Snacking',
                  desc: 'Low-calorie, high-protein superfood',
                },
                {
                  icon: '✨',
                  title: 'Multiple Flavours',
                  desc: 'Wide range of delicious flavours',
                },
                {
                  icon: '🛡️',
                  title: 'Quality Assured',
                  desc: 'Fresh packaging & strict QC',
                },
                {
                  icon: '🚚',
                  title: 'Fast Delivery',
                  desc: 'Reliable delivery across India',
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="bg-white rounded-xl p-8 shadow-sm hover-lift text-center"
                >
                  <div className="text-4xl mb-5">{f.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-gray-600">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FEATURED PRODUCTS ================= */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-14">
              Featured Products
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="product-card hover-lift"
                >
                  <div className="relative h-56">
                    {product.images[0] && (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-primary font-bold">
                      From {formatPrice(product.minPrice)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-14">
              <Link
                href="/shop"
                className="inline-block px-8 py-3 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition"
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
