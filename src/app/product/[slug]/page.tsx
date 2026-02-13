"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import Image from "next/image";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  mrp: number | null;
  stockQuantity: number;
  flavour: {
    id: string;
    name: string;
    slug: string;
  };
  packetSize: {
    id: string;
    weightGrams: number;
    label: string;
  };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  images: Array<{
    id: string;
    url: string;
    altText: string | null;
    sortOrder: number;
  }>;
  variants: ProductVariant[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const slug = typeof params.slug === "string" ? params.slug : params.slug?.[0];

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFlavourId, setSelectedFlavourId] = useState("");
  const [selectedSizeId, setSelectedSizeId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (!slug) return;

    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${slug}`);

        if (!res.ok) {
          throw new Error("Product not found");
        }

        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
        toast.error("Product not found");
        router.push("/shop");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug, router]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) return null;

  const flavours = Array.from(
    new Map(
      (product.variants ?? []).map((v) => [v.flavour.id, v.flavour]),
    ).values(),
  );

  const sizes = Array.from(
    new Map(
      (product.variants ?? []).map((v) => [v.packetSize.id, v.packetSize]),
    ).values(),
  ).sort((a, b) => a.weightGrams - b.weightGrams);

  const selectedVariant = product.variants.find(
    (v) =>
      v.flavour.id === selectedFlavourId && v.packetSize.id === selectedSizeId,
  );

  const handleAddToCart = () => {
    if (!selectedFlavourId || !selectedSizeId) {
      toast.error("Please select flavour and size");
      return;
    }

    if (!selectedVariant) {
      toast.error("Selected variant not available");
      return;
    }

    if (selectedVariant.stockQuantity < quantity) {
      toast.error("Insufficient stock");
      return;
    }

    addItem({
      productVariantId: selectedVariant.id,
      productName: product.name,
      flavour: selectedVariant.flavour.name,
      packetSize: selectedVariant.packetSize.label,
      price: selectedVariant.price,
      quantity,
      image: product.images[0]?.url,
      sku: selectedVariant.sku,
    });

    toast.success("Added to cart!");
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-2xl shadow-lg p-6 lg:p-10">
            {/* Images */}
            <div>
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
                {product.images[selectedImage] ? (
                  <Image
                    src={product.images[selectedImage].url}
                    alt={product.images[selectedImage].altText || product.name}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(idx)}
                      className={`rounded-lg overflow-hidden border-2 transition ${
                        selectedImage === idx
                          ? "border-emerald-600"
                          : "border-transparent"
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={img.altText || product.name}
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>

              <div className="mb-6">
                {selectedVariant ? (
                  <>
                    <p className="text-3xl font-bold text-emerald-600">
                      {formatPrice(selectedVariant.price)}
                    </p>
                    {selectedVariant.mrp &&
                      selectedVariant.mrp > selectedVariant.price && (
                        <p className="text-gray-500 line-through">
                          {formatPrice(selectedVariant.mrp)}
                        </p>
                      )}
                  </>
                ) : (
                  <p className="text-gray-500">Select flavour and size</p>
                )}
              </div>

              {product.description && (
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Flavours */}
              <div className="mb-6">
                <p className="font-medium mb-2">Select Flavour</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {flavours.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFlavourId(f.id)}
                      className={`py-2 rounded-lg border font-medium transition ${
                        selectedFlavourId === f.id
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                          : "border-gray-300 hover:border-emerald-300"
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="mb-6">
                <p className="font-medium mb-2">Select Size</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSizeId(s.id)}
                      className={`py-2 rounded-lg border font-medium transition ${
                        selectedSizeId === s.id
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                          : "border-gray-300 hover:border-emerald-300"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <p className="font-medium mb-2">Quantity</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border rounded-lg flex items-center justify-center"
                  >
                    <MinusIcon className="w-5 h-5" />
                  </button>
                  <span className="text-lg font-semibold w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border rounded-lg flex items-center justify-center"
                  >
                    <PlusIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {selectedVariant && (
                <p className="text-sm text-gray-600 mb-4">
                  {selectedVariant.stockQuantity > 0
                    ? `${selectedVariant.stockQuantity} in stock`
                    : "Out of stock"}
                </p>
              )}

              <button
                onClick={handleAddToCart}
                disabled={
                  !selectedVariant || selectedVariant.stockQuantity === 0
                }
                className="w-full bg-emerald-600 text-white py-4 rounded-xl font-semibold hover:bg-emerald-700 disabled:bg-gray-300 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
