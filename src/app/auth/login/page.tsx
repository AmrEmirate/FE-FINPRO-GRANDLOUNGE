// src/app/auth/login/page.tsx
"use client"

import type React from "react"
import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Eye, EyeOff, Mail, Lock } from "lucide-react"
import { SocialLogin } from "@/components/auth/social-login"
import api from "@/utils/api"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userType = searchParams.get("type") || "user"
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!formData.email || !formData.password) {
        toast.error("Input Tidak Lengkap", { description: "Mohon isi email dan password." });
        setIsLoading(false)
        return
      }

      // **PERUBAHAN DI SINI: Tambahkan userType ke payload**
      const response = await api.post("/auth/login", {
        ...formData,
        type: userType, // Kirim tipe pengguna ke backend
      })
      
      const { token } = response.data.data;
      
      toast.success("Login Berhasil", { description: "Selamat datang kembali!" });
      
      login(token);

    } catch (error: any) {
      console.error("Login error:", error)
      const errorMessage = error.response?.data?.message || "Terjadi kesalahan saat login."
      toast.error("Login Gagal", { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  // ... sisa kode tidak berubah ...
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Building2 className="h-8 w-8 text-amber-600" />
            <span className="text-2xl font-bold text-gray-900">Grand Lodge</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {userType === "tenant" ? "Property Owner Login" : "Welcome Back"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {userType === "tenant" ? "Sign in to manage your properties" : "Sign in to your account to continue"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link href="/auth/forgot-password" className="text-sm text-amber-600 hover:text-amber-500">
                  Forgot your password?
                </Link>
              </div>

              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <SocialLogin type="login" />

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  href={`/auth/register?type=${userType}`}
                  className="font-medium text-amber-600 hover:text-amber-500"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  )
}