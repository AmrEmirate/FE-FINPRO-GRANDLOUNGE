// src/app/auth/verify-email/page.tsx
"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2 } from "lucide-react"
import { PasswordForm } from "@/components/auth/password-form"
import { EmailVerificationStatus } from "@/components/auth/email-verification-status"
import { useEmailVerification } from "@/hooks/use-email-verification" // Import hook

function VerifyEmailContent() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    // Gunakan custom hook untuk semua state dan logika
    const {
        status,
        formData,
        isLoading,
        showPassword,
        showConfirmPassword,
        handleInputChange,
        handleSubmit,
        handleTogglePassword,
        handleResendVerification
    } = useEmailVerification(token);

    // Tampilkan status jika verifikasi sudah selesai atau token tidak valid
    if (status !== "pending" || !token) {
        return (
            <EmailVerificationStatus
                status={status}
                onResendVerification={handleResendVerification}
                isLoading={isLoading}
            />
        );
    }

    // Tampilan form utama
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <Building2 className="h-8 w-8 text-blue-600" />
                        <span className="text-2xl font-bold">Grand Lodge</span>
                    </div>
                    <h2 className="text-3xl font-bold">Verify Your Email</h2>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Set Your Password</CardTitle>
                        <CardDescription>Create a secure password</CardDescription>
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
                            <Link href="/auth/login" className="text-sm font-medium text-blue-600">
                                Back to Login
                            </Link>
                         </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Komponen VerifyEmailPage tidak berubah
export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}