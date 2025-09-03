"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation" // Impor usePathname
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"

interface ProtectedRouteProps {
  children: React.ReactNode
  role: "USER" | "TENANT" 
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname() // Dapatkan path saat ini

  useEffect(() => {
    if (loading) {
      return
    }

    if (!user) {
      toast.error("You must be logged in to access this page.")
      router.push("/auth/login")
      return
    }

    // --- PERBAIKAN UTAMA ---
    if (user.role !== role) {
      toast.error("You do not have permission to access this page.")
      
      let targetDashboard = "/"; // Fallback ke homepage
      if (user.role === "TENANT") {
        targetDashboard = "/tenant/dashboard";
      } else if (user.role === "USER") {
        targetDashboard = "/dashboard";
      }

      // Hanya redirect jika kita tidak sudah di halaman target
      // Ini untuk mencegah redirect loop
      if (pathname !== targetDashboard) {
        router.push(targetDashboard);
      }
    }
    
  }, [user, loading, router, role, pathname]) // Tambahkan pathname

  if (loading || !user) {
    return <div>Authenticating...</div>
  }
  
  if (user.role === role) {
    return <>{children}</>
  }

  return null
}