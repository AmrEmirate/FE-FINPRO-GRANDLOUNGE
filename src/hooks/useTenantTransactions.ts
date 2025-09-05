'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/utils/api';
import { toast } from 'sonner';

// --- BAGIAN YANG DIPERBARUI ---



// 1. Definisikan tipe Status secara terpisah agar bisa diekspor
export type TransactionStatus = 'MENUNGGU_PEMBAYARAN' | 'MENUNGGU_KONFIRMASI' | 'SELESAI' | 'DIBATALKAN' | '';

// Definisikan tipe data untuk setiap transaksi
export interface TenantTransaction {
    id: string;
    invoiceNumber: string;
    checkIn: string;
    checkOut: string;
    totalPrice: number;
    paymentProof: string | null;
    status: Exclude<TransactionStatus, ''>;
    user: {
        fullName: string;
    };
    property: {
        name: string;
    };
    createdAt: string;
}

// Custom hook untuk mengambil data transaksi tenant
// 2. Perbarui tipe parameter initialStatus
export const useTenantTransactions = (initialStatus: TransactionStatus = '') => {
    const [transactions, setTransactions] = useState<TenantTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState<TransactionStatus>(initialStatus);

    const fetchTransactions = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/orders/tenant-transactions', {
                // Cek jika status bukan string kosong sebelum dikirim
                params: { status: status || undefined },
            });
            setTransactions(response.data.data ?? []);
        } catch (error) {
            toast.error('Gagal memuat data transaksi.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [status]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    return {
        transactions,
        isLoading,
        setStatus,
        refetch: fetchTransactions,
    };
};

// --- AKHIR DARI PEMBARUAN ---