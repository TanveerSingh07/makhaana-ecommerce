"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

export default function ShopClient({ products }: { products: any[] }) {
  const [flavourFilter, setFlavourFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("FEATURED");

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // 🔹 Flavour filter
    if (flavourFilter !== "ALL") {
      list = list.filter((p) =>
        p.flavours.some(
          (f: string) =>
            f.toLowerCase() === flavourFilter.toLowerCase()
        )
      );
    }

    // 🔹 Sorting
    if (sortBy === "PRICE_ASC") {
      list.sort((a, b) => a.minPrice - b.minPrice);
    }

    if (sortBy === "PRICE_DESC") {
      list.sort((a, b) => b.minPrice - a.minPrice);
    }

    if (sortBy === "NEWEST") {
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
    }

    return list;
  }, [products, flavourFilter, sortBy]);

  return (
    <>
      {/* FILTER BAR */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-10 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-medium text-gray-700">
          {filteredProducts.length} Products
        </p>

        <div className="flex gap-3">
          <select
            value={flavourFilter}
            onChange={(e) => setFlavourFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm text-gray-700 bg-white"
          >
            <option value="ALL">All Flavours</option>
            <option value="Plain Salted">Plain Salted</option>
            <option value="Salted">Salted</option>
            <option value="Peri Peri">Peri Peri</option>
            <option value="Pudina">Pudina</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm text-gray-700 bg-white"
          >
            <option value="FEATURED">Sort: Featured</option>
            <option value="PRICE_ASC">Price: Low to High</option>
            <option value="PRICE_DESC">Price: High to Low</option>
            <option value="NEWEST">Newest</option>
          </select>
        </div>
      </div>

      {/* EMPTY STATE */}
      {filteredProducts.length === 0 ? (
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
          {/* PRODUCTS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
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
                    {product.flavours.slice(0, 3).map((f: string, i: number) => (
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
    </>
  );
}
