'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TransactionsContent } from '@/components/tenant/transactions-table';

export default function TenantTransactionsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-3xl">Daftar Transaksi</CardTitle>
                <CardDescription>
                    Kelola dan konfirmasi semua transaksi yang masuk untuk properti Anda.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <TransactionsContent />
            </CardContent>
        </Card>
    );
}