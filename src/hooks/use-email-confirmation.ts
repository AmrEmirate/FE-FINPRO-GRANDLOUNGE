// src/hooks/use-email-confirmation.ts
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import apiHelper from '@/lib/apiHelper';

// State untuk status konfirmasi
type Status = 'loading' | 'success' | 'error';

export function useEmailConfirmation(token: string | null, newEmail: string | null) {
    const router = useRouter();
    const { login } = useAuth();
    const { toast } = useToast();
    const [status, setStatus] = useState<Status>('loading');
    const [message, setMessage] = useState('Mengonfirmasi perubahan email Anda...');

    // Fungsi untuk menangani logika sukses
    const handleSuccess = (newToken: string) => {
        setStatus('success');
        setMessage('Email berhasil diubah! Anda akan diarahkan ke halaman profil.');
        if (newToken) login(newToken); // Update state otentikasi
        toast({ title: "Email Berhasil Diubah" });
        setTimeout(() => router.push('/dashboard/akun_user/profile'), 3000);
    };

    // Fungsi untuk menangani logika error
    const handleError = (error: any) => {
        const errorMessage = error.response?.data?.message || 'Gagal mengubah email.';
        setStatus('error');
        setMessage(errorMessage);
        toast({ variant: "destructive", title: "Konfirmasi Gagal", description: errorMessage });
    };

    // Fungsi utama untuk konfirmasi, dibungkus useCallback
    const confirm = useCallback(async () => {
        if (!token || !newEmail) {
            setStatus('error');
            setMessage('Tautan konfirmasi tidak valid atau tidak lengkap.');
            return;
        }
        try {
            const response = await apiHelper.post('/user/confirm-email-change', { token, newEmail });
            handleSuccess(response.data.token);
        } catch (error) {
            handleError(error);
        }
    }, [token, newEmail, login, router, toast]);

    // Jalankan konfirmasi saat komponen dimuat
    useEffect(() => {
        confirm();
    }, [confirm]);

    return { status, message };
}