"use client";

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserOrder } from '@/lib/types';
import api from '@/utils/api';
import { useToast } from '../ui/use-toast';
import Link from 'next/link';

export function PendingConfirmationWidget() {
    const [orders, setOrders] = useState<UserOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchPendingOrders = async () => {
        setIsLoading(true);
        try {
            // Panggil endpoint baru yang sudah kita buat di backend
            const response = await api.get('/orders/tenant-transactions/pending');
            setOrders(response.data.data || []);
        } catch (error) {
            console.error("Gagal mengambil pesanan menunggu konfirmasi:", error);
            toast({ variant: "destructive", title: "Error", description: "Gagal memuat pesanan." });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingOrders();
    }, []);

    const handleUpdateStatus = async (bookingId: string, status: 'DIPROSES' | 'DIBATALKAN') => {
        try {
            await api.patch(`/orders/confirm-payment/${bookingId}`, { status });
            toast({ title: "Sukses", description: `Pesanan telah berhasil diubah menjadi ${status}.` });
            // Ambil ulang data setelah berhasil update
            fetchPendingOrders();
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Gagal memperbarui status pesanan." });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Menunggu Konfirmasi</CardTitle>
                <CardDescription>
                    Anda memiliki {orders.length} pesanan yang menunggu konfirmasi pembayaran.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading ? (
                    <p>Memuat...</p>
                ) : orders.length > 0 ? (
                    orders.map((order) => (
                        <div key={order.id} className="flex items-center gap-4">
                            <Avatar className="hidden h-9 w-9 sm:flex">
                                <AvatarImage src={order.user?.profilePicture || '/placeholder-user.jpg'} alt="Avatar" />
                                <AvatarFallback>{order.user?.fullName?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1 flex-1">
                                <p className="text-sm font-medium leading-none">{order.user?.fullName || 'Tamu'}</p>
                                <p className="text-sm text-muted-foreground">{order.property?.name || 'Properti'}</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <p className="font-medium text-sm">+Rp {order.totalPrice.toLocaleString('id-ID')}</p>
                                {order.paymentProof && (
                                    <Link href={order.paymentProof} target="_blank" rel="noopener noreferrer">
                                        <Button variant="link" className="h-auto p-0 text-xs">Lihat Bukti</Button>
                                    </Link>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'DIPROSES')}>Konfirmasi</Button>
                                <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus(order.id, 'DIBATALKAN')}>Tolak</Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        Tidak ada pesanan yang menunggu konfirmasi saat ini.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}