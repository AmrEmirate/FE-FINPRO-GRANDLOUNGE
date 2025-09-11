'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/utils/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import UploadPaymentDialog from '@/components/orders/upload-payment-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { UserOrder } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Building2, Wallet, Info } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { CountdownTimer } from '@/components/bookings/CountdownTimer';
import WriteReviewDialog from '@/components/orders/WriteReviewDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from 'next/image'; // <-- TAMBAHKAN BARIS INI
import Link from 'next/link';

// Komponen Card untuk setiap pesanan
const OrderCard = ({ order, onCancel, onComplete, onUploadSuccess }: { order: UserOrder, onCancel: (invoice: string) => void, onComplete: (id: string) => void, onUploadSuccess: () => void }) => {

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
        <Card className="overflow-hidden">
            <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                {/* Gambar Properti */}
                <div className="w-full md:w-48 h-40 flex-shrink-0 relative">
                    <Image src={order.property.mainImage || '/placeholder.jpg'} alt={order.property.name} layout="fill" className="rounded-md object-cover" />
                </div>

                {/* Detail Pesanan */}
                <div className="flex-grow space-y-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-lg">{order.property.name}</h3>
                            <p className="text-xs text-gray-500">INV: {order.invoiceNumber}</p>
                        </div>
                        <Badge variant={getStatusVariant(order.status)}>{order.status.replace(/_/g, ' ')}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <div>
                                <p className="font-semibold">Check-in</p>
                                <p>{format(new Date(order.checkIn), 'dd MMM yyyy', { locale: id })}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <div>
                                <p className="font-semibold">Check-out</p>
                                <p>{format(new Date(order.checkOut), 'dd MMM yyyy', { locale: id })}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-gray-500" />
                            <div>
                                <p className="font-semibold">Total Bayar</p>
                                <p>Rp {order.totalPrice.toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                    </div>

                    {order.status === 'MENUNGGU_PEMBAYARAN' && (
                        <CountdownTimer
                            expiryTimestamp={order.paymentDeadline}
                            onTimerEnd={onUploadSuccess} // Refresh data saat waktu habis
                        />
                    )}
                </div>

                {/* Tombol Aksi */}
                <div className="flex flex-col md:items-end justify-between gap-2 pt-2 border-t md:border-none md:pt-0">
                    <Link href={`/properties/${order.property.id}`} passHref>
                        <Button variant="outline" size="sm" className="w-full md:w-auto">Lihat Properti</Button>
                    </Link>

                    {order.status === 'MENUNGGU_PEMBAYARAN' && (
                        <div className="flex gap-2 w-full">
                            <UploadPaymentDialog invoiceNumber={order.invoiceNumber} onUploadSuccess={onUploadSuccess} />
                            <AlertDialog>
                                <AlertDialogTrigger asChild><Button variant="destructive" size="sm" className="flex-grow">Batalkan</Button></AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>Anda yakin?</AlertDialogTitle><AlertDialogDescription>Tindakan ini akan membatalkan pesanan Anda.</AlertDialogDescription></AlertDialogHeader>
                                    <AlertDialogFooter><AlertDialogCancel>Tidak</AlertDialogCancel><AlertDialogAction onClick={() => onCancel(order.invoiceNumber)}>Ya, Batalkan</AlertDialogAction></AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}
                    {order.status === 'DIPROSES' && <Button size="sm" onClick={() => onComplete(order.id)}>Selesaikan Pesanan</Button>}
                    {order.status === 'SELESAI' && !order.review && <WriteReviewDialog bookingId={order.id} propertyId={order.property.id} onReviewSubmit={onUploadSuccess} />}
                </div>
            </CardContent>
        </Card>
    );
};


function OrdersContent() {
    const [allOrders, setAllOrders] = useState<UserOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/orders/order-list');
            setAllOrders(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Gagal memuat daftar pesanan.' });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Fungsi handleCancelOrder dan handleCompleteOrder perlu didefinisikan atau di-pass sebagai props jika ada
    const handleCancelOrder = (invoice: string) => {
        console.log('Cancelling order:', invoice);
        // Implementasi logika pembatalan di sini
    };

    const handleCompleteOrder = (id: string) => {
        console.log('Completing order:', id);
        // Implementasi logika penyelesaian di sini
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-48 mb-4" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
            </div>
        )
    }

    const tabs = [
        { value: "semua", label: "Semua" },
        { value: "MENUNGGU_PEMBAYARAN", label: "Menunggu Bayar" },
        { value: "MENUNGGU_KONFIRMASI", label: "Menunggu Konfirmasi" },
        { value: "DIPROSES", label: "Di Proses" },
        { value: "SELESAI", label: "Selesai" },
        { value: "DIBATALKAN", label: "Di Batalkan" },
    ];

    const filterOrders = (status: string) => {
        if (status === 'semua') return allOrders;
        return allOrders.filter(order => order.status === status);
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Riwayat Pesanan Saya</h1>
                <p className="text-gray-500">Lihat dan kelola semua riwayat pesanan Anda di sini.</p>
            </div>

            <Tabs defaultValue="semua" className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
                    {tabs.map(tab => (
                        <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
                    ))}
                </TabsList>

                {tabs.map(tab => (
                    <TabsContent key={tab.value} value={tab.value} className="space-y-4">
                        {filterOrders(tab.value).length > 0 ? (
                            filterOrders(tab.value).map(order => (
                                <OrderCard key={order.id} order={order} onCancel={handleCancelOrder} onComplete={handleCompleteOrder} onUploadSuccess={fetchOrders} />
                            ))
                        ) : (
                            <div className="text-center py-16 bg-gray-50 rounded-lg">
                                <p className="text-gray-500">Tidak ada pesanan dengan status ini.</p>
                            </div>
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}

export default function UserOrdersPage() {
    return (
        <ProtectedRoute role="USER">
            <OrdersContent />
        </ProtectedRoute>
    );
}