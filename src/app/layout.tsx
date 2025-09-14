"use client"

import { Roboto } from "next/font/google";
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import Navbar from '@/components/Navbar'
import { AuthProvider } from '@/context/AuthContext'
import { usePathname } from 'next/navigation'
import Template from "./template";


const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});


function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <>
      <Navbar />
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
      <body className={`${roboto.variable} font-sans`}>
        <AuthProvider>
          <MainLayout>
            <Template>{children}</Template>
          </MainLayout>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}