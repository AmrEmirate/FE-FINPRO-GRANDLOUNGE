// src/app/auth/reset-password/page.tsx
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { PasswordForm } from "@/components/auth/password-form";
import { usePasswordReset } from "@/hooks/use-password-reset"; // Import hook

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    
    // Gunakan custom hook untuk semua state dan logika
    const {
        formData,
        isLoading,
        showPassword,
        showConfirmPassword,
        handleInputChange,
        handleSubmit,
        handleTogglePassword,
    } = usePasswordReset(token);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <Building2 className="h-8 w-8 text-amber-600" />
                        <span className="text-2xl font-bold">Grand Lodge</span>
                    </div>
                    <h2 className="text-3xl font-bold">Create New Password</h2>
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
                           <Link href="/auth/login" className="font-medium text-amber-600">
                             Back to Login
                           </Link>
                         </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Komponen ResetPasswordPage tidak berubah
export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}