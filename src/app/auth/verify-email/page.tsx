// src/app/auth/verify-email/page.tsx
"use client"

import type React from "react"
import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2 } from "lucide-react"
import { PasswordForm } from "@/components/auth/password-form"
import { EmailVerificationStatus } from "@/components/auth/email-verification-status"
import apiHelper from "@/lib/apiHelper" // Ganti nama impor
import { useToast } from "@/hooks/use-toast"

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  // Ambil token dari URL
  const token = searchParams.get("token")

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "success" | "expired" | "invalid">("pending")

  // Cek apakah ada token saat komponen dimuat
  useEffect(() => {
    if (!token) {
      setVerificationStatus("invalid");
    }
  }, [token]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({ variant: "destructive", title: "Error", description: "Passwords do not match." });
      return
    }
    if (formData.password.length < 8) {
      toast({ variant: "destructive", title: "Error", description: "Password must be at least 8 characters long." });
      return
    }

    setIsLoading(true)

    try {
      // Panggil API backend untuk verifikasi
      await apiHelper.post("/auth/verify", {
        token: token,
        password: formData.password,
      })

      setVerificationStatus("success")
      toast({ title: "Success", description: "Account verified successfully! Redirecting to login..." });

      // Arahkan ke login setelah 2 detik [cite: 119]
      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)

    } catch (error: any) {
      console.error("Verification error:", error)
      const message = error.response?.data?.message || "Invalid or expired token."
      toast({ variant: "destructive", title: "Verification Failed", description: message });
      if (message.toLowerCase().includes("expired")) {
        setVerificationStatus("expired");
      } else {
        setVerificationStatus("invalid");
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleTogglePassword = (field: "password" | "confirmPassword") => {
    if (field === "password") {
      setShowPassword(!showPassword)
    } else {
      setShowConfirmPassword(!showConfirmPassword)
    }
  }

  const handleResendVerification = async () => {
    // Logika untuk mengirim ulang email verifikasi bisa ditambahkan di sini
    // Memerlukan input email dari pengguna
    toast({ title: "Info", description: "Resend verification feature needs to be implemented." });
  }

  // Jika status bukan lagi "pending", tampilkan hasilnya
  if (verificationStatus !== "pending" || !token) {
    return (
      <EmailVerificationStatus
        status={verificationStatus}
        onResendVerification={handleResendVerification}
        isLoading={isLoading}
      />
    )
  }
  
  // Tampilan form utama
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Grand Lodge</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Verify Your Email</h2>
          <p className="mt-2 text-sm text-gray-600">Complete your registration by setting up your password</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Set Your Password</CardTitle>
            <CardDescription>Create a secure password for your account</CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordForm
              formData={formData}
              showPassword={showPassword}
              showConfirmPassword={showConfirmPassword}
              isLoading={isLoading}
              onSubmit={handleSubmit}
              onChange={handleInputChange}
              onTogglePassword={handleTogglePassword}
            />
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}