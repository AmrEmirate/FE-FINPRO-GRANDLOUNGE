// src/app/auth/reset-password/page.tsx
"use client"

import type React from "react"
import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2 } from "lucide-react"
import { PasswordForm } from "@/components/auth/password-form" // Kita gunakan form yang sama
import apiHelper from "@/lib/apiHelper"
import { useToast } from "@/hooks/use-toast"

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const token = searchParams.get("token")

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({ variant: "destructive", title: "Error", description: "Passwords do not match." });
      return
    }
    if (!token) {
      toast({ variant: "destructive", title: "Error", description: "Invalid reset link." });
      return
    }

    setIsLoading(true)
    try {
      await apiHelper.post("/auth/password-reset/confirm", {
        token,
        password: formData.password,
      })

      toast({ title: "Success", description: "Password has been reset successfully. Please log in." });
      router.push("/auth/login")

    } catch (error: any) {
      const message = error.response?.data?.message || "Invalid or expired token."
      toast({ variant: "destructive", title: "Reset Failed", description: message });
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleTogglePassword = (field: "password" | "confirmPassword") => {
    if (field === "password") setShowPassword(!showPassword)
    else setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Building2 className="h-8 w-8 text-amber-600" />
            <span className="text-2xl font-bold text-gray-900">Grand Lodge</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create New Password</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>New Password</CardTitle>
            <CardDescription>Enter and confirm your new password.</CardDescription>
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
               <Link href="/auth/login" className="font-medium text-amber-600 hover:text-amber-500">
                Back to Login
               </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
} 