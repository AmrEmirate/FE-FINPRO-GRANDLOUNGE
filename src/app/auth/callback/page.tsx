// src/app/auth/callback/page.tsx

"use client"

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Komponen internal untuk menangani logika callback
function AuthCallback() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { login } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        // Mengambil token dari URL query parameters
        const token = searchParams.get('token');

        // Memeriksa apakah token ada
        if (token) {
            try {
                // --- PERBAIKAN UTAMA ---
                // Memanggil fungsi login hanya dengan satu argumen, yaitu token.
                // Fungsi login di dalam AuthContext akan menangani proses decoding token
                // untuk mendapatkan data pengguna dan melakukan redirect.
                login(token);

                // Menampilkan notifikasi sukses
                toast({
                    title: "Login Berhasil",
                    description: "Selamat datang kembali! Anda akan diarahkan sebentar lagi.",
                });

                // Catatan: Redirect tidak perlu dipanggil di sini karena
                // sudah ditangani di dalam fungsi login di AuthContext.

            } catch (error) {
                // Menangani jika terjadi error saat proses login
                console.error("Login callback error:", error);
                toast({
                    variant: "destructive",
                    title: "Login Gagal",
                    description: "Terjadi kesalahan saat memproses data Anda.",
                });
                // Mengarahkan kembali ke halaman login jika gagal
                router.push('/auth/login');
            }
        } else {
            // Menangani jika token tidak ditemukan di URL
            toast({
                variant: "destructive",
                title: "Login Gagal",
                description: "Token otentikasi tidak ditemukan di URL.",
            });
            router.push('/auth/login');
        }
        // Menambahkan dependensi yang relevan ke dalam array dependensi useEffect
    }, [searchParams, router, login, toast]);

    // Tampilan saat proses sedang berjalan
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="text-center">
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Memproses otentikasi Anda...
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Mohon tunggu sebentar.
                </p>
            </div>
        </div>
    );
}

// Komponen utama halaman yang menggunakan Suspense untuk fallback loading
export default function CallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        }>
            <AuthCallback />
        </Suspense>
    );
}