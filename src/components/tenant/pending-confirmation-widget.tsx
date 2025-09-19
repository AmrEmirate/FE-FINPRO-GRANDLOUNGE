"use client";

import { useTenantTransactions } from '@/hooks/useTenantTransactions';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import api from '@/utils/api';
import { toast } from 'sonner';
import { Skeleton } from '../ui/skeleton';
import { ArrowRight, Check, X } from 'lucide-react';

export function PendingConfirmationWidget() {
    // 1. Menggunakan hook yang sudah ada untuk mengambil data
    const { transactions, isLoading, refetch } = useTenantTransactions('MENUNGGU_KONFIRMASI');

    // 2. Fungsi untuk menangani aksi konfirmasi atau tolak
    const handleAction = async (invoiceNumber: string, isAccepted: boolean) => {
        const action = isAccepted ? 'menyetujui' : 'menolak';
        const toastId = toast.loading(`Sedang ${action} pembayaran...`);

        try {
            await api.patch(`/payment-confirm/confirm/${invoiceNumber}`, { isAccepted });
            toast.success(`Pembayaran berhasil ${isAccepted ? 'disetujui' : 'ditolak'}.`, { id: toastId });
            refetch(); // Ambil ulang data untuk memperbarui daftar
        } catch (error: any) {
            toast.error(`Gagal ${action} pembayaran`, {
                id: toastId,
                description: error.response?.data?.message || 'Terjadi kesalahan.',
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Perlu Dikonfirmasi</CardTitle>
                        <CardDescription>
                            Anda memiliki {transactions.length} pesanan yang menunggu konfirmasi.
                        </CardDescription>
                    </div>
                    <Link href="/tenant/transactions">
                        <Button variant="outline" size="sm">
                            Lihat Semua
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading ? (
                    // 3. Tampilan loading yang lebih baik
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                ) : transactions.length > 0 ? (
                    // 4. Batasi hanya menampilkan 3 transaksi terbaru di widget
                    transactions.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center gap-4">
                            <Avatar className="hidden h-9 w-9 sm:flex">
                                <AvatarImage src={order.user?.profilePicture || '/placeholder-user.jpg'} alt="Avatar" />
                                <AvatarFallback>{order.user?.fullName?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1 flex-1">
                                <p className="text-sm font-medium leading-none">{order.user?.fullName || 'Tamu'}</p>
                                <p className="text-sm text-muted-foreground">{order.property?.name || 'Properti'}</p>
                            </div>
                            {order.paymentProof && (
                                <Link href={order.paymentProof} target="_blank" rel="noopener noreferrer">
                                    <Button variant="link" className="h-auto p-0 text-xs">Lihat Bukti</Button>
                                </Link>
                            )}
                            <div className="flex gap-2">
                                <Button size="icon" className="h-8 w-8 bg-green-600 hover:bg-green-700" onClick={() => handleAction(order.invoiceNumber, true)}>
                                    <Check className="h-4 w-4" />
                                </Button>
                                <Button size="icon" className="h-8 w-8" variant="destructive" onClick={() => handleAction(order.invoiceNumber, false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        Tidak ada pesanan yang menunggu konfirmasi.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}