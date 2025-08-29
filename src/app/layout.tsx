// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import Navbar from '@/components/Navbar'
import { AuthProvider } from '@/context/AuthContext' // 1. Impor AuthProvider

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Grand Lodge - Premium Property Rentals',
  description: 'Find and book premium accommodations for your perfect stay',
  keywords: 'hotel, accommodation, booking, rental, property, lodge',
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <AuthProvider> {/* 2. Bungkus komponen dengan AuthProvider */}
          <Navbar />
          <main>{children}</main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}