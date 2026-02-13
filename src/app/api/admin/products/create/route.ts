import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

function generateSKU(
  productSlug: string,
  flavourSlug: string,
  size: number
) {
  return `${productSlug.toUpperCase()}-${flavourSlug.toUpperCase()}-${size}`;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();

  const { name, slug, description, images, flavours, sizes } = body;

  if (!name || !slug || !flavours?.length || !sizes?.length) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
    },
  });

  if (images?.length) {
    await prisma.productImage.createMany({
      data: images.map((url: string, index: number) => ({
        productId: product.id,
        url,
        altText: name,
        sortOrder: index,
      })),
    });
  }

  const flavourRecords = await prisma.flavour.findMany({
    where: { id: { in: flavours } },
  });

  const sizeRecords = await prisma.packetSize.findMany({
    where: { id: { in: sizes.map((s: any) => s.packetSizeId) } },
  });

  // 4️⃣ Create Variants
  for (const flavour of flavourRecords) {
    for (const sizeObj of sizes) {
      const size = sizeRecords.find(
        (s) => s.id === sizeObj.packetSizeId
      );

      if (!size) continue;

      await prisma.productVariant.create({
        data: {
          productId: product.id,
          flavourId: flavour.id,
          packetSizeId: size.id,
          price: sizeObj.price,
          mrp: sizeObj.mrp || null,
          stockQuantity: sizeObj.stock,
          sku: generateSKU(slug, flavour.slug, size.weightGrams),
        },
      });
    }
  }

  return NextResponse.json({ success: true });
}
