"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [newProduct, setNewProduct] = useState({
    name: "",
    slug: "",
    description: "",
  });

  // 🔹 Load Variants
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("/api/admin/products");
        if (!res.ok) throw new Error("Failed to load products");

        const data = await res.json();
        setVariants(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // 🔹 Update Variant
  const updateVariant = async (variant: any) => {
    try {
      const res = await fetch("/api/admin/products/variant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId: variant.id,
          price: Number(variant.price),
          stockQuantity: Number(variant.stockQuantity),
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Updated successfully");
    } catch {
      toast.error("Update failed");
    }
  };

  // 🔹 Create Product
  const createProduct = async () => {
    try {
      if (!newProduct.name || !newProduct.slug) {
        toast.error("Name and slug required");
        return;
      }

      const res = await fetch("/api/admin/products/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (!res.ok) throw new Error();

      toast.success("Product created");
      setNewProduct({ name: "", slug: "", description: "" });
    } catch {
      toast.error("Failed to create product");
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading products...</p>;
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      {/* 🔹 CREATE PRODUCT SECTION */}
      <div className="bg-white p-6 rounded-2xl shadow mb-10">
        <h2 className="text-xl font-semibold mb-4">Create Product</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            className="border rounded px-3 py-2"
          />

          <input
            type="text"
            placeholder="Slug"
            value={newProduct.slug}
            onChange={(e) =>
              setNewProduct({ ...newProduct, slug: e.target.value })
            }
            className="border rounded px-3 py-2"
          />

          <input
            type="text"
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            className="border rounded px-3 py-2"
          />
        </div>

        <button
          onClick={createProduct}
          className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-lg"
        >
          Create Product
        </button>
      </div>

      {/* 🔹 VARIANTS SECTION */}
      <div className="space-y-6">
        {variants.map((v, index) => (
          <div key={v.id} className="bg-white p-6 rounded-2xl shadow">
            <p className="font-semibold mb-4">
              {v.product.name} – {v.flavour.name} – {v.packetSize.label}
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={v.price}
                  onChange={(e) => {
                    const copy = [...variants];
                    copy[index].price = e.target.value;
                    setVariants(copy);
                  }}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 block mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  value={v.stockQuantity}
                  onChange={(e) => {
                    const copy = [...variants];
                    copy[index].stockQuantity = e.target.value;
                    setVariants(copy);
                  }}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => updateVariant(v)}
                  className="w-full bg-emerald-600 text-white px-4 py-2 rounded"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
