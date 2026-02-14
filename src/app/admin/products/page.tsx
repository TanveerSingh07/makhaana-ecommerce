"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const [variants, setVariants] = useState<any[]>([]);
  const [flavours, setFlavours] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [newProduct, setNewProduct] = useState({
    name: "",
    slug: "",
    description: "",
    images: [""],
    selectedFlavours: [] as string[],
    sizeData: [] as any[],
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const [variantRes, flavourRes, sizeRes] = await Promise.all([
      fetch("/api/admin/products"),
      fetch("/api/admin/flavours"),
      fetch("/api/admin/sizes"),
    ]);

    setVariants(await variantRes.json());
    setFlavours(await flavourRes.json());
    setSizes(await sizeRes.json());
    setLoading(false);
  };

  const updateImage = (index: number, value: string) => {
    const copy = [...newProduct.images];
    copy[index] = value;
    setNewProduct({ ...newProduct, images: copy });
  };

  const addImageField = () => {
    setNewProduct({ ...newProduct, images: [...newProduct.images, ""] });
  };

  const removeImage = (index: number) => {
    const copy = newProduct.images.filter((_, i) => i !== index);
    setNewProduct({ ...newProduct, images: copy });
  };

  const toggleFlavour = (id: string) => {
    const exists = newProduct.selectedFlavours.includes(id);
    if (exists) {
      setNewProduct({
        ...newProduct,
        selectedFlavours: newProduct.selectedFlavours.filter((f) => f !== id),
      });
    } else {
      setNewProduct({
        ...newProduct,
        selectedFlavours: [...newProduct.selectedFlavours, id],
      });
    }
  };

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

  const updateSizeData = (packetSizeId: string, field: string, value: any) => {
    const copy = [...newProduct.sizeData];
    const index = copy.findIndex((s) => s.packetSizeId === packetSizeId);

    if (index >= 0) {
      copy[index][field] = value;
    } else {
      copy.push({
        packetSizeId,
        price: 0,
        mrp: 0,
        stock: 0,
        [field]: value,
      });
    }

    setNewProduct({ ...newProduct, sizeData: copy });
  };

  const createProduct = async () => {
    try {
      const res = await fetch("/api/admin/products/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProduct.name,
          slug: newProduct.slug,
          description: newProduct.description,
          images: newProduct.images.filter(Boolean),
          flavours: newProduct.selectedFlavours,
          sizes: newProduct.sizeData,
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Product created successfully");
      loadAll();
    } catch {
      toast.error("Failed to create product");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow mb-12 space-y-6">
        <h2 className="text-xl font-semibold">Create New Product</h2>

        <input
          placeholder="Product Name"
          className="border rounded px-3 py-2 w-full"
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
        />

        <input
          placeholder="Slug"
          className="border rounded px-3 py-2 w-full"
          onChange={(e) =>
            setNewProduct({ ...newProduct, slug: e.target.value })
          }
        />

        <textarea
          placeholder="Description"
          className="border rounded px-3 py-2 w-full"
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
        />

        {/* IMAGES */}
        <div>
          <p className="font-medium mb-2">Product Images (URLs)</p>
          {newProduct.images.map((img, i) => (
            <div key={i} className="flex flex-col sm:flex-row gap-3 mb-2">
              <input
                value={img}
                placeholder="https://image-url.jpg"
                className="border rounded px-3 py-2 w-full"
                onChange={(e) => updateImage(i, e.target.value)}
              />
              <button onClick={() => removeImage(i)} className="text-red-500">
                ✕
              </button>
            </div>
          ))}
          <button onClick={addImageField} className="text-sm text-emerald-600">
            + Add Image
          </button>
        </div>

        {/* Flavours */}
        <div>
          <p className="font-medium mb-2">Select Flavours</p>
          <div className="flex flex-wrap gap-3">
            {flavours.map((f) => (
              <button
                key={f.id}
                onClick={() => toggleFlavour(f.id)}
                className={`px-3 py-1 rounded ${
                  newProduct.selectedFlavours.includes(f.id)
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div>
          <p className="font-medium mb-4">Set Prices & Stock Per Size</p>

          {sizes.map((size) => (
            <div
              key={size.id}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-3"
            >
              <p className="flex items-center">{size.label}</p>

              <input
                type="number"
                placeholder="Price"
                className="border rounded px-3 py-2"
                onChange={(e) =>
                  updateSizeData(size.id, "price", Number(e.target.value))
                }
              />

              <input
                type="number"
                placeholder="MRP"
                className="border rounded px-3 py-2"
                onChange={(e) =>
                  updateSizeData(size.id, "mrp", Number(e.target.value))
                }
              />

              <input
                type="number"
                placeholder="Stock"
                className="border rounded px-3 py-2"
                onChange={(e) =>
                  updateSizeData(size.id, "stock", Number(e.target.value))
                }
              />
            </div>
          ))}
        </div>

        <button
          onClick={createProduct}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg w-full sm:w-auto"
        >
          Create Product
        </button>
      </div>

      {/* VARIANTS SECTION */}
      <div className="space-y-6">
        {variants.map((v, index) => (
          <div key={v.id} className="bg-white p-6 rounded-2xl shadow">
            <p className="font-semibold mb-4">
              {v.product.name} – {v.flavour.name} – {v.packetSize.label}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
