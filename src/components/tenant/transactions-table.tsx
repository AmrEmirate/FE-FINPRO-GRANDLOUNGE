// amremirate/fe-finpro-grandlounge/FE-FINPRO-GRANDLOUNGE-4e37e69ccc87104868c4c82ed3e46f4cc9610da0/src/components/tenant/transactions-table.tsx

'use client';

import { useState } from 'react';
import { useTenantTransactions, TenantTransaction, TransactionStatus } from '@/hooks/useTenantTransactions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '../ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Image from 'next/image';
import api from '@/utils/api';
import { toast } from 'sonner';
import { Eye, Check, X } from 'lucide-react';

interface TransactionsTableProps {
    status: TransactionStatus;
}

export const TransactionsTable = ({ status }: TransactionsTableProps) => {
    const { transactions, isLoading, refetch } = useTenantTransactions(status);
    const [selectedProof, setSelectedProof] = useState<string | null>(null);

    const handleAction = async (invoiceNumber: string, isAccepted: boolean) => {
        const action = isAccepted ? 'menyetujui' : 'menolak';
        const toastId = toast.loading(`Sedang ${action} pembayaran...`);

        try {
            // Endpoint untuk konfirmasi pembayaran
            await api.patch(`/payment-confirm/confirm/${invoiceNumber}`, { isAccepted });
            toast.success(`Pembayaran berhasil ${isAccepted ? 'disetujui' : 'ditolak'}.`, { id: toastId });
            refetch(); // Memuat ulang data setelah aksi berhasil
        } catch (error: any) {
            toast.error(`Gagal ${action} pembayaran`, {
                id: toastId,
                description: error.response?.data?.message || 'Terjadi kesalahan.',
            });
        }
    };

    const getStatusVariant = (status: TenantTransaction['status']) => {
        switch (status) {
            case 'SELESAI': return 'success';
            case 'MENUNGGU_KONFIRMASI': return 'default';
            case 'MENUNGGU_PEMBAYARAN': return 'secondary';
            case 'DIBATALKAN': return 'destructive';
            default: return 'outline';
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

    if (!transactions || transactions.length === 0) {
        return <p className="text-center text-gray-500 py-8">Tidak ada transaksi dengan status ini.</p>;
    }

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Properti</TableHead>
                        <TableHead>Pemesan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((trx) => (
                        <TableRow key={trx.id}>
                            <TableCell className="font-medium">{trx.invoiceNumber}</TableCell>
                            <TableCell>{trx.property.name}</TableCell>
                            <TableCell>{trx.user.fullName}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusVariant(trx.status)}>{trx.status.replace(/_/g, ' ')}</Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                                {trx.status === 'MENUNGGU_KONFIRMASI' && (
                                    <>
                                        {/* Tombol Lihat Bukti Pembayaran */}
                                        <Button variant="outline" size="sm" onClick={() => setSelectedProof(trx.paymentProof)}>
                                            <Eye className="h-4 w-4 mr-1" /> Lihat Payment
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
                                                    <Check className="h-4 w-4 mr-1" /> Setuju
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Anda yakin ingin menyetujui pembayaran ini?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Tindakan ini akan memproses pesanan dan mengubah status transaksi menjadi "Diproses". Pastikan Anda telah memeriksa bukti pembayaran dengan benar.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Tutup</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleAction(trx.invoiceNumber, true)}>
                                                        Ya, Setujui Pembayaran
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>

                                        {/* Tombol Batalkan/Tolak */}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="sm">
                                                    <X className="h-4 w-4 mr-1" /> Batalkan
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Anda yakin ingin menolak pembayaran ini?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Tindakan ini akan membatalkan konfirmasi dan mengubah status transaksi. Pastikan Anda telah memeriksa bukti pembayaran dengan seksama.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Tutup</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleAction(trx.invoiceNumber, false)}>
                                                        Ya, Tolak Pembayaran
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Dialog untuk menampilkan bukti pembayaran */}
            <Dialog open={!!selectedProof} onOpenChange={(isOpen) => !isOpen && setSelectedProof(null)}>
                <DialogContent className="sm:max-w-xs">
                    <DialogHeader>
                        <DialogTitle>Bukti Pembayaran</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                        {selectedProof ? (
                            <Image
                                src={selectedProof}
                                alt="Bukti Pembayaran"
                                width={600}  // Beri nilai width & height agar Next.js bisa optimasi
                                height={800}
                                className="rounded-md w-full h-auto"
                            />
                        ) : (
                            <p>Tidak ada bukti pembayaran yang diunggah.</p>
                        )}
                    </div>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" className="mt-4 w-full">Tutup</Button>
                    </DialogClose>
                </DialogContent>
            </Dialog>
        </>
    );
};