'use client';

import { TransactionsContent } from '@/components/tenant/transactions-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTenantTransactions, TransactionStatus } from '@/hooks/useTenantTransactions';
import { useState } from 'react';

export default function TermsPage() {
    const [statusFilter, setStatusFilter] = useState<TransactionStatus>('Semua');

    const statusTabs: { value: TransactionStatus, label: string }[] = [
        { value: 'Semua', label: 'Semua' },
        { value: 'MENUNGGU_PEMBAYARAN', label: 'Menunggu Pembayaran' },
        { value: 'MENUNGGU_KONFIRMASI', label: 'Konfirmasi' },
        { value: 'DIPROSES', label: 'Diproses' },
        { value: 'SELESAI', label: 'Selesai' },
        { value: 'DIBATALKAN', label: 'Dibatalkan' },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Syarat dan Ketentuan</h1>
            <p className="mb-8 text-muted-foreground">
                Berikut adalah syarat dan ketentuan penggunaan platform Grand Lodge.
            </p>
            
            <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as TransactionStatus)} className="w-full">
                <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-4">
                    {statusTabs.map(tab => (
                        <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
                    ))}
                </TabsList>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Transaksi</CardTitle>
                        <CardDescription>
                            Menampilkan transaksi dengan status: {statusTabs.find(t => t.value === statusFilter)?.label}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TransactionsContent />
                    </CardContent>
                </Card>
            </Tabs>
        </div>
    );
}