import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Makhaana - Premium Fox Nuts | Healthy Snacks',
  description: 'Shop premium quality makhaana (fox nuts) in multiple flavours and sizes. Healthy, delicious, and delivered fresh to your door.',
  keywords: 'makhaana, fox nuts, healthy snacks, makhana, Indian snacks',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="makhaana">
      <body className={inter.className}>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}