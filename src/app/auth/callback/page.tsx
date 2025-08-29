"use client"

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

function AuthCallback() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { login } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        const token = searchParams.get('token');
        const userDataString = searchParams.get('user');

        if (token && userDataString) {
            try {
                const user = JSON.parse(decodeURIComponent(userDataString));
                
                // Simpan sesi login
                login(token, user);

                toast({
                    title: "Login Berhasil",
                    description: "Selamat datang kembali!",
                });

                // Arahkan ke dashboard yang sesuai
                if (user.role === 'TENANT') {
                    router.push('/tenant/dashboard');
                } else {
                    router.push('/dashboard');
                }

            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Login Gagal",
                    description: "Gagal memproses data pengguna.",
                });
                router.push('/auth/login');
            }
        } else {
            // Jika tidak ada token, kembali ke halaman login
            toast({
                variant: "destructive",
                title: "Login Gagal",
                description: "Token otentikasi tidak ditemukan.",
            });
            router.push('/auth/login');
        }
    }, [searchParams, router, login, toast]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Mengesahkan sesi Anda...</p>
            </div>
        </div>
    );
}

// Bungkus dengan Suspense karena menggunakan useSearchParams
export default function CallbackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthCallback />
        </Suspense>
    )
}
