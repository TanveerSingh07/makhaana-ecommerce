# 🛒 Makhaana E-Commerce Platform

A full-stack, production-ready e-commerce web application built with Next.js (App Router), featuring a complete user storefront, secure authentication, Razorpay payments, and a powerful Admin Panel for managing products, orders, and inventory.

The application is fully mobile-responsive, scalable, and follows modern best practices used in real-world commerce platforms.

# 🚀 Features Overview

👤 User (Customer) Features

    Browse products with clean, responsive UI

    View product details (images, flavours, sizes, pricing)

    Filter products by flavour and sort by price

    Add products to cart

    Place orders securely using Razorpay

    Order confirmation page after successful payment

    Track order status using order number

    User authentication with NextAuth

    View past orders and order details

    Contact Us form

    About Us page

    Fully mobile-friendly UI

🛠️ Admin Panel Features

Accessible only to admin users.

    Dashboard with:

        Total orders

        Pending orders

        Total revenue

        Low-stock alerts

    Product management:

        Create new products

        Add multiple images

        Assign flavours and packet sizes

        Set price, MRP, and stock per variant

    Inventory management:

        Update product prices

        Update stock quantities

    Order management:

        View all orders

        Update order status

    Delivery rules management:

        Set delivery charges based on order value

        View customer contact messages

    Responsive admin UI with:

        Sidebar on desktop

        Dropdown menu on mobile

# 🧱 Tech Stack

Frontend

    Next.js 14+ (App Router)

    React

    Tailwind CSS

    Heroicons

Backend

    Next.js API Routes

    Prisma ORM

    PostgreSQL

Authentication

    NextAuth.js

        Credentials & session-based auth

        Admin role protection

Payments

    Razorpay Payment Gateway

    Secure checkout

    Order confirmation handling

State Management

    Zustand (Cart state)

# 🗂️ Project Structure

    app/
    ├─ admin/
    │   ├─ orders/
    │   ├─ products/
    │   ├─ delivery-rules/
    │   ├─ messages/
    │   ├─ layout.tsx
    │   └─ AdminShell.tsx
    ├─ shop/
    ├─ product/[slug]/
    ├─ cart/
    ├─ order-confirmation/
    ├─ track-order/
    ├─ auth/
    ├─ about/
    └─ contact/

    lib/
    ├─ prisma.ts
    ├─ authOptions.ts
    └─ utils.ts

    prisma/
    ├─ schema.prisma
    └─ seed.ts

# 🔐 Environment Variables

Create a .env file:

DATABASE_URL=postgresql://user:password@host:5432/dbname

NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000

RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# 🧪 Local Development Setup

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database
npx prisma db seed

# Start development server
npm run dev

# 🧪 Running E2E Tests

# Install python dependencies
pip install -r requirements.txt

# Install Playwright browsers
playwright install chromium

# Run tests
npm run test:e2e