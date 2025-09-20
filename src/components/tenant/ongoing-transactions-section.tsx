'use client';

import { useTenantTransactions } from '@/hooks/useTenantTransactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Skeleton } from '../ui/skeleton';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

export const OngoingTransactionsSection = () => {
    const { transactions, isLoading } = useTenantTransactions('MENUNGGU_KONFIRMASI');

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (transactions.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold tracking-tight">ADA TRANSAKSI BARU</h2>
            </div>
            <Card>
                <CardContent className="pt-6 bg-gray-900 text-white rounded-xl">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='text-white'>No. Pesanan</TableHead>
                                <TableHead className='text-white'>Properti</TableHead>
                                <TableHead className='text-white'>Tamu</TableHead>
                                <TableHead className='text-white'>Tanggal Check-in</TableHead>
                                <TableHead className='text-white'>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map(trx => (
                                <TableRow key={trx.id}>
                                    <TableCell>{trx.reservationId?.substring(0, 6).toUpperCase() ?? 'N/A'}</TableCell>
                                    <TableCell className="font-medium">{trx.property.name}</TableCell>
                                    <TableCell>{trx.user?.fullName}</TableCell>
                                    <TableCell>{format(new Date(trx.checkIn), 'd MMM yyyy', { locale: id })}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className='text-white text-center'>
                                            PERLU KONFIRMASI
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};