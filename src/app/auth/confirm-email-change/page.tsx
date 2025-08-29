"use client"

import { useEffect, Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import apiHelper from '@/lib/apiHelper'; // <-- PERBAIKAN: Tambahkan baris ini

function ConfirmEmailChangeContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { logout } = useAuth();
    const { toast } = useToast();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your new email address...');

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setStatus('error');
            setMessage('Invalid or missing token.');
            return;
        }

        const confirmEmail = async () => {
            try {
                // Sekarang `apiHelper` sudah dikenali
                const response = await apiHelper.post('/user/confirm-email-change', { token });
                setStatus('success');
                setMessage(response.data.message || 'Email changed successfully! Please log in with your new email.');
                
                toast({
                    title: "Email Berhasil Diubah",
                    description: "Anda akan dikeluarkan. Silakan masuk kembali dengan email baru Anda.",
                });

                // Logout otomatis setelah 3 detik dan arahkan ke login
                setTimeout(() => {
                    logout();
                    router.push('/auth/login');
                }, 3000);

            } catch (error: any) {
                setStatus('error');
                const errorMessage = error.response?.data?.message || 'Failed to change email. The link may be invalid or expired.';
                setMessage(errorMessage);
                toast({
                    variant: "destructive",
                    title: "Verification Failed",
                    description: errorMessage,
                });
            }
        };

        confirmEmail();
    }, [searchParams, router, logout, toast]);

    const Icon = status === 'success' ? CheckCircle : status === 'error' ? XCircle : null;
    const iconColor = status === 'success' ? 'text-green-500' : 'text-red-500';

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle>Email Change Confirmation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {status === 'loading' ? (
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                    ) : (
                        Icon && <Icon className={`h-16 w-16 ${iconColor} mx-auto`} />
                    )}
                    <p className="text-gray-600">{message}</p>
                    {status !== 'loading' && (
                        <Button onClick={() => router.push('/auth/login')}>
                            Back to Login
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default function ConfirmEmailChangePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ConfirmEmailChangeContent />
        </Suspense>
    )
}

