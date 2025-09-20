"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { RegisterForm } from "@/components/auth/register-form";
import { SocialLogin } from "@/components/auth/social-login";
import { useRegistration } from "@/hooks/use-registration";

function RegisterContent() {
    const searchParams = useSearchParams();
    const userType = searchParams.get("type") || "user";

    const { formData, isLoading, handleInputChange, handleSubmit } = useRegistration(userType);

    return (
        <div className="min-h-screen bg-blue- flex items-center justify-center p-4 bg-blue-200">
            <div className="max-w-md w-full">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Sign Up</CardTitle>
                        <CardDescription>Fill out the form to get started</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {userType !== 'tenant' && <SocialLogin type="register" />}
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
                                <Link href={`/auth/login?type=${userType}`} className="font-medium text-amber-600 hover:underline">
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

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <RegisterContent />
        </Suspense>
    );
}