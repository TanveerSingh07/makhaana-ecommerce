/* prisma/seed.ts */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  const flavours = await Promise.all([
    prisma.flavour.upsert({
      where: { slug: "plain-salted" },
      update: {},
      create: { name: "Plain Salted", slug: "plain-salted" },
    }),
    prisma.flavour.upsert({
      where: { slug: "peri-peri" },
      update: {},
      create: { name: "Peri Peri", slug: "peri-peri" },
    }),
    prisma.flavour.upsert({
      where: { slug: "cheese" },
      update: {},
      create: { name: "Cheese", slug: "cheese" },
    }),
    prisma.flavour.upsert({
      where: { slug: "pudina" },
      update: {},
      create: { name: "Pudina", slug: "pudina" },
    }),
  ]);

  console.log("✅ Flavours created");

  const sizes = await Promise.all([
    prisma.packetSize.upsert({
      where: { weightGrams: 50 },
      update: {},
      create: { weightGrams: 50, label: "50g" },
    }),
    prisma.packetSize.upsert({
      where: { weightGrams: 100 },
      update: {},
      create: { weightGrams: 100, label: "100g" },
    }),
    prisma.packetSize.upsert({
      where: { weightGrams: 250 },
      update: {},
      create: { weightGrams: 250, label: "250g" },
    }),
  ]);

  console.log("✅ Packet sizes created");

  const product = await prisma.product.upsert({
    where: { slug: "premium-makhaana" },
    update: {},
    create: {
      name: "Premium Makhaana",
      slug: "premium-makhaana",
      description:
        "Premium quality fox nuts roasted to perfection. Healthy, crunchy, and delicious.",
      images: {
        create: [
          {
            url: "/products/plain_salted.png",
            altText: "Plain Salted",
            sortOrder: 0,
          },
          {
            url: "/products/peri_peri.png",
            altText: "Peri Peri",
            sortOrder: 1,
          },
          { url: "/products/cheese.png", altText: "Cheese", sortOrder: 2 },
          { url: "/products/pudina.png", altText: "Pudina", sortOrder: 3 },
        ],
      },
    },
  });

  console.log("✅ Product created");

  for (const flavour of flavours) {
    for (const size of sizes) {
      const basePrice =
        size.weightGrams === 50 ? 60 : size.weightGrams === 100 ? 110 : 260;

      const sku = `MK-${flavour.slug.toUpperCase()}-${size.weightGrams}`;

      await prisma.productVariant.upsert({
        where: { sku },
        update: {},
        create: {
          productId: product.id,
          flavourId: flavour.id,
          packetSizeId: size.id,
          sku,
          price: basePrice,
          mrp: basePrice + 30,
          stockQuantity: 100,
        },
      });
    }
  }

  console.log("✅ Product variants created");

  await prisma.deliveryRule.deleteMany();

  await prisma.deliveryRule.createMany({
    data: [
      { minOrderValue: 0, maxOrderValue: 499, deliveryCharge: 50 },
      { minOrderValue: 500, maxOrderValue: 99999999, deliveryCharge: 0 },
    ],
  });

  console.log("✅ Delivery rules created");

  const bcrypt = require("bcryptjs");

  // 1️⃣ Ensure admin role exists
  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: { name: "admin" },
  });

  console.log("✅ Admin role ensured");

  // 2️⃣ Create admin user (if not exists)
  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@makhaana.com" },
    update: {},
    create: {
      email: "admin@makhaana.com",
      hashedPassword,
      isActive: true,
      isEmailVerified: true,
    },
  });

  console.log("✅ Admin user ensured");

  // 3️⃣ Assign role safely
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  console.log("✅ Admin role assigned");
  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
