import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Create flavours
  const flavours = await Promise.all([
    prisma.flavour.upsert({
      where: { slug: 'plain' },
      update: {},
      create: { name: 'Plain', slug: 'plain' }
    }),
    prisma.flavour.upsert({
      where: { slug: 'salted' },
      update: {},
      create: { name: 'Salted', slug: 'salted' }
    }),
    prisma.flavour.upsert({
      where: { slug: 'peri-peri' },
      update: {},
      create: { name: 'Peri Peri', slug: 'peri-peri' }
    }),
    prisma.flavour.upsert({
      where: { slug: 'cheese' },
      update: {},
      create: { name: 'Cheese', slug: 'cheese' }
    }),
    prisma.flavour.upsert({
      where: { slug: 'pudina' },
      update: {},
      create: { name: 'Pudina', slug: 'pudina' }
    })
  ])

  console.log('Created flavours:', flavours.length)

  // Create packet sizes
  const sizes = await Promise.all([
    prisma.packetSize.upsert({
      where: { weightGrams: 50 },
      update: {},
      create: { weightGrams: 50, label: '50g' }
    }),
    prisma.packetSize.upsert({
      where: { weightGrams: 100 },
      update: {},
      create: { weightGrams: 100, label: '100g' }
    }),
    prisma.packetSize.upsert({
      where: { weightGrams: 250 },
      update: {},
      create: { weightGrams: 250, label: '250g' }
    }),
    prisma.packetSize.upsert({
      where: { weightGrams: 500 },
      update: {},
      create: { weightGrams: 500, label: '500g' }
    })
  ])

  console.log('Created packet sizes:', sizes.length)

  // Create products
  const products = [
    {
      name: 'Premium Makhaana',
      slug: 'premium-makhaana',
      description: 'Our flagship premium quality fox nuts, roasted to perfection. Perfect for guilt-free snacking any time of the day.',
      images: [
        { url: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800', altText: 'Premium Makhaana', sortOrder: 0 }
      ]
    },
    {
      name: 'Flavoured Makhana Mix',
      slug: 'flavoured-makhana-mix',
      description: 'A delightful mix of our best flavours in one convenient pack. Experience variety in every bite.',
      images: [
        { url: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800', altText: 'Flavoured Mix', sortOrder: 0 }
      ]
    }
  ]

  for (const productData of products) {
    const { images, ...productInfo } = productData
    
    const product = await prisma.product.upsert({
      where: { slug: productInfo.slug },
      update: {},
      create: {
        ...productInfo,
        images: {
          create: images
        }
      }
    })

    console.log('Created product:', product.name)

    // Create variants for each product (all flavour and size combinations)
    for (const flavour of flavours) {
      for (const size of sizes) {
        const basePrice = size.weightGrams === 50 ? 50 : 
                         size.weightGrams === 100 ? 95 :
                         size.weightGrams === 250 ? 220 :
                         400

        const sku = `${product.slug.toUpperCase()}-${flavour.slug.toUpperCase()}-${size.label}`

        await prisma.productVariant.upsert({
          where: { sku },
          update: {},
          create: {
            productId: product.id,
            flavourId: flavour.id,
            packetSizeId: size.id,
            sku,
            price: basePrice,
            mrp: basePrice + 20,
            stockQuantity: 100
          }
        })
      }
    }
  }

  console.log('Created all product variants')

  // Create delivery rules
  await prisma.deliveryRule.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      minOrderValue: 0,
      maxOrderValue: 500,
      deliveryCharge: 50
    }
  })

  await prisma.deliveryRule.upsert({
    where: { id: '2' },
    update: {},
    create: {
      id: '2',
      minOrderValue: 500,
      maxOrderValue: 99999999,
      deliveryCharge: 0
    }
  })

  console.log('Created delivery rules')

  // Create admin role
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' }
  })

  console.log('Created admin role')

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })