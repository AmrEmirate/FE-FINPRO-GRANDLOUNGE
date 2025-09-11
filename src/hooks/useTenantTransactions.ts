'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/utils/api';
import { toast } from 'sonner';

export type TransactionStatus = 'MENUNGGU_PEMBAYARAN' | 'MENUNGGU_KONFIRMASI' | 'DIPROSES' | 'SELESAI' | 'DIBATALKAN' | 'Semua';

export interface TenantTransaction {
    id: string;
    invoiceNumber: string;
    checkIn: string;
    checkOut: string;
    totalPrice: number;
    paymentProof: string | null;
    status: Exclude<TransactionStatus, 'Semua' | ''>;
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

export const useTenantTransactions = (status: TransactionStatus) => {
    const [transactions, setTransactions] = useState<TenantTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTransactions = useCallback(async () => {
        setIsLoading(true);
        try {
            let url = '/orders/tenant-transactions';
            if (status && status !== 'Semua') {
                url += `?status=${status}`;
            }
            const response = await api.get(url);
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
        refetch: fetchTransactions,
    };
};