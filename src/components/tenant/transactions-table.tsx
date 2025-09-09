// src/components/tenant/transactions-table.tsx

'use client';

import { useState } from 'react';
import { useTenantTransactions, TenantTransaction, TransactionStatus } from '@/hooks/useTenantTransactions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '../ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Image from 'next/image';
import api from '@/utils/api';
import { toast } from 'sonner';
import { Eye, Check, X, MoreHorizontal, Clock } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface TransactionsTableProps {
    status: TransactionStatus;
}

// Komponen Aksi agar tidak duplikasi kode antara mobile dan desktop
const ActionMenu = ({ trx, onProofSelect, onAction }: { trx: TenantTransaction, onProofSelect: (proof: string) => void, onAction: (invoice: string, accepted: boolean) => void }) => {
    return (
        <AlertDialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Buka menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={() => {
                            if (trx.paymentProof) { 
                                onProofSelect(trx.paymentProof);
                            }
                        }}
                        disabled={!trx.paymentProof}
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat Bukti
                    </DropdownMenuItem>

                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            Setuju
                        </DropdownMenuItem>
                    </AlertDialogTrigger>

                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-red-500" onSelect={(e) => e.preventDefault()}>
                            <X className="mr-2 h-4 w-4" />
                            Tolak
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Konten dialog tetap di sini, dipicu dari item menu */}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Konfirmasi Tindakan</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin melanjutkan tindakan ini? Pastikan Anda telah memeriksa bukti pembayaran dengan benar.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onAction(trx.invoiceNumber, true)}>Setuju</AlertDialogAction>
                    <AlertDialogAction onClick={() => onAction(trx.invoiceNumber, false)} className="bg-red-500 hover:bg-red-600">Tolak</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};


export const TransactionsTable = ({ status }: TransactionsTableProps) => {
    const { transactions, isLoading, refetch } = useTenantTransactions(status);
    const [selectedProof, setSelectedProof] = useState<string | null>(null);

    const handleAction = async (invoiceNumber: string, isAccepted: boolean) => {
        const action = isAccepted ? 'menyetujui' : 'menolak';
        const toastId = toast.loading(`Sedang ${action} pembayaran...`);

        try {
            await api.patch(`/payment-confirm/confirm/${invoiceNumber}`, { isAccepted });
            toast.success(`Pembayaran berhasil ${isAccepted ? 'disetujui' : 'ditolak'}.`, { id: toastId });
            refetch();
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
            case 'DIPROSES': return 'default';
            case 'MENUNGGU_PEMBAYARAN': return 'secondary';
            case 'DIBATALKAN': return 'destructive';
            default: return 'outline';
        }
    };

    if (isLoading) {
        return (
            <div>
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full mb-4" />
                ))}
            </div>
        );
    }

    if (!transactions || transactions.length === 0) {
        return <p className="text-center text-gray-500 py-8">Tidak ada transaksi dengan status ini.</p>;
    }

    return (
        <>
            {/* Tampilan Mobile: Daftar Kartu (tersembunyi di layar medium ke atas) */}
            <div className="grid gap-4 md:hidden">
                {transactions.map((trx) => (
                    <Card key={trx.id}>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium flex justify-between items-center">
                                <span>{trx.invoiceNumber}</span>
                                {trx.status === 'MENUNGGU_KONFIRMASI' && <ActionMenu trx={trx} onProofSelect={setSelectedProof} onAction={handleAction} />}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p><strong>Properti:</strong> {trx.property.name}</p>
                            <p><strong>Pemesan:</strong> {trx.user.fullName}</p>
                            <div className="flex items-center">
                                <strong className="mr-2">Status:</strong>
                                <Badge variant={getStatusVariant(trx.status)}>
                                    {trx.status === 'MENUNGGU_KONFIRMASI' && <Clock className="h-3 w-3 mr-1" />}
                                    {trx.status.replace(/_/g, ' ')}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Tampilan Desktop: Tabel (tersembunyi di layar kecil) */}
            <Table className="hidden md:table">
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
                                <Badge variant={getStatusVariant(trx.status)}>
                                    {trx.status === 'MENUNGGU_KONFIRMASI' && <Clock className="h-3 w-3 mr-1" />}
                                    {trx.status.replace(/_/g, ' ')}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                {trx.status === 'MENUNGGU_KONFIRMASI' && <ActionMenu trx={trx} onProofSelect={setSelectedProof} onAction={handleAction} />}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Dialog untuk menampilkan bukti pembayaran (tidak berubah) */}
            <Dialog open={!!selectedProof} onOpenChange={(isOpen) => !isOpen && setSelectedProof(null)}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Bukti Pembayaran</DialogTitle></DialogHeader>
                    {selectedProof && <Image src={selectedProof} alt="Bukti Pembayaran" width={600} height={800} className="rounded-md w-full h-auto" />}
                    <DialogClose asChild><Button type="button" variant="secondary" className="mt-4 w-full">Tutup</Button></DialogClose>
                </DialogContent>
            </Dialog>
        </>
    );
};