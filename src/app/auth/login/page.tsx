"use client"

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLogin } from "@/hooks/use-login"; // Import hook
import { LoginForm } from "@/components/auth/LoginForm"; // Import komponen form

function LoginContent() {
    const searchParams = useSearchParams();
    const userType = searchParams.get("type") || "user";
    
    // Gunakan custom hook untuk semua logika
    const loginProps = useLogin(userType);

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-blue-200">
            <div className="max-w-md w-full space-y-8">
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