'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import TransactionsTable from '@/components/tenant/transactions-table';
import { TenantTransaction } from '@/lib/types';

export default function TenantTransactionsPage() {
    const [transactions, setTransactions] = useState<TenantTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchTransactions = async () => {
        setIsLoading(true);
        try {
            // Endpoint BE untuk mengambil semua transaksi milik tenant
            const response = await api.get('/order-list/tenant');
            setTransactions(response.data);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Gagal memuat data transaksi.',
            });
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <h1 className="text-2xl font-bold">Manajemen Transaksi</h1>
                <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Manajemen Transaksi</h1>
            {transactions.length > 0 ? (
                <TransactionsTable
                    data={transactions}
                    refetchData={fetchTransactions} // Kirim fungsi untuk me-refresh data
                />
            ) : (
                <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                    <p className="text-gray-500">Belum ada transaksi yang masuk.</p>
                </div>
            )}
        </div>
    );
}