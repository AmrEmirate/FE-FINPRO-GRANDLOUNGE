// src/app/auth/confirm-email-change/page.tsx
"use client"

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Import hook dan komponen baru
import { useEmailConfirmation } from '@/hooks/use-email-confirmation';
import { StatusDisplay } from '@/components/auth/StatusDisplay';

function ConfirmEmailChangeContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    const newEmail = searchParams.get('newEmail');

    // Gunakan custom hook untuk semua logika
    const { status, message } = useEmailConfirmation(token, newEmail);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle>Konfirmasi Perubahan Email</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <StatusDisplay status={status} message={message} />
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

// Wrapper Suspense tetap sama
export default function ConfirmEmailChangePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-amber-600" />
            </div>
        }>
            <ConfirmEmailChangeContent />
        </Suspense>
    );
}