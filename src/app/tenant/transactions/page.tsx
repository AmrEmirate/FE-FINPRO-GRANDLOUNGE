'use client';

import { useTenantTransactions } from '@/hooks/useTenantTransactions';
import TransactionFilters from '@/components/tenant/TransactionFilters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useMemo } from 'react';
import { UserOrder } from '@/lib/types'; // Pastikan tipe UserOrder diimpor

export default function TenantTransactionsPage() {
    const {
        transactions,
        isLoading,
        properties,
        filters,
        setFilters,
        handleResetFilters
    } = useTenantTransactions();

    const validTransactions = useMemo(() =>
        transactions.filter(trx => trx && trx.user && trx.property),
        [transactions]
    );

    const summary = useMemo(() => {
        const totalTransactions = validTransactions.length;
        const totalRevenue = validTransactions.reduce((sum, current) => sum + current.totalPrice, 0);
        return { totalTransactions, totalRevenue };
    }, [validTransactions]);

    // Fungsi ini dipindahkan ke luar atau tetap di dalam, pastikan sintaksnya benar
    const getStatusVariant = (status: UserOrder['status']) => {
        switch (status) {
            case 'SELESAI': return 'success';
            case 'DIPROSES': return 'default';
            case 'MENUNGGU_PEMBAYARAN':
            case 'MENUNGGU_KONFIRMASI':
                return 'secondary';
            case 'DIBATALKAN': return 'destructive';
            default: return 'outline';
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Pusat Komando Transaksi</h1>

            <TransactionFilters
                filters={filters}
                setFilters={setFilters}
                properties={properties}
                onReset={handleResetFilters}
            />

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle>Total Transaksi</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-bold">{summary.totalTransactions}</p></CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Total Pendapatan</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-bold">Rp {summary.totalRevenue.toLocaleString('id-ID')}</p></CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice</TableHead>
                                <TableHead>Properti</TableHead>
                                <TableHead>Nama Tamu</TableHead>
                                <TableHead>Check-in</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow><TableCell colSpan={6} className="text-center">Memuat data...</TableCell></TableRow>
                            ) : validTransactions.length > 0 ? (
                                // Gunakan data yang sudah bersih
                                validTransactions.map(trx => (
                                    <TableRow key={trx.id}>
                                        <TableCell>{trx.invoiceNumber}</TableCell>
                                        <TableCell>{trx.property.name}</TableCell>
                                        <TableCell>{trx.user.fullName}</TableCell>
                                        <TableCell>{format(new Date(trx.checkIn), 'dd MMM yyyy', { locale: id })}</TableCell>
                                        <TableCell>Rp {trx.totalPrice.toLocaleString('id-ID')}</TableCell>
                                        <TableCell><Badge variant={getStatusVariant(trx.status)}>{trx.status.replace(/_/g, ' ')}</Badge></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow><TableCell colSpan={6} className="text-center">Tidak ada transaksi ditemukan.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}