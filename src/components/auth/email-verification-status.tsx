"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

interface EmailVerificationStatusProps {
  // PERUBAHAN DI SINI: Menambahkan "pending" ke dalam tipe data status
  status: "pending" | "success" | "expired" | "invalid"
  onResendVerification: () => void
  isLoading: boolean
}

export function EmailVerificationStatus({ status, onResendVerification, isLoading }: EmailVerificationStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "success":
        return {
          icon: CheckCircle,
          iconColor: "text-green-500",
          title: "Email Verified Successfully!",
          description: "Your account has been verified and password has been set.",
          message: "You will be redirected to the login page shortly.",
        }
      case "expired":
        return {
          icon: Clock,
          iconColor: "text-orange-500",
          title: "Verification Link Expired",
          description: "This verification link has expired. Please request a new one.",
          message: "Verification links are valid for 1 hour only.",
        }
      case "invalid":
        return {
          icon: XCircle,
          iconColor: "text-red-500",
          title: "Invalid Verification Link",
          description: "This verification link is invalid or has already been used.",
          message: "Please check your email for the correct link or request a new one.",
        }
      // Case "pending" akan ditangani oleh "default"
      default:
        return {
          icon: AlertCircle,
          iconColor: "text-gray-500",
          title: "Verification Status Unknown",
          description: "Unable to determine verification status.",
          message: "Please try again or contact support.",
        }
    }
  }

  const config = getStatusConfig()
  const IconComponent = config.icon

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Building2 className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">Grand Lodge</span>
        </div>

        <Card>
          <CardHeader className="text-center">
            <IconComponent className={`h-12 w-12 ${config.iconColor} mx-auto mb-4`} />
            <CardTitle>{config.title}</CardTitle>
            <CardDescription>{config.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 text-center">{config.message}</p>

            {status === "success" ? (
              <Link href="/auth/login">
                <Button className="w-full">Go to Login</Button>
              </Link>
            ) : (
              <div className="space-y-3">
                <Button onClick={onResendVerification} disabled={isLoading} className="w-full">
                  {isLoading ? "Sending..." : "Resend Verification Email"}
                </Button>
                <Link href="/auth/register">
                  <Button variant="outline" className="w-full bg-transparent">
                    Back to Registration
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}