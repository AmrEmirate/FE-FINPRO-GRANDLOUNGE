// src/hooks/useTenantTransactions.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/utils/api';
import { toast } from 'sonner';

export type TransactionStatus = 'MENUNGGU_PEMBAYARAN' | 'MENUNGGU_KONFIRMASI' | 'DIPROSES' | 'SELESAI' | 'DIBATALKAN' | 'Semua';

export interface TenantTransaction {
    id: string;
    invoiceNumber: string;
    reservationId: string;
    checkIn: string;
    checkOut: string;
    totalPrice: number;
    paymentProof: string | null;
    status: Exclude<TransactionStatus, 'Semua'>;
    user: {
        fullName: string;
    } | null;
    property: {
        id: string;
        name: string;
        mainImage: string | null;
    };
    createdAt: string;
}

// Tipe untuk state filter tetap kita definisikan di sini agar bisa diakses komponen lain
export interface TransactionFiltersState {
    status: TransactionStatus;
    searchQuery: string;
    checkInDate?: Date;
}

// Hook sekarang HANYA bergantung pada status untuk mengambil data
export const useTenantTransactions = (status: TransactionStatus) => {
    const [transactions, setTransactions] = useState<TenantTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTransactions = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();

            // Hanya kirim status ke backend, ini akan mengambil semua data untuk status tsb
            if (status && status !== 'Semua') {
                params.append('status', status);
            }

            const url = `/orders/tenant-transactions?${params.toString()}`;

            const response = await api.get(url);
            setTransactions(response.data.data ?? []);
        } catch (error) {
            toast.error('Gagal memuat data transaksi.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [status]); // Dependensi sekarang hanya 'status'

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    return {
        transactions,
        isLoading,
        refetch: fetchTransactions,
    };
};