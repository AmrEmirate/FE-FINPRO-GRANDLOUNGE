'use client';

import { TenantTransaction } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import api from '@/utils/api';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

interface Props {
    data: TenantTransaction[];
    refetchData: () => void;
}

export default function TransactionsTable({ data, refetchData }: Props) {
    const { toast } = useToast();

    const handleAction = async (action: 'approve' | 'reject', id: string) => {
        const actionMessages = {
            approve: { past: 'disetujui', present: 'menyetujui' },
            reject: { past: 'ditolak', present: 'menolak' },
        };
        const message = actionMessages[action];

        try {
            await api.patch(`/confirm-payment/${id}/${action}`);
            toast({ title: 'Sukses', description: `Pembayaran berhasil ${message.past}.` });
            refetchData();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: `Gagal ${message.present} pembayaran.` });
        }
    };

    const handleCancelOrder = async (id: string) => {
        try {
            await api.patch(`/cancel-order/tenant/${id}`);
            toast({ title: 'Sukses', description: 'Pesanan berhasil dibatalkan.' });
            refetchData();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Gagal membatalkan pesanan.' });
        }
    };

    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Penyewa</TableHead>
                        <TableHead>Properti</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.orderId}</TableCell>
                            <TableCell>{item.user.name}</TableCell>
                            <TableCell>{item.property.name}</TableCell>
                            <TableCell><Badge>{item.status}</Badge></TableCell>
                            <TableCell className="text-right space-x-2">
                                {item.status === 'Menunggu Konfirmasi' && (
                                    <>
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={item.paymentProof || '#'} target="_blank" rel="noopener noreferrer">Lihat Bukti</Link>
                                        </Button>
                                        <Button size="sm" onClick={() => handleAction('approve', item.id)}>Setujui</Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleAction('reject', item.id)}>Tolak</Button>
                                    </>
                                )}
                                {item.status === 'Menunggu Pembayaran' && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="sm">Batalkan</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Anda Yakin?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Tindakan ini akan membatalkan pesanan pengguna secara permanen. Pengguna akan diberi notifikasi.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Tidak</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleCancelOrder(item.id)}>Ya, Batalkan</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}