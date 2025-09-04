'use client';

import { useTenantTransactions, TenantTransaction, TransactionStatus } from '@/hooks/useTenantTransactions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Skeleton } from '../ui/skeleton';

interface TransactionsTableProps {
   status: TransactionStatus;
}

export const TransactionsTable = ({ status }: TransactionsTableProps) => {
    const { transactions, isLoading } = useTenantTransactions(status);

    const getStatusVariant = (status: TenantTransaction['status']) => {
        switch (status) {
            case 'SELESAI':
                return 'success';
            case 'DIKONFIRMASI':
                return 'default';
            case 'MENUNGGU_PEMBAYARAN':
                return 'secondary';
            case 'DIBATALKAN':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    if (isLoading) {
        return (
            <div>
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full mb-2" />
                ))}
            </div>
        );
    }

    if (transactions.length === 0) {
        return <p className="text-center text-gray-500 py-8">Tidak ada transaksi ditemukan.</p>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>No. Invoice</TableHead>
                    <TableHead>Properti</TableHead>
                    <TableHead>Pemesan</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Total Harga</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {transactions.map((trx) => (
                    <TableRow key={trx.id}>
                        <TableCell className="font-medium">{trx.invoiceNumber}</TableCell>
                        <TableCell>{trx.property.name}</TableCell>
                        <TableCell>{trx.user.fullName}</TableCell>
                        <TableCell>{format(new Date(trx.checkIn), 'd MMM yyyy', { locale: id })}</TableCell>
                        <TableCell>
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(trx.totalPrice)}
                        </TableCell>
                        <TableCell>
                            <Badge variant={getStatusVariant(trx.status)}>{trx.status.replace('_', ' ')}</Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};