'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import UploadPaymentDialog from '@/components/orders/upload-payment-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface UserOrder {
    id: string;
    orderId: string;
    property: { name: string };
    checkIn: string;
    checkOut: string;
    total: number;
    status: 'Menunggu Pembayaran' | 'Diproses' | 'Selesai' | 'Dibatalkan' | 'Menunggu Konfirmasi';
}

export default function UserOrdersPage() {
    const [orders, setOrders] = useState<UserOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/order-list/user');
            setOrders(response.data);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Gagal memuat daftar pesanan.' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCancelOrder = async (orderId: string) => {
        try {
            await api.patch(`/cancel-order/user/${orderId}`);
            toast({ title: 'Sukses', description: 'Pesanan berhasil dibatalkan.' });
            fetchOrders(); // Refresh data
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Gagal membatalkan pesanan.' });
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-1/3" />
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
            <h1 className="text-2xl font-bold">Riwayat Pesanan Saya</h1>
            {orders.length === 0 ? (
                <p>Anda belum memiliki riwayat pesanan.</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Properti</TableHead>
                            <TableHead>Check-in</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.orderId}</TableCell>
                                <TableCell>{order.property.name}</TableCell>
                                <TableCell>{new Date(order.checkIn).toLocaleDateString('id-ID')}</TableCell>
                                <TableCell>Rp {order.total.toLocaleString('id-ID')}</TableCell>
                                <TableCell><Badge>{order.status}</Badge></TableCell>
                                <TableCell className="text-right">
                                    {order.status === 'Menunggu Pembayaran' && (
                                        <div className="flex justify-end space-x-2">
                                            <UploadPaymentDialog orderId={order.id} onUploadSuccess={fetchOrders} />

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" size="sm">Batalkan</Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Tindakan ini akan membatalkan pesanan Anda secara permanen.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Tidak</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleCancelOrder(order.id)}>Ya, Batalkan</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>

                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}