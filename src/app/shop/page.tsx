import Link from "next/link";
import Image from "next/image";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

async function getProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      variants: {
        where: { isActive: true },
        include: { flavour: true, packetSize: true },
      },
    },
  });

  return products.map((product) => {
    const prices = product.variants.map((v) => parseFloat(v.price.toString()));

    return {
      ...product,
      minPrice: prices.length ? Math.min(...prices) : 0,
      flavours: Array.from(
        new Set(product.variants.map((v) => v.flavour.name)),
      ),
      sizes: Array.from(
        new Set(product.variants.map((v) => v.packetSize.label)),
      ),
    };
  });
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <>
      <Header />

      <main className="pt-10 bg-gray-50 min-h-screen">
        {/* ================= PAGE HEADER ================= */}
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <p className="text-sm text-gray-500 mb-2">
              Home / <span className="text-gray-900">Shop</span>
            </p>

            <h1 className="text-4xl font-bold text-gray-900">
              Shop All Products
            </h1>

            <p className="mt-3 text-gray-600 max-w-2xl">
              Premium quality makhaana in various flavours and sizes, carefully
              sourced and packed fresh.
            </p>
          </div>
        </section>

        {/* ================= CONTENT ================= */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          {/* ---------- FILTER BAR ---------- */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-10 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm font-medium text-gray-700">
              {products.length} Products
            </p>

            <div className="flex gap-3">
              <select className="border rounded-lg px-3 py-2 text-sm text-gray-700 bg-white">
                <option>All Flavours</option>
                <option>Plain</option>
                <option>Salted</option>
                <option>Peri Peri</option>
              </select>

              <select className="border rounded-lg px-3 py-2 text-sm text-gray-700 bg-white">
                <option>Sort: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          {/* ---------- EMPTY STATE ---------- */}
          {products.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-16 text-center">
              <div className="text-5xl mb-4">🛍️</div>
              <h3 className="text-2xl font-semibold text-gray-900">
                No products available
              </h3>
              <p className="text-gray-600 mt-2">
                Check back soon for new arrivals.
              </p>
            </div>
          ) : (
            <>
              {/* ---------- PRODUCTS GRID ---------- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    className="bg-white rounded-xl shadow-sm hover-lift overflow-hidden"
                  >
                    {/* Image */}
                    <div className="relative h-56 bg-gray-100">
                      {product.images[0] && (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">
                        {product.name}
                      </h3>

                      <p className="mt-2 text-primary font-bold text-lg">
                        {formatPrice(product.minPrice)}
                        <span className="text-sm text-gray-500 font-normal">
                          {" "}
                          onwards
                        </span>
                      </p>

                      {/* Flavours */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {product.flavours.slice(0, 3).map((f, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                          >
                            {f}
                          </span>
                        ))}
                        {product.flavours.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{product.flavours.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Sizes */}
                      <p className="mt-3 text-xs text-gray-500">
                        Sizes: {product.sizes.join(", ")}
                      </p>

                      {/* CTA */}
                      <div className="mt-4">
                        <span className="inline-block w-full text-center text-sm font-medium text-white bg-primary rounded-lg py-2">
                          View Details
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Benefits Banner */}
        <section className="bg-white border-t border-gray-100 pb-10">
          <div className="max-w-7xl mx-auto px-6 py-14">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Benefit 1 */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Premium Quality
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    100% natural ingredients with strict quality checks
                  </p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Fast Delivery</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Delivered within 3–5 business days
                  </p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Secure Payments
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Multiple safe and trusted payment options
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
