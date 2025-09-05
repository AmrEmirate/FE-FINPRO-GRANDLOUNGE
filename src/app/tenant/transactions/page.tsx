'use client';

import { TransactionsTable } from '@/components/tenant/transactions-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransactionStatus } from '@/hooks/useTenantTransactions';

interface StatusTab {
    value: TransactionStatus | 'MENUNGGU_KONFIRMASI' | '';
    label: string;
}

export default function TenantTransactionsPage() {
    const statusTabs: StatusTab[] = [
        { value: '', label: 'Semua' },
        { value: 'MENUNGGU_PEMBAYARAN', label: 'Menunggu Pembayaran' },
        { value: 'MENUNGGU_KONFIRMASI', label: 'Di Konfirmasi' },
        { value: 'SELESAI', label: 'Selesai' },
        { value: 'DIBATALKAN', label: 'Dibatalkan' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Daftar Transaksi</h1>

            <Tabs defaultValue="" className="w-full">
                <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6">
                    {statusTabs.map((tab) => (
                        <TabsTrigger key={tab.value} value={tab.value}>
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* Logika yang disederhanakan dan diperbaiki */}
                {statusTabs.map((tab) => (
                    <TabsContent key={tab.value} value={tab.value}>
                        <Card>
                            <CardHeader>
                                <CardTitle>{tab.label} Transaksi</CardTitle>
                                <CardDescription>
                                    Daftar semua transaksi dengan status {tab.label.toLowerCase()}.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Melemparkan 'value' dari tab langsung ke tabel */}
                                <TransactionsTable status={tab.value as TransactionStatus} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}