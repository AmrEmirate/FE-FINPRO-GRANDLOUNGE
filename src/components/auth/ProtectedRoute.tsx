"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"

interface ProtectedRouteProps {
  children: React.ReactNode
  role: "USER" | "TENANT"
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // 1. Tunggu hingga status autentikasi selesai dimuat
    if (loading) {
      return
    }

    // 2. Cek apakah pengguna sudah login
    if (!user) {
      toast.error("Anda harus login untuk mengakses halaman ini.")
      router.push("/auth/login")
      return
    }

    // 3. Cek apakah email pengguna sudah terverifikasi (sesuai permintaan awal)
    if (!user.verified) {
      toast.error("Akun Anda belum terverifikasi. Silakan periksa email Anda.")
      router.push("/") // Arahkan ke halaman utama jika belum terverifikasi
      return
    }

    // 4. Cek apakah peran pengguna sesuai dengan yang diizinkan untuk halaman ini
    if (user.role !== role) {
      toast.error("Anda tidak memiliki izin untuk mengakses halaman ini.")
      
      // Arahkan pengguna ke dashboard mereka yang benar untuk menghindari kebingungan
      const targetDashboard = user.role === "TENANT" ? "/tenant/dashboard" : "/dashboard"
      
      // Mencegah redirect loop jika sudah berada di halaman dashboard yang salah
      if (pathname !== targetDashboard) {
        router.push(targetDashboard)
      }
    }
  }, [user, loading, router, role, pathname])

  // Tampilkan loading screen jika data belum siap atau jika pengguna tidak memenuhi kriteria
  if (loading || !user || !user.verified || user.role !== role) {
    return <div>Loading...</div> // Anda bisa ganti dengan komponen skeleton yang lebih bagus
  }

  // Jika semua kondisi terpenuhi, tampilkan konten halaman
  return <>{children}</>
}