'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/utils/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import UploadPaymentDialog from '@/components/orders/upload-payment-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { UserOrder } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Search, X } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const formatDeadline = (isoString: string) => {
    try {
        const date = new Date(isoString);
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta', hour12: false
        }) + ' WIB';
    } catch (error) {
        return "Invalid time";
    }
};

export default function UserOrdersPage() {
    const [orders, setOrders] = useState<UserOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const [searchOrderId, setSearchOrderId] = useState('');
    const [searchDate, setSearchDate] = useState<Date | undefined>();

    const fetchOrders = useCallback(async (filters: { orderId?: string; date?: string } = {}) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.orderId) params.append('orderId', filters.orderId);
            if (filters.date) params.append('date', filters.date);

            const response = await api.get(`/order-list/user?${params.toString()}`);

            if (Array.isArray(response.data.data)) {
                setOrders(response.data.data);
            } else {
                setOrders([]);
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Gagal memuat daftar pesanan.' });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // --- PENJELASAN 1: Efek untuk memeriksa pesanan yang kedaluwarsa secara real-time ---
    useEffect(() => {
        // Jalankan sebuah timer yang akan memeriksa setiap 5 detik
        const intervalId = setInterval(() => {
            // Dapatkan state `orders` yang paling baru
            setOrders(currentOrders => {
                let hasChanged = false;
                // Buat array baru dengan status yang sudah diperbarui
                const updatedOrders = currentOrders.map(order => {
                    // Hanya periksa pesanan yang statusnya 'Menunggu Pembayaran'
                    if (order.status === 'Menunggu Pembayaran') {
                        const isExpired = new Date() > new Date(order.paymentDeadline);
                        if (isExpired) {
                            hasChanged = true; 
                            return { ...order, status: 'Dibatalkan' as const };
                        }
                    }
                    return order; // Kembalikan pesanan tanpa perubahan jika tidak ada masalah
                });

                // Hanya perbarui state jika benar-benar ada perubahan
                // Ini penting untuk mencegah re-render yang tidak perlu
                if (hasChanged) {
                    return updatedOrders;
                }
                return currentOrders;
            });
        }, 5000); // Interval 5 detik

        // --- PENJELASAN 2: Hentikan timer saat komponen tidak lagi ditampilkan ---
        // Ini adalah "cleanup function" yang sangat penting untuk mencegah kebocoran memori (memory leak)
        return () => clearInterval(intervalId);
    }, []); // Dependency array kosong `[]` berarti efek ini hanya berjalan sekali saat komponen dimuat

    const handleSearch = () => {
        const filters: { orderId?: string; date?: string } = {};
        if (searchOrderId) filters.orderId = searchOrderId;
        if (searchDate) filters.date = searchDate.toISOString().split('T')[0];
        fetchOrders(filters);
    };

    const handleReset = () => {
        setSearchOrderId('');
        setSearchDate(undefined);
        fetchOrders();
    };

    const handleCancelOrder = async (orderId: string) => {
        try {
            await api.patch(`/cancel-order/user/${orderId}`);
            toast({ title: 'Sukses', description: 'Pesanan berhasil dibatalkan.' });
            fetchOrders();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Gagal membatalkan pesanan.' });
        }
    };

    if (isLoading && orders.length === 0) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-1/3" />
                <div className="space-y-2">
                    <Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Riwayat Pesanan Saya</h1>

            <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-gray-50/50">
                <Input
                    placeholder="Cari berdasarkan Order ID..."
                    value={searchOrderId}
                    onChange={(e) => setSearchOrderId(e.target.value)}
                    className="md:max-w-xs"
                />
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant={"outline"} className="w-full md:w-[240px] justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {searchDate ? format(searchDate, "dd MMMM yyyy", { locale: id }) : <span>Pilih tanggal</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={searchDate} onSelect={setSearchDate} initialFocus />
                    </PopoverContent>
                </Popover>
                <div className="flex gap-2">
                    <Button onClick={handleSearch} disabled={isLoading}><Search className="mr-2 h-4 w-4" /> Cari</Button>
                    <Button onClick={handleReset} variant="ghost" disabled={isLoading}><X className="mr-2 h-4 w-4" /> Reset</Button>
                </div>
            </div>

            {!isLoading && orders.length === 0 ? (
                <p className="text-center py-8">Tidak ada pesanan yang ditemukan.</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead><TableHead>Properti</TableHead><TableHead>Check-in</TableHead>
                            <TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.orderId}</TableCell>
                                <TableCell>{order.property.name}</TableCell>
                                <TableCell>{new Date(order.checkIn).toLocaleDateString('id-ID')}</TableCell>
                                <TableCell>Rp {order.total.toLocaleString('id-ID')}</TableCell>
                                <TableCell>
                                    <Badge>{order.status}</Badge>
                                    {order.status === 'Menunggu Pembayaran' && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Bayar sebelum: {formatDeadline(order.paymentDeadline)}
                                        </p>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    {/* --- PENJELASAN 3: Logika Tampilan Otomatis Berubah --- */}
                                    {/* Karena state statusnya diubah oleh timer, React akan otomatis */}
                                    {/* menyembunyikan bagian ini saat status berubah menjadi 'Dibatalkan' */}
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
                                                        <AlertDialogDescription>Tindakan ini akan membatalkan pesanan Anda.</AlertDialogDescription>
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