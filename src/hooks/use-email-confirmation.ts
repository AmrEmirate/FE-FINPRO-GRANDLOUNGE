import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import apiHelper from '@/lib/apiHelper';

type Status = 'loading' | 'success' | 'error';

export function useEmailConfirmation(token: string | null, newEmail: string | null) {
    const router = useRouter();
    const { login } = useAuth(); // Gunakan fungsi login dari AuthContext untuk update token
    const { toast } = useToast();
    const [status, setStatus] = useState<Status>('loading');
    const [message, setMessage] = useState('Mengonfirmasi perubahan email Anda...');

    const handleSuccess = (newToken: string) => {
        setStatus('success');
        setMessage('Email berhasil diubah! Anda akan diarahkan ke halaman profil untuk verifikasi.');
        if (newToken) login(newToken); // Perbarui token di AuthContext untuk menjaga sesi login
        toast({ title: "Email Berhasil Diubah", description: "Silakan verifikasi email baru Anda di halaman profil." });
        setTimeout(() => router.push('/dashboard/akun_user/profile'), 3000); // Arahkan ke profil
    };

    const handleError = (error: any) => {
        const errorMessage = error.response?.data?.message || 'Gagal mengubah email.';
        setStatus('error');
        setMessage(errorMessage);
        toast({ variant: "destructive", title: "Konfirmasi Gagal", description: errorMessage });
    };

    const confirm = useCallback(async () => {
        if (!token || !newEmail) {
            setStatus('error');
            setMessage('Tautan konfirmasi tidak valid atau tidak lengkap.');
            return;
        }
        try {
            const response = await apiHelper.post('/auth/confirm-email-change', { token, newEmail });
            handleSuccess(response.data.token); // Kirim token baru ke handler sukses
        } catch (error) {
            handleError(error);
        }
    }, [token, newEmail, login, router, toast]);

    useEffect(() => {
        confirm();
    }, [confirm]);

    return { status, message };
}