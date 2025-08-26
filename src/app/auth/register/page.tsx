"use client"

import type React from "react"
import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Building2 } from "lucide-react"
import { RegisterForm } from "@/src/components/auth/register-form"
import { SocialLogin } from "@/src/components/auth/social-login"

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userType = searchParams.get("type") || "user"

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    companyName: "",
    addressCompany: "",
    phoneNumberCompany: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log("Registration attempt:", { ...formData, userType })
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push("/auth/verify-email")
    } catch (error) {
      console.error("Registration error:", error)
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Building2 className="h-8 w-8 text-amber-600" />
            <span className="text-2xl font-bold text-gray-900">Grand Lodge</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {userType === "tenant" ? "Become a Property Owner" : "Create Account"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {userType === "tenant"
              ? "Join us and start listing your properties"
              : "Sign up to book amazing accommodations"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Create your account to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <SocialLogin type="register" />

            <RegisterForm
              userType={userType}
              formData={formData}
              isLoading={isLoading}
              onSubmit={handleSubmit}
              onChange={handleInputChange}
            />

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href={`/auth/login?type=${userType}`} className="font-medium text-amber-600 hover:text-amber-500">
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

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  )
}
