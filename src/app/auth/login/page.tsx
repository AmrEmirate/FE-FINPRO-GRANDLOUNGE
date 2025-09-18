// src/app/auth/login/page.tsx
"use client"

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Building2 } from "lucide-react";
import { useLogin } from "@/hooks/use-login"; // Import hook
import { LoginForm } from "@/components/auth/LoginForm"; // Import komponen form

function LoginContent() {
    const searchParams = useSearchParams();
    const userType = searchParams.get("type") || "user";
    
    // Gunakan custom hook untuk semua logika
    const loginProps = useLogin(userType);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <Building2 className="h-8 w-8 text-amber-600" />
                        <span className="text-2xl font-bold">Grand Lodge</span>
                    </div>
                    <h2 className="text-3xl font-bold">
                        {userType === "tenant" ? "Property Owner Login" : "Welcome Back"}
                    </h2>
                </div>
                {/* Panggil komponen form dengan semua props dari hook */}
                <LoginForm userType={userType} {...loginProps} />
            </div>
        </div>
    );
}

// Komponen LoginPage (wrapper Suspense) tidak berubah
export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}