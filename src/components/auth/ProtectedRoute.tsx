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
    if (loading) {
      return
    }

    if (!user) {
      toast.error("Anda harus login untuk mengakses halaman ini.")
      router.push("/auth/login")
      return
    }

    if (!user.verified) {
      toast.error("Akun Anda belum terverifikasi. Silakan periksa email Anda.")
      router.push("/") 
    }

    if (user.role !== role) {
      toast.error("Anda tidak memiliki izin untuk mengakses halaman ini.")
      
      const targetDashboard = user.role === "TENANT" ? "/tenant/dashboard" : "/dashboard"
      
      if (pathname !== targetDashboard) {
        router.push(targetDashboard)
      }
    }
  }, [user, loading, router, role, pathname])

  if (loading || !user || !user.verified || user.role !== role) {
    return <div>Loading...</div> 
  }

  return <>{children}</>
}