// src/app/auth/register/page.tsx
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { RegisterForm } from "@/components/auth/register-form";
import { SocialLogin } from "@/components/auth/social-login";
import { useRegistration } from "@/hooks/use-registration"; // Import hook

function RegisterContent() {
    const searchParams = useSearchParams();
    const userType = searchParams.get("type") || "user";

    // Gunakan custom hook untuk semua state dan logika
    const { formData, isLoading, handleInputChange, handleSubmit } = useRegistration(userType);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <Building2 className="h-8 w-8 text-amber-600" />
                        <span className="text-2xl font-bold">Grand Lodge</span>
                    </div>
                    <h2 className="text-3xl font-bold">
                        {userType === "tenant" ? "Become a Property Owner" : "Create Account"}
                    </h2>
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
                            <p className="text-sm">
                                Already have an account?{" "}
                                <Link href={`/auth/login?type=${userType}`} className="font-medium text-amber-600">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Komponen RegisterPage (wrapper Suspense) tidak berubah
export default function RegisterPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RegisterContent />
        </Suspense>
    );
}