"use client"

import { useEffect, Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import apiHelper from '@/lib/apiHelper';

function ConfirmEmailChangeContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { login } = useAuth(); // Kita akan pakai fungsi login dari AuthContext
    const { toast } = useToast();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Mengonfirmasi perubahan email Anda...');

    useEffect(() => {
        // PERBAIKAN 1: Ambil token DAN email baru dari URL
        const token = searchParams.get('token');
        const newEmail = searchParams.get('newEmail');

        if (!token || !newEmail) {
            setStatus('error');
            setMessage('Tautan konfirmasi tidak valid atau tidak lengkap.');
            return;
        }

        const confirmEmail = async () => {
            try {
                // PERBAIKAN 2: Kirim token DAN email baru ke backend
                const response = await apiHelper.post('/user/confirm-email-change', { token, newEmail });
                
                setStatus('success');
                setMessage('Email berhasil diubah! Anda akan diarahkan ke halaman profil.');
                
                // PERBAIKAN 3: Gunakan token baru untuk "login" ulang
                const newToken = response.data.token;
                if (newToken) {
                    login(newToken); // AuthContext akan menyimpan token baru & data user
                }

                toast({
                    title: "Email Berhasil Diubah",
                    description: "Email Anda telah diperbarui. Silakan verifikasi email baru Anda.",
                });

                // PERBAIKAN 4: Arahkan ke halaman profil, bukan logout/login
                setTimeout(() => {
                    router.push('/dashboard/akun_user/profile');
                }, 3000);

            } catch (error: any) {
                setStatus('error');
                const errorMessage = error.response?.data?.message || 'Gagal mengubah email. Tautan mungkin tidak valid atau sudah kedaluwarsa.';
                setMessage(errorMessage);
                toast({
                    variant: "destructive",
                    title: "Konfirmasi Gagal",
                    description: errorMessage,
                });
            }
        };

        confirmEmail();
    }, [searchParams, router, login, toast]);

    const Icon = status === 'success' ? CheckCircle : status === 'error' ? XCircle : Loader2;
    const iconColor = status === 'success' ? 'text-green-500' : 'text-red-500';

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle>Konfirmasi Perubahan Email</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Icon className={`h-16 w-16 ${iconColor} mx-auto ${status === 'loading' ? 'animate-spin' : ''}`} />
                    <p className="text-gray-600">{message}</p>
                    {status === 'error' && (
                        <Button onClick={() => router.push('/dashboard/akun_user/profile')}>
                            Kembali ke Profil
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default function ConfirmEmailChangePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-amber-600" />
            </div>
        }>
            <ConfirmEmailChangeContent />
        </Suspense>
    )
}