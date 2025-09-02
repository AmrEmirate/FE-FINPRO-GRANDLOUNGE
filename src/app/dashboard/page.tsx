"use client"

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function DashboardContent() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <Card className="w-full max-w-lg text-center">
                <CardHeader>
                    <CardTitle className="text-3xl">
                        Selamat Datang, {user?.fullName}!
                    </CardTitle>
                    <CardDescription>
                        Ini adalah halaman dashboard Anda. Kelola semua informasi akun Anda dari sini.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mb-6 text-gray-600">
                        Anda dapat melihat riwayat pesanan, mengelola ulasan, dan memperbarui detail profil Anda.
                    </p>
                    <Link href="/dashboard/akun_user/profile">
                        <Button size="lg">
                            Buka Pengaturan Profil
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}

// Komponen utama halaman yang dilindungi
export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}