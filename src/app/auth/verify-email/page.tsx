"use client"

import type React from "react"
import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Building2 } from "lucide-react"
import { PasswordForm } from "@/src/components/auth/password-form"
import { EmailVerificationStatus } from "@/src/components/auth/email-verification-status"

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "success" | "expired" | "invalid">("pending")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long")
      return
    }

    setIsLoading(true)

    try {
      console.log("Email verification and password setup:", { token, password: formData.password })
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setVerificationStatus("success")

      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
    } catch (error) {
      console.error("Verification error:", error)
      setVerificationStatus("invalid")
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
    setIsLoading(true)
    try {
      console.log("Resending verification email")
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert("Verification email sent!")
    } catch (error) {
      console.error("Resend verification error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (verificationStatus !== "pending") {
    return (
      <EmailVerificationStatus
        status={verificationStatus}
        onResendVerification={handleResendVerification}
        isLoading={isLoading}
      />
    )
  }

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
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
