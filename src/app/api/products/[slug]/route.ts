import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    // ✅ REQUIRED IN NEXT 15 / TURBOPACK
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json(
        { error: "Missing product slug" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        slug,
      },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
        variants: {
          where: { isActive: true },
          include: {
            flavour: true,
            packetSize: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
