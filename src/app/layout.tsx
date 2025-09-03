// src/app/layout.tsx

"use client" // Tambahkan ini di baris pertama

import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import Navbar from '@/components/Navbar'
import { AuthProvider } from '@/context/AuthContext'
import { usePathname } from 'next/navigation' // Impor usePathname

const inter = Inter({ subsets: ['latin'] })

// Hapus metadata dari sini karena Client Component tidak mendukungnya
// export const metadata: Metadata = { ... };

function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <>
      <Navbar />
      {/* PERBAIKAN UTAMA:
        Kelas pt-20 hanya ditambahkan jika BUKAN halaman utama.
      */}
      <main className={!isHome ? 'pt-20' : ''}>{children}</main>
    </>
  )
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Anda bisa menambahkan <title> dan <meta> di sini secara manual jika perlu */}
        <title>Grand Lodge - Premium Property Rentals</title>
        <meta name="description" content="Find and book premium accommodations for your perfect stay" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <MainLayout>{children}</MainLayout>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}